import React from 'react';
import { Code2, Database, ShieldCheck, CheckCircle2, Server, ArrowUpRight, Cpu } from 'lucide-react';

export const RadarApiIntegrationTab: React.FC = () => {
  const apiConnectors = [
    {
      name: 'MEC / SIMEC API',
      status: 'Aguardando Token OAuth',
      description: 'Sincronização de adesões, PAR 4º Ciclo e Pactuação do Programa Escola em Tempo Integral.',
      protocol: 'REST / JSON OAuth2',
      ping: '14ms',
      ready: true,
    },
    {
      name: 'FNDE / SIGPC e SIOPE',
      status: 'Conectado (Ambiente Homologação)',
      description: 'Consulta automática de inadimplência, repasses do PDDE, PNAE, PNATE e transmissão de investimentos.',
      protocol: 'SOAP / REST SIOPE',
      ping: '22ms',
      ready: true,
    },
    {
      name: 'Censo Escolar / INEP',
      status: 'Sincronizado (Educacenso 2024.2)',
      description: 'Importação automática das contagens oficiais de alunos por turma, etapa e tempo integral.',
      protocol: 'API REST Inep / Batch',
      ping: '8ms',
      ready: true,
    },
    {
      name: 'Transferegov.br',
      status: 'Pronto para Integração',
      description: 'Acompanhamento e prestação de contas de convênios federais e emendas parlamentares.',
      protocol: 'API Transferegov',
      ping: '19ms',
      ready: true,
    }
  ];

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
            Conectores & Preparação para APIs Oficiais
            <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded text-[10px] font-bold">
              MEC / FNDE / SIOPE
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Arquitetura preparada para integração nativa via webservices governamentais com validação automatizada de esquema JSON.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apiConnectors.map((c, i) => (
          <div key={i} className="bg-[#060b19] border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-sky-400" />
                {c.name}
              </span>
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px] font-mono font-bold">
                {c.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800">
              <span>Protocolo: {c.protocol}</span>
              <span>Latência: {c.ping}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
