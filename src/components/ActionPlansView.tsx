import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Sparkles
} from 'lucide-react';
import { useCockpit } from '../context/CockpitContext';
import { ActionPlan } from '../types';

export const ActionPlansView: React.FC = () => {
  const { actionPlans, schools, addActionPlan, updateActionPlanStatus, toggleActionStep } = useCockpit();

  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [responsible, setResponsible] = useState('');
  const [deadline, setDeadline] = useState('2025-06-30');
  const [priority, setPriority] = useState<'alta' | 'media' | 'baixa'>('alta');
  const [stepInputs, setStepInputs] = useState<string[]>(['Mapeamento inicial', 'Execução da intervenção']);

  const filteredPlans = actionPlans.filter((p) => {
    if (filterStatus !== 'todos' && p.status !== filterStatus) return false;
    return true;
  });

  const handleAddStepInput = () => {
    setStepInputs([...stepInputs, '']);
  };

  const handleStepInputChange = (index: number, val: string) => {
    const copy = [...stepInputs];
    copy[index] = val;
    setStepInputs(copy);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedSch = schools.find((s) => s.id === selectedSchoolId);

    const formattedSteps = stepInputs
      .filter((s) => s.trim().length > 0)
      .map((desc, idx) => ({
        id: `st-new-${Date.now()}-${idx}`,
        description: desc,
        done: false,
      }));

    addActionPlan({
      title,
      description,
      schoolId: matchedSch?.id,
      schoolName: matchedSch?.name,
      responsible: responsible || 'Coordenadoria de Ensino',
      deadline,
      status: 'a_fazer',
      priority,
      completionPercentage: 0,
      steps: formattedSteps.length > 0 ? formattedSteps : [{ id: `st-def-${Date.now()}`, description: 'Etapa inicial', done: false }],
    });

    setShowCreateModal(false);
    setTitle('');
    setDescription('');
    setSelectedSchoolId('');
    setResponsible('');
  };

  const getStatusBadge = (status: ActionPlan['status']) => {
    switch (status) {
      case 'a_fazer':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            A Fazer
          </span>
        );
      case 'em_andamento':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-sky-950 text-sky-300 border border-sky-800">
            Em Andamento
          </span>
        );
      case 'concluido':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
            Concluído
          </span>
        );
      case 'em_atraso':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
            Em Atraso
          </span>
        );
    }
  };

  const getPriorityBadge = (p: ActionPlan['priority']) => {
    switch (p) {
      case 'alta':
        return <span className="text-[10px] font-bold text-rose-400 uppercase">Prioridade Alta</span>;
      case 'media':
        return <span className="text-[10px] font-bold text-amber-400 uppercase">Prioridade Média</span>;
      case 'baixa':
        return <span className="text-[10px] font-bold text-slate-400 uppercase">Prioridade Baixa</span>;
    }
  };

  return (
    <div className="space-y-4 text-white">
      {/* Header & Filter Controls */}
      <div className="bg-[#0b132a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-amber-400" />
              PLANOS DE AÇÃO & INTERVENÇÕES PEDAGÓGICAS
            </h2>
            <p className="text-xs text-slate-400">
              Crie e acompanhe etapas de superação de metas e resolução de indicadores em risco
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Novo Plano de Ação</span>
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {(['todos', 'a_fazer', 'em_andamento', 'concluido', 'em_atraso'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition ${
                filterStatus === st
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {st === 'todos' ? 'Todos os Planos' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Plan List */}
      <div className="space-y-3">
        {filteredPlans.map((plan) => {
          const isExpanded = expandedPlanId === plan.id;
          return (
            <div
              key={plan.id}
              className="bg-[#0b132a] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(plan.priority)}
                    <span className="text-[10px] text-slate-500">• Criado em {plan.createdDate}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-100">{plan.title}</h3>
                  {plan.schoolName && (
                    <p className="text-xs font-semibold text-amber-300">
                      Unidade: {plan.schoolName}
                    </p>
                  )}
                  <p className="text-xs text-slate-400">{plan.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(plan.status)}
                  <button
                    onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg transition"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Progresso das Etapas:</span>
                  <span className="text-amber-300">{plan.completionPercentage}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${plan.completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Responsible and Deadline */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span><strong>Responsável:</strong> {plan.responsible}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span><strong>Prazo Limite:</strong> {plan.deadline}</span>
                </div>
              </div>

              {/* Expanded Checklist Steps */}
              {isExpanded && (
                <div className="mt-3 p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 animate-fade-in">
                  <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">
                    Checklist de Execução
                  </h4>
                  <div className="space-y-2">
                    {plan.steps.map((st) => (
                      <label
                        key={st.id}
                        className="flex items-center gap-3 p-2 bg-slate-950 border border-slate-800 rounded-lg hover:border-slate-700 cursor-pointer transition text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={st.done}
                          onChange={() => toggleActionStep(plan.id, st.id)}
                          className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                        />
                        <span className={st.done ? 'line-through text-slate-500' : 'text-slate-200'}>
                          {st.description}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Manual Status Override Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-2 text-xs">
                    <span className="text-slate-500 text-[10px]">Alterar status manual:</span>
                    <button
                      onClick={() => updateActionPlanStatus(plan.id, 'em_andamento')}
                      className="px-2.5 py-1 bg-sky-950 text-sky-300 border border-sky-800 rounded-lg hover:bg-sky-900"
                    >
                      Em Andamento
                    </button>
                    <button
                      onClick={() => updateActionPlanStatus(plan.id, 'concluido')}
                      className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg hover:bg-emerald-900"
                    >
                      Marcar Concluído
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Creator */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0b132a] border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-extrabold uppercase text-amber-300 tracking-wider">
              Criar Novo Plano de Ação
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Título do Plano</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Força-tarefa de Busca Ativa em Língua Portuguesa"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Objetivos e justificativa da intervenção..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Escola Foco</label>
                  <select
                    value={selectedSchoolId}
                    onChange={(e) => setSelectedSchoolId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="">Toda a Rede Municipal</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Responsável</label>
                  <input
                    type="text"
                    required
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    placeholder="Nome do gestor ou coordenação"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Prazo Limite</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Prioridade</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                  </select>
                </div>
              </div>

              {/* Steps inputs */}
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 uppercase font-bold">Etapas / Tarefas</label>
                {stepInputs.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={val}
                    onChange={(e) => handleStepInputChange(idx, e.target.value)}
                    placeholder={`Etapa ${idx + 1}`}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-white text-xs mb-1"
                  />
                ))}
                <button
                  type="button"
                  onClick={handleAddStepInput}
                  className="text-[10px] text-amber-400 font-bold hover:underline"
                >
                  + Adicionar mais uma etapa
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 shadow-md"
                >
                  Salvar Plano
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
