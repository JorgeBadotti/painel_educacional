import React, { useState } from 'react';
import { EducationResourceProgram, RadarSummaryMetrics } from '../../types/radar';
import {
  Sparkles,
  Bot,
  AlertTriangle,
  FileSearch,
  CheckCircle2,
  RefreshCw,
  Zap,
  Info,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface Props {
  programs: EducationResourceProgram[];
  metrics: RadarSummaryMetrics;
  onNavigateToProgram?: (programId: string) => void;
}

export const RadarAiAnalysis: React.FC<Props> = ({ programs, metrics, onNavigateToProgram }) => {
  const [customAiAdvice, setCustomAiAdvice] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Compute dynamic statements based on actual data as requested by prompt
  const urgentPrograms = programs.filter((p) => p.daysToDeadline <= 15 && p.eligibilityStatus !== 'encerrado');
  const fullTimeProgram = programs.find((p) => p.program.toLowerCase().includes('tempo integral'));
  const docPendingPrograms = programs.filter((p) => p.eligibilityStatus === 'pendente' || p.checklist.some((c) => !c.uploaded));
  const highRiskPrograms = programs.filter((p) => p.risk === 'Alto' || p.risk === 'Crítico');

  const generatedBulletPoints = [
    {
      id: 'stmt-prazos',
      icon: <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />,
      text: `O município possui ${urgentPrograms.length} programas com prazo de vencimento inferior a 15 dias (destaque para ${urgentPrograms.map(p => p.program).join(', ') || 'nenhum'}).`,
      badge: `${urgentPrograms.length} urgentes`,
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-800'
    },
    {
      id: 'stmt-integral',
      icon: <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />,
      text: fullTimeProgram
        ? `Existe uma oportunidade estratégica prioritária de R$ ${new Intl.NumberFormat('pt-BR').format(fullTimeProgram.estimatedValue)} relacionada ao ${fullTimeProgram.program}, que aguarda assinatura do Decreto Municipal.`
        : 'Existe uma oportunidade relacionada ao Programa Escola em Tempo Integral com alto valor potencial de investimento.',
      badge: 'Oportunidade de Ouro',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800'
    },
    {
      id: 'stmt-docs',
      icon: <FileSearch className="w-4 h-4 text-orange-400 shrink-0" />,
      text: `Foram identificadas pendências documentais em ${docPendingPrograms.length} programas que demandam regularização com certidões ou aprovações de conselhos.`,
      badge: `${docPendingPrograms.length} com pendências`,
      badgeColor: 'bg-orange-950 text-orange-300 border-orange-800'
    },
    {
      id: 'stmt-iar',
      icon: <Zap className="w-4 h-4 text-emerald-400 shrink-0" />,
      text: `O Índice de Aproveitamento de Recursos (IAR) do município está em ${metrics.iarIndex}/100. A regularização dos programas em risco pode elevar o IAR para ${Math.min(100, metrics.iarIndex + 14)} pontos.`,
      badge: `IAR: ${metrics.iarIndex}/100`,
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800'
    }
  ];

  // Calls the backend, which holds GEMINI_API_KEY and runs the Gemini
  // synthesis server-side (see POST /api/radar-analysis in server.ts) —
  // the key never reaches the browser.
  const handleGenerateCustomAdvice = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/radar-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programs, metrics }),
      });

      if (!res.ok) {
        throw new Error(`Falha na análise (HTTP ${res.status})`);
      }

      const data = await res.json();
      setCustomAiAdvice(data.text || 'Análise gerada com sucesso.');
    } catch (err) {
      console.warn('Radar analysis API call failed, using fallback:', err);
      setCustomAiAdvice(buildSimulatedAdvice());
    } finally {
      setIsGenerating(false);
    }
  };

  // Simulated advice used when the backend call fails (e.g. GEMINI_API_KEY
  // not configured on the server), computed from the same real data as the
  // bullets above so it never contradicts what's shown on screen.
  const buildSimulatedAdvice = () => {
    const projectedIar = Math.min(100, metrics.iarIndex + 14);
    const formattedValue = fullTimeProgram
      ? `R$ ${new Intl.NumberFormat('pt-BR').format(fullTimeProgram.estimatedValue)}`
      : 'valor estimado a confirmar';

    return `PARECER ESTRATÉGICO (SIMULADO - configure GEMINI_API_KEY no servidor para gerar com IA real):\n\n1. AÇÃO IMEDIATA: ${
      fullTimeProgram
        ? `Publicar o Decreto Municipal do ${fullTimeProgram.program} para destravar o repasse de ${formattedValue}.`
        : 'Priorizar a regularização dos programas com prazo mais próximo do vencimento.'
    }\n2. SANEAMENTO DOCUMENTAL: Regularizar as pendências em ${docPendingPrograms.length} programa(s) identificados no diagnóstico acima.\n3. IMPACTO NO IAR: A regularização dos programas em risco pode elevar o Índice de Aproveitamento de Recursos de ${metrics.iarIndex} para ${projectedIar} pontos.`;
  };

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
            <div className="w-full h-full bg-[#060b19] rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              Análise Inteligente
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold">
                IA Copilot Financeiro
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Diagnóstico autogerado em tempo real com identificação proativa de riscos, prazos e gargalos orçamentários.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateCustomAdvice}
          disabled={isGenerating}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Analisando...' : 'Gerar Parecer Estratégico com IA'}</span>
        </button>
      </div>

      {/* Generated Bullet Insights Requested in Prompt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {generatedBulletPoints.map((item) => (
          <div
            key={item.id}
            className="bg-[#060b19] border border-slate-800 rounded-xl p-4 flex items-start gap-3 hover:border-amber-500/40 transition group"
          >
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-700/80 group-hover:bg-amber-500/10 transition">
              {item.icon}
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2 py-0.2 rounded text-[10px] font-bold border uppercase tracking-wider ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Autodiagnóstico</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Custom Advice Block if generated */}
      {customAiAdvice && (
        <div className="bg-gradient-to-br from-[#08122d] to-[#0d1d45] border-2 border-amber-500/50 rounded-xl p-4 sm:p-5 space-y-3 animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
            <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 font-mono">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              Parecer Executivo Síntese - Inteligência Educacional
            </span>
            <button
              onClick={() => setCustomAiAdvice(null)}
              className="text-slate-400 hover:text-white text-xs"
            >
              × Fechar
            </button>
          </div>
          <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans bg-[#040814]/80 p-3.5 rounded-lg border border-slate-800 font-mono">
            {customAiAdvice}
          </div>
        </div>
      )}

      {/* Mandatory Disclaimer explicitly required in prompt */}
      <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5 text-amber-200/90 text-xs leading-relaxed">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-amber-300">Aviso Legal de Estimativa:</strong> "As informações apresentadas são estimativas para apoiar a gestão e dependem do atendimento aos requisitos dos programas."
        </div>
      </div>
    </div>
  );
};
