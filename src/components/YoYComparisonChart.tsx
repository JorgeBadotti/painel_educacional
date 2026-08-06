import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  TooltipProps
} from 'recharts';
import { TrendingUp, Target, Award, BarChart3, Sliders, Calendar } from 'lucide-react';

export interface YoYDataItem {
  mes: string;
  anoAnterior: number | null;
  anoAtual: number | null;
  metaPlanejada?: number | null;
  metaFinal?: number;
  meta?: number;
}

export interface YoYComparisonChartProps {
  data?: YoYDataItem[];
  anoBase?: number;
  anoVigente?: number;
  title?: string;
  subtitle?: string;
  unit?: string;
}

// Default payload with Glide Path (Curva de Planejamento) requested strictly in prompt
const SAMPLE_FREQUENCIA_DATA: YoYDataItem[] = [
  { mes: 'Jan', anoAnterior: 88.0, anoAtual: 90.1, metaPlanejada: 89.0, metaFinal: 95.0 },
  { mes: 'Fev', anoAnterior: 88.5, anoAtual: 90.8, metaPlanejada: 89.5, metaFinal: 95.0 },
  { mes: 'Mar', anoAnterior: 89.0, anoAtual: 89.9, metaPlanejada: 90.2, metaFinal: 95.0 },
  { mes: 'Abr', anoAnterior: 89.2, anoAtual: 91.5, metaPlanejada: 91.0, metaFinal: 95.0 },
  { mes: 'Mai', anoAnterior: 89.5, anoAtual: 91.8, metaPlanejada: 91.5, metaFinal: 95.0 },
  { mes: 'Jun', anoAnterior: 90.1, anoAtual: 91.0, metaPlanejada: 92.5, metaFinal: 95.0 },
  { mes: 'Jul', anoAnterior: 90.5, anoAtual: 92.1, metaPlanejada: 93.0, metaFinal: 95.0 },
  { mes: 'Ago', anoAnterior: 91.0, anoAtual: 91.9, metaPlanejada: 93.5, metaFinal: 95.0 },
  { mes: 'Set', anoAnterior: 91.2, anoAtual: null, metaPlanejada: 94.0, metaFinal: 95.0 },
  { mes: 'Out', anoAnterior: 91.5, anoAtual: null, metaPlanejada: 94.3, metaFinal: 95.0 },
  { mes: 'Nov', anoAnterior: 91.8, anoAtual: null, metaPlanejada: 94.8, metaFinal: 95.0 },
  { mes: 'Dez', anoAnterior: 91.9, anoAtual: null, metaPlanejada: 95.0, metaFinal: 95.0 }
];

