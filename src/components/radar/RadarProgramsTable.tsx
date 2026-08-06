import React, { useState } from 'react';
import { EducationResourceProgram, DocChecklistItem, LegalCategory } from '../../types/radar';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  FileCheck,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  X,
  FileText,
  UserCheck,
  Building,
  AlertCircle,
  Sparkles,
  CheckSquare,
  Scale,
  Ban,
  Check,
  Laptop,
  Utensils,
  Bus,
  GraduationCap,
  Wrench,
  BookOpen,
  FileCode
} from 'lucide-react';

interface Props {
  programs: EducationResourceProgram[];
  onGenerateActionPlan: (program: EducationResourceProgram) => void;
  onUpdateProgramChecklist?: (programId: string, checklist: DocChecklistItem[]) => void;
}

export const RadarProgramsTable: React.FC<Props> = ({
  programs,
  onGenerateActionPlan,
  onUpdateProgramChecklist
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [riskFilter, setRiskFilter] = useState<string>('todos');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [selectedProgram, setSelectedProgram] = useState<EducationResourceProgram | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const isCategoryMatch = (p: EducationResourceProgram, filter: string): boolean => {
    if (filter === 'todos') return true;

    const filterNorm = filter.toLowerCase();
    const categoryNorm = (p.legalDestination?.category || '').toLowerCase();

    if (categoryNorm === filterNorm) return true;

    if (
      (filterNorm.includes('tecnologia') || filterNorm.includes('ti') || filterNorm.includes('informática') || filterNorm.includes('equipamento')) &&
      (categoryNorm.includes('tecnologia') || categoryNorm.includes('ti') || categoryNorm.includes('informática') || p.rubricBreakdown?.some(r => r.rubricName.toLowerCase().includes('ti') || r.rubricName.toLowerCase().includes('informática') || r.rubricName.toLowerCase().includes('tecnologia')))
    ) return true;

    if (
      (filterNorm.includes('merenda') || filterNorm.includes('alimentação')) &&
      (categoryNorm.includes('merenda') || categoryNorm.includes('alimentação') || p.rubricBreakdown?.some(r => r.rubricName.toLowerCase().includes('merenda')))
    ) return true;

    if (
      filterNorm.includes('transporte') &&
      (categoryNorm.includes('transporte') || p.rubricBreakdown?.some(r => r.rubricName.toLowerCase().includes('transporte')))
    ) return true;

    if (
      (filterNorm.includes('magistério') || filterNorm.includes('pessoal') || filterNorm.includes('folha')) &&
      (categoryNorm.includes('magistério') || p.rubricBreakdown?.some(r => r.rubricName.toLowerCase().includes('magistério')))
    ) return true;

    if (
      (filterNorm.includes('infraestrutura') || filterNorm.includes('obras')) &&
      (categoryNorm.includes('infraestrutura') || categoryNorm.includes('obras') || p.rubricBreakdown?.some(r => r.rubricName.toLowerCase().includes('infraestrutura') || r.rubricName.toLowerCase().includes('obras')))
    ) return true;

    if (
      (filterNorm.includes('material') || filterNorm.includes('formação') || filterNorm.includes('didático') || filterNorm.includes('pedagógico')) &&
      (categoryNorm.includes('material') || categoryNorm.includes('formação') || categoryNorm.includes('pedagógico') || p.rubricBreakdown?.some(r => r.rubricName.toLowerCase().includes('material') || r.rubricName.toLowerCase().includes('formação')))
    ) return true;

    if (
      (filterNorm.includes('manutenção') || filterNorm.includes('custeio')) &&
      (categoryNorm.includes('manutenção') || categoryNorm.includes('custeio'))
    ) return true;

    return false;
  };

  const filtered = programs.filter((p) => {
    const matchesSearch =
      p.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.organ.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.legalDestination && p.legalDestination.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'todos' || p.eligibilityStatus === statusFilter;

    const matchesRisk = riskFilter === 'todos' || p.risk.toLowerCase() === riskFilter.toLowerCase();

    const matchesCategory = isCategoryMatch(p, categoryFilter);

    return matchesSearch && matchesStatus && matchesRisk && matchesCategory;
  });

  // Calculate totals for currently filtered items
  const filteredTotalValue = filtered.reduce((sum, p) => sum + p.estimatedValue, 0);
  const filteredCapturedValue = filtered.reduce((sum, p) => sum + (p.capturedValue || p.estimatedValue || 0), 0);
  const filteredSpentValue = filtered.reduce((sum, p) => sum + (p.spentValue || 0), 0);
  const filteredRemainingBalance = filteredCapturedValue - filteredSpentValue;

  const handleToggleDoc = (docId: string) => {
    if (!selectedProgram || !onUpdateProgramChecklist) return;
    const updatedChecklist = selectedProgram.checklist.map((item) =>
      item.id === docId ? { ...item, uploaded: !item.uploaded } : item
    );
    setSelectedProgram({ ...selectedProgram, checklist: updatedChecklist });
    onUpdateProgramChecklist(selectedProgram.id, updatedChecklist);
  };

  const getCategoryIcon = (category?: LegalCategory) => {
    switch (category) {
      case 'Tecnologia & Equipamentos':
        return <Laptop className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Merenda Escolar':
        return <Utensils className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Transporte Escolar':
        return <Bus className="w-3.5 h-3.5 text-amber-400" />;
      case 'Valorização do Magistério':
        return <GraduationCap className="w-3.5 h-3.5 text-purple-400" />;
      case 'Infraestrutura & Obras':
        return <Building className="w-3.5 h-3.5 text-orange-400" />;
      case 'Material Didático & Formação':
        return <BookOpen className="w-3.5 h-3.5 text-sky-400" />;
      default:
        return <Wrench className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Table Header & Search Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-black text-white tracking-wide uppercase flex items-center gap-2">
            Lista Completa de Programas Financeiros
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {filtered.length} registrados
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoramento analítico com enquadramento de destinação legal das verbas e vedações fiscais (Parecer da Advocacia Educacional).
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar programa, órgão, verba..."
              className="w-full bg-[#060b19] border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Legal Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#060b19] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
          >
            <option value="todos">Todas Destinações Legais</option>
            <option value="Tecnologia & Equipamentos">💻 Tecnologia & Equipamentos</option>
            <option value="Merenda Escolar">🍎 Merenda Escolar</option>
            <option value="Transporte Escolar">🚌 Transporte Escolar</option>
            <option value="Valorização do Magistério">👩‍🏫 Valorização do Magistério</option>
            <option value="Infraestrutura & Obras">🏗️ Infraestrutura & Obras</option>
            <option value="Material Didático & Formação">📚 Material & Formação</option>
            <option value="Manutenção & Custeio Geral">🔧 Manutenção & Custeio</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#060b19] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
          >
            <option value="todos">Todos Status</option>
            <option value="elegivel">🟢 Elegível</option>
            <option value="pendente">🟡 Doc. Pendente</option>
            <option value="risco">🔴 Em Risco</option>
            <option value="encerrado">⚪ Encerrado</option>
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-[#060b19] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
          >
            <option value="todos">Todos Riscos</option>
            <option value="baixo">Risco Baixo</option>
            <option value="médio">Risco Médio</option>
            <option value="alto">Risco Alto</option>
            <option value="crítico">Risco Crítico</option>
          </select>
        </div>
      </div>

      {/* Filtered Financial Totals Summary Bar */}
      <div className="bg-[#060b19] border border-amber-500/30 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Recursos Filtrados</span>
          <span className="font-mono font-black text-amber-300 text-sm">{filtered.length} Programa{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Valor Total Estimado</span>
          <span className="font-mono font-black text-emerald-400 text-sm">{formatCurrency(filteredTotalValue)}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Captado em Conta</span>
          <span className="font-mono font-black text-sky-300 text-sm">{formatCurrency(filteredCapturedValue)}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Saldo Disponível</span>
          <span className="font-mono font-black text-amber-400 text-sm">{formatCurrency(filteredRemainingBalance)}</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#060b19] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <th className="p-3">Programa</th>
              <th className="p-3">Destinação Legal da Verba</th>
              <th className="p-3">Órgão</th>
              <th className="p-3">Status</th>
              <th className="p-3">Prazo</th>
              <th className="p-3 text-right">Valor Estimado</th>
              <th className="p-3">Responsável</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  Nenhum programa encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filtered.map((prog) => {
                const isUrgent = prog.daysToDeadline <= 15;
                const uploadedCount = prog.checklist.filter((c) => c.uploaded).length;
                const totalDoc = prog.checklist.length;
                const legalCat = prog.legalDestination?.category;

                return (
                  <tr
                    key={prog.id}
                    className="hover:bg-[#0f1b3d]/60 transition group cursor-pointer"
                    onClick={() => setSelectedProgram(prog)}
                  >
                    {/* Programa */}
                    <td className="p-3">
                      <div className="font-bold text-white text-sm group-hover:text-amber-300 transition">
                        {prog.program}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{prog.description}</div>
                    </td>

                    {/* Destinação Legal da Verba (Advocacia Especializada) */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {getCategoryIcon(legalCat)}
                        <span className="font-semibold text-slate-200 text-[11px]">
                          {legalCat || 'Custeio Geral'}
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                        {prog.legalDestination?.expenseType || 'Misto'}
                      </div>
                    </td>

                    {/* Órgão */}
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-medium text-[11px]">
                        {prog.organ}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide inline-flex items-center gap-1 ${
                          prog.status === 'Aprovado'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                            : prog.status === 'Prestação Pendente'
                            ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
                            : prog.status === 'Em Análise'
                            ? 'bg-sky-950 text-sky-300 border border-sky-700/60'
                            : 'bg-rose-950 text-rose-300 border border-rose-700/60'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {prog.status}
                      </span>
                    </td>

                    {/* Prazo */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
                        <div>
                          <div className={`font-mono font-bold ${isUrgent ? 'text-rose-300' : 'text-slate-200'}`}>
                            {prog.deadline}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {prog.daysToDeadline > 0 ? `${prog.daysToDeadline} dias restantes` : 'Vencido'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Valor Estimado */}
                    <td className="p-3 text-right whitespace-nowrap">
                      <span className="font-mono font-black text-amber-300 text-sm">
                        {formatCurrency(prog.estimatedValue)}
                      </span>
                    </td>

                    {/* Responsável */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="text-slate-300 font-medium text-[11px] truncate max-w-[140px]">
                        {prog.responsible}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Docs: {uploadedCount}/{totalDoc} ok
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="p-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedProgram(prog)}
                          title="Ver parecer jurídico e destinação da verba"
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg border border-slate-700 transition flex items-center gap-1"
                        >
                          <Scale className="w-3.5 h-3.5 text-amber-400" />
                          <span>Jurídico</span>
                        </button>

                        <button
                          onClick={() => onGenerateActionPlan(prog)}
                          title="Gerar Plano de Ação Automático para este programa"
                          className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black rounded-lg shadow transition flex items-center gap-1"
                        >
                          <CheckSquare className="w-3 h-3" />
                          <span>Plano Ação</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Detail & Checklist Modal with Legal Destination Advice */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#081026] border-2 border-amber-500/50 rounded-2xl max-w-4xl w-full p-6 space-y-5 text-slate-100 relative shadow-2xl animate-fade-in my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {selectedProgram.organ}
                  </span>
                  {selectedProgram.legalDestination && (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                      {getCategoryIcon(selectedProgram.legalDestination.category)}
                      {selectedProgram.legalDestination.category}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono">ID: {selectedProgram.id}</span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">{selectedProgram.program}</h3>
                <p className="text-xs text-slate-300 mt-1">{selectedProgram.description}</p>
              </div>

              <button
                onClick={() => setSelectedProgram(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#040814] p-3.5 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Valor Potencial</span>
                <span className="text-lg font-black text-amber-300 font-mono">
                  {formatCurrency(selectedProgram.estimatedValue)}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Prazo Limite</span>
                <span className="text-sm font-bold text-sky-300 font-mono">
                  {selectedProgram.deadline} ({selectedProgram.daysToDeadline} dias)
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Fonte Pagadora</span>
                <span className="text-xs font-semibold text-slate-200">{selectedProgram.fundingSource}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Nível de Risco</span>
                <span
                  className={`text-xs font-black uppercase ${
                    selectedProgram.risk === 'Crítico'
                      ? 'text-rose-400'
                      : selectedProgram.risk === 'Alto'
                      ? 'text-orange-400'
                      : selectedProgram.risk === 'Médio'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {selectedProgram.risk}
                </span>
              </div>
            </div>

            {/* Legal Destination & Restrictions Box (Parecer de Advocacia Educacional) */}
            {selectedProgram.legalDestination && (
              <div className="bg-gradient-to-br from-[#0a1533] to-[#0d1d45] border border-amber-500/40 rounded-xl p-4 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-500/20 rounded-lg border border-amber-500/30 text-amber-400">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
                        Parecer Jurídico: Destinação da Verba & Vedações
                        <span className="px-2 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[9px] font-mono">
                          Direito Financeiro
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        Base Legal: <span className="font-semibold text-amber-300">{selectedProgram.legalDestination.legalBasis}</span>
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-slate-200 text-[10px] font-bold rounded-lg font-mono">
                    {selectedProgram.legalDestination.expenseType}
                  </span>
                </div>

                {/* Grid for Allowed Uses vs Prohibited Uses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                  {/* Allowed Uses */}
                  <div className="bg-[#050b1c] p-3.5 rounded-xl border border-emerald-700/50 space-y-2">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                      <Check className="w-4 h-4 text-emerald-400 bg-emerald-950 p-0.5 rounded-full border border-emerald-700" />
                      <span>O que PODE ser adquirido com esta verba:</span>
                    </span>
                    <ul className="space-y-1.5 pl-1">
                      {selectedProgram.legalDestination.allowedUses.map((use, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-200 leading-snug">
                          <span className="text-emerald-400 font-bold text-xs mt-0.5">✓</span>
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prohibited Uses (Vedações Legais) */}
                  <div className="bg-[#0f0714] p-3.5 rounded-xl border border-rose-700/60 space-y-2">
                    <span className="font-bold text-rose-400 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                      <Ban className="w-4 h-4 text-rose-400 bg-rose-950 p-0.5 rounded-full border border-rose-700" />
                      <span>VEDAÇÕES LEGAIS CRÍTICAS (O que NÃO PODE):</span>
                    </span>
                    <ul className="space-y-1.5 pl-1">
                      {selectedProgram.legalDestination.forbiddenUses.map((use, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-rose-200/90 leading-snug font-medium">
                          <span className="text-rose-400 font-bold text-xs mt-0.5">✕</span>
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Lawyer Opinion Text */}
                <div className="bg-[#040814] p-3 rounded-lg border border-slate-800 text-xs">
                  <span className="text-[10px] font-bold uppercase text-amber-400 block mb-1 font-mono">
                    📜 RESUMO DO PARECER DA ADVOCACIA EDUCACIONAL:
                  </span>
                  <p className="text-slate-300 italic leading-relaxed">
                    "{selectedProgram.legalDestination.legalOpinionSummary}"
                  </p>
                </div>
              </div>
            )}

            {/* Criteria & Responsible */}
            <div className="space-y-3">
              <div className="bg-[#0b1329] p-3 rounded-xl border border-slate-800 text-xs">
                <span className="font-bold text-amber-400 block uppercase tracking-wider text-[10px] mb-1">
                  Requisitos & Critérios Legais do MEC/FNDE:
                </span>
                <p className="text-slate-200 leading-relaxed">{selectedProgram.criteria}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#0b1329] p-3 rounded-xl border border-slate-800">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                    Setor e Responsável Técnico:
                  </span>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-sky-400" />
                    <span>{selectedProgram.responsible}</span>
                  </div>
                </div>

                <div className="bg-[#0b1329] p-3 rounded-xl border border-slate-800">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                    Observações da Gestão:
                  </span>
                  <p className="text-slate-300">{selectedProgram.observations}</p>
                </div>
              </div>
            </div>

            {/* Interactive Document Checklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4" />
                  <span>Checklist de Documentação Obrigatória ({selectedProgram.checklist.filter(c => c.uploaded).length}/{selectedProgram.checklist.length} anexados)</span>
                </h4>
                <span className="text-[10px] text-slate-400">Clique para alternar o status de envio</span>
              </div>

              <div className="space-y-1.5 bg-[#040814] p-3 rounded-xl border border-slate-800">
                {selectedProgram.checklist.map((item) => (
                  <label
                    key={item.id}
                    onClick={() => handleToggleDoc(item.id)}
                    className="flex items-start gap-3 p-2 rounded-lg bg-[#0b1329] hover:bg-[#0f1b3d] border border-slate-800 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={item.uploaded}
                      onChange={() => {}}
                      className="mt-1 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${item.uploaded ? 'text-emerald-300 line-through' : 'text-slate-100'}`}>
                          {item.docName}
                        </span>
                        <span
                          className={`px-2 py-0.2 text-[9px] font-bold rounded ${
                            item.uploaded
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                              : 'bg-rose-950 text-rose-300 border border-rose-700/60'
                          }`}
                        >
                          {item.uploaded ? 'Enviado' : 'Pendente'}
                        </span>
                      </div>
                      {item.notes && <p className="text-[10px] text-amber-400/90 mt-0.5">{item.notes}</p>}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4 gap-3">
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
              >
                Fechar
              </button>

              <button
                onClick={() => {
                  onGenerateActionPlan(selectedProgram);
                  setSelectedProgram(null);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 text-xs font-black rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Gerar Plano de Ação para este Programa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

