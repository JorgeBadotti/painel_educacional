import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell,
  CartesianGrid
} from 'recharts';
import { EducationResourceProgram } from '../../types/radar';
import { Filter, DollarSign, Calendar, Info, FileSpreadsheet, AlertCircle } from 'lucide-react';

interface Props {
  programs: EducationResourceProgram[];
  onSelectProgram?: (program: EducationResourceProgram) => void;
}

export const RadarOpportunityChart: React.FC<Props> = ({ programs, onSelectProgram }) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('todos');

  // Format programs data for scatter/bubble chart
  const filteredPrograms = programs.filter((p) => {
    if (selectedStatusFilter === 'todos') return true;
    return p.eligibilityStatus === selectedStatusFilter;
  });

  const chartData = filteredPrograms.map((p, idx) => {
    return {
      x: Math.max(1, p.daysToDeadline), // X axis: days to deadline
      y: p.estimatedValue / 1000, // Y axis: value in thousands R$
      z: p.estimatedValue, // Z axis: bubble size proportional to estimated value
      program: p.program,
      organ: p.organ,
      status: p.eligibilityStatus,
      statusLabel: p.eligibilityStatus === 'elegivel' ? 'Elegível' : p.eligibilityStatus === 'pendente' ? 'Doc. Pendente' : p.eligibilityStatus === 'risco' ? 'Em Risco' : 'Encerrado',
      formattedValue: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(p.estimatedValue),
      deadline: p.deadline,
      rawProgram: p,
      index: idx,
    };
  });

  // Map status color
  const getColorByStatus = (status: string) => {
    switch (status) {
      case 'elegivel':
        return '#10b981'; // Green
      case 'pendente':
        return '#f59e0b'; // Yellow / Amber
      case 'risco':
        return '#f43f5e'; // Red / Rose
      case 'encerrado':
      default:
        return '#64748b'; // Gray / Slate
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const prog: EducationResourceProgram = data.rawProgram;

      return (
        <div className="bg-[#081026] border-2 border-amber-500/60 p-4 rounded-xl shadow-2xl max-w-sm text-slate-100 space-y-2.5 z-50 animate-fade-in backdrop-blur-md">
          <div className="flex items-start justify-between gap-2 border-b border-slate-700/80 pb-2">
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider font-mono">
                {data.organ}
              </span>
              <h4 className="font-bold text-sm text-white leading-snug">{data.program}</h4>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 border ${
                data.status === 'elegivel'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                  : data.status === 'pendente'
                  ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                  : data.status === 'risco'
                  ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              {data.statusLabel}
            </span>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{prog.description}</p>

          <div className="grid grid-cols-2 gap-2 bg-[#040814] p-2.5 rounded-lg border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Valor Estimado</span>
              <span className="font-black text-amber-300 font-mono text-sm">{data.formattedValue}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Prazo Restante</span>
              <span className="font-bold text-sky-300 font-mono text-xs">{data.x} dias ({data.deadline})</span>
            </div>
          </div>

          {prog.pendingIssues.length > 0 && (
            <div className="text-[11px] text-amber-300/90 bg-amber-950/40 p-2 rounded border border-amber-800/40 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Pendência:</strong> {prog.pendingIssues[0]}
              </div>
            </div>
          )}

          <div className="text-[10px] text-slate-400 text-center font-semibold pt-1 border-t border-slate-800">
            💡 Clique na bolha para abrir detalhes completos
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-white tracking-wide uppercase">
              Mapa de Oportunidades Financeiras
            </h3>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold">
              Gráfico de Distribuição
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Distribuição dos programas por prazo de vencimento (Eixo X) e valor financeiro estimado em R$ mil (Eixo Y). Tamanho da bolha reflete o volume potencial.
          </p>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap bg-[#060b19] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedStatusFilter('todos')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
              selectedStatusFilter === 'todos'
                ? 'bg-slate-700 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos ({programs.length})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('elegivel')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              selectedStatusFilter === 'elegivel'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-emerald-400 hover:bg-emerald-950/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Elegível ({programs.filter((p) => p.eligibilityStatus === 'elegivel').length})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('pendente')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              selectedStatusFilter === 'pendente'
                ? 'bg-amber-600 text-white shadow'
                : 'text-amber-400 hover:bg-amber-950/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Doc. Pendente ({programs.filter((p) => p.eligibilityStatus === 'pendente').length})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('risco')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              selectedStatusFilter === 'risco'
                ? 'bg-rose-600 text-white shadow'
                : 'text-rose-400 hover:bg-rose-950/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            Em Risco ({programs.filter((p) => p.eligibilityStatus === 'risco').length})
          </button>
        </div>
      </div>

      {/* Bubble Chart Canvas */}
      <div className="h-[380px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
            <XAxis
              type="number"
              dataKey="x"
              name="Dias para Vencimento"
              unit=" dias"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              domain={[0, 'auto']}
              label={{ value: 'Prazo até o Vencimento (Dias)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Valor Estimado"
              unit="k"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'Valor Estimado (R$ em milhares)', angle: -90, position: 'insideLeft', offset: 0, fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
            />
            <ZAxis
              type="number"
              dataKey="z"
              range={[120, 1400]} // Bubble size range
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#f59e0b' }} />
            <Scatter
              name="Programas Financeiros"
              data={chartData}
              onClick={(node: any) => {
                if (node && node.rawProgram && onSelectProgram) {
                  onSelectProgram(node.rawProgram);
                }
              }}
              className="cursor-pointer"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColorByStatus(entry.status)}
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  opacity={0.85}
                  className="hover:opacity-100 hover:stroke-amber-300 transition"
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Color Code Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#060b19] p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Legenda de Status:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300"></span>
            <span className="text-slate-300 font-medium">Verde: Elegível</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300"></span>
            <span className="text-slate-300 font-medium">Amarelo: Doc. Pendente</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-300"></span>
            <span className="text-slate-300 font-medium">Vermelho: Em Risco</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-500 border border-slate-300"></span>
            <span className="text-slate-300 font-medium">Cinza: Encerrado</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>Tamanho da bolha representa o montante financeiro em disputa.</span>
        </div>
      </div>
    </div>
  );
};
