import React, { useState, useEffect } from 'react';
import {
  Tv,
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Clock,
  Sparkles,
  School,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useCockpit } from '../context/CockpitContext';
import { InstitutionalWoodPlaque } from './InstitutionalWoodPlaque';

export const TvPresentationMode: React.FC = () => {
  const { kpis, schools, alerts, highlights, setIsTvMode, userProfile } = useCockpit();

  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  const totalSlides = 3;

  // Auto slide cycle every 12 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % totalSlides);
      }, 12000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const criticalSchools = schools.filter((s) => s.status === 'critico');
  const topSchools = schools.filter((s) => s.status === 'destaque');

  return (
    <div className="fixed inset-0 z-50 bg-[#060b19] text-white flex flex-col justify-between p-6 overflow-hidden select-none animate-fade-in">
      {/* TV Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl shadow-xl text-slate-950">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-amber-200 via-white to-amber-100 bg-clip-text text-transparent">
                PAINEL EXECUTIVO DE INTELIGÊNCIA EDUCACIONAL
              </h1>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-bold text-xs rounded-full border border-amber-500/40 uppercase">
                {userProfile.municipality}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Monitor de Gestão em Tempo Real • Secretaria Municipal de Educação
            </p>
          </div>
        </div>

        {/* TV Controls & Live Clock */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-mono text-sm">
            <span>{currentDate}</span>
            <span className="text-amber-400 font-bold">{currentTime}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides)}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 text-amber-400 hover:text-amber-300 rounded-lg transition"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % totalSlides)}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setIsTvMode(false)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 font-bold text-xs rounded-xl transition"
          >
            <X className="w-4 h-4" />
            <span>Sair da TV</span>
          </button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="my-auto py-4">
        {/* SLIDE 0: VISÃO GERAL DE IMPACTO */}
        {activeSlide === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                Painel 01 de 03 — Indicadores de Alto Impacto
              </span>
              <span className="text-xs text-slate-400 font-mono">Rotação Automática Ativa</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Index Card */}
              <div className="bg-gradient-to-br from-[#0c1636] to-[#132252] border border-amber-500/40 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                  ÍNDICE GERAL DA EDUCAÇÃO
                </span>
                <div className="my-4">
                  <div className="text-6xl font-black text-amber-300">72,4</div>
                  <div className="text-xs text-emerald-400 font-bold mt-2">↑ +8.7 pts vs ano anterior</div>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300">
                  Objetivo 2027: <strong>80,0 pontos</strong>
                </div>
              </div>

              {/* Attendance */}
              <div className="bg-[#0b132a] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                  FREQUÊNCIA MÉDIA DA REDE
                </span>
                <div className="my-4">
                  <div className="text-6xl font-black text-sky-400">91,3%</div>
                  <div className="text-xs text-emerald-400 font-bold mt-2">↑ +4.6 pts vs mês anterior</div>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300">
                  Meta Municipal: <strong>95,0%</strong>
                </div>
              </div>

              {/* Approval */}
              <div className="bg-[#0b132a] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                  TAXA DE APROVAÇÃO
                </span>
                <div className="my-4">
                  <div className="text-6xl font-black text-emerald-400">87,6%</div>
                  <div className="text-xs text-emerald-400 font-bold mt-2">↑ +3.2 pts vs ano anterior</div>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300">
                  Meta Municipal: <strong>94,0%</strong>
                </div>
              </div>

              {/* Students at Risk */}
              <div className="bg-[#0b132a] border border-rose-800/80 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-rose-300">
                  ALUNOS EM RISCO
                </span>
                <div className="my-4">
                  <div className="text-6xl font-black text-rose-400">427</div>
                  <div className="text-xs text-rose-300 font-bold mt-2">Necessitam atenção da Busca Ativa</div>
                </div>
                <div className="p-3 bg-rose-950/60 rounded-xl border border-rose-800 text-xs text-rose-200">
                  Ações de acompanhamento em andamento
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 1: MAPA MUNICIPAL DE ESCOLAS */}
        {activeSlide === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <School className="w-4 h-4" />
                Painel 02 de 03 — Panorama Unidades Escolares (108 Unidades)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Destaques */}
              <div className="bg-[#0b132a] border border-emerald-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Unidades em Destaque na Rede
                </h3>
                <div className="space-y-3">
                  {topSchools.slice(0, 4).map((s) => (
                    <div key={s.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-slate-100">{s.name}</p>
                        <span className="text-xs text-slate-400">Diretor: {s.director}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-emerald-400">IDEB {s.ideb}</span>
                        <p className="text-[10px] text-slate-400">Freq. {s.frequencia}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Atenção Prioritária */}
              <div className="bg-[#0b132a] border border-rose-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Unidades em Situação Crítica (Atuação Imediata)
                </h3>
                <div className="space-y-3">
                  {criticalSchools.map((s) => (
                    <div key={s.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-slate-100">{s.name}</p>
                        <span className="text-xs text-slate-400">{s.alunosEmRisco} alunos em risco de evasão</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-rose-400">IDEB {s.ideb}</span>
                        <p className="text-[10px] text-slate-400">Freq. {s.frequencia}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 2: ALERTAS E AÇÕES */}
        {activeSlide === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Painel 03 de 03 — Central de Alertas & Intervenções
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0b132a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-3">
                <h3 className="text-sm font-bold uppercase text-amber-300">Alertas Disparados no Dia</h3>
                {alerts.slice(0, 4).map((a) => (
                  <div key={a.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                    <p className="font-bold text-slate-200">{a.title}</p>
                    <p className="text-slate-400 mt-1">{a.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#0b132a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-3">
                <h3 className="text-sm font-bold uppercase text-emerald-400">Destaques da Semana</h3>
                {highlights.map((h) => (
                  <div key={h.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                    <p className="font-bold text-slate-200">{h.title}</p>
                    <p className="text-slate-400 mt-1">{h.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Ticker Marquee Bar */}
      <div className="bg-slate-900/90 border-t border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-bold rounded uppercase shrink-0 text-[10px]">
            Informativo
          </span>
          <p className="text-amber-200 truncate font-mono">
            "Cada dado é um aluno. Cada indicador é uma oportunidade. Cada ação é um futuro melhor. #EducaçãoQueTransforma"
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-slate-400 font-mono text-[11px]">
          <span>Painel {activeSlide + 1} / {totalSlides}</span>
        </div>
      </div>

      <div className="mt-2 -mx-6 -mb-6">
        <InstitutionalWoodPlaque />
      </div>
    </div>
  );
};
