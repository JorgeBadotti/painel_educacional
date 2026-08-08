import React, { useState, useEffect } from 'react';
import { useCockpit } from '../context/CockpitContext';
import { INITIAL_RADAR_PROGRAMS, calculateRadarCoreMetrics } from '../data/radarRecursosData';
import { EducationResourceProgram, RadarSummaryMetrics, DocChecklistItem } from '../types/radar';
import { RadarIndexedDbService } from '../utils/indexedDbService';
import { RadarKPIHeader } from './radar/RadarKPIHeader';
import { RadarOpportunityChart } from './radar/RadarOpportunityChart';
import { RadarProgramsTable } from './radar/RadarProgramsTable';
import { RadarAiAnalysis } from './radar/RadarAiAnalysis';
import { RadarSimulator } from './radar/RadarSimulator';
import { RadarAlertsTab } from './radar/RadarAlertsTab';
import { RadarApiIntegrationTab } from './radar/RadarApiIntegrationTab';
import { RadarFinancialExecutionTab } from './radar/RadarFinancialExecutionTab';
import {
  Layers,
  Sparkles,
  Sliders,
  Bell,
  CheckSquare,
  Database,
  Wifi,
  WifiOff,
  Bot,
  FileSpreadsheet,
  CheckCircle2,
  Plug,
  DollarSign,
  Coins
} from 'lucide-react';

type RadarSubTab = 'visao_geral' | 'tabela' | 'execucao_financeira' | 'analise_ia' | 'simulador' | 'alertas' | 'api_conectores';

