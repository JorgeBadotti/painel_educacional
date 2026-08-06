import React, { useState } from 'react';
import { SimulationParameters } from '../../types/radar';
import {
  Sliders,
  TrendingUp,
  DollarSign,
  Info,
  Users,
  Award,
  GraduationCap,
  CalendarCheck,
  RefreshCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const RadarSimulator: React.FC = () => {
  const [sim, setSim] = useState<SimulationParameters>({
    enrollmentIncreasePercent: 10,
    dropoutReductionPercent: 3,
    fullTimeStudentsCount: 300,
    attendanceRatePercent: 92,
  });

  const baseEnrollment = 14500; // Base municipal students
  const baseFundebVaat = 1250000;
  const basePnae = 620000;
  const baseTempoIntegral = 850000;
  const basePnate = 190000;

  // Recalculate projections dynamically based on parameters
  // 1. Enrollment impact on Fundeb & PNAE (+ R$ 110 per student)
  const additionalStudents = Math.round(baseEnrollment * (sim.enrollmentIncreasePercent / 100));
  const fundebDelta = additionalStudents * 120;
  const pnaeDelta = additionalStudents * 45;

  // 2. Dropout reduction impact (+ R$ 80 per retained student)
  const retainedStudents = Math.round((baseEnrollment * (sim.dropoutReductionPercent / 100)));
  const retentionDelta = retainedStudents * 80;

  // 3. Full-time expansion (+ R$ 2.800 per full-time student in Escola em Tempo Integral)
  const tempoIntegralDelta = sim.fullTimeStudentsCount * 2800;

  // 4. Attendance rate impact (over 90% unlocks bonus PNAE/MEC tier)
  const attendanceBonus = sim.attendanceRatePercent >= 90 ? 75000 : 0;

  const totalCurrentRevenue = baseFundebVaat + basePnae + baseTempoIntegral + basePnate;
  const totalProjectedDelta = fundebDelta + pnaeDelta + retentionDelta + tempoIntegralDelta + attendanceBonus;
  const totalProjectedRevenue = totalCurrentRevenue + totalProjectedDelta;

  const chartData = [
    { name: 'Fundeb (VAAT)', Atual: baseFundebVaat, Projetado: baseFundebVaat + fundebDelta },
    { name: 'PNAE (Alimentação)', Atual: basePnae, Projetado: basePnae + pnaeDelta + attendanceBonus },
    { name: 'Escola Tempo Integral', Atual: baseTempoIntegral, Projetado: baseTempoIntegral + tempoIntegralDelta },
    { name: 'Evasão Retida / Outros', Atual: basePnate, Projetado: basePnate + retentionDelta },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const handleReset = () => {
    setSim({
      enrollmentIncreasePercent: 0,
      dropoutReductionPercent: 0,
      fullTimeStudentsCount: 0,
      attendanceRatePercent: 85,
    });
  };

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
            Simulador de Impacto Orçamentário e Receitas
            <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded text-[10px] font-bold">
              Projeções Financeiras
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ajuste os cenários operacionais da Secretaria para calcular a projeção do incremento de receitas do Fundeb, PNAE e Tempo Integral.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Resetar Cenários</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sliders Control Panel */}
        <div className="lg:col-span-5 space-y-4 bg-[#060b19] p-4.5 rounded-xl border border-slate-800">
          <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            Parâmetros de Simulação
          </h4>

          {/* 1. Se aumentarmos matrículas */}
          <div className="space-y-1.5 bg-[#0b1329] p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                Se aumentarmos matrículas (+%)
              </span>
              <span className="text-amber-400 font-mono font-bold">
                +{sim.enrollmentIncreasePercent}% (+{additionalStudents} alunos)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={sim.enrollmentIncreasePercent}
              onChange={(e) => setSim({ ...sim, enrollmentIncreasePercent: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0%</span>
              <span>+10%</span>
              <span>+25%</span>
            </div>
          </div>

          {/* 2. Se reduzirmos evasão */}
          <div className="space-y-1.5 bg-[#0b1329] p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-200 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                Se reduzirmos evasão escolar (%)
              </span>
              <span className="text-emerald-400 font-mono font-bold">
                -{sim.dropoutReductionPercent}% ({retainedStudents} retidos)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={sim.dropoutReductionPercent}
              onChange={(e) => setSim({ ...sim, dropoutReductionPercent: parseFloat(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0%</span>
              <span>-5%</span>
              <span>-10%</span>
            </div>
          </div>

          {/* 3. Se implantarmos escola integral */}
          <div className="space-y-1.5 bg-[#0b1329] p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Se implantarmos escola integral (alunos)
              </span>
              <span className="text-amber-300 font-mono font-bold">
                {sim.fullTimeStudentsCount} novas vagas
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={sim.fullTimeStudentsCount}
              onChange={(e) => setSim({ ...sim, fullTimeStudentsCount: parseInt(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 vagas</span>
              <span>500 vagas</span>
              <span>1000 vagas</span>
            </div>
          </div>

          {/* 4. Se aumentarmos frequência */}
          <div className="space-y-1.5 bg-[#0b1329] p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-200 flex items-center gap-1.5">
                <CalendarCheck className="w-3.5 h-3.5 text-indigo-400" />
                Se aumentarmos frequência escolar (%)
              </span>
              <span className="text-indigo-300 font-mono font-bold">
                {sim.attendanceRatePercent}% média
              </span>
            </div>
            <input
              type="range"
              min="75"
              max="98"
              step="1"
              value={sim.attendanceRatePercent}
              onChange={(e) => setSim({ ...sim, attendanceRatePercent: parseInt(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>75%</span>
              <span>90% (Bonus MEC)</span>
              <span>98%</span>
            </div>
          </div>
        </div>

        {/* Projection Outputs & Visual Comparison */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#060b19] border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Receita Base Atual</span>
              <span className="text-xl font-black text-slate-200 font-mono">
                {formatCurrency(totalCurrentRevenue)}
              </span>
            </div>

            <div className="bg-[#060b19] border border-emerald-900/50 p-3.5 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-400 uppercase block">Acréscimo Projetado</span>
              <span className="text-xl font-black text-emerald-400 font-mono flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +{formatCurrency(totalProjectedDelta)}
              </span>
            </div>

            <div className="bg-[#060b19] border border-amber-500/40 p-3.5 rounded-xl">
              <span className="text-[10px] font-bold text-amber-400 uppercase block">Receita Potencial Total</span>
              <span className="text-xl font-black text-amber-300 font-mono">
                {formatCurrency(totalProjectedRevenue)}
              </span>
            </div>
          </div>

          {/* Bar Chart comparing Current vs Projected */}
          <div className="bg-[#060b19] p-4 rounded-xl border border-slate-800 space-y-2">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Comparativo de Repasses (Atual vs. Projeção Simulada)
            </h5>
            <div className="h-[220px] w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#081026', borderColor: '#f59e0b', borderRadius: '8px' }}
                    formatter={(val: any) => formatCurrency(Number(val))}
                  />
                  <Bar dataKey="Atual" fill="#475569" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Projetado" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Disclaimer required by prompt */}
          <div className="bg-sky-950/30 border border-sky-500/30 rounded-xl p-3 flex items-start gap-2.5 text-sky-200 text-xs leading-relaxed">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong>Nota sobre Projeções:</strong> As projeções apresentadas são cálculos matemáticos pautados nas regras de repasse do Fundeb, PNAE e MEC para apoio à decisão. Elas deixam claro que <strong className="text-white">não constituem garantia legal de transferência de recursos</strong> e dependem da pactuação e homologação dos dados nos órgãos oficiais.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
