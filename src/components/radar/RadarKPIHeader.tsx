import React from 'react';
import {
  Layers,
  Sparkles,
  AlertTriangle,
  DollarSign,
  Clock,
  FileSearch,
  CheckCircle2,
  TrendingUp,
  HelpCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { RadarSummaryMetrics } from '../../types/radar';

interface Props {
  metrics: RadarSummaryMetrics;
  onFilterClick?: (filterType: string) => void;
}

export const RadarKPIHeader: React.FC<Props> = ({ metrics, onFilterClick }) => {
  // Determine IAR color & status
  const getIarBadge = (score: number) => {
    if (score >= 85) {
      return {
        bg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
        dot: 'bg-emerald-400',
        text: '🟢 Excelente aproveitamento. Maioria dos recursos aptos.',
      };
    } else if (score >= 60) {
      return {
        bg: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
        dot: 'bg-amber-400',
        text: '🟡 Há oportunidades importantes não exploradas.',
      };
    } else {
      return {
        bg: 'bg-rose-950/80 border-rose-500/40 text-rose-300',
        dot: 'bg-rose-400',
        text: '🔴 Alto potencial de melhoria, com programas elegíveis e pendências identificadas.',
      };
    }
  };

  const iarBadge = getIarBadge(metrics.iarIndex);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-4">
      {/* Exclusivo Diferencial Comercial: IAR Banner Card */}
      <div className="bg-gradient-to-r from-[#0b1633] via-[#0f214a] to-[#0b1633] border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                Diferencial Estratégico Exclusivo
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Central de Inteligência Financeira SEDUC
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Índice de Aproveitamento de Recursos (IAR)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Métrica síntese de 0 a 100 que mensura a eficácia do município em captar, regularizar e executar os programas financeiros estaduais e federais elegíveis.
            </p>

            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${iarBadge.bg}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${iarBadge.dot} animate-pulse`}></span>
              <span>{iarBadge.text}</span>
            </div>
          </div>

          {/* Large IAR Score Meter */}
          <div className="bg-[#060b19]/90 border border-slate-700/80 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-inner w-full lg:w-auto justify-between lg:justify-start">
            <div className="text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pontuação IAR</div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight">
                  {metrics.iarIndex}
                </span>
                <span className="text-sm font-bold text-slate-400 font-mono">/100</span>
              </div>
            </div>

            {/* Circular Donut Gauge */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-400"
                  strokeDasharray={`${metrics.iarIndex}, 100`}
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <TrendingUp className="w-5 h-5 text-amber-300 absolute" />
            </div>
          </div>
        </div>
      </div>

      {/* Six KPI Cards requested by prompt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* 1. Recursos Monitorados */}
        <div
          onClick={() => onFilterClick?.('todos')}
          className="bg-[#0b1329] hover:bg-[#0f1b3b] border border-slate-800 rounded-xl p-3.5 shadow-lg transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recursos Monitorados</span>
            <div className="p-1.5 bg-slate-800/80 rounded-lg group-hover:bg-amber-500/20 transition">
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono tracking-tight">
              {metrics.totalMonitoredPrograms}
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Programas mapeados</p>
          </div>
        </div>

        {/* 2. Oportunidades */}
        <div
          onClick={() => onFilterClick?.('oportunidades')}
          className="bg-[#0b1329] hover:bg-[#0f1b3b] border border-emerald-900/50 hover:border-emerald-500/50 rounded-xl p-3.5 shadow-lg transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Oportunidades</span>
            <div className="p-1.5 bg-emerald-950/80 rounded-lg group-hover:bg-emerald-500/20 transition">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-300 font-mono tracking-tight flex items-baseline gap-1">
              {metrics.totalOpportunities}
              <span className="text-xs font-normal text-emerald-400">identificadas</span>
            </div>
            <p className="text-[10px] text-emerald-400/80 font-medium mt-0.5">Elegíveis ou em análise</p>
          </div>
        </div>

        {/* 3. Recursos em Risco */}
        <div
          onClick={() => onFilterClick?.('risco')}
          className="bg-[#0b1329] hover:bg-[#0f1b3b] border border-rose-900/50 hover:border-rose-500/50 rounded-xl p-3.5 shadow-lg transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recursos em Risco</span>
            <div className="p-1.5 bg-rose-950/80 rounded-lg group-hover:bg-rose-500/20 transition">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-rose-400 font-mono tracking-tight">
              {metrics.programsAtRisk}
            </div>
            <p className="text-[10px] text-rose-400/80 font-medium mt-0.5">Programas com pendências</p>
          </div>
        </div>

        {/* 4. Valor Potencial */}
        <div
          onClick={() => onFilterClick?.('todos')}
          className="bg-[#0b1329] hover:bg-[#0f1b3b] border border-amber-900/50 hover:border-amber-500/50 rounded-xl p-3.5 shadow-lg transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Valor Potencial</span>
            <div className="p-1.5 bg-amber-950/80 rounded-lg group-hover:bg-amber-500/20 transition">
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono tracking-tight truncate">
              {formatCurrency(metrics.totalPotentialValue)}
            </div>
            <p className="text-[10px] text-amber-400/80 font-medium mt-0.5">(Estimativa total elegível)</p>
          </div>
        </div>

        {/* 5. Prazos Próximos */}
        <div
          onClick={() => onFilterClick?.('prazos')}
          className="bg-[#0b1329] hover:bg-[#0f1b3b] border border-sky-900/50 hover:border-sky-500/50 rounded-xl p-3.5 shadow-lg transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Prazos Próximos</span>
            <div className="p-1.5 bg-sky-950/80 rounded-lg group-hover:bg-sky-500/20 transition">
              <Clock className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-sky-300 font-mono tracking-tight">
              {metrics.upcomingDeadlinesCount}
            </div>
            <p className="text-[10px] text-sky-400/80 font-medium mt-0.5">Vencimento ≤ 30 dias</p>
          </div>
        </div>

        {/* 6. Pendências Documentais */}
        <div
          onClick={() => onFilterClick?.('pendencias')}
          className="bg-[#0b1329] hover:bg-[#0f1b3b] border border-orange-900/50 hover:border-orange-500/50 rounded-xl p-3.5 shadow-lg transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pendências Doc.</span>
            <div className="p-1.5 bg-orange-950/80 rounded-lg group-hover:bg-orange-500/20 transition">
              <FileSearch className="w-4 h-4 text-orange-400" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-orange-300 font-mono tracking-tight">
              {metrics.documentPendingCount}
            </div>
            <p className="text-[10px] text-orange-400/80 font-medium mt-0.5">Documentos faltantes</p>
          </div>
        </div>
      </div>
    </div>
  );
};
