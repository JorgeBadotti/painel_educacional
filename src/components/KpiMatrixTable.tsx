import React, { useState } from 'react';
import {
  Layers,
  BookOpen,
  CalendarCheck,
  UserCheck,
  Building,
  Wifi,
  Monitor,
  DollarSign,
  HeartHandshake,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Plus,
  Edit2,
  X,
  Sparkles
} from 'lucide-react';
import { useCockpit } from '../context/CockpitContext';
import { KpiCategory, KpiIndicator } from '../types';
import { YoYSparkline, YoYSparklineDataItem } from './YoYSparkline';

export const CATEGORY_ITEMS: { id: KpiCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'visao_geral', label: 'Visão Geral', icon: Layers },
  { id: 'aprendizagem', label: 'Aprendizagem', icon: BookOpen },
  { id: 'permanencia', label: 'Permanência', icon: CalendarCheck },
  { id: 'professores', label: 'Professores', icon: UserCheck },
  { id: 'gestao_escolar', label: 'Gestão Escolar', icon: Building },
  { id: 'infraestrutura', label: 'Infraestrutura', icon: Wifi },
  { id: 'tecnologia', label: 'Tecnologia', icon: Monitor },
  { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
  { id: 'inclusao', label: 'Inclusão', icon: HeartHandshake },
];

