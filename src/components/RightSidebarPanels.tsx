import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Target,
  ChevronRight,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { useCockpit } from '../context/CockpitContext';

export const RightSidebarPanels: React.FC = () => {
  const { alerts, highlights, setActiveTab, setSelectedSchoolId } = useCockpit();

  const activeAlerts = alerts.filter((a) => !a.resolved).slice(0, 5);

  return (
    <div className="space-y-3">
      {/* 1. ALERTAS IMPORTANTES */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-3.5 shadow-xl">
        <div className="flex items-center justify-between mb-2.5 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-rose-500/20 text-rose-400 rounded-full">
              <AlertCircle className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-100">
              ALERTAS IMPORTANTES
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('alertas')}
            className="text-[10px] text-amber-400 font-bold hover:underline flex items-center gap-0.5"
          >
            <span>Ver todos</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-1.5">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => {
                if (alert.schoolId) {
                  setSelectedSchoolId(alert.schoolId);
                  setActiveTab('escolas');
                } else {
                  setActiveTab('alertas');
                }
              }}
              className="group p-2 bg-[#070d1e] hover:bg-slate-800/80 border border-slate-800/80 rounded-xl transition cursor-pointer flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                <p className="text-[11px] font-semibold text-slate-200 group-hover:text-amber-300 transition truncate leading-tight">
                  {alert.title}
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* 2. DESTAQUES POSITIVOS */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-3.5 shadow-xl">
        <div className="flex items-center justify-between mb-2.5 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-sky-500/20 text-sky-400 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-100">
              DESTAQUES POSITIVOS
            </h3>
          </div>
        </div>

        <div className="space-y-1.5">
          {highlights.map((item) => (
            <div
              key={item.id}
              className="group p-2 bg-[#070d1e] hover:bg-slate-800/80 border border-slate-800/80 rounded-xl transition cursor-pointer flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0"></span>
                <p className="text-[11px] font-semibold text-slate-200 group-hover:text-emerald-300 transition truncate leading-tight">
                  {item.title}
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. META PRINCIPAL A PERSEGUIR (Magenta / Purple Gradient Card from Screenshot) */}
      <div className="bg-gradient-to-br from-[#801b52] via-[#5c1340] to-[#3a0928] border border-pink-500/30 rounded-2xl p-4 shadow-xl text-white relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1.5">
          <Target className="w-4 h-4 text-pink-300 animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-wider text-pink-100">
            META PRINCIPAL A PERSEGUIR
          </h3>
        </div>

        <p className="text-xs text-pink-100/90 mb-1">
          Elevar o <strong>Índice Geral da Educação</strong> para
        </p>

        <div className="flex items-baseline justify-between mb-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-white font-mono tracking-tight">80</span>
            <span className="text-xs text-pink-200 font-bold">pontos até 2027</span>
          </div>
        </div>

        <p className="text-xs font-bold text-amber-300 mb-2">
          Rumo à excelência!
        </p>

        {/* Progress bar */}
        <div className="w-full bg-black/40 rounded-full h-2 p-0.5 border border-pink-400/20">
          <div
            className="bg-gradient-to-r from-amber-400 via-pink-300 to-emerald-400 h-1 rounded-full shadow-sm"
            style={{ width: '72.4%' }}
          ></div>
        </div>

        {/* Bottom Chart Illustration */}
        <div className="absolute right-3 bottom-2 opacity-30 pointer-events-none">
          <BarChart2 className="w-16 h-16 text-pink-200" />
        </div>
      </div>
    </div>
  );
};