const METRIC_PRESETS: Record<string, { name: string; unit: string; data: YoYDataItem[] }> = {
  frequencia: {
    name: 'Frequência Escolar Média (%)',
    unit: '%',
    data: SAMPLE_FREQUENCIA_DATA
  },
  alfabetizacao: {
    name: 'Taxa de Alunos Alfabetizados no 2º Ano (%)',
    unit: '%',
    data: [
      { mes: 'Jan', anoAnterior: 72.0, anoAtual: 76.5, metaPlanejada: 75.0, metaFinal: 85.0 },
      { mes: 'Fev', anoAnterior: 73.2, anoAtual: 78.0, metaPlanejada: 76.5, metaFinal: 85.0 },
      { mes: 'Mar', anoAnterior: 74.5, anoAtual: 79.4, metaPlanejada: 78.0, metaFinal: 85.0 },
      { mes: 'Abr', anoAnterior: 75.8, anoAtual: 81.0, metaPlanejada: 79.5, metaFinal: 85.0 },
      { mes: 'Mai', anoAnterior: 76.2, anoAtual: 82.3, metaPlanejada: 81.0, metaFinal: 85.0 },
      { mes: 'Jun', anoAnterior: 77.0, anoAtual: 83.5, metaPlanejada: 82.0, metaFinal: 85.0 },
      { mes: 'Jul', anoAnterior: 78.1, anoAtual: 84.1, metaPlanejada: 83.0, metaFinal: 85.0 },
      { mes: 'Ago', anoAnterior: 79.0, anoAtual: 84.8, metaPlanejada: 83.8, metaFinal: 85.0 },
      { mes: 'Set', anoAnterior: 79.8, anoAtual: null, metaPlanejada: 84.2, metaFinal: 85.0 },
      { mes: 'Out', anoAnterior: 80.5, anoAtual: null, metaPlanejada: 84.5, metaFinal: 85.0 },
      { mes: 'Nov', anoAnterior: 81.2, anoAtual: null, metaPlanejada: 84.8, metaFinal: 85.0 },
      { mes: 'Dez', anoAnterior: 82.0, anoAtual: null, metaPlanejada: 85.0, metaFinal: 85.0 }
    ]
  },
  aprendizado: {
    name: 'Proficiência Média em Língua Portuguesa & Matemática',
    unit: ' pts',
    data: [
      { mes: 'Jan', anoAnterior: 210.0, anoAtual: 218.4, metaPlanejada: 215.0, metaFinal: 235.0 },
      { mes: 'Fev', anoAnterior: 212.5, anoAtual: 220.1, metaPlanejada: 218.0, metaFinal: 235.0 },
      { mes: 'Mar', anoAnterior: 214.0, anoAtual: 222.8, metaPlanejada: 221.0, metaFinal: 235.0 },
      { mes: 'Abr', anoAnterior: 215.2, anoAtual: 224.5, metaPlanejada: 223.5, metaFinal: 235.0 },
      { mes: 'Mai', anoAnterior: 217.0, anoAtual: 226.2, metaPlanejada: 226.0, metaFinal: 235.0 },
      { mes: 'Jun', anoAnterior: 218.8, anoAtual: 228.0, metaPlanejada: 228.0, metaFinal: 235.0 },
      { mes: 'Jul', anoAnterior: 220.0, anoAtual: 229.4, metaPlanejada: 230.0, metaFinal: 235.0 },
      { mes: 'Ago', anoAnterior: 221.5, anoAtual: 230.1, metaPlanejada: 232.0, metaFinal: 235.0 },
      { mes: 'Set', anoAnterior: 222.8, anoAtual: null, metaPlanejada: 233.0, metaFinal: 235.0 },
      { mes: 'Out', anoAnterior: 224.0, anoAtual: null, metaPlanejada: 234.0, metaFinal: 235.0 },
      { mes: 'Nov', anoAnterior: 225.5, anoAtual: null, metaPlanejada: 234.5, metaFinal: 235.0 },
      { mes: 'Dez', anoAnterior: 226.0, anoAtual: null, metaPlanejada: 235.0, metaFinal: 235.0 }
    ]
  }
};

// Custom Tooltip Component complying strictly with dynamic year props
interface CustomTooltipContentProps extends TooltipProps<number, string> {
  anoBase: number;
  anoVigente: number;
  unit: string;
}