export const RadarRecursosView: React.FC = () => {
  const { addActionPlan, userProfile, addAlert } = useCockpit();

  const [programs, setPrograms] = useState<EducationResourceProgram[]>(INITIAL_RADAR_PROGRAMS);
  const [activeSubTab, setActiveSubTab] = useState<RadarSubTab>('visao_geral');
  const [isIndexedDbSynced, setIsIndexedDbSynced] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load programs from IndexedDB or seed initial data
  useEffect(() => {
    const loadFromDb = async () => {
      try {
        const stored = await RadarIndexedDbService.getAllPrograms();
        if (stored && stored.length > 0) {
          setPrograms(stored);
        }
        setIsIndexedDbSynced(true);
      } catch (err) {
        console.warn('IndexedDB offline sync status:', err);
        setIsIndexedDbSynced(false);
      }
    };
    loadFromDb();
  }, []);

  // Compute aggregate summary metrics including commercial differential IAR
  const {
    totalMonitoredPrograms,
    totalOpportunities,
    programsAtRisk,
    totalPotentialValue,
    documentPendingCount,
    iarIndex,
  } = calculateRadarCoreMetrics(programs);
  const upcomingDeadlinesCount = programs.filter((p) => p.daysToDeadline <= 30 && p.eligibilityStatus !== 'encerrado').length;

  const iarStatusText =
    iarIndex >= 85
      ? 'Excelente aproveitamento'
      : iarIndex >= 60
      ? 'Há oportunidades importantes não exploradas'
      : 'Alto potencial de melhoria, com programas elegíveis e pendências';

  const metrics: RadarSummaryMetrics = {
    totalMonitoredPrograms,
    totalOpportunities,
    programsAtRisk,
    totalPotentialValue,
    upcomingDeadlinesCount,
    documentPendingCount,
    iarIndex,
    iarStatusText,
    iarStatusColor: iarIndex >= 85 ? 'green' : iarIndex >= 60 ? 'yellow' : 'red',
  };

  // Handler to update a single program (e.g. after adding expense transaction)
  const handleUpdateProgram = (updatedProgram: EducationResourceProgram) => {
    const updatedList = programs.map((p) => (p.id === updatedProgram.id ? updatedProgram : p));
    setPrograms(updatedList);
    RadarIndexedDbService.updateProgram(updatedProgram);
    setToastMessage(`Lançamento financeiro em "${updatedProgram.program}" atualizado com sucesso!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handler to update program checklist
  const handleUpdateProgramChecklist = async (programId: string, updatedChecklist: DocChecklistItem[]) => {
    const updatedList = programs.map((p) => {
      if (p.id === programId) {
        const uploadedCount = updatedChecklist.filter((c) => c.uploaded).length;
        const isComplete = uploadedCount === updatedChecklist.length;
        const newStatus = isComplete ? 'elegivel' : p.eligibilityStatus;
        const updatedProg: EducationResourceProgram = {
          ...p,
          checklist: updatedChecklist,
          eligibilityStatus: newStatus as any,
        };
        RadarIndexedDbService.updateProgram(updatedProg);
        return updatedProg;
      }
      return p;
    });
    setPrograms(updatedList);
  };

  // Handler to generate Action Plan automatically from opportunity
  const handleGenerateActionPlan = (program: EducationResourceProgram) => {
    const missingDocs = program.checklist.filter((c) => !c.uploaded).map((c) => c.docName).join(', ');

    addActionPlan({
      title: `Regularização de Recurso: ${program.program}`,
      description: `Ação emergencial para saneamento de pendências e liberação do repasse estimado em R$ ${new Intl.NumberFormat('pt-BR').format(program.estimatedValue)}. Pendências: ${missingDocs || 'Validação de critérios no SIMEC/FNDE.'}`,
      responsible: program.responsible,
      deadline: program.deadline,
      status: 'a_fazer',
      priority: program.risk === 'Crítico' || program.risk === 'Alto' ? 'alta' : 'media',
      completionPercentage: 10,
      steps: program.checklist.map((c) => ({
        id: c.id,
        description: `Providenciar e anexar: ${c.docName}`,
        done: c.uploaded,
      })),
    });

    addAlert({
      title: `Plano de Ação Gerado: ${program.program}`,
      description: `Plano adicionado à Central com responsável ${program.responsible}. Prazo: ${program.deadline}.`,
      severity: 'high',
      category: 'financeiro',
    });

    setToastMessage(`Plano de Ação para "${program.program}" gerado com sucesso!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-black text-xs flex items-center gap-2 border-2 border-amber-300 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Sub-Navigation Controls */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase flex items-center gap-2">
              📡 RADAR DE RECURSOS DA EDUCAÇÃO
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 ${
                isIndexedDbSynced
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                  : 'bg-rose-950 text-rose-300 border-rose-700/60'
              }`}
            >
              <Database className={`w-3 h-3 ${isIndexedDbSynced ? 'text-emerald-400' : 'text-rose-400'}`} />
              {isIndexedDbSynced ? 'IndexedDB Offline Sync' : 'IndexedDB Indisponível'}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Central de Inteligência Financeira e Captação de Verbas — {userProfile.municipality}
          </p>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 bg-[#060b19] p-1 rounded-xl border border-slate-800 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setActiveSubTab('visao_geral')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'visao_geral'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Visão Geral & Gráfico</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tabela')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'tabela'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Lista de Programas ({programs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('execucao_financeira')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'execucao_financeira'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>💰 Execução & Verbas Aderidas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('analise_ia')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'analise_ia'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span>Análise Inteligente (IA)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('simulador')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'simulador'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span>Simulações</span>
          </button>

          <button
            onClick={() => setActiveSubTab('alertas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'alertas'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-rose-400" />
            <span>Alertas ({metrics.upcomingDeadlinesCount})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('api_conectores')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'api_conectores'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Plug className="w-3.5 h-3.5 text-emerald-400" />
            <span>APIs Oficiais</span>
          </button>
        </div>
      </div>

      {/* 6 KPI Cards & Commercial Differential IAR Score */}
      <RadarKPIHeader
        metrics={metrics}
        onFilterClick={(type) => {
          if (type === 'tabela' || type === 'todos' || type === 'oportunidades' || type === 'risco' || type === 'pendencias') {
            setActiveSubTab('tabela');
          } else if (type === 'prazos') {
            setActiveSubTab('alertas');
          }
        }}
      />

      {/* Dynamic View Sections based on SubTab */}
      {activeSubTab === 'visao_geral' && (
        <div className="space-y-6">
          <RadarOpportunityChart
            programs={programs}
            onSelectProgram={(prog) => setActiveSubTab('tabela')}
          />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7">
              <RadarProgramsTable
                programs={programs.slice(0, 6)}
                onGenerateActionPlan={handleGenerateActionPlan}
                onUpdateProgramChecklist={handleUpdateProgramChecklist}
              />
            </div>
            <div className="xl:col-span-5">
              <RadarAiAnalysis
                programs={programs}
                metrics={metrics}
              />
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'tabela' && (
        <RadarProgramsTable
          programs={programs}
          onGenerateActionPlan={handleGenerateActionPlan}
          onUpdateProgramChecklist={handleUpdateProgramChecklist}
        />
      )}

      {activeSubTab === 'execucao_financeira' && (
        <RadarFinancialExecutionTab
          programs={programs}
          onUpdateProgram={handleUpdateProgram}
          onSelectProgram={(prog) => setActiveSubTab('tabela')}
        />
      )}

      {activeSubTab === 'analise_ia' && (
        <RadarAiAnalysis
          programs={programs}
          metrics={metrics}
        />
      )}

      {activeSubTab === 'simulador' && <RadarSimulator />}

      {activeSubTab === 'alertas' && (
        <RadarAlertsTab
          programs={programs}
          onGenerateActionPlan={handleGenerateActionPlan}
        />
      )}

      {activeSubTab === 'api_conectores' && <RadarApiIntegrationTab />}
    </div>
  );
};
