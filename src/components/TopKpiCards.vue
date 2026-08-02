<template>
  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
    <div
      v-for="card in topCards"
      :key="card.cardId"
      class="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md relative overflow-hidden group"
    >
      <!-- Top Card Header -->
      <div class="flex items-start justify-between gap-1 mb-2">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider line-clamp-1">
          {{ card.title }}
        </span>

        <!-- Card Specific Badge or Icon -->
        <span v-if="card.badgeType === 'gauge'" class="p-1 rounded bg-amber-500/10 text-amber-400">
          <Award class="w-3.5 h-3.5" />
        </span>
        <span v-else-if="card.cardId === 'card_escolas'" class="p-1 rounded bg-blue-500/10 text-blue-400">
          <SchoolIcon class="w-3.5 h-3.5" />
        </span>
        <span v-else-if="card.cardId === 'card_alunos_risco'" class="p-1 rounded bg-rose-500/10 text-rose-400">
          <AlertCircle class="w-3.5 h-3.5" />
        </span>
        <span v-else-if="card.cardId === 'card_frequencia'" class="p-1 rounded bg-emerald-500/10 text-emerald-400">
          <CalendarCheck class="w-3.5 h-3.5" />
        </span>
        <span v-else-if="card.cardId === 'card_aprovacao'" class="p-1 rounded bg-emerald-500/10 text-emerald-400">
          <CheckCircle class="w-3.5 h-3.5" />
        </span>
        <span v-else-if="card.cardId === 'card_professores'" class="p-1 rounded bg-indigo-500/10 text-indigo-400">
          <GraduationCap class="w-3.5 h-3.5" />
        </span>
        <span v-else-if="card.cardId === 'card_recursos'" class="p-1 rounded bg-amber-500/10 text-amber-400">
          <DollarSign class="w-3.5 h-3.5" />
        </span>
      </div>

      <!-- Main Metric Value & Subvalue -->
      <div class="flex items-baseline gap-1.5 my-1">
        <span class="text-2xl font-black text-slate-100 tracking-tight">
          {{ card.value }}
        </span>
        <span v-if="card.subvalue" class="text-xs font-semibold text-slate-400">
          {{ card.subvalue }}
        </span>
      </div>

      <!-- Trend or Detail breakdown -->
      <div v-if="card.trendText" class="mt-1 flex items-center gap-1 text-[11px] font-medium"
        :class="[
          card.trendText.includes('+') || card.trendText.includes('↑')
            ? 'text-emerald-400'
            : 'text-slate-400'
        ]"
      >
        <TrendingUp v-if="card.trendText.includes('+') || card.trendText.includes('↑')" class="w-3 h-3" />
        <span>{{ card.trendText }}</span>
      </div>

      <!-- Detail chips for schools card -->
      <div v-else-if="card.detail" class="mt-1 flex items-center gap-1.5 text-[10px]">
        <span class="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
          {{ card.detail.destaque }} Destaque
        </span>
        <span class="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">
          {{ card.detail.atencao }} Atenção
        </span>
        <span class="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold">
          {{ card.detail.critico }} Crítico
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Award,
  School as SchoolIcon,
  AlertCircle,
  CalendarCheck,
  CheckCircle,
  GraduationCap,
  DollarSign,
  TrendingUp
} from 'lucide-vue-next';
import { useCockpit } from '../composables/useCockpit';

const { topCards } = useCockpit();
</script>
