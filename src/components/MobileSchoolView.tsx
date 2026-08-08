import React, { useState } from 'react';
import { useCockpit } from '../context/CockpitContext';
import { School, ActionPlan } from '../types';
import {
  Smartphone,
  UserCheck,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  PlusCircle,
  BookOpen,
  Users,
  Utensils,
  Bell,
  Search,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  Filter,
  Award,
  Sparkles,
  ArrowRight,
  CheckSquare,
  RefreshCw,
  Sliders,
  Laptop,
  MapPin,
  GraduationCap,
  ScanLine,
  X,
  Wand2
} from 'lucide-react';

type RoleMode = 'diretor' | 'professor';
type MobileTab = 'resumo' | 'escolas' | 'chamada' | 'diario' | 'ocorrencias' | 'tarefas';
type ZoneFilter = 'todas' | 'urbana' | 'rural';
type Semaphore = 'verde' | 'amarelo' | 'vermelho';

const SEMAPHORE_DOT_CLASS: Record<Semaphore, string> = {
  verde: 'bg-emerald-500',
  amarelo: 'bg-amber-500',
  vermelho: 'bg-rose-500'
};

// Zone (urbana/rural) isn't in the School model yet; derive a stable pseudo-classification
// from the INEP code so filtering is deterministic without adding a new data field.
const getSchoolZone = (school: School): 'urbana' | 'rural' => {
  const digitSum = school.code.split('').reduce((sum, ch) => sum + (parseInt(ch, 10) || 0), 0);
  return digitSum % 3 === 0 ? 'rural' : 'urbana';
};

const getAprendizadoSemaphore = (school: School): Semaphore => {
  if (school.alfabetizacao >= 80 && school.taxaAprovacao >= 90) return 'verde';
  if (school.alfabetizacao >= 60 && school.taxaAprovacao >= 75) return 'amarelo';
  return 'vermelho';
};

const getInsumosSemaphore = (school: School): Semaphore => {
  if (school.execucaoFinanceira >= 80 && !school.hasInternetIssues) return 'verde';
  if (school.execucaoFinanceira >= 50) return 'amarelo';
  return 'vermelho';
};

const getSocialSemaphore = (school: School): Semaphore => {
  const riskRatio = school.studentCount > 0 ? school.alunosEmRisco / school.studentCount : 0;
  if (school.taxaAbandono < 3 && riskRatio < 0.05) return 'verde';
  if (school.taxaAbandono < 6 && riskRatio < 0.12) return 'amarelo';
  return 'vermelho';
};

const SEMAPHORE_LABEL: Record<Semaphore, string> = {
  verde: 'Adequado',
  amarelo: 'Atenção',
  vermelho: 'Alerta'
};

const SEMAPHORE_TEXT_CLASS: Record<Semaphore, string> = {
  verde: 'text-emerald-400',
  amarelo: 'text-amber-400',
  vermelho: 'text-rose-400'
};

interface SchoolTag {
  label: string;
  className: string;
}

// Diagnostic tags used both in the detail modal and to seed the generated plan below —
// derived only from real per-school indicators already in the data model.
const getSchoolTags = (school: School): SchoolTag[] => {
  const tags: SchoolTag[] = [];
  const aprendizado = getAprendizadoSemaphore(school);
  const insumos = getInsumosSemaphore(school);
  const social = getSocialSemaphore(school);

  if (aprendizado === 'vermelho') {
    tags.push({ label: 'Aprendizado Crítico', className: 'bg-rose-950 text-rose-300 border-rose-800' });
  } else if (aprendizado === 'amarelo') {
    tags.push({ label: 'Aprendizado em Atenção', className: 'bg-amber-950 text-amber-300 border-amber-800' });
  }

  if (insumos === 'vermelho') {
    tags.push({ label: 'Infraestrutura Defasada', className: 'bg-amber-950 text-amber-300 border-amber-800' });
  } else if (insumos === 'amarelo') {
    tags.push({ label: 'Insumos em Atenção', className: 'bg-amber-950 text-amber-300 border-amber-800' });
  }

  if (social === 'vermelho') {
    tags.push({ label: 'Alta Vulnerabilidade Social', className: 'bg-rose-950 text-rose-300 border-rose-800' });
  } else if (social === 'amarelo') {
    tags.push({ label: 'Vulnerabilidade Social em Atenção', className: 'bg-amber-950 text-amber-300 border-amber-800' });
  }

  return tags;
};

