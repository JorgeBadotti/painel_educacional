import React, { useState } from 'react';
import {
  Building2,
  Trophy,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Plus,
  Trash2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useCockpit } from '../context/CockpitContext';
import { School } from '../types';

export const SchoolComparisonView: React.FC = () => {
  const { schools } = useCockpit();

  const [selectedSchoolIds, setSelectedSchoolIds] = useState<string[]>([
    schools[0]?.id || 'sch-1',
    schools[2]?.id || 'sch-3',
  ]);

  const [sortField, setSortField] = useState<'ideb' | 'frequencia' | 'taxaAprovacao' | 'alfabetizacao'>('ideb');

  const selectedSchools = schools.filter((s) => selectedSchoolIds.includes(s.id));

  const handleAddSchool = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (id && !selectedSchoolIds.includes(id) && selectedSchoolIds.length < 4) {
      setSelectedSchoolIds([...selectedSchoolIds, id]);
    }
  };

  const handleRemoveSchool = (id: string) => {
    if (selectedSchoolIds.length > 1) {
      setSelectedSchoolIds(selectedSchoolIds.filter((sId) => sId !== id));
    }
  };

  // Ranking list sorted
  const rankedSchools = [...schools].sort((a, b) => b[sortField] - a[sortField]);

  // Chart data for selected schools
  const compareChartData = [
    {
      metric: 'IDEB',
      ...Object.fromEntries(selectedSchools.map((s) => [s.name, s.ideb])),
    },
    {
      metric: 'Frequência (%)',
      ...Object.fromEntries(selectedSchools.map((s) => [s.name, s.frequencia])),
    },
    {
      metric: 'Alfabetização (%)',
      ...Object.fromEntries(selectedSchools.map((s) => [s.name, s.alfabetizacao])),
    },
    {
      metric: 'Aprovação (%)',
      ...Object.fromEntries(selectedSchools.map((s) => [s.name, s.taxaAprovacao])),
    },
  ];

  const barColors = ['#f59e0b', '#38bdf8', '#10b981', '#a855f7'];

  return (
    <div className="space-y-6 text-white">
      {/* 1. COMPARATIVO LADO A LADO */}
      <div className="bg-[#0b132a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              COMPARATIVO LADO A LADO ENTRE UNIDADES ESCOLARES
            </h2>
            <p className="text-xs text-slate-400">Selecione até 4 escolas para analisar lado a lado</p>
          </div>

          {/* Add School Selector */}
          {selectedSchoolIds.length < 4 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">Adicionar Escola:</span>
              <select
                onChange={handleAddSchool}
                defaultValue=""
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="" disabled>Escolha uma escola...</option>
                {schools
                  .filter((s) => !selectedSchoolIds.includes(s.id))
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {/* Selected School Scorecard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {selectedSchools.map((sch, idx) => (
            <div
              key={sch.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 relative group"
            >
              {selectedSchoolIds.length > 1 && (
                <button
                  onClick={() => handleRemoveSchool(sch.id)}
                  className="absolute top-3 right-3 p-1 text-slate-500 hover:text-rose-400 transition"
                  title="Remover da comparação"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: barColors[idx % barColors.length] }}
                ></span>
                <div>
                  <h3 className="font-bold text-xs text-slate-100 leading-tight pr-6">{sch.name}</h3>
                  <p className="text-[10px] text-slate-400">Região {sch.region}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">IDEB:</span>
                  <strong className="text-amber-300 font-bold">{sch.ideb}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Frequência:</span>
                  <strong className="text-sky-300 font-bold">{sch.frequencia}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Alfabetização:</span>
                  <strong className="text-emerald-300 font-bold">{sch.alfabetizacao}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Taxa de Aprovação:</span>
                  <strong className="text-slate-200 font-bold">{sch.taxaAprovacao}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Taxa de Abandono:</span>
                  <strong className={sch.taxaAbandono > 4 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                    {sch.taxaAbandono}%
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Alunos em Risco:</span>
                  <strong className={sch.alunosEmRisco > 30 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                    {sch.alunosEmRisco}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparative Chart */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            Visualização Gráfica Comparativa
          </h3>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="metric" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Legend />
                {selectedSchools.map((sch, idx) => (
                  <Bar
                    key={sch.id}
                    dataKey={sch.name}
                    fill={barColors[idx % barColors.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2. RANKING GERAL DAS ESCOLAS */}
      <div className="bg-[#0b132a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
              RANKING MUNICIPAL DAS ESCOLAS
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold">Ordenar por:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-amber-300 font-bold text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="ideb">IDEB</option>
              <option value="frequencia">Frequência Escolar</option>
              <option value="alfabetizacao">Alfabetização (2º Ano)</option>
              <option value="taxaAprovacao">Taxa de Aprovação</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 bg-slate-900/60">
                <th className="py-2.5 px-3"># Pos.</th>
                <th className="py-2.5 px-3">Escola</th>
                <th className="py-2.5 px-3 text-center">Região</th>
                <th className="py-2.5 px-3 text-center">IDEB</th>
                <th className="py-2.5 px-3 text-center">Frequência</th>
                <th className="py-2.5 px-3 text-center">Alfabetização</th>
                <th className="py-2.5 px-3 text-center">Aprovação</th>
                <th className="py-2.5 px-3 text-center">Alunos em Risco</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rankedSchools.map((sch, index) => (
                <tr key={sch.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-300">
                    {index === 0 && <span className="text-amber-400">🥇 1º</span>}
                    {index === 1 && <span className="text-slate-300">🥈 2º</span>}
                    {index === 2 && <span className="text-amber-600">🥉 3º</span>}
                    {index > 2 && `${index + 1}º`}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-100">{sch.name}</td>
                  <td className="py-3 px-3 text-center text-slate-400">{sch.region}</td>
                  <td className="py-3 px-3 text-center font-bold text-amber-300">{sch.ideb}</td>
                  <td className="py-3 px-3 text-center font-bold text-sky-300">{sch.frequencia}%</td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-300">{sch.alfabetizacao}%</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-200">{sch.taxaAprovacao}%</td>
                  <td className="py-3 px-3 text-center font-bold text-rose-400">{sch.alunosEmRisco}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        sch.status === 'destaque'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : sch.status === 'atencao'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {sch.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
