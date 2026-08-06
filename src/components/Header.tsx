import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Tv,
  FileText,
  RefreshCw,
  Clock,
  Calendar,
  Layers,
  School,
  AlertTriangle,
  CheckSquare,
  Code2,
  UserCheck,
  Building2,
  ChevronDown,
  Radio,
  Smartphone,
  Sliders,
  MapPin
} from 'lucide-react';
import { useCockpit } from '../context/CockpitContext';
import { exportCockpitPdf } from '../utils/pdfExporter';

export const Header: React.FC<{ onOpenAuthModal: () => void }> = ({ onOpenAuthModal }) => {
  const {
    userProfile,
    municipalityConfig,
    activeTab,
    setActiveTab,
    setIsTvMode,
    selectedPeriod,
    setSelectedPeriod,
    lastUpdatedTimestamp,
    refreshDataSimulated,
    kpis,
    schools,
    alerts,
    actionPlans,
    isLiveStreaming,
    setIsLiveStreaming,
  } = useCockpit();

  const [currentTime, setCurrentTime] = useState<string>('10:24');
  const [currentDate, setCurrentDate] = useState<string>('23/05/2025');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    refreshDataSimulated();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleExportPdf = () => {
    exportCockpitPdf(userProfile.municipality, kpis, schools, alerts, actionPlans);
  };

  const unreadAlertsCount = alerts.filter((a) => !a.resolved).length;
  const pendingActionsCount = actionPlans.filter((p) => p.status !== 'concluido').length;

  return (
    <header className="bg-[#060b19] border-b border-slate-800 text-white sticky top-0 z-30 shadow-2xl">
      {/* Primary Banner as shown in Screenshot */}
      <div className="max-w-[1920px] mx-auto px-5 py-3 flex items-center justify-between border-b border-slate-800/80 gap-4">
        {/* Left Side: Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
            <div className="w-full h-full bg-[#060b19] rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-sm md:text-base tracking-wider uppercase text-slate-100 leading-tight">
                PAINEL DE INTELIGÊNCIA EDUCACIONAL
              </h1>
              <button
                onClick={() => setActiveTab('configuracao')}
                className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition flex items-center gap-1 cursor-pointer"
                title="Clique para alterar o município de atuação"
              >
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{municipalityConfig.name} - {municipalityConfig.uf}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
              Gestão Educacional Municipal • {municipalityConfig.totalSchools} Escolas • {municipalityConfig.totalStudents.toLocaleString('pt-BR')} Matrículas
            </p>
          </div>
        </div>

        {/* Center Title: EDUCAÇÃO EM TEMPO REAL */}
        <div className="hidden md:flex flex-col items-center justify-center text-center">
          <h2 className="text-lg md:text-xl font-black tracking-widest text-white uppercase">
            EDUCAÇÃO EM TEMPO REAL
          </h2>
          <p className="text-xs text-emerald-400/90 font-semibold tracking-wide mt-0.5">
            Decisões inteligentes. Resultados que transformam.
          </p>
        </div>

        {/* Right Side: Date, Time & Status */}
        <div className="flex flex-col items-end justify-center text-right text-xs">
          <div className="flex items-center gap-3 font-medium text-slate-200">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono text-xs">{currentDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono text-xs font-bold text-white">{currentTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1 text-[11px]">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">
              Última atualização: <strong className="text-emerald-300 font-normal">{lastUpdatedTimestamp}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Control Strip & Navigation Tabs */}
      <div className="max-w-[1920px] mx-auto px-5 py-1.5 flex flex-wrap items-center justify-between gap-3 bg-[#081024]">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
          <button
            onClick={() => setActiveTab('cockpit')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap transition ${
              activeTab === 'cockpit'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cockpit Executivo</span>
          </button>

          <button
            onClick={() => setActiveTab('escolas')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap transition ${
              activeTab === 'escolas'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>Escolas</span>
            <span className="ml-0.5 px-1.5 py-0.2 text-[10px] bg-slate-900 text-amber-300 rounded-full font-mono">
              {schools.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('comparativo')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap transition ${
              activeTab === 'comparativo'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Comparativo</span>
          </button>

          <button
            onClick={() => setActiveTab('planos_acao')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap transition ${
              activeTab === 'planos_acao'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Planos de Ação</span>
            {pendingActionsCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-amber-600 text-white rounded-full font-bold">
                {pendingActionsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('mobile_escola')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap transition border ${
              activeTab === 'mobile_escola'
                ? 'bg-sky-500 text-slate-950 border-sky-400 font-black shadow-lg shadow-sky-500/30'
                : 'bg-sky-500/10 text-sky-300 border-sky-500/30 hover:bg-sky-500/20'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            <span>App Diretor & Professor</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-sky-400 text-slate-950 rounded-full font-black">
              MOBILE
            </span>
          </button>

          <button
            onClick={() => setActiveTab('radar_recursos')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap transition border ${
              activeTab === 'radar_recursos'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-400 font-extrabold shadow-lg shadow-amber-500/30 animate-pulse-subtle'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Radar de Recursos</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-amber-400 text-slate-950 rounded-full font-black">
              NOVO
            </span>
          </button>

          <button
            onClick={() => setActiveTab('alertas')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap transition ${
              activeTab === 'alertas'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Central de Alertas</span>
            {unreadAlertsCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-rose-600 text-white rounded-full font-bold">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('api_integracao')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap transition ${
              activeTab === 'api_integracao'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-sky-400" />
            <span>API / Carga</span>
          </button>

          <button
            onClick={() => setActiveTab('configuracao')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap transition border ${
              activeTab === 'configuracao'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-black'
                : 'bg-slate-900/80 text-amber-300 border-amber-500/30 hover:bg-slate-800 hover:text-amber-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Configuração</span>
            <span className="px-1.5 py-0.2 text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full font-mono">
              MUNICÍPIO
            </span>
          </button>
        </nav>

        {/* Quick controls */}
        <div className="flex items-center gap-2">
          {/* Real-time toggle */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border transition ${
              isLiveStreaming
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveStreaming ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
              }`}
            ></span>
            <span>{isLiveStreaming ? 'TEMPO REAL ATIVO' : 'PAUSADO'}</span>
          </button>

          {/* Refresh Simulation Button */}
          <button
            onClick={handleRefreshClick}
            title="Sincronizar com APIs da Prefeitura"
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-md transition border border-slate-700/80 flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Period Select */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-700/80 text-slate-200 text-xs rounded-md pl-2.5 pr-7 py-1 focus:outline-none focus:border-amber-500 font-medium cursor-pointer"
            >
              <option value="2025-AnoLetivo">Ano Letivo 2025</option>
              <option value="2025-B2">2º Bimestre 2025</option>
              <option value="2025-B1">1º Bimestre 2025</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2 pointer-events-none" />
          </div>

          {/* Export PDF */}
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-semibold rounded-md transition"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          {/* Modo Televisão Button */}
          <button
            onClick={() => setIsTvMode(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-md shadow border border-sky-400/30 transition"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>TV</span>
          </button>

          {/* User Profile */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-md transition text-slate-200"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

