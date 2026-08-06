import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Bell,
  SlidersHorizontal,
  Plus,
  ArrowRight,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { useCockpit } from '../context/CockpitContext';

export const AlertsCenterView: React.FC = () => {
  const { alerts, resolveAlert, addActionPlan, setActiveTab, addAlert } = useCockpit();

  const [filterSeverity, setFilterSeverity] = useState<string>('todas');
  const [showResolved, setShowResolved] = useState<boolean>(false);

  // New Alert modal trigger
  const [showNewAlertModal, setShowNewAlertModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSeverity, setNewSeverity] = useState<'high' | 'medium' | 'low'>('high');

  const filteredAlerts = alerts.filter((a) => {
    if (!showResolved && a.resolved) return false;
    if (filterSeverity !== 'todas' && a.severity !== filterSeverity) return false;
    return true;
  });

  const handleConvertToActionPlan = (alertItem: any) => {
    addActionPlan({
      title: `Intervenção: ${alertItem.title}`,
      description: alertItem.description,
      schoolId: alertItem.schoolId,
      schoolName: alertItem.schoolName,
      kpiId: alertItem.kpiId,
      responsible: 'Equipe Técnica de Resposta Rápida',
      deadline: '2025-06-20',
      status: 'a_fazer',
      priority: alertItem.severity === 'high' ? 'alta' : 'media',
      completionPercentage: 0,
      steps: [
        { id: `st-alt1-${Date.now()}`, description: 'Identificação e apuração das causas', done: false },
        { id: `st-alt2-${Date.now()}`, description: 'Execução do plano de correção', done: false },
      ],
    });
    resolveAlert(alertItem.id);
    setActiveTab('planos_acao');
  };

  const handleCreateCustomAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addAlert({
      title: newTitle,
      description: newDesc || 'Alerta registrado manualmente pelo gestor.',
      severity: newSeverity,
      category: 'visao_geral',
    });

    setShowNewAlertModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-4 text-white">
      {/* Header & Controls */}
      <div className="bg-[#0b132a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              CENTRAL DE ALERTAS AUTOMÁTICOS & MONITORAMENTO DE RISCO
            </h2>
            <p className="text-xs text-slate-400">
              Alertas disparados por regras inteligentes de variação de assiduidade, desempenho e prazos
            </p>
          </div>

          <button
            onClick={() => setShowNewAlertModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>Emitir Alerta Manual</span>
          </button>
        </div>

        {/* Severity Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Severidade:</span>
            {(['todas', 'high', 'medium', 'low'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition ${
                  filterSeverity === sev
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {sev === 'todas' ? 'Todas' : sev === 'high' ? 'Alta' : sev === 'medium' ? 'Média' : 'Baixa'}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white transition">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded"
            />
            <span className="text-xs">Exibir alertas já resolvidos</span>
          </label>
        </div>
      </div>

      {/* Rules Banner */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold text-slate-200">Regra de Frequência</span>
            <p className="text-[10px] text-slate-400">Gera alerta quando 10+ alunos faltam por 3 dias consecutivos.</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold text-slate-200">Regra de Queda de Desempenho</span>
            <p className="text-[10px] text-slate-400">Gera alerta quando a proficiência cai &gt; 10% no bimestre.</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold text-slate-200">Regra de Prestação de Contas</span>
            <p className="text-[10px] text-slate-400">Gera alerta quando o recurso vence em menos de 30 dias.</p>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-[#0b132a] border rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 transition ${
              alert.resolved
                ? 'border-slate-800 opacity-60'
                : alert.severity === 'high'
                ? 'border-rose-800/80 bg-rose-950/10'
                : 'border-slate-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`p-2 rounded-xl mt-0.5 ${
                  alert.severity === 'high'
                    ? 'bg-rose-500/20 text-rose-400'
                    : alert.severity === 'medium'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-sky-500/20 text-sky-400'
                }`}
              >
                <ShieldAlert className="w-5 h-5" />
              </span>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      alert.severity === 'high'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {alert.severity === 'high' ? 'Alta Severidade' : 'Média Severidade'}
                  </span>
                  <span className="text-[10px] text-slate-500">• {alert.dateCreated}</span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-100">{alert.title}</h3>
                <p className="text-xs text-slate-400">{alert.description}</p>
                {alert.schoolName && (
                  <p className="text-xs font-semibold text-amber-300">
                    Unidade Afetada: {alert.schoolName}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!alert.resolved ? (
                <>
                  <button
                    onClick={() => handleConvertToActionPlan(alert)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md"
                  >
                    <span>Transformar em Plano de Ação</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700 transition"
                  >
                    Marcar Resolvido
                  </button>
                </>
              ) : (
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Resolvido
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Manual Alert Modal */}
      {showNewAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0b132a] border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-extrabold uppercase text-amber-300">
              Emitir Alerta Manual
            </h3>

            <form onSubmit={handleCreateCustomAlert} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Título do Alerta</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Instabilidade no sistema de diário eletrônico"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Severidade</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="high">Alta Severidade</option>
                  <option value="medium">Média Severidade</option>
                  <option value="low">Baixa Severidade</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAlertModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400"
                >
                  Emitir Alerta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