// Builds a 5W2H-style draft action plan from the school's real indicators. Mirrors the
// simulated-fallback pattern already used in RadarAiAnalysis.tsx (no external AI call here).
const buildGeneratedPlan = (school: School): Omit<ActionPlan, 'id' | 'createdDate'> => {
  const aprendizado = getAprendizadoSemaphore(school);
  const insumos = getInsumosSemaphore(school);
  const social = getSocialSemaphore(school);
  const criticalCount = [aprendizado, insumos, social].filter((s) => s === 'vermelho').length;

  const focusAreas: string[] = [];
  if (aprendizado !== 'verde') focusAreas.push('Alfabetização e Aprovação');
  if (insumos !== 'verde') focusAreas.push('Infraestrutura e Execução Financeira');
  if (social !== 'verde') focusAreas.push('Evasão e Alunos em Risco');

  const title =
    aprendizado === 'vermelho'
      ? `Plano de Choque Emergencial de Recomposição da Aprendizagem - ${school.name}`
      : social === 'vermelho'
      ? `Plano de Enfrentamento à Vulnerabilidade Social - ${school.name}`
      : insumos === 'vermelho'
      ? `Plano de Regularização de Infraestrutura e Insumos - ${school.name}`
      : `Plano de Monitoramento e Melhoria Contínua - ${school.name}`;

  const description =
    focusAreas.length > 0
      ? `Identificados indicadores críticos ou em atenção em ${focusAreas.join(', ')}, exigindo intervenção ${
          criticalCount >= 2 ? 'emergencial multi-eixo' : 'direcionada'
        }.`
      : 'Escola com indicadores adequados nas 3 dimensões — plano de manutenção e monitoramento preventivo.';

  const steps: { id: string; description: string; done: boolean }[] = [];
  let stepIndex = 1;

  if (aprendizado !== 'verde') {
    steps.push({
      id: `plan-step-${stepIndex++}`,
      description: `Diagnóstico Urgente de Alfabetização e Numeramento (Prazo: 5 dias) | Responsável: Coordenação Pedagógica | Metodologia: Aplicação de teste individual de leitura e matemática básica com todas as turmas de ciclo.`,
      done: false
    });
    steps.push({
      id: `plan-step-${stepIndex++}`,
      description: `Implantação de Agrupamentos Flexíveis de Leitura e Escrita (Frequência: Diária - 30 min) | Responsável: Professores Regentes | Metodologia: Oficinas diárias com materiais didáticos estruturados por nível de escrita.`,
      done: false
    });
  }

  if (insumos !== 'verde') {
    steps.push({
      id: `plan-step-${stepIndex++}`,
      description: `Regularização de Infraestrutura e Conectividade (Prazo: 30 dias) | Responsável: Secretaria de Infraestrutura | Metodologia: Vistoria técnica e priorização orçamentária das pendências identificadas.`,
      done: false
    });
  }

  if (social !== 'verde') {
    steps.push({
      id: `plan-step-${stepIndex++}`,
      description: `Força-Tarefa de Busca Ativa Escolar (Prazo: 48 horas) | Responsável: Agentes de Busca Ativa | Metodologia: Visitas domiciliares imediatas e contato direto com famílias dos alunos com faltas não justificadas.`,
      done: false
    });
  }

  steps.push({
    id: `plan-step-${stepIndex++}`,
    description: `Acompanhamento Quinzenal de Indicadores (Frequência: Quinzenal) | Responsável: Direção Escolar | Metodologia: Revisão do painel de KPIs da escola e ajuste das ações em curso.`,
    done: false
  });

  return {
    title,
    description,
    schoolId: school.id,
    schoolName: school.name,
    responsible: school.director,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'a_fazer',
    priority: criticalCount >= 1 ? 'alta' : focusAreas.length > 0 ? 'media' : 'baixa',
    completionPercentage: 0,
    steps
  };
};

interface StudentAttendance {
  id: string;
  name: string;
  rollNumber: number;
  status: 'presente' | 'ausente' | 'justificado';
  consecutiveAbsences: number;
  avatar: string;
}

