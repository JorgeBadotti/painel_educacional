import React, { useState, useEffect } from 'react';
import { useCockpit } from '../context/CockpitContext';
import { KpiIndicator } from '../types';
import {
  Target,
  Sparkles,
  TrendingUp,
  Sliders,
  Save,
  Bot,
  Send,
  CheckCircle2,
  AlertTriangle,
  Zap,
  RotateCcw,
  Calendar,
  Layers,
  ArrowRight,
  Plus,
  Check,
  ShieldAlert,
  HelpCircle,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend
} from 'recharts';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedTrajectory?: number[];
}

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Calendar metadata for pedagogical context
const MONTH_METADATA: { [key: number]: { label: string; badgeClass: string; isRecess?: boolean; isEval?: boolean } } = {
  0: { label: 'Recesso', badgeClass: 'bg-slate-800 text-slate-400', isRecess: true },
  1: { label: 'Início Ano', badgeClass: 'bg-blue-950/60 text-blue-400 border border-blue-800/40' },
  2: { label: 'Diagnóstica', badgeClass: 'bg-indigo-950/60 text-indigo-400 border border-indigo-800/40' },
  3: { label: 'Avaliação B1', badgeClass: 'bg-purple-950/60 text-purple-400 border border-purple-800/40', isEval: true },
  4: { label: 'Intervenção', badgeClass: 'bg-blue-950/60 text-blue-400 border border-blue-800/40' },
  5: { label: 'Avaliação B2', badgeClass: 'bg-purple-950/60 text-purple-400 border border-purple-800/40', isEval: true },
  6: { label: 'Recesso Julho', badgeClass: 'bg-slate-800 text-slate-400', isRecess: true },
  7: { label: 'Retorno/B3', badgeClass: 'bg-blue-950/60 text-blue-400 border border-blue-800/40' },
  8: { label: 'Avaliação B3', badgeClass: 'bg-purple-950/60 text-purple-400 border border-purple-800/40', isEval: true },
  9: { label: 'Simulado SAEB', badgeClass: 'bg-amber-950/60 text-amber-400 border border-amber-800/40', isEval: true },
  10: { label: 'Avaliação B4', badgeClass: 'bg-purple-950/60 text-purple-400 border border-purple-800/40', isEval: true },
  11: { label: 'Conselho Final', badgeClass: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' }
};

export const GoalPlanningView: React.FC = () => {
  const { kpis, updateKpiGlidePath, addActionPlan } = useCockpit();

  // Selected KPI State
  const [selectedKpiId, setSelectedKpiId] = useState<string>(kpis[0]?.id || 'frequencia');
  const selectedKpi = kpis.find((k) => k.id === selectedKpiId) || kpis[0];

  // Base value (previous year or historical)
  const baseValue = selectedKpi ? (selectedKpi.historyBefore?.[1]?.value || selectedKpi.currentValue * 0.94) : 90.0;
  
  // Final Strategic Target
  const [targetStrategic, setTargetStrategic] = useState<number>(selectedKpi ? selectedKpi.target2025 : 95.0);

  // 12-Month Trajectory State
  const [monthlyValues, setMonthlyValues] = useState<number[]>(() => {
    if (selectedKpi?.metaPlanejadaMonthly && selectedKpi.metaPlanejadaMonthly.length === 12) {
      return [...selectedKpi.metaPlanejadaMonthly];
    }
    // Default linear initialization
    const target = selectedKpi ? selectedKpi.target2025 : 95.0;
    return Array.from({ length: 12 }, (_, i) => parseFloat((baseValue + ((target - baseValue) * (i + 1)) / 12).toFixed(1)));
  });

  // Toast & Save confirmation state
  const [savedSuccessToast, setSavedSuccessToast] = useState(false);
  const [exportedActionsToast, setExportedActionsToast] = useState(false);

  // Active distribution preset identifier
  const [activePreset, setActivePreset] = useState<'linear' | 'sazonal' | 'progressivo' | 'custom'>('linear');

  // Copilot Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Olá! Sou seu Assistente de Planejamento IA. Estou pronto para ajudar a estruturar a trajetória ideal (Glide Path) para "${selectedKpi.name}". Como posso ajudar no planejamento estratégico da rede?`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Generated Action Plans State
  const [generatedActions, setGeneratedActions] = useState<any[]>([]);
  const [isGeneratingActions, setIsGeneratingActions] = useState(false);

  // Sync state when selected KPI changes
  useEffect(() => {
    if (selectedKpi) {
      setTargetStrategic(selectedKpi.target2025);
      if (selectedKpi.metaPlanejadaMonthly && selectedKpi.metaPlanejadaMonthly.length === 12) {
        setMonthlyValues([...selectedKpi.metaPlanejadaMonthly]);
        setActivePreset('custom');
      } else {
        applyDistributionPreset('linear', selectedKpi.target2025);
      }
      generateDefaultActionsForKpi(selectedKpi);
    }
  }, [selectedKpiId]);

  // Recalculate distribution presets
  const applyDistributionPreset = (preset: 'linear' | 'sazonal' | 'progressivo', customTarget?: number) => {
    const target = customTarget !== undefined ? customTarget : targetStrategic;
    const gap = target - baseValue;
    const newValues: number[] = [];

    if (preset === 'linear') {
      for (let i = 0; i < 12; i++) {
        const val = baseValue + (gap * (i + 1)) / 12;
        newValues.push(parseFloat(val.toFixed(1)));
      }
    } else if (preset === 'sazonal') {
      // Recess plateau in Jan (i=0) & Jul (i=6)
      // Faster gains in Apr/May (i=3,4) & Sep/Oct/Nov (i=8,9,10)
      const weights = [0.03, 0.08, 0.15, 0.28, 0.38, 0.48, 0.50, 0.62, 0.75, 0.88, 0.96, 1.0];
      for (let i = 0; i < 12; i++) {
        const val = baseValue + gap * weights[i];
        newValues.push(parseFloat(val.toFixed(1)));
      }
    } else if (preset === 'progressivo') {
      // Slow start in Q1 (20% of gap), ramp up in Q2/Q3 (50%), strong final push (30%)
      const weights = [0.03, 0.08, 0.15, 0.25, 0.38, 0.52, 0.60, 0.72, 0.82, 0.90, 0.95, 1.0];
      for (let i = 0; i < 12; i++) {
        const val = baseValue + gap * weights[i];
        newValues.push(parseFloat(val.toFixed(1)));
      }
    }

    setMonthlyValues(newValues);
    setActivePreset(preset);
  };

  // Update single month value manually
  const handleMonthInputChange = (index: number, valStr: string) => {
    const num = parseFloat(valStr);
    if (!isNaN(num)) {
      const updated = [...monthlyValues];
      updated[index] = parseFloat(num.toFixed(1));
      setMonthlyValues(updated);
      setActivePreset('custom');
      if (index === 11) {
        setTargetStrategic(parseFloat(num.toFixed(1)));
      }
    }
  };

  // Diagnostic Engine: "Meta, Metinha ou Ilusão?"
  const evaluateGoalDiagnosis = () => {
    const decVal = monthlyValues[11] || targetStrategic;
    const netGain = decVal - baseValue;
    
    // Calculate maximum single-month jump
    let maxMonthlyJump = 0;
    for (let i = 0; i < monthlyValues.length; i++) {
      const prev = i === 0 ? baseValue : monthlyValues[i - 1];
      const jump = monthlyValues[i] - prev;
      if (jump > maxMonthlyJump) maxMonthlyJump = jump;
    }

    // Is negative indicator (like Abandono or Distorção)?
    const isReverseIndicator = selectedKpi?.name.toLowerCase().includes('abandono') || selectedKpi?.name.toLowerCase().includes('distorção');

    if (isReverseIndicator) {
      const drop = baseValue - decVal;
      if (drop < 0.5) {
        return {
          type: 'metinha' as const,
          label: '🟡 Metinha (Conservador)',
          badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
          title: 'Meta muito conservadora',
          description: `A redução planejada é de apenas ${drop.toFixed(1)} ${selectedKpi.unit}. Há espaço técnico na rede para um corte mais ambicioso.`
        };
      } else if (drop > 5.0 || Math.abs(maxMonthlyJump) > 2.0) {
        return {
          type: 'ilusao' as const,
          label: '🔴 Ilusão (Inviável/Risco)',
          badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
          title: 'Meta irrealista ou salto desproporcional',
          description: `Risco alto de sobrefadiga. A taxa de redução mensal excede a capacidade histórica da rede.`
        };
      }
      return {
        type: 'ideal' as const,
        label: '🟢 Meta Desafiadora (Ideal/Realista)',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        title: 'Trajetória equilibrada e viável',
        description: `Trajetória consistente de queda (${drop.toFixed(1)} ${selectedKpi.unit}). Exige governança ativa das equipes.`
      };
    }

    // Standard positive metrics (%)
    if (netGain < 1.5) {
      return {
        type: 'metinha' as const,
        label: '🟡 Metinha (Conservador)',
        badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        title: 'Meta muito conservadora',
        description: `O ganho pretendido é de apenas +${netGain.toFixed(1)} ${selectedKpi.unit}. A rede possui capacidade histórica para maior ambição sem risco de sobrecarga.`
      };
    } else if (netGain > 8.5 || maxMonthlyJump > 2.5) {
      return {
        type: 'ilusao' as const,
        label: '🔴 Ilusão (Inviável/Risco)',
        badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
        title: 'Risco de Inviabilidade Técnica',
        description: `Exige um salto mensal acelerado de até +${maxMonthlyJump.toFixed(1)} ${selectedKpi.unit}/mês (Ganho total de +${netGain.toFixed(1)} ${selectedKpi.unit}). Sem intervenção profunda, há alto risco de sobrefadiga docente.`
      };
    } else {
      return {
        type: 'ideal' as const,
        label: '🟢 Meta Desafiadora (Ideal/Realista)',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        title: 'Trajetória transformadora e alcançável',
        description: `Ganho de +${netGain.toFixed(1)} ${selectedKpi.unit} com aceleração mensal máxima de +${maxMonthlyJump.toFixed(1)} ${selectedKpi.unit}. Trajetória sólida para atingir a Meta Estratégica.`
      };
    }
  };

  const diagnosis = evaluateGoalDiagnosis();

  // Save Planning to Context & LocalStorage
  const handleSavePlanning = () => {
    updateKpiGlidePath(selectedKpi.id, monthlyValues, targetStrategic);
    setSavedSuccessToast(true);
    setTimeout(() => setSavedSuccessToast(false), 4500);
  };

  // Generate Default Operational Actions for selected KPI
  const generateDefaultActionsForKpi = (kpi: KpiIndicator) => {
    let actions = [];
    if (kpi.name.toLowerCase().includes('frequência') || kpi.name.toLowerCase().includes('frequencia')) {
      actions = [
        {
          title: 'Operação Busca Ativa Escolar em Rede (WhatsApp & Visitas)',
          objective: 'Engajar estudantes com mais de 3 faltas consecutivas via monitoramento diário.',
          responsible: 'Coordenadoria de Frequência & Assistência Social',
          deadline: '30 dias',
          priority: 'alta',
          steps: [
            { id: 'st-1', description: 'Disparar alertas automáticos no app dos diretores de polo', done: true },
            { id: 'st-2', description: 'Mapear 100% das famílias com risco de abandono', done: false },
            { id: 'st-3', description: 'Realizar busca ativa presencial com agentes comunitários', done: false }
          ]
        },
        {
          title: 'Programa Frequência Premiada & Incentivo Familiar',
          objective: 'Incentivar turmas com frequência superior a 95% no bimestre com reconhecimento.',
          responsible: 'Diretores de Polo & Grêmio Estudantil',
          deadline: '60 dias',
          priority: 'media',
          steps: [
            { id: 'st-4', description: 'Definir selos bimestrais de excelência por turma', done: true },
            { id: 'st-5', description: 'Realizar encontros mensais com famílias parceiras', done: false }
          ]
        },
        {
          title: 'Mapeamento de Rotas do Transporte Escolar Rural',
          objective: 'Eliminar gargalos operacionais em dias chuvosos que impactam a assiduidade.',
          responsible: 'Secretaria de Transporte & Infraestrutura',
          deadline: '45 dias',
          priority: 'alta',
          steps: [
            { id: 'st-6', description: 'Auditar 100% das rotas críticas em áreas rurais', done: false },
            { id: 'st-7', description: 'Garantir frota reserva para substituição emergencial', done: false }
          ]
        }
      ];
    } else if (kpi.name.toLowerCase().includes('alfabetiz') || kpi.name.toLowerCase().includes('ideb')) {
      actions = [
        {
          title: 'Formação Continuada em Fluência Leitora & Fonética',
          objective: 'Capacitar 100% dos professores de 1º e 2º ano em metodologias estruturadas.',
          responsible: 'Núcleo de Formação Pedagógica',
          deadline: '30 dias',
          priority: 'alta',
          steps: [
            { id: 'st-8', description: 'Realizar workshop com especialistas em neurociência da leitura', done: true },
            { id: 'st-9', description: 'Distribuir kits de jogos fonológicos para todas as salas', done: false }
          ]
        },
        {
          title: 'Recomposição Intensiva de Aprendizagem no Contraturno',
          objective: 'Atender alunos com defasagem em pequenos grupos de alfabetização.',
          responsible: 'Coordenadores Pedagógicos de Escola',
          deadline: '45 dias',
          priority: 'alta',
          steps: [
            { id: 'st-10', description: 'Aplicar avaliação diagnóstica de leitura no 1º bimestre', done: true },
            { id: 'st-11', description: 'Enturmar alunos em nível pré-silábico no contraturno', done: false }
          ]
        },
        {
          title: 'Monitoramento Bimestral de Fluência Leitora (Audio-Leitura)',
          objective: 'Acompanhar a evolução das palavras lidas por minuto por criança.',
          responsible: 'Equipe de Avaliação da Rede',
          deadline: '60 dias',
          priority: 'media',
          steps: [
            { id: 'st-12', description: 'Gravar amostra de leitura nos 2ºs anos', done: false },
            { id: 'st-13', description: 'Devolver relatórios individuais para intervenção docente', done: false }
          ]
        }
      ];
    } else {
      actions = [
        {
          title: `Plano Estratégico de Aceleração do KPI: ${kpi.name}`,
          objective: `Atingir a meta de ${targetStrategic} ${kpi.unit} com acompanhamento quinzenal.`,
          responsible: kpi.responsibleArea || 'Equipe de Gestão Educacional',
          deadline: '30 dias',
          priority: 'alta',
          steps: [
            { id: 'st-14', description: 'Diagnóstico detalhado por polo e etapa de ensino', done: true },
            { id: 'st-15', description: 'Pactuação de metas com gestores escolares', done: false },
            { id: 'st-16', description: 'Reunião mensal de alinhamento e acompanhamento do Glide Path', done: false }
          ]
        },
        {
          title: 'Reforço de Infraestrutura e Recursos Pedagógicos Mapeados',
          objective: 'Garantir insumos e ferramentas para as turmas prioritárias.',
          responsible: 'Diretoria de Insumos & Logística',
          deadline: '60 dias',
          priority: 'media',
          steps: [
            { id: 'st-17', description: 'Auditoria de materiais nas escolas com menor desempenho', done: false },
            { id: 'st-18', description: 'Distribuição acelerada dos materiais didáticos', done: false }
          ]
        }
      ];
    }
    setGeneratedActions(actions);
  };

  // Export Generated Actions to Global ActionPlans Store
  const handleExportActionsToGlobal = () => {
    generatedActions.forEach((act) => {
      addActionPlan({
        title: act.title,
        description: act.objective,
        kpiId: selectedKpi.id,
        kpiName: selectedKpi.name,
        responsible: act.responsible,
        deadline: act.deadline,
        priority: act.priority as any,
        completionPercentage: 15,
        steps: act.steps,
        status: 'em_andamento'
      });
    });
    setExportedActionsToast(true);
    setTimeout(() => setExportedActionsToast(false), 4500);
  };

  // Send message to Copilot AI
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsAiThinking(true);

    setTimeout(() => {
      let aiResponseText = '';
      let suggestedVals: number[] | undefined = undefined;

      const lower = text.toLowerCase();

      if (lower.includes('sazonal') || lower.includes('férias') || lower.includes('recesso')) {
        suggestedVals = [
          baseValue,
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.08).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.18).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.32).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.44).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.52).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.54).toFixed(1)), // Recess Jul
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.68).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.80).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.90).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.96).toFixed(1)),
          targetStrategic
        ];
        aiResponseText = `Analisei o padrão pedagógico de "${selectedKpi.name}". Recomendo uma trajetória **Sazonal com Estabilização em Julho**. O início do ano letivo exige adaptação (Fev/Mar), seguido de forte aceleração nas avaliações bimestrais (Abr/Mai e Out/Nov). Clique no botão abaixo para aplicar essa curva diretamente no Grid!`;
      } else if (lower.includes('tração') || lower.includes('agressivo') || lower.includes('ambiciosa') || lower.includes('segundo semestre')) {
        suggestedVals = [
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.05).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.10).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.18).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.28).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.40).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.52).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.60).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.74).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.86).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.94).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.98).toFixed(1)),
          targetStrategic
        ];
        aiResponseText = `Propus um **Glide Path de Tração Progressiva** com forte impulso no 2º semestre (${targetStrategic} ${selectedKpi.unit}). Essa curva alivia a pressão nos primeiros meses para focar na formação docente e consolida os resultados durante o simulado SAEB. Clique abaixo para carregar essa proposta.`;
      } else if (lower.includes('viabilidade') || lower.includes('meta, metinha') || lower.includes('diagnóstico')) {
        aiResponseText = `Diagnóstico técnico para **${selectedKpi.name}**:\n\n• **Status atual**: ${diagnosis.label}\n• **Ganho pretendido**: ${(targetStrategic - baseValue).toFixed(1)} ${selectedKpi.unit}\n• **Parecer IA**: ${diagnosis.description}\n\nPara garantir a sustentabilidade desta meta, certifique-se de acionar as ações operacionais listadas ao lado.`;
      } else {
        suggestedVals = [
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.08).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.16).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.25).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.35).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.45).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.55).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.62).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.72).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.82).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.90).toFixed(1)),
          parseFloat((baseValue + (targetStrategic - baseValue) * 0.96).toFixed(1)),
          targetStrategic
        ];
        aiResponseText = `Com base nas evidências históricas de redes municipais similares, estruturei uma proposta de **Glide Path Otimizado** para "${selectedKpi.name}". Ela distribui o ganho de forma sustentável, evitando picos de estresse pedagógico nos meses de férias. Quer aplicar no Grid?`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedTrajectory: suggestedVals
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      setIsAiThinking(false);
    }, 900);
  };

  const handleApplyAiProposal = (vals: number[]) => {
    setMonthlyValues(vals);
    setActivePreset('custom');
    if (vals.length === 12) {
      setTargetStrategic(vals[11]);
    }
  };

  // Prepare chart data for Recharts
  const chartData = MONTH_NAMES.map((mes, idx) => {
    const factorPast = 0.92 + idx * 0.007;
    const pastVal = parseFloat((baseValue * factorPast).toFixed(1));

    // Executed values up to month 7 (August)
    const factorCurr = 0.94 + idx * 0.008;
    const executedVal = idx <= 7 ? parseFloat((selectedKpi.currentValue * factorCurr).toFixed(1)) : null;

    const plannedVal = monthlyValues[idx] !== undefined ? monthlyValues[idx] : null;

    return {
      mes,
      anoAnterior: pastVal,
      anoAtual: executedVal,
      metaPlanejada: plannedVal,
      metaFinal: targetStrategic
    };
  });

  return (
    <div className="space-y-6 max-w-[1920px] mx-auto pb-12 animate-fade-in text-slate-100 font-sans">
      {/* Toast Confirmation Banners */}
      {savedSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-950 border-2 border-emerald-500 text-emerald-100 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-bold text-sm text-white">Planejamento Salvo com Sucesso!</h4>
            <p className="text-xs text-emerald-300">
              O Glide Path do indicador <strong>{selectedKpi.name}</strong> foi atualizado em todo o Cockpit.
            </p>
          </div>
        </div>
      )}

      {exportedActionsToast && (
        <div className="fixed top-20 right-6 z-50 bg-blue-950 border-2 border-blue-500 text-blue-100 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in">
          <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
          <div>
            <h4 className="font-bold text-sm text-white">Planos de Ação Sincronizados!</h4>
            <p className="text-xs text-blue-300">
              {generatedActions.length} ações operacionais foram exportadas para o módulo <strong>Planos de Ação</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Top Header Module Title */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              Glide Path & Copilot IA
            </span>
            <span className="bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono font-medium px-2.5 py-1 rounded-full">
              Exercício 2026
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Planejamento de Metas Mensais
          </h1>
          <p className="text-sm text-slate-400">
            Definição de trajetórias estratégicas mês a mês, diagnóstico de viabilidade técnica ("Meta, Metinha ou Ilusão?") e copiloto de inteligência pedagógica.
          </p>
        </div>

        {/* Global Action Button */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            onClick={handleSavePlanning}
            className="w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Save className="w-5 h-5" />
            Salvar Planejamento do KPI
          </button>
        </div>
      </div>

      {/* Section 1: KPI Selector & Strategic Baseline */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="w-full md:w-1/2 space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Selecionar Indicador (KPI) para Planejar
            </label>
            <select
              value={selectedKpiId}
              onChange={(e) => setSelectedKpiId(e.target.value)}
              className="w-full bg-[#060b19] border border-slate-700 rounded-xl px-4 py-3 text-white font-semibold text-base focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
            >
              {kpis.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name} (Atual: {k.currentValue}{k.unit} | Meta Estratégica: {k.target2025}{k.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Metrics Header Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="bg-[#060b19] border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Base Histórica</span>
              <span className="text-lg font-black text-slate-300 font-mono">{baseValue.toFixed(1)}{selectedKpi.unit}</span>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-300 block">Realidade (2026)</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{selectedKpi.currentValue.toFixed(1)}{selectedKpi.unit}</span>
            </div>

            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Alvo Final (Dez)</span>
              <input
                type="number"
                step="0.1"
                value={targetStrategic}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) {
                    setTargetStrategic(val);
                    applyDistributionPreset(activePreset === 'custom' ? 'linear' : activePreset, val);
                  }
                }}
                className="w-20 bg-amber-950/60 border border-amber-500/50 rounded text-center text-lg font-black text-amber-300 font-mono focus:outline-none focus:ring-1 focus:ring-amber-400 mx-auto block"
              />
            </div>

            <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-purple-300 block">Excelência</span>
              <span className="text-lg font-black text-purple-300 font-mono">{selectedKpi.targetExcellence}{selectedKpi.unit}</span>
            </div>
          </div>
        </div>

        {/* Presets & Distribution Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#060b19] border border-slate-800 p-4 rounded-xl">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Distribuição Rápida de Trajetória (Glide Path)
            </span>
            <p className="text-xs text-slate-400">
              Escolha uma fórmula de distribuição matemática ou ajuste os 12 meses manualmente no grid.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => applyDistributionPreset('linear')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activePreset === 'linear'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              📈 Linear
            </button>

            <button
              onClick={() => applyDistributionPreset('sazonal')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activePreset === 'sazonal'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              🎒 Sazonal Escolar
            </button>

            <button
              onClick={() => applyDistributionPreset('progressivo')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activePreset === 'progressivo'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              🚀 Progressivo (Tração Final)
            </button>
          </div>
        </div>

        {/* Interactive 12-Month Input Grid */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
            <span>Grid de Metas Planejadas Mês a Mês ({selectedKpi.unit})</span>
            <span className="text-xs text-slate-400 font-normal">Edite diretamente os campos numéricos</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
            {MONTH_NAMES.map((monthName, idx) => {
              const metaVal = monthlyValues[idx] ?? 0;
              const prevVal = idx === 0 ? baseValue : monthlyValues[idx - 1];
              const monthlyStep = parseFloat((metaVal - prevVal).toFixed(1));
              const metaInfo = MONTH_METADATA[idx];

              return (
                <div
                  key={monthName}
                  className="bg-[#060b19] border border-slate-800 rounded-xl p-3 space-y-2 hover:border-slate-700 transition-all focus-within:border-blue-500/80 focus-within:ring-1 focus-within:ring-blue-500/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm font-mono">{monthName}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${metaInfo.badgeClass}`}>
                      {metaInfo.label}
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={metaVal}
                      onChange={(e) => handleMonthInputChange(idx, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-lg py-2 px-3 text-right font-mono font-black text-blue-400 text-base focus:outline-none focus:border-blue-500 focus:bg-blue-950/20"
                    />
                    <span className="absolute left-2.5 top-2.5 text-xs text-slate-400 font-mono">{selectedKpi.unit}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-800/80 pt-1">
                    <span className="text-slate-400">Var Mês:</span>
                    <span className={monthlyStep >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {monthlyStep >= 0 ? '+' : ''}{monthlyStep.toFixed(1)}{selectedKpi.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Grid: Left 8 cols (Chart + Diagnostic) & Right 4 cols (Copilot IA) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Chart Preview & Technical Diagnosis */}
        <div className="xl:col-span-8 space-y-6">
          {/* Live Recharts Glide Path Preview */}
          <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Visualização em Tempo Real do Glide Path
                </h3>
                <p className="text-xs text-slate-400">
                  Comparativo visual da base histórica (cinza), curva planejada (azul tracejado) e execução vigente (verde).
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 border border-blue-500/30 px-3 py-1 rounded-full">
                Alvo: {targetStrategic.toFixed(1)}{selectedKpi.unit}
              </span>
            </div>

            <div className="h-[320px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="mes" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={['auto', 'auto']} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload;
                      return (
                        <div className="bg-[#0b1329]/95 border border-slate-700/80 backdrop-blur-md rounded-xl p-3 shadow-2xl text-xs space-y-2 min-w-[200px]">
                          <span className="font-bold text-white text-sm border-b border-slate-700/60 pb-1 block">
                            Mês: {label}
                          </span>
                          <div className="space-y-1 font-mono">
                            <div className="flex justify-between text-slate-400">
                              <span>Ano Base:</span>
                              <span className="font-bold">{d.anoAnterior}{selectedKpi.unit}</span>
                            </div>
                            <div className="flex justify-between text-blue-400 font-bold bg-blue-950/40 p-1 rounded">
                              <span>Meta Planejada:</span>
                              <span>{d.metaPlanejada}{selectedKpi.unit}</span>
                            </div>
                            {d.anoAtual !== null && (
                              <div className="flex justify-between text-emerald-400 font-bold bg-emerald-950/40 p-1 rounded">
                                <span>Realidade (2026):</span>
                                <span>{d.anoAtual}{selectedKpi.unit}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                    formatter={(val) => {
                      if (val === 'anoAnterior') return <span className="text-slate-400">Passado</span>;
                      if (val === 'metaPlanejada') return <span className="text-blue-400 font-bold">Curva de Planejamento (Glide Path)</span>;
                      if (val === 'anoAtual') return <span className="text-emerald-400 font-bold">Realidade (2026)</span>;
                      return val;
                    }}
                  />
                  <ReferenceLine
                    y={targetStrategic}
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                    strokeWidth={1.5}
                    label={{ value: `Alvo: ${targetStrategic}${selectedKpi.unit}`, fill: '#f59e0b', fontSize: 11, fontWeight: 700 }}
                  />
                  <Line type="monotone" dataKey="anoAnterior" stroke="#64748b" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="metaPlanejada" stroke="#3b82f6" strokeDasharray="5 5" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 3 }} />
                  <Line type="monotone" dataKey="anoAtual" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} connectNulls={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Technical Diagnosis Card: "Meta, Metinha ou Ilusão?" */}
          <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">
                  Diagnóstico da Meta: "Meta, Metinha ou Ilusão?"
                </h3>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${diagnosis.badgeClass}`}>
                {diagnosis.label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2 bg-[#060b19] border border-slate-800/80 rounded-xl p-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  {diagnosis.type === 'ideal' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {diagnosis.type === 'metinha' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  {diagnosis.type === 'ilusao' && <ShieldAlert className="w-4 h-4 text-rose-400" />}
                  {diagnosis.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {diagnosis.description}
                </p>
              </div>

              <div className="bg-[#060b19] border border-slate-800/80 rounded-xl p-4 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-1">
                  <span>Ganho Acumulado:</span>
                  <span className="font-bold text-white">
                    {(targetStrategic - baseValue) >= 0 ? '+' : ''}
                    {(targetStrategic - baseValue).toFixed(1)}{selectedKpi.unit}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-1">
                  <span>Ritmo Médio Mensal:</span>
                  <span className="font-bold text-blue-400">
                    +{((targetStrategic - baseValue) / 12).toFixed(2)}{selectedKpi.unit}/mês
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Nível de Risco:</span>
                  <span className={diagnosis.type === 'ideal' ? 'text-emerald-400 font-bold' : diagnosis.type === 'metinha' ? 'text-amber-400 font-bold' : 'text-rose-400 font-bold'}>
                    {diagnosis.type === 'ideal' ? 'Baixo / Moderado' : diagnosis.type === 'metinha' ? 'Nulo (Subaproveitado)' : 'Crítico (Inviável)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Recommended Action Plans for KPI */}
          <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Ações Operacionais Recomendadas para o Glide Path
                </h3>
                <p className="text-xs text-slate-400">
                  Planos de intervenção estruturados para sustentar a curva planejada de {selectedKpi.name}.
                </p>
              </div>

              <button
                onClick={handleExportActionsToGlobal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                Exportar para Planos de Ação
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedActions.map((action, idx) => (
                <div key={idx} className="bg-[#060b19] border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-white">{action.title}</h4>
                    <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                      {action.priority}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">{action.objective}</p>

                  <div className="text-[11px] font-mono text-slate-300 flex items-center justify-between border-t border-slate-800/80 pt-2">
                    <span>Responsável: <strong>{action.responsible}</strong></span>
                    <span className="text-slate-400">Prazo: {action.deadline}</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Passos de Execução:</span>
                    {action.steps.map((st: any) => (
                      <div key={st.id} className="flex items-center gap-2 text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={st.done}
                          onChange={() => {
                            const updated = generatedActions.map((a, aIdx) => {
                              if (aIdx === idx) {
                                return {
                                  ...a,
                                  steps: a.steps.map((s: any) => (s.id === st.id ? { ...s, done: !s.done } : s))
                                };
                              }
                              return a;
                            });
                            setGeneratedActions(updated);
                          }}
                          className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500"
                        />
                        <span className={st.done ? 'line-through text-slate-400' : ''}>{st.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Conversational Copilot IA Panel */}
        <div className="xl:col-span-4 bg-[#0b1329] border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col h-[820px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                <Bot className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h3 className="font-black text-white text-base flex items-center gap-1.5">
                  Copilot IA de Planejamento
                </h3>
                <p className="text-xs text-slate-400">Inteligência Educacional & Estratégica</p>
              </div>
            </div>

            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Online
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-[#060b19] border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                  {msg.suggestedTrajectory && (
                    <div className="pt-2 border-t border-slate-800">
                      <button
                        onClick={() => handleApplyAiProposal(msg.suggestedTrajectory!)}
                        className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                      >
                        <Sparkles className="w-4 h-4" />
                        ✨ Aplicar Proposta no Grid
                      </button>
                    </div>
                  )}

                  <span className="text-[9px] text-slate-400 font-mono block text-right pt-0.5">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isAiThinking && (
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-[#060b19] p-3 rounded-xl border border-slate-800 w-max animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Analisando o contexto de {selectedKpi.name}...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Sugestões de Consulta:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleSendMessage('Sugira um Glide Path Sazonal para este KPI')}
                className="text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-2.5 py-1.5 rounded-lg transition-all text-left"
              >
                🎒 Glide Path Sazonal
              </button>
              <button
                onClick={() => handleSendMessage('Proponha uma trajetória com tração forte no 2º semestre')}
                className="text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-2.5 py-1.5 rounded-lg transition-all text-left"
              >
                🚀 Tração no 2º Semestre
              </button>
              <button
                onClick={() => handleSendMessage('Avalie a viabilidade técnica da minha meta atual')}
                className="text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-2.5 py-1.5 rounded-lg transition-all text-left"
              >
                🛡️ Diagnóstico de Risco
              </button>
            </div>

            {/* Input Box */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Pergunte ao Copilot sobre as metas..."
                className="flex-1 bg-[#060b19] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <button
                onClick={() => handleSendMessage()}
                className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
