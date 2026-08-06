import React, { useState } from 'react';
import { useCockpit } from '../context/CockpitContext';
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
  Laptop
} from 'lucide-react';

type RoleMode = 'diretor' | 'professor';
type MobileTab = 'resumo' | 'chamada' | 'diario' | 'ocorrencias' | 'tarefas';

interface StudentAttendance {
  id: string;
  name: string;
  rollNumber: number;
  status: 'presente' | 'ausente' | 'justificado';
  consecutiveAbsences: number;
  avatar: string;
}

export const MobileSchoolView: React.FC = () => {
  const { schools, actionPlans, alerts, addAlert, addActionPlan } = useCockpit();

  // Selected state
  const [roleMode, setRoleMode] = useState<RoleMode>('diretor');
  const [showDeviceFrame, setShowDeviceFrame] = useState<boolean>(true);
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('resumo');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id || 'esc-1');
  const [selectedClass, setSelectedClass] = useState<string>('5º Ano A - Matutino');
  const [toast, setToast] = useState<string | null>(null);

  // Selected school data
  const currentSchool = schools.find((s) => s.id === selectedSchoolId) || schools[0];

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
    </div>
  );
};