export const MobileSchoolView: React.FC = () => {
  const { schools, actionPlans, alerts, addAlert, addActionPlan, municipalityConfig, setActiveTab } = useCockpit();

  // Selected state
  const [roleMode, setRoleMode] = useState<RoleMode>('diretor');
  const [showDeviceFrame, setShowDeviceFrame] = useState<boolean>(true);
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('resumo');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id || 'esc-1');
  const [selectedClass, setSelectedClass] = useState<string>('5º Ano A - Matutino');
  const [toast, setToast] = useState<string | null>(null);
  const [zoneFilter, setZoneFilter] = useState<ZoneFilter>('todas');
  const [detailSchoolId, setDetailSchoolId] = useState<string | null>(null);
  const [generatingPlanSchoolId, setGeneratingPlanSchoolId] = useState<string | null>(null);
  const [savedPlanBySchool, setSavedPlanBySchool] = useState<Record<string, ActionPlan>>({});

  // Selected school data
  const currentSchool = schools.find((s) => s.id === selectedSchoolId) || schools[0];
  const detailSchool = schools.find((s) => s.id === detailSchoolId) || null;

  const hasSchoolAlert = (school: School): boolean =>
    school.status === 'critico' || alerts.some((a) => a.schoolId === school.id && !a.resolved);

  const handleGeneratePlan = (school: School) => {
    setGeneratingPlanSchoolId(school.id);
    setTimeout(() => {
      const planData = buildGeneratedPlan(school);
      const plan: ActionPlan = { ...planData, id: `act-${Date.now()}`, createdDate: new Date().toISOString().split('T')[0] };
      addActionPlan(planData);
      setSavedPlanBySchool((prev) => ({ ...prev, [school.id]: plan }));
      setGeneratingPlanSchoolId(null);
      showNotification(`Plano gerado e salvo na Central de Planos para ${school.name}!`);
    }, 1400);
  };

  const filteredSchoolsForZone = schools.filter(
    (s) => zoneFilter === 'todas' || getSchoolZone(s) === zoneFilter
  );

  const totalDocentesRede = schools.reduce((sum, s) => sum + s.teacherCount, 0);
  const totalDocentesSemFormacaoRede = schools.reduce((sum, s) => sum + s.professoresSemFormacao, 0);
  const percentDocentesAdequados =
    totalDocentesRede > 0
      ? Math.round(((totalDocentesRede - totalDocentesSemFormacaoRede) / totalDocentesRede) * 1000) / 10
      : 0;

  // Mock Students for Teacher Chamada Digital
  const [studentsList, setStudentsList] = useState<StudentAttendance[]>([
    { id: 'st-1', name: 'Ana Clara Souza', rollNumber: 1, status: 'presente', consecutiveAbsences: 0, avatar: '👩' },
    { id: 'st-2', name: 'Bruno Henrique Lima', rollNumber: 2, status: 'presente', consecutiveAbsences: 0, avatar: '👦' },
    { id: 'st-3', name: 'Carlos Eduardo Santos', rollNumber: 3, status: 'ausente', consecutiveAbsences: 4, avatar: '👦' },
    { id: 'st-4', name: 'Daniela Alcantara', rollNumber: 4, status: 'presente', consecutiveAbsences: 0, avatar: '👧' },
    { id: 'st-5', name: 'Enzo Gabriel Oliveira', rollNumber: 5, status: 'justificado', consecutiveAbsences: 1, avatar: '👦' },
    { id: 'st-6', name: 'Fernanda Rocha', rollNumber: 6, status: 'presente', consecutiveAbsences: 0, avatar: '👩' },
    { id: 'st-7', name: 'Gabriel Martins', rollNumber: 7, status: 'ausente', consecutiveAbsences: 3, avatar: '👦' },
    { id: 'st-8', name: 'Isabela Fontes', rollNumber: 8, status: 'presente', consecutiveAbsences: 0, avatar: '👧' },
    { id: 'st-9', name: 'Lucas Silva Pereira', rollNumber: 9, status: 'presente', consecutiveAbsences: 0, avatar: '👦' },
    { id: 'st-10', name: 'Mariana Ribeiro', rollNumber: 10, status: 'presente', consecutiveAbsences: 0, avatar: '👧' }
  ]);

  // Lesson Log State for Teachers
  const [lessonContent, setLessonContent] = useState<string>('Resolução de problemas de divisão com números naturais e análise de gráficos simples.');
  const [bnccSkill, setBnccSkill] = useState<string>('EF05MA08 - Resolver problemas de divisão');
  const [homework, setHomework] = useState<string>('Exercícios página 42 do Livro Didático de Matemática.');

  // Director Occurrence Form State
  const [newOccurrenceText, setNewOccurrenceText] = useState<string>('');
  const [occurrencesList, setOccurrencesList] = useState<Array<{ id: string; time: string; type: string; studentName: string; desc: string }>>([
    {
      id: 'occ-1',
      time: '08:15',
      type: 'Busca Ativa Urgente',
      studentName: 'Carlos Eduardo Santos (5º Ano A)',
      desc: '4ª falta consecutiva sem justificativa. Contato telefônico sem resposta.'
    },
    {
      id: 'occ-2',
      time: '09:40',
      type: 'Atendimento Psicopedagógico',
      studentName: 'Gabriel Martins (5º Ano A)',
      desc: 'Dificuldade de concentração e retenção de conteúdo em Matemática.'
    }
  ]);

  // Director Tasks
  const [directorTasks, setDirectorTasks] = useState<Array<{ id: string; title: string; done: boolean; urgent?: boolean }>>([
    { id: 'dt-1', title: 'Homologar cardápio da Merenda Escolar para a próxima semana', done: true },
    { id: 'dt-2', title: 'Reunião de alinhamento com Coordenadores Pedagógicos (HTPC)', done: false, urgent: true },
    { id: 'dt-3', title: 'Conferir atestado médico do Prof. Roberto (Substituição 4º B)', done: false },
    { id: 'dt-4', title: 'Validar formulário de prestação de contas PDDE no SIMEC', done: false, urgent: true }
  ]);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Student Attendance Actions
  const handleToggleAttendance = (studentId: string, nextStatus: 'presente' | 'ausente' | 'justificado') => {
    setStudentsList((prev) =>
      prev.map((st) => (st.id === studentId ? { ...st, status: nextStatus } : st))
    );
  };

  const handleSaveAttendance = () => {
    const presentCount = studentsList.filter((s) => s.status === 'presente').length;
    const absentCount = studentsList.filter((s) => s.status === 'ausente').length;

    showNotification(`Chamada salva! ${presentCount} presentes, ${absentCount} ausentes.`);

    // If there are absent students with 3+ consecutive absences, generate alert
    const criticalAbsents = studentsList.filter((s) => s.status === 'ausente' && s.consecutiveAbsences >= 3);
    if (criticalAbsents.length > 0) {
      addAlert({
        title: `Busca Ativa Mobile: ${criticalAbsents.length} alunos ausentes críticos`,
        description: `Turma ${selectedClass} - ${currentSchool.name}. Alunos: ${criticalAbsents.map((a) => a.name).join(', ')}`,
        severity: 'high',
        category: 'permanencia',
        schoolId: currentSchool.id,
        schoolName: currentSchool.name
      });
    }
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('Diário de Classe registrado com sucesso no sistema!');
  };

  const handleAddOccurrence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOccurrenceText.trim()) return;

    const newOcc = {
      id: `occ-${Date.now()}`,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: 'Registro de Ocorrência',
      studentName: 'Aluno / Observação da Direção',
      desc: newOccurrenceText
    };

    setOccurrencesList([newOcc, ...occurrencesList]);
    setNewOccurrenceText('');
    showNotification('Ocorrência registrada no histórico escolar!');
  };

  const toggleTask = (id: string) => {
    setDirectorTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  // Calculate statistics
  const totalStudents = studentsList.length;
  const totalPresent = studentsList.filter((s) => s.status === 'presente').length;
  const totalAbsent = studentsList.filter((s) => s.status === 'ausente').length;
  const attendanceRate = Math.round((totalPresent / totalStudents) * 100);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast Popup */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-sky-500 text-slate-950 font-black px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border-2 border-sky-300 animate-bounce text-xs">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}

      {/* Control Header & Mode Switchers */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase flex items-center gap-2">
              📱 APLICATIVO MOBILE DA ESCOLA
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Direção & Professores
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Interface otimizada para smartphones e tablets — Gestão em tempo real de presença, ocorrências e diário de classe.
          </p>
        </div>

        {/* Global Controls: Role Switch & Frame Toggle */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Role Switcher */}
          <div className="bg-[#060b19] p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => {
                setRoleMode('diretor');
                setActiveMobileTab('resumo');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                roleMode === 'diretor'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Visão Diretor</span>
            </button>

            <button
              onClick={() => {
                setRoleMode('professor');
                setActiveMobileTab('chamada');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                roleMode === 'professor'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Visão Professor</span>
            </button>
          </div>

          {/* Simulator Device Frame Toggle */}
          <button
            onClick={() => setShowDeviceFrame(!showDeviceFrame)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1.5 ${
              showDeviceFrame
                ? 'bg-slate-800 text-sky-300 border-sky-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
            }`}
          >
            {showDeviceFrame ? <Smartphone className="w-4 h-4 text-sky-400" /> : <Laptop className="w-4 h-4" />}
            <span>{showDeviceFrame ? 'Moldura Smartphone' : 'Modo Expansível'}</span>
          </button>
        </div>
      </div>

      {/* Selector Filters Bar */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-400 font-medium">Escola Selecionada:</span>
          <select
            value={selectedSchoolId}
            onChange={(e) => setSelectedSchoolId(e.target.value)}
            className="bg-[#060b19] border border-slate-700 text-white rounded-lg px-2.5 py-1.5 font-bold focus:outline-none focus:border-amber-500 w-full sm:w-auto"
          >
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        {roleMode === 'professor' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Users className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-slate-400 font-medium">Turma:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-[#060b19] border border-slate-700 text-white rounded-lg px-2.5 py-1.5 font-bold focus:outline-none focus:border-sky-500 w-full sm:w-auto"
            >
              <option value="5º Ano A - Matutino">5º Ano A - Matutino</option>
              <option value="4º Ano B - Vespertino">4º Ano B - Vespertino</option>
              <option value="3º Ano A - Tempo Integral">3º Ano A - Tempo Integral</option>
              <option value="1º Ano C - Matutino">1º Ano C - Matutino</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Hoje: {new Date().toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {/* Main Container: Mobile Frame Mockup vs Expanded Layout */}
      <div className={`flex justify-center ${showDeviceFrame ? 'py-2' : ''}`}>
        <div
          className={`w-full transition-all ${
            showDeviceFrame
              ? 'max-w-[410px] bg-slate-950 border-[10px] border-slate-800 rounded-[40px] shadow-2xl p-3 relative overflow-hidden ring-1 ring-slate-700'
              : 'bg-[#0b1329] border border-slate-800 rounded-2xl p-5 shadow-2xl'
          }`}
        >
          {/* Smartphone Speaker Notch Header if frame active */}
          {showDeviceFrame && (
            <div className="w-full flex justify-center mb-2">
              <div className="w-28 h-4 bg-slate-900 rounded-full flex items-center justify-center gap-1.5 border border-slate-800">
                <div className="w-3 h-1 bg-slate-700 rounded-full" />
                <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
              </div>
            </div>
          )}

          {/* App Top Bar inside Phone Screen */}
          <div className="bg-[#0b1329] border border-slate-800 rounded-xl p-3 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-lg text-slate-950 font-black ${
                  roleMode === 'diretor' ? 'bg-amber-400' : 'bg-sky-400'
                }`}
              >
                {roleMode === 'diretor' ? (
                  <Building2 className="w-4 h-4" />
                ) : (
                  <UserCheck className="w-4 h-4" />
                )}
              </div>
              <div>
                <h3 className="font-black text-xs text-white uppercase tracking-wider">
                  {roleMode === 'diretor' ? 'DIREÇÃO ESCOLAR' : 'PAINEL DO PROFESSOR'}
                </h3>
                <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                  {currentSchool.name}
                </p>
              </div>
            </div>

            <span
              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                roleMode === 'diretor'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-sky-950 text-sky-300 border border-sky-800'
              }`}
            >
              {roleMode === 'diretor' ? 'Diretor(a)' : 'Professor(a)'}
            </span>
          </div>

          {/* Navigation Bar inside Phone Screen */}
          <div className="flex items-center justify-between bg-[#060b19] p-1 rounded-xl border border-slate-800 mb-3 text-[10px]">
            {roleMode === 'diretor' ? (
              <>
                <button
                  onClick={() => setActiveMobileTab('resumo')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition text-center ${
                    activeMobileTab === 'resumo' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Resumo
                </button>
                <button
                  onClick={() => setActiveMobileTab('escolas')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition text-center ${
                    activeMobileTab === 'escolas' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Escolas
                </button>
                <button
                  onClick={() => setActiveMobileTab('ocorrencias')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition text-center ${
                    activeMobileTab === 'ocorrencias' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Ocorrências
                </button>
                <button
                  onClick={() => setActiveMobileTab('tarefas')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition text-center ${
                    activeMobileTab === 'tarefas' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Tarefas ({directorTasks.filter((t) => !t.done).length})
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveMobileTab('chamada')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition text-center ${
                    activeMobileTab === 'chamada' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Chamada
                </button>
                <button
                  onClick={() => setActiveMobileTab('diario')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition text-center ${
                    activeMobileTab === 'diario' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Diário
                </button>
                <button
                  onClick={() => setActiveMobileTab('ocorrencias')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition text-center ${
                    activeMobileTab === 'ocorrencias' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Avisos
                </button>
              </>
            )}
          </div>

          {/* SCREEN CONTENT AREA */}
          <div className="space-y-3 min-h-[420px]">
            {/* 1. VISÃO DIRETOR - RESUMO */}
            {roleMode === 'diretor' && activeMobileTab === 'resumo' && (
              <div className="space-y-3">
                {/* School Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#060b19] border border-slate-800 p-2.5 rounded-xl">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Frequência Alunos</span>
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-lg font-black text-emerald-400 mt-0.5">{attendanceRate}%</p>
                    <p className="text-[9px] text-slate-400">{totalPresent} presentes hoje</p>
                  </div>

                  <div className="bg-[#060b19] border border-slate-800 p-2.5 rounded-xl">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Professores</span>
                      <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                    </div>
                    <p className="text-lg font-black text-sky-400 mt-0.5">
                      {currentSchool.teacherCount - 1}/{currentSchool.teacherCount}
                    </p>
                    <p className="text-[9px] text-amber-400">1 licença (substituído)</p>
                  </div>

                  <div className="bg-[#060b19] border border-slate-800 p-2.5 rounded-xl">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Merenda Escolar</span>
                      <Utensils className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <p className="text-xs font-bold text-white mt-1">Refeição 100% OK</p>
                    <p className="text-[9px] text-slate-400">Arroz, feijão e frango</p>
                  </div>

                  <div className="bg-[#060b19] border border-slate-800 p-2.5 rounded-xl">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>IDEB Atual</span>
                      <Award className="w-3.5 h-3.5 text-yellow-400" />
                    </div>
                    <p className="text-lg font-black text-yellow-400 mt-0.5">{currentSchool.ideb.toFixed(1)}</p>
                    <p className="text-[9px] text-emerald-400">Meta atingida</p>
                  </div>
                </div>

                {/* Direct Action Cards */}
                <div className="bg-[#060b19] border border-amber-500/30 p-3 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Ações Emergenciais da Direção
                    </span>
                    <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded text-[9px] font-bold">
                      Busca Ativa
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-tight">
                    {totalAbsent} alunos ausentes hoje na escola. 2 alunos acumulam mais de 3 faltas consecutivas.
                  </p>

                  <button
                    onClick={() => {
                      showNotification('Alerta de Busca Ativa enviado para Assistência Social e Responsáveis via SMS/WhatsApp!');
                    }}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg shadow transition flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Disparar Busca Ativa via WhatsApp</span>
                  </button>
                </div>

                {/* Recent School Notifications */}
                <div className="bg-[#060b19] border border-slate-800 p-3 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-white block border-b border-slate-800 pb-1">
                    Avisos Recentes do Diretor
                  </span>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg">
                      <Bell className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-white">Reunião de Pais e Mestres</p>
                        <p className="text-[10px] text-slate-400">Sexta-feira às 17h no Pátio Principal.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rede Municipal: Docentes */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#060b19] border border-slate-800 p-2.5 rounded-xl">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Docentes</span>
                      <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                    </div>
                    <p className="text-lg font-black text-sky-400 mt-0.5">{totalDocentesRede}</p>
                    <p className="text-[9px] text-slate-400">Total na rede municipal</p>
                  </div>

                  <div className="bg-[#060b19] border border-slate-800 p-2.5 rounded-xl">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Docentes Adequ...</span>
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-lg font-black text-emerald-400 mt-0.5">
                      {percentDocentesAdequados.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                    </p>
                    <p className="text-[9px] text-slate-400">Com formação na área</p>
                  </div>
                </div>

                {/* Aprendizado por disciplina (pendente de integração com API externa) */}
                <div className="bg-[#060b19] border border-slate-800 p-3 rounded-xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                      Aprendizado
                    </span>
                    <span className="px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded text-[9px] font-bold">
                      Aguardando integração API
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900/60 p-2 rounded-lg text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Português</p>
                      <p className="text-lg font-black text-slate-600 mt-0.5">-</p>
                      <p className="text-[9px] text-slate-500">Aguardando integração API</p>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Matemática</p>
                      <p className="text-lg font-black text-slate-600 mt-0.5">-</p>
                      <p className="text-[9px] text-slate-500">Aguardando integração API</p>
                    </div>
                  </div>
                </div>

                {/* Matriz de Desigualdade */}
                <div className="bg-[#060b19] border border-slate-800 p-3 rounded-xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ScanLine className="w-3.5 h-3.5 text-amber-400" />
                      Matriz de Desigualdade
                    </span>
                    <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded text-[9px] font-bold">
                      {schools.length} escolas
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                    {schools.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setDetailSchoolId(s.id)}
                        className="w-full text-left bg-slate-900/60 hover:bg-slate-900 p-2 rounded-lg transition"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-[10.5px] font-bold text-white truncate">{s.name}</p>
                          {hasSchoolAlert(s) && (
                            <span className="shrink-0 px-1.5 py-0.2 bg-rose-950 text-rose-300 text-[8px] font-black rounded border border-rose-800">
                              Alerta
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] text-slate-500 font-mono">INEP {s.code}</p>
                        <div className="flex items-center gap-3 mt-1 text-[8.5px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${SEMAPHORE_DOT_CLASS[getAprendizadoSemaphore(s)]}`} />
                            Aprendizado
                          </span>
                          <span className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${SEMAPHORE_DOT_CLASS[getInsumosSemaphore(s)]}`} />
                            Insumos
                          </span>
                          <span className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${SEMAPHORE_DOT_CLASS[getSocialSemaphore(s)]}`} />
                            Social
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 1B. VISÃO DIRETOR - LISTA DE ESCOLAS DA REDE */}
            {roleMode === 'diretor' && activeMobileTab === 'escolas' && (
              <div className="space-y-3">
                {/* Municipality Header */}
                <div className="bg-[#060b19] border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-black text-white flex items-center gap-1.5 truncate">
                        <span className="truncate">{municipalityConfig.name}</span>
                        <span className="shrink-0 px-1 py-0.2 bg-sky-950 text-sky-300 text-[8px] font-black border border-sky-800 rounded">
                          {municipalityConfig.uf}
                        </span>
                      </p>
                      <p className="text-[9px] text-slate-500">Cód. IBGE: {municipalityConfig.inepCode}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('configuracao')}
                    className="shrink-0 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-bold text-slate-300 hover:bg-slate-800 transition flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Trocar</span>
                  </button>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="px-2.5 py-1 rounded-full font-bold bg-sky-500 text-slate-950">2025</span>
                  <span className="px-2.5 py-1 rounded-full font-bold bg-sky-500 text-slate-950">Municipal</span>
                  <span className="px-2.5 py-1 rounded-full font-bold bg-slate-900 border border-slate-700 text-slate-400">Pública</span>
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-full p-0.5">
                    {(['todas', 'urbana', 'rural'] as ZoneFilter[]).map((z) => (
                      <button
                        key={z}
                        onClick={() => setZoneFilter(z)}
                        className={`px-2 py-0.5 rounded-full font-bold capitalize transition ${
                          zoneFilter === z ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {z}
                      </button>
                    ))}
                  </div>
                </div>

                {/* School Cards List */}
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {filteredSchoolsForZone.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setDetailSchoolId(s.id)}
                      className={`w-full text-left bg-[#060b19] border p-2.5 rounded-xl space-y-1.5 transition ${
                        s.id === selectedSchoolId ? 'border-amber-500/60' : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-1.5 py-0.2 bg-slate-900 border border-slate-700 text-slate-300 text-[9px] font-mono font-bold rounded">
                          INEP {s.code}
                        </span>
                        {hasSchoolAlert(s) && (
                          <span className="px-1.5 py-0.2 bg-rose-950 text-rose-300 text-[9px] font-black rounded border border-rose-800">
                            Alerta
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-black text-white leading-tight">{s.name}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{s.address}</span>
                      </p>
                      <div className="flex items-center gap-3 pt-1 border-t border-slate-800/80 text-[9px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${SEMAPHORE_DOT_CLASS[getAprendizadoSemaphore(s)]}`} />
                          Aprendizado
                        </span>
                        <span className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${SEMAPHORE_DOT_CLASS[getInsumosSemaphore(s)]}`} />
                          Insumos
                        </span>
                        <span className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${SEMAPHORE_DOT_CLASS[getSocialSemaphore(s)]}`} />
                          Social
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. VISÃO PROFESSOR - CHAMADA DIGITAL */}
            {roleMode === 'professor' && activeMobileTab === 'chamada' && (
              <div className="space-y-3">
                <div className="bg-[#060b19] border border-slate-800 p-2.5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Lista de Alunos ({selectedClass})</span>
                    <p className="text-xs font-black text-white">
                      {totalPresent} Presentes / {totalAbsent} Ausentes
                    </p>
                  </div>
                  <button
                    onClick={handleSaveAttendance}
                    className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black rounded-lg shadow transition flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Salvar Chamada</span>
                  </button>
                </div>

                {/* Students Attendance List */}
                <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                  {studentsList.map((st) => (
                    <div
                      key={st.id}
                      className="bg-[#060b19] border border-slate-800/80 p-2 rounded-xl flex items-center justify-between gap-2 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{st.avatar}</span>
                        <div>
                          <p className="text-xs font-bold text-white flex items-center gap-1">
                            <span>{st.rollNumber}. {st.name}</span>
                            {st.consecutiveAbsences >= 3 && (
                              <span className="px-1 py-0.2 bg-rose-950 text-rose-300 text-[8px] font-black border border-rose-800 rounded">
                                {st.consecutiveAbsences} FALTAS
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleToggleAttendance(st.id, 'presente')}
                          className={`px-2 py-1 rounded text-[10px] font-black transition ${
                            st.status === 'presente'
                              ? 'bg-emerald-500 text-slate-950 shadow'
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}
                        >
                          P
                        </button>

                        <button
                          onClick={() => handleToggleAttendance(st.id, 'ausente')}
                          className={`px-2 py-1 rounded text-[10px] font-black transition ${
                            st.status === 'ausente'
                              ? 'bg-rose-500 text-white shadow'
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}
                        >
                          F
                        </button>

                        <button
                          onClick={() => handleToggleAttendance(st.id, 'justificado')}
                          className={`px-2 py-1 rounded text-[10px] font-black transition ${
                            st.status === 'justificado'
                              ? 'bg-amber-500 text-slate-950 shadow'
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}
                        >
                          J
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. VISÃO PROFESSOR - DIÁRIO DE CLASSE */}
            {roleMode === 'professor' && activeMobileTab === 'diario' && (
              <form onSubmit={handleSaveLesson} className="space-y-3">
                <div className="bg-[#060b19] border border-slate-800 p-3 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-sky-300">
                    <BookOpen className="w-4 h-4" />
                    <span>Lançamento de Conteúdo Ministrado</span>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-0.5">
                      Conteúdo da Aula
                    </label>
                    <textarea
                      rows={2}
                      value={lessonContent}
                      onChange={(e) => setLessonContent(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-0.5">
                      Habilidade BNCC Relacionada
                    </label>
                    <input
                      type="text"
                      value={bnccSkill}
                      onChange={(e) => setBnccSkill(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-0.5">
                      Tarefa de Casa / Orientação aos Pais
                    </label>
                    <input
                      type="text"
                      value={homework}
                      onChange={(e) => setHomework(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-lg shadow transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Registrar Aula no Diário Digital</span>
                  </button>
                </div>
              </form>
            )}

            {/* 4. OCORRÊNCIAS & AVISOS DA ESCOLA (Compartilhado Diretor & Professor) */}
            {activeMobileTab === 'ocorrencias' && (
              <div className="space-y-3">
                <form onSubmit={handleAddOccurrence} className="bg-[#060b19] border border-slate-800 p-2.5 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-white block">
                    {roleMode === 'diretor' ? 'Registrar Nova Ocorrência' : 'Enviar Recado para a Direção'}
                  </span>
                  <input
                    type="text"
                    placeholder="Descreva o fato ou ocorrência com o aluno..."
                    value={newOccurrenceText}
                    onChange={(e) => setNewOccurrenceText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg transition"
                  >
                    {roleMode === 'diretor' ? 'Salvar Ocorrência' : 'Enviar à Direção'}
                  </button>
                </form>

                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {occurrencesList.map((occ) => (
                    <div key={occ.id} className="bg-[#060b19] border border-slate-800 p-2.5 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-1.5 py-0.2 bg-rose-950 text-rose-300 text-[9px] font-black rounded border border-rose-800">
                          {occ.type}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">{occ.time}</span>
                      </div>
                      <p className="text-xs font-bold text-white">{occ.studentName}</p>
                      <p className="text-[11px] text-slate-300 leading-tight">{occ.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. TAREFAS DO DIRETOR */}
            {roleMode === 'diretor' && activeMobileTab === 'tarefas' && (
              <div className="space-y-3">
                <div className="bg-[#060b19] border border-slate-800 p-2.5 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Checklist Diário do Gestor</span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">
                    {directorTasks.filter((t) => t.done).length}/{directorTasks.length} concluídas
                  </span>
                </div>

                <div className="space-y-2">
                  {directorTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer flex items-start gap-2.5 ${
                        task.done
                          ? 'bg-slate-900/40 border-slate-800 opacity-60'
                          : task.urgent
                          ? 'bg-[#060b19] border-rose-500/40 hover:border-rose-400'
                          : 'bg-[#060b19] border-slate-800 hover:border-amber-500/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => {}}
                        className="mt-0.5 accent-amber-500 shrink-0"
                      />
                      <div className="space-y-0.5">
                        <p
                          className={`text-xs font-bold ${
                            task.done ? 'line-through text-slate-500' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.urgent && !task.done && (
                          <span className="px-1.5 py-0.2 bg-rose-950 text-rose-300 text-[8px] font-black rounded border border-rose-800 uppercase">
                            Prioridade Alta
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Smartphone Home Bar at bottom if frame active */}
          {showDeviceFrame && (
            <div className="w-full flex justify-center mt-3 pt-2 border-t border-slate-900">
              <div className="w-32 h-1 bg-slate-700 rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* School Detail Modal (Diagnóstico das 3 Dimensões + Gerador de Plano) */}
      {detailSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setDetailSchoolId(null)}
          />
          <div className="relative w-full max-w-md max-h-[88vh] overflow-y-auto bg-[#0b1329] border border-slate-800 rounded-2xl shadow-2xl">
            <div className="sticky top-0 z-10 bg-[#0b1329] border-b border-slate-800 p-4 flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase truncate pr-3">{detailSchool.name}</h3>
              <button
                onClick={() => setDetailSchoolId(null)}
                aria-label="Fechar detalhes da escola"
                className="shrink-0 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-slate-300" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Header Card */}
              <div className="bg-gradient-to-br from-sky-950 to-slate-900 border border-sky-900/60 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-1.5 py-0.5 bg-slate-900/70 border border-slate-700 text-slate-300 text-[10px] font-mono font-bold rounded">
                    INEP {detailSchool.code}
                  </span>
                  {hasSchoolAlert(detailSchool) && (
                    <span className="px-2 py-0.5 bg-rose-950 text-rose-300 text-[10px] font-black rounded-full border border-rose-800">
                      Índice Alerta
                    </span>
                  )}
                </div>
                <p className="text-base font-black text-white leading-tight">{detailSchool.name}</p>
                <p className="text-[11px] text-sky-200/80 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    {detailSchool.address} - {municipalityConfig.name} - {municipalityConfig.uf}
                  </span>
                </p>
              </div>

              {/* Taxas de Rendimento Escolar */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Taxas de Rendimento Escolar
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-lg p-2 text-center">
                    <p className="text-[9px] font-bold text-emerald-300 uppercase">Aprovação</p>
                    <p className="text-base font-black text-emerald-400 mt-0.5">
                      {detailSchool.taxaAprovacao.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-amber-950/40 border border-amber-900/60 rounded-lg p-2 text-center">
                    <p className="text-[9px] font-bold text-amber-300 uppercase">Reprovação</p>
                    <p className="text-base font-black text-amber-400 mt-0.5">
                      {Math.max(0, 100 - detailSchool.taxaAprovacao - detailSchool.taxaAbandono).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-rose-950/40 border border-rose-900/60 rounded-lg p-2 text-center">
                    <p className="text-[9px] font-bold text-rose-300 uppercase">Abandono / Evasão</p>
                    <p className="text-base font-black text-rose-400 mt-0.5">
                      {detailSchool.taxaAbandono.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Distorção Idade-Série */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Distorção Idade-Série
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-rose-950/40 border border-rose-900/60 rounded-lg p-2 text-center">
                    <p className="text-[9px] font-bold text-rose-300 uppercase">Distorção Total EF</p>
                    <p className="text-base font-black text-rose-400 mt-0.5">
                      {detailSchool.distorcaoIdadeSerie.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 text-center">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Anos Iniciais (5º)</p>
                    <p className="text-sm font-black text-slate-600 mt-1.5">-</p>
                    <p className="text-[8px] text-slate-500 mt-0.5">Aguardando integração API</p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 text-center">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Anos Finais (9º)</p>
                    <p className="text-sm font-black text-slate-600 mt-1.5">-</p>
                    <p className="text-[8px] text-slate-500 mt-0.5">Aguardando integração API</p>
                  </div>
                </div>
              </div>

              {/* Diagnóstico das 3 Dimensões */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Diagnóstico das 3 Dimensões
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-[#060b19] border border-slate-800 rounded-lg p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-white">1. Aprendizado</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${SEMAPHORE_DOT_CLASS[getAprendizadoSemaphore(detailSchool)]}`} />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Português: <span className="text-slate-500">Aguardando API</span>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Matemática: <span className="text-slate-500">Aguardando API</span>
                    </p>
                  </div>

                  <div className="bg-[#060b19] border border-slate-800 rounded-lg p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-white">2. Insumos</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${SEMAPHORE_DOT_CLASS[getInsumosSemaphore(detailSchool)]}`} />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Infraestrutura:{' '}
                      <span className={SEMAPHORE_TEXT_CLASS[detailSchool.hasInternetIssues ? 'vermelho' : 'verde']}>
                        {detailSchool.hasInternetIssues ? 'Alerta' : 'Adequado'}
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Docentes:{' '}
                      <span
                        className={
                          SEMAPHORE_TEXT_CLASS[
                            detailSchool.professoresSemFormacao / Math.max(1, detailSchool.teacherCount) > 0.15
                              ? 'vermelho'
                              : 'verde'
                          ]
                        }
                      >
                        {detailSchool.professoresSemFormacao / Math.max(1, detailSchool.teacherCount) > 0.15
                          ? 'Alerta'
                          : 'Adequado'}
                      </span>
                    </p>
                  </div>

                  <div className="bg-[#060b19] border border-slate-800 rounded-lg p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-white">3. Social</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${SEMAPHORE_DOT_CLASS[getSocialSemaphore(detailSchool)]}`} />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Evasão: <span className={SEMAPHORE_TEXT_CLASS[detailSchool.taxaAbandono >= 6 ? 'vermelho' : detailSchool.taxaAbandono >= 3 ? 'amarelo' : 'verde']}>
                        {SEMAPHORE_LABEL[detailSchool.taxaAbandono >= 6 ? 'vermelho' : detailSchool.taxaAbandono >= 3 ? 'amarelo' : 'verde']}
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Alunos em Risco:{' '}
                      <span
                        className={
                          SEMAPHORE_TEXT_CLASS[
                            detailSchool.alunosEmRisco / Math.max(1, detailSchool.studentCount) >= 0.12
                              ? 'vermelho'
                              : detailSchool.alunosEmRisco / Math.max(1, detailSchool.studentCount) >= 0.05
                              ? 'amarelo'
                              : 'verde'
                          ]
                        }
                      >
                        {
                          SEMAPHORE_LABEL[
                            detailSchool.alunosEmRisco / Math.max(1, detailSchool.studentCount) >= 0.12
                              ? 'vermelho'
                              : detailSchool.alunosEmRisco / Math.max(1, detailSchool.studentCount) >= 0.05
                              ? 'amarelo'
                              : 'verde'
                          ]
                        }
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Gerador de Plano com IA */}
              <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-sky-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    Gerador de Plano com IA
                  </span>
                  <span className="px-1.5 py-0.5 bg-sky-500/20 text-sky-300 rounded text-[9px] font-bold border border-sky-500/30">
                    SMART 5W2H
                  </span>
                </div>
                <p className="text-[11px] text-sky-100/80 leading-tight">
                  Criar um plano de ação automatizado com foco nos insumos, rendimento e aprendizagem desta unidade
                  escolar.
                </p>

                {getSchoolTags(detailSchool).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {getSchoolTags(detailSchool).map((tag) => (
                      <span
                        key={tag.label}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${tag.className}`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                )}

                {!savedPlanBySchool[detailSchool.id] ? (
                  <button
                    onClick={() => handleGeneratePlan(detailSchool)}
                    disabled={generatingPlanSchoolId === detailSchool.id}
                    className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-slate-950 font-black text-xs rounded-lg shadow transition flex items-center justify-center gap-1.5"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>{generatingPlanSchoolId === detailSchool.id ? 'Gerando...' : 'Gerar'}</span>
                  </button>
                ) : (
                  <div className="bg-[#060b19] border border-emerald-800/60 rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[9px] font-black rounded-full border border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Salvo na Central de Planos
                      </span>
                      <span className="px-2 py-0.5 bg-rose-950 text-rose-300 text-[9px] font-black rounded-full border border-rose-800 uppercase">
                        {savedPlanBySchool[detailSchool.id].priority}
                      </span>
                    </div>
                    <p className="text-xs font-black text-white leading-tight">
                      {savedPlanBySchool[detailSchool.id].title}
                    </p>
                    <p className="text-[10.5px] text-slate-400 leading-snug">
                      {savedPlanBySchool[detailSchool.id].description}
                    </p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider pt-1 border-t border-slate-800">
                      Ações Estruturadas (5W2H):
                    </p>
                    <div className="space-y-1.5">
                      {savedPlanBySchool[detailSchool.id].steps.map((step, idx) => (
                        <div key={step.id} className="bg-slate-900/60 p-2 rounded-lg text-[10px] text-slate-300 leading-snug">
                          <span className="font-bold text-white">Passo {idx + 1}: </span>
                          {step.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