export const KpiMatrixTable: React.FC = () => {
  const {
    kpis,
    selectedCategory,
    setSelectedCategory,
    setOpenKpiDetailModal,
    updateKpiValue,
    addNewKpi
  } = useCockpit();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingKpiId, setEditingKpiId] = useState<string | null>(null);
  const [inlineVal, setInlineVal] = useState<string>('');

  // Form fields for new KPI
  const [newKpiName, setNewKpiName] = useState('');
  const [newKpiSub, setNewKpiSub] = useState('');
  const [newKpiCategory, setNewKpiCategory] = useState<KpiCategory>('aprendizagem');
  const [newKpiVal, setNewKpiVal] = useState('75.0');
  const [newKpiTarget2025, setNewKpiTarget2025] = useState('85.0');
  const [newKpiTargetExcellence, setNewKpiTargetExcellence] = useState('95.0');
  const [newKpiUnit, setNewKpiUnit] = useState('%');

  const filteredKpis =
    selectedCategory === 'visao_geral'
      ? kpis
      : kpis.filter((k) => k.category === selectedCategory);

  const handleStartInlineEdit = (e: React.MouseEvent, kpi: KpiIndicator) => {
    e.stopPropagation();
    setEditingKpiId(kpi.id);
    setInlineVal(kpi.currentValue.toString());
  };

  const handleSaveInlineValue = (e: React.FormEvent, kpiId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const num = parseFloat(inlineVal);
    if (!isNaN(num)) {
      updateKpiValue(kpiId, num);
    }
    setEditingKpiId(null);
  };

  const handleQuickAdjust = (e: React.MouseEvent, kpiId: string, current: number, delta: number) => {
    e.stopPropagation();
    updateKpiValue(kpiId, Math.max(0, current + delta));
  };

  const handleCreateNewKpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKpiName.trim()) return;

    const val = parseFloat(newKpiVal) || 75.0;
    const t25 = parseFloat(newKpiTarget2025) || 85.0;
    const tExc = parseFloat(newKpiTargetExcellence) || 95.0;

    addNewKpi({
      name: newKpiName,
      subtitle: newKpiSub || 'Indicador municipal personalizado em tempo real',
      category: newKpiCategory,
      currentValue: val,
      target2025: t25,
      targetExcellence: tExc,
      unit: newKpiUnit,
      status: val >= tExc ? 'em_evolucao' : val >= t25 ? 'atencao' : 'critico',
      historyBefore: [
        { period: '2022', value: parseFloat((val - 12).toFixed(1)) },
        { period: '2023', value: parseFloat((val - 8).toFixed(1)) },
      ],
      historyAfter: [
        { period: '2024.1', value: parseFloat((val - 3).toFixed(1)) },
        { period: 'Atual', value: val },
      ],
      description: 'Indicador de gestão em tempo real cadastrado pela equipe pedagógica municipal.',
      schoolsBreakdown: [],
    });

    setShowAddModal(false);
    setNewKpiName('');
    setNewKpiSub('');
  };

  const getSparklineDataForKpi = (kpi: KpiIndicator): YoYSparklineDataItem[] => {
    const base = kpi.historyBefore?.[1]?.value || kpi.currentValue * 0.95;
    const curr = kpi.currentValue;
    const metaFinal = kpi.target2025;
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    return months.map((mes, idx) => {
      const factorPast = 0.92 + (idx * 0.007);
      const factorCurr = 0.94 + (idx * 0.008);
      // Glide path trajectory from base to final target across 12 months
      const plannedProgress = base + ((metaFinal - base) * (idx + 1) / 12);
      
      const valPrev = parseFloat((base * factorPast).toFixed(1));
      const valCurr = idx <= 7 ? parseFloat((curr * factorCurr).toFixed(1)) : null;
      const valPlan = parseFloat(plannedProgress.toFixed(1));

      return {
        mes,
        anoAnterior: valPrev,
        anoAtual: valCurr,
        metaPlanejada: valPlan,
        metaFinal: metaFinal,
        meta: metaFinal
      };
    });
  };

  const getStatusBadge = (status: KpiIndicator['status']) => {
    switch (status) {
      case 'em_evolucao':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Em evolução
          </span>
        );
      case 'atencao':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-700/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Atenção
          </span>
        );
      case 'critico':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            Crítico
          </span>
        );
    }
  };

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-2xl shadow-2xl p-4 mb-4">
      {/* Title Bar */}
      <div className="flex flex-wrap items-center justify-between mb-4 border-b border-slate-800 pb-3 gap-3">
        <div>
          <h2 className="text-xs md:text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            ACOMPANHAMENTO DOS PRINCIPAIS INDICADORES (KPIs)
          </h2>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Cadastrar Indicador</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* Left Vertical Category Nav (as in Screenshot) */}
        <div className="lg:col-span-2 space-y-1.5 bg-[#070e22] p-2 rounded-xl border border-slate-800/80 flex flex-col justify-between min-h-[400px]">
          <div className="space-y-1">
            {CATEGORY_ITEMS.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600/90 text-white shadow-md shadow-blue-600/30 font-bold border border-blue-400/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80 space-y-2 mt-auto">
            <button
              onClick={() => setSelectedCategory('visao_geral')}
              className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded-lg shadow transition"
            >
              <span>VER TODOS OS INDICADORES</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <p className="text-[9px] text-slate-400 leading-tight text-center">
              Fonte: Dados internos da Secretaria e plataformas integradas
            </p>
          </div>
        </div>

        {/* Central Matrix Table (Matching Screenshot Columns & Dashed Line) */}
        <div className="lg:col-span-10 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-900/80">
                <th className="py-2.5 px-3 min-w-[170px]">KPI</th>
                <th className="py-2.5 px-2 text-center min-w-[160px]">
                  HISTÓRICO <span className="text-slate-400 font-normal">(ANTES DA IMPLANTAÇÃO)</span>
                </th>
                <th className="py-2.5 px-1 text-center bg-emerald-950/40 text-emerald-400 border-x border-emerald-500/40 min-w-[110px]">
                  <div className="text-[9px] font-black uppercase tracking-tight text-emerald-300">
                    IMPLANTAÇÃO<br />DO SISTEMA<br />
                    <span className="text-[8px] font-mono text-emerald-400">MAR/2024</span>
                  </div>
                </th>
                <th className="py-2.5 px-2 text-center min-w-[190px]">
                  EVOLUÇÃO MÊS A MÊS <span className="text-emerald-400 font-normal">(SPARKLINE YoY)</span>
                </th>
                <th className="py-2.5 px-2 text-center min-w-[100px] text-white">RESULTADO ATUAL</th>
                <th className="py-2.5 px-2 text-center min-w-[70px]">META ESTRATÉGICA</th>
                <th className="py-2.5 px-2 text-center min-w-[80px]">META EXCELÊNCIA</th>
                <th className="py-2.5 px-2 text-center min-w-[100px]">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {filteredKpis.map((kpi) => (
                <tr
                  key={kpi.id}
                  onClick={() => setOpenKpiDetailModal(kpi)}
                  className="hover:bg-slate-800/60 transition cursor-pointer group"
                >
                  {/* KPI Name & Subtitle */}
                  <td className="py-2.5 px-3">
                    <div className="font-extrabold text-slate-100 group-hover:text-amber-300 transition text-xs uppercase">
                      {kpi.name}
                    </div>
                    {kpi.subtitle && (
                      <div className="text-[10px] text-slate-400 font-medium leading-tight">{kpi.subtitle}</div>
                    )}
                  </td>

                  {/* Sparkline BEFORE System Implementation */}
                  <td className="py-2.5 px-2 text-center">
                    <div className="flex items-center justify-center gap-3">
                      {kpi.historyBefore.map((pt, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <span className="text-[11px] font-mono text-slate-300 font-semibold">{pt.value}{kpi.unit === '%' ? '%' : ''}</span>
                        </div>
                      ))}
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full my-1 overflow-hidden">
                      <div className="h-full bg-sky-500 w-full shadow-sm shadow-sky-500"></div>
                    </div>
                  </td>

                  {/* Vertical System Implementation Marker Column */}
                  <td className="py-2.5 px-1 text-center bg-emerald-950/20 border-x border-emerald-500/40 relative">
                    <div className="flex flex-col items-center justify-center h-full text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/80 animate-ping"></span>
                    </div>
                  </td>

                  {/* Sparkline AFTER System Implementation (Year-over-Year Overlay Sparkline) */}
                  <td className="py-2 px-2 text-center bg-emerald-950/10 min-w-[190px]">
                    <YoYSparkline
                      data={getSparklineDataForKpi(kpi)}
                      anoBase={2025}
                      anoVigente={2026}
                      height={45}
                      unit={kpi.unit}
                      showLabels={true}
                    />
                  </td>

                  {/* Current Result */}
                  <td className="py-2.5 px-2 text-center bg-slate-900/60 font-mono font-black text-sm text-white">
                    {editingKpiId === kpi.id ? (
                      <form onSubmit={(e) => handleSaveInlineValue(e, kpi.id)} className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          step="0.1"
                          value={inlineVal}
                          onChange={(e) => setInlineVal(e.target.value)}
                          className="w-14 bg-slate-950 border border-amber-400 text-white font-mono font-bold text-xs rounded px-1 text-center"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      </form>
                    ) : (
                      <span
                        onClick={(e) => handleStartInlineEdit(e, kpi)}
                        className="hover:text-amber-300 cursor-pointer"
                        title="Clique para editar valor"
                      >
                        {kpi.currentValue}{kpi.unit === '%' ? '%' : ''}
                      </span>
                    )}
                  </td>

                  {/* Meta 2025 */}
                  <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-200">
                    {kpi.target2025}{kpi.unit === '%' ? '%' : ''}
                  </td>

                  {/* Meta Excelência */}
                  <td className="py-2.5 px-2 text-center font-mono font-bold text-amber-300">
                    {kpi.targetExcellence}{kpi.unit === '%' ? '%' : ''}
                  </td>

                  {/* Status Badge */}
                  <td className="py-2.5 px-2 text-center">
                    {getStatusBadge(kpi.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custom KPI Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm text-white">
          <div className="bg-[#0b132a] border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-extrabold uppercase text-slate-100">
                  Cadastrar Novo Indicador Municipal
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewKpi} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Nome do Indicador</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Taxa de Leitura no 2º Ano"
                  value={newKpiName}
                  onChange={(e) => setNewKpiName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Subtítulo / Descrição Curta</label>
                <input
                  type="text"
                  placeholder="Ex: Estudantes com fluência leitora comprovada"
                  value={newKpiSub}
                  onChange={(e) => setNewKpiSub(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Dimensão / Categoria</label>
                <select
                  value={newKpiCategory}
                  onChange={(e) => setNewKpiCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white capitalize"
                >
                  {CATEGORY_ITEMS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Valor Atual</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newKpiVal}
                    onChange={(e) => setNewKpiVal(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-white text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Meta Estratégica</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newKpiTarget2025}
                    onChange={(e) => setNewKpiTarget2025(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-white text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Unidade</label>
                  <input
                    type="text"
                    required
                    value={newKpiUnit}
                    onChange={(e) => setNewKpiUnit(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-white text-center font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400"
                >
                  Cadastrar Indicador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