const CustomTooltip: React.FC<CustomTooltipContentProps> = ({
  active,
  payload,
  label,
  anoBase,
  anoVigente,
  unit
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const dataPoint = payload[0]?.payload as YoYDataItem | undefined;
  if (!dataPoint) return null;

  const metaFin = dataPoint.metaFinal ?? dataPoint.meta ?? 95.0;
  const planned = dataPoint.metaPlanejada;
  const curr = dataPoint.anoAtual;
  const varianceVsPlanned = curr !== null && planned !== undefined && planned !== null ? curr - planned : null;

  return (
    <div className="bg-[#0b1329]/95 border border-slate-700/80 backdrop-blur-md rounded-xl p-3.5 shadow-2xl text-xs space-y-2.5 min-w-[220px]">
      <div className="border-b border-slate-700/60 pb-1.5 flex items-center justify-between">
        <span className="font-black text-white text-sm tracking-wide">
          {label}
        </span>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
          Mês de Referência
        </span>
      </div>

      <div className="space-y-1.5 font-sans">
        {/* Realidade Passada (Ano Base) */}
        {dataPoint.anoAnterior !== null && (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#64748b] shrink-0"></span>
              <span className="text-slate-400 font-medium">{anoBase} (Passado):</span>
            </div>
            <span className="font-bold text-slate-300 font-mono">
              {dataPoint.anoAnterior.toFixed(1)}{unit}
            </span>
          </div>
        )}

        {/* Curva de Planejamento (Glide Path) */}
        {planned !== undefined && planned !== null && (
          <div className="flex items-center justify-between gap-3 bg-blue-950/30 p-1 rounded border border-blue-500/20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-0.5 bg-[#3b82f6] shrink-0"></span>
              <span className="text-blue-300 font-medium">Meta Planejada:</span>
            </div>
            <span className="font-bold text-blue-400 font-mono">
              {planned.toFixed(1)}{unit}
            </span>
          </div>
        )}

        {/* Realidade Presente (Ano Vigente) */}
        {curr !== null ? (
          <div className="flex items-center justify-between gap-3 bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-500/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shrink-0 animate-pulse"></span>
              <span className="text-emerald-300 font-bold">{anoVigente} (Realidade):</span>
            </div>
            <span className="font-black text-emerald-400 font-mono text-sm">
              {curr.toFixed(1)}{unit}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 text-slate-500 italic text-[11px] pt-0.5">
            <span>{anoVigente}:</span>
            <span>Sem dados (futuro)</span>
          </div>
        )}

        {/* Variance vs Planned */}
        {varianceVsPlanned !== null && (
          <div className="text-[10px] bg-slate-900/80 p-1.5 rounded border border-slate-800 flex items-center justify-between font-mono">
            <span className="text-slate-400">Desvio vs Planejado:</span>
            <span className={varianceVsPlanned >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {varianceVsPlanned >= 0 ? '+' : ''}{varianceVsPlanned.toFixed(1)} {unit}
              {varianceVsPlanned >= 0 ? ' (No trilho)' : ' (Abaixo)'}
            </span>
          </div>
        )}

        {/* Meta Final Estática */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-0.5 bg-amber-400 shrink-0"></span>
            <span className="text-amber-300 font-semibold">Alvo Final (Dez):</span>
          </div>
          <span className="font-bold text-amber-400 font-mono">
            {metaFin.toFixed(1)}{unit}
          </span>
        </div>
      </div>
    </div>
  );
};

export const YoYComparisonChart: React.FC<YoYComparisonChartProps> = ({
  data,
  anoBase = 2025,
  anoVigente = 2026,
  title = 'Evolução Mensal YoY (Sobreposição Ano a Ano com Curva de Planejamento)',
  subtitle = 'Painel de Inteligência Educativa — Comparativo do exercício anterior, planejamento ideal (Glide Path) e resultado vigente',
  unit = '%'
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('frequencia');
  const [customAnoBase, setCustomAnoBase] = useState<number>(anoBase);
  const [customAnoVigente, setCustomAnoVigente] = useState<number>(anoVigente);

  // Active dataset determination
  const activeDataset = data || METRIC_PRESETS[selectedPreset]?.data || SAMPLE_FREQUENCIA_DATA;
  const activeUnit = data ? unit : (METRIC_PRESETS[selectedPreset]?.unit || '%');

  const metaFinalValue = activeDataset.length > 0 ? (activeDataset[0].metaFinal ?? activeDataset[0].meta ?? 95.0) : 95.0;

  // Calculate latest valid item
  const latestValidItem = [...activeDataset].reverse().find((d) => d.anoAtual !== null);
  const currentVal = latestValidItem ? latestValidItem.anoAtual : null;
  const previousVal = latestValidItem ? latestValidItem.anoAnterior : null;
  const plannedVal = latestValidItem ? latestValidItem.metaPlanejada : null;
  
  const deltaYoY = currentVal !== null && previousVal !== null ? currentVal - previousVal : null;
  const deltaVsPlan = currentVal !== null && plannedVal !== undefined && plannedVal !== null ? currentVal - plannedVal : null;

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl space-y-4">
      {/* Top Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              YoY + Curva de Planejamento (Glide Path)
            </span>
            <span className="text-xs font-mono text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {customAnoBase} vs {customAnoVigente}
            </span>
          </div>
          <h3 className="text-lg font-black text-white tracking-wide">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>

        {/* Dynamic Year Controls & Metric Selector */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {!data && (
            <div className="flex items-center gap-1 bg-[#060b19] border border-slate-800 rounded-xl p-1">
              {Object.entries(METRIC_PRESETS).map(([key]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPreset(key)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    selectedPreset === key
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {key === 'frequencia' ? 'Frequência' : key === 'alfabetizacao' ? 'Alfabetização' : 'Aprendizado'}
                </button>
              ))}
            </div>
          )}

          {/* Year Selectors */}
          <div className="flex items-center gap-2 bg-[#060b19] border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-medium">Base:</span>
              <select
                value={customAnoBase}
                onChange={(e) => setCustomAnoBase(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 text-white font-mono font-bold rounded px-1.5 py-0.5 focus:outline-none focus:border-amber-500 cursor-pointer text-xs"
              >
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
            </div>

            <span className="text-slate-600 font-bold">vs</span>

            <div className="flex items-center gap-1">
              <span className="text-emerald-400 font-bold">Vigente:</span>
              <select
                value={customAnoVigente}
                onChange={(e) => setCustomAnoVigente(Number(e.target.value))}
                className="bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono font-bold rounded px-1.5 py-0.5 focus:outline-none focus:border-emerald-400 cursor-pointer text-xs"
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Quick Stats Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#060b19] border border-slate-800/80 rounded-xl p-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Ano Anterior ({customAnoBase})
          </span>
          <span className="text-base font-black text-slate-300 font-mono">
            {previousVal !== null ? `${previousVal.toFixed(1)}${activeUnit}` : 'N/A'}
          </span>
        </div>

        <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-3">
          <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">
            Planejado Mês ({latestValidItem?.mes || 'Atual'})
          </span>
          <span className="text-base font-black text-blue-400 font-mono">
            {plannedVal !== null && plannedVal !== undefined ? `${plannedVal.toFixed(1)}${activeUnit}` : 'N/A'}
          </span>
        </div>

        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3">
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
            Realidade ({customAnoVigente})
          </span>
          <span className="text-lg font-black text-emerald-400 font-mono">
            {currentVal !== null ? `${currentVal.toFixed(1)}${activeUnit}` : 'N/A'}
          </span>
        </div>

        <div className="bg-[#060b19] border border-slate-800/80 rounded-xl p-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Status vs. Planejamento
          </span>
          <span className={`text-base font-black font-mono ${deltaVsPlan !== null && deltaVsPlan >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {deltaVsPlan !== null ? `${deltaVsPlan >= 0 ? '+' : ''}${deltaVsPlan.toFixed(1)}${activeUnit}` : 'N/A'}
            {deltaVsPlan !== null && (
              <span className="text-[10px] font-sans font-normal ml-1">
                {deltaVsPlan >= 0 ? '(No trilho)' : '(Abaixo)'}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Recharts Main Chart Container */}
      <div className="w-full h-80 sm:h-96 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activeDataset} margin={{ top: 20, right: 35, left: -5, bottom: 5 }}>
            <CartesianGrid vertical={false} horizontal={true} stroke="#1e293b" strokeDasharray="3 3" />

            <XAxis
              dataKey="mes"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            />

            <YAxis
              domain={['auto', 'auto']}
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
              unit={activeUnit}
            />

            <Tooltip
              content={(props) => (
                <CustomTooltip
                  {...props}
                  anoBase={customAnoBase}
                  anoVigente={customAnoVigente}
                  unit={activeUnit}
                />
              )}
            />

            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
              formatter={(value: string) => {
                if (value === 'anoAnterior') {
                  return <span className="text-slate-400 font-semibold">{customAnoBase} (Passado)</span>;
                }
                if (value === 'metaPlanejada') {
                  return <span className="text-blue-400 font-bold">Curva de Planejamento (Glide Path)</span>;
                }
                if (value === 'anoAtual') {
                  return <span className="text-emerald-400 font-bold">{customAnoVigente} (Realidade)</span>;
                }
                return value;
              }}
            />

            {/* Reference Line for Meta Final */}
            <ReferenceLine
              y={metaFinalValue}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              strokeWidth={1.5}
              label={{
                value: `Alvo Final: ${metaFinalValue.toFixed(1)}${activeUnit}`,
                fill: '#f59e0b',
                fontSize: 11,
                fontWeight: 700,
                position: 'top'
              }}
            />

            {/* Line 1: Ano Anterior (anoAnterior) - Neutral slate line */}
            <Line
              type="monotone"
              dataKey="anoAnterior"
              name="anoAnterior"
              stroke="#64748b"
              strokeWidth={1.5}
              dot={{ fill: '#64748b', r: 3 }}
              activeDot={{ r: 5, fill: '#cbd5e1', stroke: '#0f172a', strokeWidth: 2 }}
            />

            {/* Line 2: Meta Planejada (metaPlanejada) - Blue dashed line (Glide Path) */}
            <Line
              type="monotone"
              dataKey="metaPlanejada"
              name="metaPlanejada"
              stroke="#3b82f6"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: '#60a5fa', stroke: '#1e3a8a', strokeWidth: 2 }}
            />

            {/* Line 3: Ano Atual (anoAtual) - Emerald continuous thick line */}
            <Line
              type="monotone"
              dataKey="anoAtual"
              name="anoAtual"
              stroke="#10b981"
              strokeWidth={3}
              connectNulls={false}
              dot={{ fill: '#10b981', r: 5 }}
              activeDot={{ r: 7, fill: '#34d399', stroke: '#064e3b', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 bg-[#060b19] border border-slate-800 rounded-xl p-3 gap-2">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            A curva azul tracejada representa o <strong>Planejamento Ideal (Glide Path)</strong>. A linha sólida verde acompanha a realidade executada em <strong>{customAnoVigente}</strong>.
          </span>
        </div>
        <div className="font-mono text-slate-300 text-[11px] shrink-0">
          Recharts <code>connectNulls={'{false}'}</code> | 100% Responsivo
        </div>
      </div>
    </div>
  );
};
