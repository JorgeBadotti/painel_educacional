import React from 'react';
import {
  School,
  CalendarCheck,
  CheckCircle2,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  GraduationCap,
  Sparkles,
  Radio,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useCockpit } from '../context/CockpitContext';

export const TopKpiCards: React.FC = () => {
  const { schools, kpis, setFilterRisk, setActiveTab } = useCockpit();

  const totalSchools = 108;
  const destaqueCount = schools.filter((s) => s.status === 'destaque').length || 8;
  const atencaoCount = schools.filter((s) => s.status === 'atencao').length || 3;
  const criticoCount = schools.filter((s) => s.status === 'critico').length || 2;

  const freqKpi = kpis.find((k) => k.id === 'frequencia')?.currentValue || 91.3;
  const aprovKpi = kpis.find((k) => k.id === 'aprovacao')?.currentValue || 87.6;
  const totalAlunosRisco = 427;
  const profsFormacao = 63;
  const recursos = 'R$ 2,6 mi';

  return (
    <div className="space-y-3 mb-3">
      {/* Prominent Golden Opportunity Banner for Main Cockpit Integration */}
      <div
        onClick={() => setActiveTab('radar_recursos')}
        className="bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border-2 border-amber-500/60 rounded-xl p-3 sm:p-3.5 shadow-xl hover:border-amber-400 transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group relative overflow-hidden"
      >
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2.5 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl text-slate-950 font-black shadow-lg shadow-amber-500/30 group-hover:scale-110 transition shrink-0">
            <Radio className="w-5 h-5 fill-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.2 bg-amber-400 text-slate-950 text-[10px] font-black rounded uppercase tracking-wider">
                12 Oportunidades Mapeadas
              </span>
              <span className="text-[11px] font-mono text-amber-300 font-bold">
                R$ 3.250.000,00 Potencial
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition mt-0.5 flex items-center gap-1.5">
              <span>Radar de Recursos da Educação — Central de Inteligência Financeira</span>
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h4>
            <p className="text-xs text-slate-300 font-medium hidden sm:block">
              Índice IAR em 78/100. Clique para analisar programas, pendências documentais e simulações.
            </p>
          </div>
        </div>

        <button className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg shadow-lg transition flex items-center gap-1.5 shrink-0 group-hover:translate-x-1">
          <span>Abrir Radar de Recursos</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
      {/* 1. ÍNDICE GERAL DA EDUCAÇÃO */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col justify-between relative overflow-hidden">
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
          ÍNDICE GERAL DA EDUCAÇÃO
        </span>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white tracking-tight font-mono">72,4</span>
              <span className="text-xs font-bold text-slate-400 font-mono">/100</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>↑ 8,7 pts vs. ano anterior</span>
            </div>
          </div>

          {/* Speedometer Arc Gauge */}
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-400"
                strokeDasharray="72.4, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[9px] font-black text-amber-300 font-mono">72,4</span>
          </div>
        </div>
      </div>

      {/* 2. ESCOLAS */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col justify-between">
        <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
          <School className="w-3.5 h-3.5 text-sky-400" />
          <span>ESCOLAS</span>
        </div>
        <div className="flex items-baseline gap-1.5 my-0.5">
          <span className="text-2xl font-extrabold text-white font-mono">{totalSchools}</span>
          <span className="text-[11px] text-slate-400">no total</span>
        </div>
        <div className="flex items-center justify-between text-[9px] font-bold pt-1 border-t border-slate-800/80">
          <button
            onClick={() => {
              setFilterRisk('destaque');
              setActiveTab('escolas');
            }}
            className="text-emerald-400 hover:underline"
          >
            <span className="font-mono">{destaqueCount}</span> em destaque
          </button>
          <button
            onClick={() => {
              setFilterRisk('atencao');
              setActiveTab('escolas');
            }}
            className="text-amber-400 hover:underline"
          >
            <span className="font-mono">{atencaoCount}</span> em atenção
          </button>
          <button
            onClick={() => {
              setFilterRisk('critico');
              setActiveTab('escolas');
            }}
            className="text-rose-400 hover:underline"
          >
            <span className="font-mono">{criticoCount}</span> críticas
          </button>
        </div>
      </div>

      {/* 3. ALUNOS EM RISCO */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col justify-between">
        <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
          <Users className="w-3.5 h-3.5 text-rose-400" />
          <span>ALUNOS EM RISCO</span>
        </div>
        <div className="flex items-baseline gap-1.5 my-0.5">
          <span className="text-2xl font-extrabold text-white font-mono">{totalAlunosRisco}</span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">precisam de atenção</p>
      </div>

      {/* 4. FREQUÊNCIA MÉDIA */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col justify-between">
        <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
          <CalendarCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>FREQUÊNCIA MÉDIA</span>
        </div>
        <div className="flex items-baseline gap-1.5 my-0.5">
          <span className="text-2xl font-extrabold text-white font-mono">{freqKpi}%</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
          <ArrowUpRight className="w-3 h-3" />
          <span>↑ 4,6 pts vs. mês anterior</span>
        </div>
      </div>

      {/* 5. TAXA DE APROVAÇÃO */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col justify-between">
        <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>TAXA DE APROVAÇÃO</span>
        </div>
        <div className="flex items-baseline gap-1.5 my-0.5">
          <span className="text-2xl font-extrabold text-white font-mono">{aprovKpi}%</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
          <ArrowUpRight className="w-3 h-3" />
          <span>↑ 3,2 pts vs. ano anterior</span>
        </div>
      </div>

      {/* 6. PROFESSORES */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col justify-between">
        <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
          <span>PROFESSORES</span>
        </div>
        <div className="flex items-baseline gap-1.5 my-0.5">
          <span className="text-2xl font-extrabold text-white font-mono">{profsFormacao}</span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">precisam de formação</p>
      </div>

      {/* 7. RECURSOS DISPONÍVEIS */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col justify-between">
        <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
          <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          <span>RECURSOS DISPONÍVEIS</span>
        </div>
        <div className="flex items-baseline gap-1.5 my-0.5">
          <span className="text-2xl font-extrabold text-white font-mono">{recursos}</span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">a executar</p>
      </div>
      </div>
    </div>
  );
};

