import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  Target,
  Award,
  AlertTriangle,
  Plus,
  Building,
  BarChart2,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { useCockpit } from '../context/CockpitContext';
import { KpiIndicator } from '../types';

export const KpiDetailModal: React.FC<{
  kpi: KpiIndicator | null;
  onClose: () => void; }> = ({ kpi, onClose }) => {
  const { addActionPlan, setActiveTab, schools } = useCockpit();

  const [showCreateAction, setShowCreateAction] = useState(false);
  const [actionTitle, setActionTitle] = useState('');
  const [actionDesc, setActionDesc] = useState('');
  const [responsible, setResponsible] = useState('');
  const [deadline, setDeadline] = useState('2025-07-30');

  if (!kpi) return null;

  // Chart data merging historyBefore & historyAfter
  const chartData = [
    ...kpi.historyBefore.map((p) => ({ period: p.period, valor: p.value, fase: 'Antes da Implantação' })),
    ...kpi.historyAfter.map((p) => ({ period: p.period, valor: p.value, fase: 'Após Implantação' })),
  ];

  // School breakdown ranking for this KPI
  const sortedSchools = [...schools].sort((a, b) => {
    if (kpi.id === 'frequencia') return b.frequencia - a.frequencia;
    if (kpi.id === 'ideb') return b.ideb - a.ideb;
    if (kpi.id === 'alfabetizacao') return b.alfabetizacao - a.alfabetizacao;
    if (kpi.id === 'aprovacao') return b.taxaAprovacao - a.taxaAprovacao;
    return b.studentCount - a.studentCount;
  });

  const topSchools = sortedSchools.slice(0, 3);
  const bottomSchools = sortedSchools.slice(-3).reverse();

  const handleCreateActionPlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionTitle.trim()) return;

    addActionPlan({
      title: actionTitle,
      description: actionDesc || `Plano emergencial focado no indicador ${kpi.name}`,
      kpiId: kpi.id,
      kpiName: kpi.name,
      responsible: responsible || kpi.responsibleArea,
      deadline: deadline,
      status: 'a_fazer',
      priority: kpi.status === 'critico' ? 'alta' : 'media',
      completionPercentage: 0,
      steps: [
        { id: `st-init-${Date.now()}`, description: 'Mapeamento inicial das escolas com menor índice', done: false },
        { id: `st-exec-${Date.now()}`, description: 'Aplicação de reforço e disponibilização de recursos', done: false },
      ],
    });

    setShowCreateAction(false);
    setActiveTab('planos_acao');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b132a] border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white uppercase tracking-wider">{kpi.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-800 text-amber-300 border border-slate-700">
                  {kpi.responsibleArea}
                </span>
              </div>
              <p className="text-xs text-slate-400">{kpi.subtitle || kpi.description}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Resultado Atual</span>
              <p className="text-2xl font-extrabold text-white mt-1">
                {kpi.currentValue} <span className="text-xs text-slate-400 font-normal">{kpi.unit}</span>
              </p>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Meta Estratégica</span>
              <p className="text-2xl font-extrabold text-sky-400 mt-1">
                {kpi.target2025} <span className="text-xs text-slate-400 font-normal">{kpi.unit}</span>
              </p>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-amber-400/80 uppercase font-bold">Meta Excelência</span>
              <p className="text-2xl font-extrabold text-amber-300 mt-1">
                {kpi.targetExcellence} <span className="text-xs text-amber-400/60 font-normal">{kpi.unit}</span>
              </p>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Status do Indicador</span>
              <div className="mt-2">
                {kpi.status === 'em_evolucao' && (
                  <span className="px-2.5 py-1 text-xs font-bold text-emerald-400 bg-emerald-950 rounded-full border border-emerald-800">
                    Em Evolução
                  </span>
                )}
                {kpi.status === 'atencao' && (
                  <span className="px-2.5 py-1 text-xs font-bold text-amber-300 bg-amber-950 rounded-full border border-amber-800">
                    Atenção Requerida
                  </span>
                )}
                {kpi.status === 'critico' && (
                  <span className="px-2.5 py-1 text-xs font-bold text-rose-300 bg-rose-950 rounded-full border border-rose-800 animate-pulse">
                    Situação Crítica
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Historical Evolution Chart with Target Lines */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Trajetória Histórica & Linhas de Meta
              </h3>
              <span className="text-[10px] text-slate-400">
                Divisor: Implantação em Março/2024
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                    formatter={(val: any) => [`${val} ${kpi.unit}`, 'Valor']}
                  />
                  <ReferenceLine
                    y={kpi.target2025}
                    label={{ value: `Meta Estratégica (${kpi.target2025})`, fill: '#38bdf8', fontSize: 10 }}
                    stroke="#38bdf8"
                    strokeDasharray="4 4"
                  />
                  <ReferenceLine
                    y={kpi.targetExcellence}
                    label={{ value: `Excelência (${kpi.targetExcellence})`, fill: '#f59e0b', fontSize: 10 }}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                  />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#34d399', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* School Performance Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top performing schools */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Escolas em Destaque neste Indicador
              </h4>
              <div className="space-y-2">
                {topSchools.map((sch) => (
                  <div key={sch.id} className="p-2 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-200">{sch.name}</p>
                      <span className="text-[10px] text-slate-400">Região {sch.region}</span>
                    </div>
                    <span className="font-bold text-emerald-400">
                      {kpi.id === 'frequencia' ? sch.frequencia : sch.ideb} {kpi.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom performing schools needing attention */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                Escolas em Atenção / Situação Crítica
              </h4>
              <div className="space-y-2">
                {bottomSchools.map((sch) => (
                  <div key={sch.id} className="p-2 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-200">{sch.name}</p>
                      <span className="text-[10px] text-slate-400">Região {sch.region}</span>
                    </div>
                    <span className="font-bold text-rose-400">
                      {kpi.id === 'frequencia' ? sch.frequencia : sch.ideb} {kpi.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Plan Creator Drawer Trigger */}
          {!showCreateAction ? (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setActionTitle(`Plano de Ação Especial: Melhotia do ${kpi.name}`);
                  setShowCreateAction(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Plano de Ação para este Indicador</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreateActionPlanSubmit} className="p-4 bg-slate-900 border border-amber-500/40 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Novo Plano de Ação para {kpi.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Título do Plano</label>
                  <input
                    type="text"
                    required
                    value={actionTitle}
                    onChange={(e) => setActionTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Responsável</label>
                  <input
                    type="text"
                    required
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    placeholder={kpi.responsibleArea}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Descrição do Objetivo</label>
                <textarea
                  rows={2}
                  value={actionDesc}
                  onChange={(e) => setActionDesc(e.target.value)}
                  placeholder="Descreva as medidas emergenciais..."
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Prazo limite</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateAction(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400 shadow-md"
                  >
                    Salvar e Acompanhar
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
