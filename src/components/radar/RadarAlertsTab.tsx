import React from 'react';
import {
  AlertTriangle,
  Clock,
  FileSearch,
  Sparkles,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Bell,
  ArrowRight
} from 'lucide-react';
import { EducationResourceProgram } from '../../types/radar';

interface Props {
  programs: EducationResourceProgram[];
  onGenerateActionPlan: (program: EducationResourceProgram) => void;
}

export const RadarAlertsTab: React.FC<Props> = ({ programs, onGenerateActionPlan }) => {
  // Generate notification items based on programs state
  const alertsList = [
    {
      id: 'alt-1',
      type: 'Prazo próximo',
      icon: <Clock className="w-4 h-4 text-rose-400" />,
      title: 'Prazo de Vencimento do Programa Escola em Tempo Integral',
      description: 'Restam apenas 10 dias para envio do Decreto Municipal assinado no SIMEC. Risco de perda de R$ 850.000,00.',
      severity: 'alta',
      programId: 'prog-escola-integral'
    },
    {
      id: 'alt-2',
      type: 'Documentação pendente',
      icon: <FileSearch className="w-4 h-4 text-orange-400" />,
      title: 'Pendente Certidão de Matrícula do Terreno - PAR Creche',
      description: 'Construção da Creche Bairro Novo (R$ 980 mil) aguarda certidão de imóvel atualizada.',
      severity: 'media',
      programId: 'prog-par-4ciclo'
    },
    {
      id: 'alt-3',
      type: 'Prestação de contas',
      icon: <AlertCircle className="w-4 h-4 text-amber-400" />,
      title: 'Prestação de Contas SIGPC Pendente em 2 Escolas',
      description: 'PDDE Básico retido parcialmente para EMEB Paulo Freire e EMEB Anísio Teixeira.',
      severity: 'alta',
      programId: 'prog-pdde-basico'
    },
    {
      id: 'alt-4',
      type: 'Indicador crítico',
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
      title: 'Falta de Tutores Pedagógicos - Brasil na Escola',
      description: 'Programa em risco crítico de cancelamento por ausência de cadastro de tutores no sistema.',
      severity: 'alta',
      programId: 'prog-brasil-na-escola'
    },
    {
      id: 'alt-5',
      type: 'Nova oportunidade',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      title: 'Aviso de Abertura: Robótica PNED 2025',
      description: 'Novos recursos abertos para aquisição de laboratórios de robótica (R$ 450 mil).',
      severity: 'baixa',
      programId: 'prog-educacao-digital-pned'
    }
  ];

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
            Central de Alertas Financeiros
            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-[10px] font-bold">
              {alertsList.length} Notificações Ativas
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Notificações automáticas configuradas para prazos, pendências documentais e exigências de prestação de contas dos repasses.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {alertsList.map((item) => {
          const matchingProg = programs.find((p) => p.id === item.programId);

          return (
            <div
              key={item.id}
              className="bg-[#060b19] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-500/40 transition"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700 shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.2 rounded text-[10px] font-black uppercase tracking-wider ${
                        item.severity === 'alta'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : item.severity === 'media'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">ID: {item.id}</span>
                  </div>

                  <h4 className="font-bold text-sm text-white mt-1">{item.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{item.description}</p>
                </div>
              </div>

              {matchingProg && (
                <button
                  onClick={() => onGenerateActionPlan(matchingProg)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg shadow transition flex items-center gap-1.5 shrink-0"
                >
                  <span>Resolver com Plano de Ação</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
