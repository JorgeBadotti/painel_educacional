import React, { useState } from 'react';
import {
  School as SchoolIcon,
  Search,
  Filter,
  Users,
  Award,
  AlertTriangle,
  WifiOff,
  Phone,
  MapPin,
  X,
  Plus,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useCockpit } from '../context/CockpitContext';
import { School, RiskLevel, TeachingStage } from '../types';

export const SchoolDetailView: React.FC = () => {
  const {
    schools,
    filterRisk,
    setFilterRisk,
    selectedStage,
    setSelectedStage,
    searchQuery,
    setSearchQuery,
    addActionPlan,
    setActiveTab,
    selectedSchoolId,
    setSelectedSchoolId
  } = useCockpit();

  const [selectedRegion, setSelectedRegion] = useState<string>('todas');
  const [inspectedSchool, setInspectedSchool] = useState<School | null>(
    selectedSchoolId ? schools.find((s) => s.id === selectedSchoolId) || null : null
  );

  const [showCreateActionModal, setShowCreateActionModal] = useState(false);
  const [actionTitle, setActionTitle] = useState('');
  const [actionDesc, setActionDesc] = useState('');
  const [responsible, setResponsible] = useState('');
  const [deadline, setDeadline] = useState('2025-06-30');

  // Filter logic
  const filteredSchools = schools.filter((sch) => {
    if (filterRisk !== 'todas' && sch.status !== filterRisk) return false;
    if (selectedRegion !== 'todas' && sch.region !== selectedRegion) return false;
    if (selectedStage !== 'todas' && !sch.stages.includes(selectedStage as any)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sch.name.toLowerCase().includes(q) ||
        sch.code.toLowerCase().includes(q) ||
        sch.director.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: RiskLevel) => {
    switch (status) {
      case 'destaque':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
            Destaque
          </span>
        );
      case 'atencao':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-amber-950 text-amber-300 border border-amber-800">
            Atenção
          </span>
        );
      case 'critico':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
            Crítico
          </span>
        );
    }
  };

  const handleCreateActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectedSchool || !actionTitle.trim()) return;

    addActionPlan({
      title: actionTitle,
      description: actionDesc || `Plano de ação focado na unidade ${inspectedSchool.name}`,
      schoolId: inspectedSchool.id,
      schoolName: inspectedSchool.name,
      responsible: responsible || inspectedSchool.director,
      deadline: deadline,
      status: 'a_fazer',
      priority: inspectedSchool.status === 'critico' ? 'alta' : 'media',
      completionPercentage: 0,
      steps: [
        { id: `st-s1-${Date.now()}`, description: 'Visita técnica de alinhamento com a diretoria', done: false },
        { id: `st-s2-${Date.now()}`, description: 'Acompanhamento do plano de intervenção pedagógica', done: false },
      ],
    });

    setShowCreateActionModal(false);
    setActiveTab('planos_acao');
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Controls */}
      <div className="bg-[#0b132a] border border-slate-800 rounded-2xl p-4 shadow-xl text-white">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <SchoolIcon className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
              DETALHAMENTO POR ESCOLA ({filteredSchools.length} de {schools.length})
            </h2>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por escola, diretor ou código..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
          {/* Risk Level Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Situação:</span>
            {(['todas', 'destaque', 'atencao', 'critico'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterRisk(lvl)}
                className={`px-3 py-1 rounded-lg capitalize font-semibold transition ${
                  filterRisk === lvl
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Region Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Região:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="todas">Todas as Regiões</option>
              <option value="Norte">Zona Norte</option>
              <option value="Sul">Zona Sul</option>
              <option value="Leste">Zona Leste</option>
              <option value="Oeste">Zona Oeste</option>
              <option value="Centro">Centro</option>
            </select>
          </div>

          {/* Teaching Stage Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Etapa:</span>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value as TeachingStage)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="todas">Todas as Etapas</option>
              <option value="educacao_infantil">Educação Infantil</option>
              <option value="anos_iniciais">Anos Iniciais (1º ao 5º)</option>
              <option value="anos_finais">Anos Finais (6º ao 9º)</option>
              <option value="eja">EJA</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of School Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSchools.map((school) => (
          <div
            key={school.id}
            onClick={() => {
              setInspectedSchool(school);
              setSelectedSchoolId(school.id);
            }}
            className="bg-[#0b132a] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 shadow-xl transition transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {school.code}
                </span>
                {getStatusBadge(school.status)}
              </div>

              <h3 className="font-bold text-sm text-slate-100 group-hover:text-amber-300 transition leading-snug">
                {school.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>Região {school.region} • {school.director}</span>
              </p>

              {/* Key indicators snippet */}
              <div className="grid grid-cols-3 gap-2 my-3 p-2.5 bg-slate-900/80 rounded-xl border border-slate-800/80 text-center">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">IDEB</span>
                  <span className="text-sm font-extrabold text-amber-300">{school.ideb}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Freq.</span>
                  <span className="text-sm font-extrabold text-sky-300">{school.frequencia}%</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Aprov.</span>
                  <span className="text-sm font-extrabold text-emerald-300">{school.taxaAprovacao}%</span>
                </div>
              </div>
            </div>

            {/* Card Footer badges */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2 text-slate-400 font-medium">
                <Users className="w-3 h-3 text-slate-500" />
                <span>{school.studentCount} Alunos</span>
              </div>
              {school.alunosEmRisco > 0 && (
                <span className="text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900">
                  {school.alunosEmRisco} em risco
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* School Scorecard Drawer / Modal */}
      {inspectedSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in p-2 md:p-4">
          <div className="bg-[#0b132a] border border-slate-700 rounded-2xl w-full max-w-2xl h-full max-h-[95vh] overflow-y-auto shadow-2xl text-white p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-800">
                  {inspectedSchool.code}
                </span>
                <h2 className="text-lg font-extrabold text-white mt-2">{inspectedSchool.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{inspectedSchool.address}</p>
              </div>
              <button
                onClick={() => setInspectedSchool(null)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">IDEB Atual</span>
                <span className="text-xl font-extrabold text-amber-300">{inspectedSchool.ideb}</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Frequência</span>
                <span className="text-xl font-extrabold text-sky-300">{inspectedSchool.frequencia}%</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Alfabetização</span>
                <span className="text-xl font-extrabold text-emerald-300">{inspectedSchool.alfabetizacao}%</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Aprovação</span>
                <span className="text-xl font-extrabold text-indigo-300">{inspectedSchool.taxaAprovacao}%</span>
              </div>
            </div>

            {/* School Profile Details */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs">
              <h3 className="text-xs font-bold uppercase text-slate-200 tracking-wider">Gestão e Contato</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                <p><strong>Diretor(a):</strong> {inspectedSchool.director}</p>
                <p><strong>Telefone:</strong> {inspectedSchool.phone}</p>
                <p><strong>Total Alunos:</strong> {inspectedSchool.studentCount}</p>
                <p><strong>Total Professores:</strong> {inspectedSchool.teacherCount}</p>
                <p><strong>Execução Financeira:</strong> {inspectedSchool.execucaoFinanceira}%</p>
                <p><strong>Distorção Idade-Série:</strong> {inspectedSchool.distorcaoIdadeSerie}%</p>
              </div>
            </div>

            {/* Critical Points */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs">
              <h3 className="text-xs font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Pontos de Atenção na Unidade
              </h3>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  <span><strong>{inspectedSchool.alunosEmRisco} alunos</strong> em risco de evasão/reprovação.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  <span><strong>{inspectedSchool.professoresSemFormacao} professores</strong> necessitam concluir módulos de formação continuada.</span>
                </li>
                {inspectedSchool.hasInternetIssues && (
                  <li className="flex items-center gap-2 text-rose-300 font-semibold">
                    <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                    <span>Instabilidade de conectividade relatada no laboratório de informática.</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Create Action Plan Trigger */}
            {!showCreateActionModal ? (
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setActionTitle(`Plano de Intervenção: ${inspectedSchool.name}`);
                    setShowCreateActionModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Criar Plano de Ação para esta Escola</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateActionSubmit} className="p-4 bg-slate-900 border border-amber-500/50 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-amber-300 uppercase">
                  Novo Plano para {inspectedSchool.name}
                </h4>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Título</label>
                  <input
                    type="text"
                    required
                    value={actionTitle}
                    onChange={(e) => setActionTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Responsável</label>
                  <input
                    type="text"
                    required
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    placeholder={inspectedSchool.director}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Prazo</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateActionModal(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
