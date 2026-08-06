import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  Tooltip,
  TooltipProps
} from 'recharts';

export interface YoYSparklineDataItem {
  mes: string;
  anoAnterior: number | null;
  anoAtual: number | null;
  metaPlanejada?: number | null;
  metaFinal?: number;
  meta?: number;
}

export interface YoYSparklineProps {
  data?: YoYSparklineDataItem[];
  anoBase?: number;
  anoVigente?: number;
  height?: number;
  unit?: string;
  showLabels?: boolean;
}

// Default payload requested in prompt
const DEFAULT_SPARKLINE_DATA: YoYSparklineDataItem[] = [
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

// Compact custom Tooltip for table cell usage
interface SparklineTooltipContentProps extends TooltipProps<number, string> {
  anoBase: number;
  anoVigente: number;
  unit: string;
}

const SparklineTooltipContent: React.FC<SparklineTooltipContentProps> = ({
  active,
  payload,
  label,
  anoBase,
  anoVigente,
  unit
}) => {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0]?.payload as YoYSparklineDataItem | undefined;
  if (!point) return null;

  const planned = point.metaPlanejada;
  const curr = point.anoAtual;
  const metaFin = point.metaFinal ?? point.meta ?? 95.0;

  return (
    <div className="bg-[#0b1329] border border-slate-700/90 rounded-lg p-2 shadow-xl text-[11px] font-sans space-y-1 z-50 min-w-[145px]">
      <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between">
        <span>{point.mes}</span>
        <span className="text-[9px] text-slate-400 font-mono">YoY + Plan</span>
      </div>

      <div className="space-y-0.5">
        {/* Base Year */}
        {point.anoAnterior !== null && (
          <div className="flex items-center justify-between gap-2 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#64748b]" />
              <span>{anoBase}:</span>
            </span>
            <span className="font-mono font-bold text-slate-300">
              {point.anoAnterior.toFixed(1)}{unit}
            </span>
          </div>
        )}

        {/* Planned Line */}
        {planned !== undefined && planned !== null && (
          <div className="flex items-center justify-between gap-2 text-blue-300">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-0.5 bg-[#3b82f6]" />
              <span>Plano:</span>
            </span>
            <span className="font-mono font-bold text-blue-400">
              {planned.toFixed(1)}{unit}
            </span>
          </div>
        )}

        {/* Current Year */}
        {curr !== null ? (
          <div className="flex items-center justify-between gap-2 text-emerald-400 font-bold bg-emerald-950/50 px-1 py-0.5 rounded">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span>{anoVigente}:</span>
            </span>
            <span className="font-mono">
              {curr.toFixed(1)}{unit}
            </span>
          </div>
        ) : (
          <div className="text-[9px] text-slate-500 italic">
            {anoVigente}: Sem dados
          </div>
        )}

        {/* Target Meta */}
        <div className="flex items-center justify-between gap-2 text-amber-400 text-[10px] pt-0.5 border-t border-slate-800/80">
          <span>Alvo Final:</span>
          <span className="font-mono font-bold">{metaFin.toFixed(1)}{unit}</span>
        </div>
      </div>
    </div>
  );
};

export const YoYSparkline: React.FC<YoYSparklineProps> = ({
  data = DEFAULT_SPARKLINE_DATA,
  anoBase = 2025,
  anoVigente = 2026,
  height = 50,
  unit = '%',
  showLabels = false
}) => {
  const metaFinVal = data.length > 0 ? (data[0].metaFinal ?? data[0].meta ?? 95.0) : 95.0;

  return (
    <div className="w-full flex flex-col justify-center">
      {showLabels && (
        <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 mb-0.5 px-0.5">
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#64748b]"></span>
            {anoBase}
          </span>
          <span className="flex items-center gap-1 text-blue-400">
            <span className="w-1.5 h-0.5 bg-[#3b82f6]"></span>
            Plano
          </span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <span className="w-1 h-1 rounded-full bg-[#10b981]"></span>
            {anoVigente}
          </span>
        </div>
      )}

      <div className="w-full" style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
            <Tooltip
              content={(props) => (
                <SparklineTooltipContent
                  {...props}
                  anoBase={anoBase}
                  anoVigente={anoVigente}
                  unit={unit}
                />
              )}
            />

            {/* Target Meta Reference Line */}
            <ReferenceLine
              y={metaFinVal}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              strokeWidth={1}
            />

            {/* Line 1: Base Year (anoAnterior) */}
            <Line
              type="monotone"
              dataKey="anoAnterior"
              stroke="#64748b"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, fill: '#cbd5e1' }}
            />

            {/* Line 2: Meta Planejada (metaPlanejada - Glide Path) */}
            <Line
              type="monotone"
              dataKey="metaPlanejada"
              stroke="#3b82f6"
              strokeDasharray="4 4"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: '#60a5fa' }}
            />

            {/* Line 3: Current Year (anoAtual) - Stops when null */}
            <Line
              type="monotone"
              dataKey="anoAtual"
              stroke="#10b981"
              strokeWidth={2.5}
              connectNulls={false}
              dot={false}
              activeDot={{ r: 4, fill: '#34d399', stroke: '#064e3b', strokeWidth: 1.5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
