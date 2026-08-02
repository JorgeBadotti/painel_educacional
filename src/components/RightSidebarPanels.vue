<template>
  <aside class="space-y-5">
    
    <!-- META PRINCIPAL A PERSEGUIR -->
    <div v-if="mainGoal" class="bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 rounded-xl p-4 shadow-xl relative overflow-hidden">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1">
          <Target class="w-3.5 h-3.5" />
          {{ mainGoal.title }}
        </span>
        <span class="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/20">
          Até {{ mainGoal.targetYear }}
        </span>
      </div>

      <div class="my-3 flex items-baseline justify-between">
        <div>
          <span class="text-3xl font-black text-white tracking-tight">{{ mainGoal.currentValue }}</span>
          <span class="text-xs text-slate-400 font-medium ml-1">/ {{ mainGoal.targetValue }} {{ mainGoal.targetUnit }}</span>
        </div>
        <span class="text-xs font-bold text-amber-400 italic">"{{ mainGoal.motto }}"</span>
      </div>

      <div class="w-full bg-slate-950/80 rounded-full h-2.5 overflow-hidden border border-slate-800">
        <div
          class="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 rounded-full transition-all duration-700"
          :style="{ width: `${(mainGoal.currentValue / mainGoal.targetValue) * 100}%` }"
        ></div>
      </div>
      <p class="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
        {{ mainGoal.description }}
      </p>
    </div>

    <!-- CENTRAL DE ALERTAS -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <div class="flex items-center gap-2">
          <AlertOctagon class="w-4 h-4 text-rose-400" />
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">
            Central de Alertas Críticos
          </h3>
        </div>
        <span class="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold border border-rose-500/20">
          {{ activeAlertsCount }} Ativos
        </span>
      </div>

      <div class="space-y-2.5 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        <div
          v-for="alert in alerts"
          :key="alert.alertId"
          class="p-3 rounded-lg border transition-all"
          :class="[
            alert.resolved
              ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
              : alert.severity === 'high'
                ? 'bg-rose-950/30 border-rose-500/30 text-rose-100'
                : 'bg-amber-950/30 border-amber-500/30 text-amber-100'
          ]"
        >
          <div class="flex items-start justify-between gap-2">
            <h4 class="text-xs font-bold leading-snug" :class="{ 'line-through text-slate-500': alert.resolved }">
              {{ alert.title }}
            </h4>
            <span v-if="!alert.resolved" class="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase shrink-0"
              :class="alert.severity === 'high' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'"
            >
              {{ alert.severity === 'high' ? 'Alta' : 'Média' }}
            </span>
          </div>

          <p class="text-[11px] text-slate-400 my-1 leading-normal">
            {{ alert.description }}
          </p>

          <div class="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/40 text-[10px]">
            <span class="text-slate-500 font-medium">{{ alert.schoolName }}</span>
            <button
              v-if="!alert.resolved"
              @click="resolveAlert(alert.alertId)"
              class="px-2 py-0.5 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white rounded text-[10px] font-semibold transition-all"
            >
              Marcar Resolvido
            </button>
            <span v-else class="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle class="w-3 h-3" /> Resolvido
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- DESTAQUES DO MÊS -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
        <Zap class="w-4 h-4 text-amber-400" />
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">
          Destaques & Boas Práticas
        </h3>
      </div>

      <div class="space-y-2.5">
        <div
          v-for="hl in highlights"
          :key="hl.highlightId"
          class="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all"
        >
          <div class="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
            <TrendingUp class="w-3.5 h-3.5 text-emerald-400" />
            <span>{{ hl.title }}</span>
          </div>
          <p class="text-[11px] text-slate-400 leading-normal">
            {{ hl.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- AÇÕES RÁPIDAS -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 pb-2 border-b border-slate-800">
        Ações Rápidas de Gestão
      </h3>

      <div class="grid grid-cols-2 gap-2">
        <button
          @click="activeTab = 'planos_acao'"
          class="p-2.5 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 rounded-lg text-left transition-all group"
        >
          <PlusCircle class="w-4 h-4 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
          <div class="text-xs font-bold text-blue-200">Novo Plano</div>
          <div class="text-[10px] text-slate-400">Criar plano de ação</div>
        </button>

        <button
          @click="exportPdfReport"
          class="p-2.5 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 rounded-lg text-left transition-all group"
        >
          <FileText class="w-4 h-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
          <div class="text-xs font-bold text-amber-200">Relatório PDF</div>
          <div class="text-[10px] text-slate-400">Exportar executivo</div>
        </button>
      </div>
    </div>

  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Target,
  AlertOctagon,
  CheckCircle,
  Zap,
  TrendingUp,
  PlusCircle,
  FileText
} from 'lucide-vue-next';
import { useCockpit } from '../composables/useCockpit';
import jsPDF from 'jspdf';

const {
  mainGoal,
  alerts,
  highlights,
  indicators,
  resolveAlert,
  activeTab
} = useCockpit();

const activeAlertsCount = computed(() => alerts.value.filter((a) => !a.resolved).length);

const exportPdfReport = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("PAINEL DE INTELIGÊNCIA EDUCACIONAL", 14, 20);
  doc.setFontSize(10);
  doc.text("Relatório Executivo de Desempenho e Indicadores", 14, 28);
  doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, 14, 34);

  let y = 45;
  doc.setFontSize(12);
  doc.text("Resumo dos Principais Indicadores:", 14, y);
  y += 8;

  indicators.value.slice(0, 8).forEach((ind, i) => {
    doc.setFontSize(10);
    doc.text(`${i + 1}. ${ind.name}: ${ind.currentValue} ${ind.unit} (Meta: ${ind.annualTarget} ${ind.unit})`, 14, y);
    y += 6;
  });

  doc.save("Relatorio_Inteligencia_Educacional.pdf");
};
</script>
