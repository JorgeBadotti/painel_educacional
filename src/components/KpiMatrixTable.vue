<template>
  <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-4 lg:p-5 shadow-xl">
    
    <!-- Category Tabs Bar -->
    <div class="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-thin scrollbar-thumb-slate-700">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="selectedCategory = cat.id"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5"
        :class="[
          selectedCategory === cat.id
            ? 'bg-blue-600 border-blue-500 text-white shadow-md'
            : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        ]"
      >
        <span>{{ cat.label }}</span>
        <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-950/40 text-slate-300">
          {{ getCategoryCount(cat.id) }}
        </span>
      </button>
    </div>

    <!-- KPI Table Container -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <th class="py-3 px-3">Indicador Educacional</th>
            <th class="py-3 px-3">Status</th>
            <th class="py-3 px-3 text-right">Valor Atual</th>
            <th class="py-3 px-3 text-right">Meta Anual</th>
            <th class="py-3 px-3 text-right">Meta Excelência</th>
            <th class="py-3 px-3 min-w-[140px]">Atingimento da Meta</th>
            <th class="py-3 px-3 text-center">Tendência</th>
            <th class="py-3 px-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60 text-xs text-slate-200">
          <tr
            v-for="kpi in filteredIndicators"
            :key="kpi.indicatorId"
            class="hover:bg-slate-800/40 transition-colors group cursor-pointer"
            @click="openKpiModal(kpi)"
          >
            <!-- Indicator Name & Icon -->
            <td class="py-3 px-3">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg bg-slate-800 text-blue-400 border border-slate-700 group-hover:border-blue-500/50 transition-colors">
                  <Award v-if="kpi.icon === 'award'" class="w-4 h-4 text-amber-400" />
                  <BookOpen v-else-if="kpi.icon === 'book-open'" class="w-4 h-4 text-blue-400" />
                  <CalendarCheck v-else-if="kpi.icon === 'calendar-check'" class="w-4 h-4 text-emerald-400" />
                  <UserMinus v-else-if="kpi.icon === 'user-minus'" class="w-4 h-4 text-rose-400" />
                  <CheckCircle v-else-if="kpi.icon === 'check-circle'" class="w-4 h-4 text-emerald-400" />
                  <AlertTriangle v-else-if="kpi.icon === 'alert-triangle'" class="w-4 h-4 text-amber-400" />
                  <GraduationCap v-else-if="kpi.icon === 'graduation-cap'" class="w-4 h-4 text-indigo-400" />
                  <Laptop v-else-if="kpi.icon === 'laptop'" class="w-4 h-4 text-cyan-400" />
                  <DollarSign v-else-if="kpi.icon === 'dollar-sign'" class="w-4 h-4 text-emerald-400" />
                  <Activity v-else class="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div class="font-bold text-slate-100 group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
                    {{ kpi.name }}
                  </div>
                  <div v-if="kpi.subtitle" class="text-[11px] text-slate-400">
                    {{ kpi.subtitle }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Status Badge -->
            <td class="py-3 px-3">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                :class="getStatusClass(kpi.status)"
              >
                {{ getStatusLabel(kpi.status) }}
              </span>
            </td>

            <!-- Current Value -->
            <td class="py-3 px-3 text-right font-black text-sm text-slate-100">
              {{ kpi.currentValue }} <span class="text-[10px] font-normal text-slate-400">{{ kpi.unit }}</span>
            </td>

            <!-- Annual Target -->
            <td class="py-3 px-3 text-right font-semibold text-slate-300">
              {{ kpi.annualTarget }} <span class="text-[10px] font-normal text-slate-400">{{ kpi.unit }}</span>
            </td>

            <!-- Excellence Target -->
            <td class="py-3 px-3 text-right font-semibold text-amber-400">
              {{ kpi.excellenceTarget }} <span class="text-[10px] font-normal text-slate-400">{{ kpi.unit }}</span>
            </td>

            <!-- Target Progress Bar -->
            <td class="py-3 px-3">
              <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden relative border border-slate-700/50">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="getProgressColor(getProgressPercentage(kpi))"
                  :style="{ width: `${Math.min(getProgressPercentage(kpi), 100)}%` }"
                ></div>
              </div>
              <div class="text-[10px] font-semibold text-slate-400 text-right mt-1">
                {{ getProgressPercentage(kpi).toFixed(0) }}% da meta
              </div>
            </td>

            <!-- Trend -->
            <td class="py-3 px-3 text-center">
              <span class="inline-flex items-center justify-center p-1 rounded bg-slate-800 border border-slate-700">
                <TrendingUp v-if="kpi.trend === 'up'" class="w-3.5 h-3.5 text-emerald-400" />
                <TrendingDown v-else-if="kpi.trend === 'down'" class="w-3.5 h-3.5 text-rose-400" />
                <Minus v-else class="w-3.5 h-3.5 text-slate-400" />
              </span>
            </td>

            <!-- Actions -->
            <td class="py-3 px-3 text-center" @click.stop>
              <button
                @click="openKpiModal(kpi)"
                class="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white rounded-lg border border-slate-700 hover:border-blue-500 text-[11px] font-semibold transition-all flex items-center gap-1 mx-auto"
              >
                <Edit2 class="w-3 h-3" />
                <span>Atualizar</span>
              </button>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="filteredIndicators.length === 0">
            <td colspan="8" class="py-8 text-center text-slate-400 italic">
              Nenhum indicador encontrado para o filtro selecionado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Award,
  BookOpen,
  CalendarCheck,
  UserMinus,
  CheckCircle,
  AlertTriangle,
  GraduationCap,
  Laptop,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Edit2
} from 'lucide-vue-next';
import { useCockpit } from '../composables/useCockpit';
import { Indicator } from '../types';

const {
  indicators,
  filteredIndicators,
  selectedCategory,
  openKpiModal
} = useCockpit();

const categories = [
  { id: 'visao_geral', label: 'Todos os Indicadores' },
  { id: 'aprendizagem', label: 'Aprendizagem' },
  { id: 'permanencia', label: 'Permanência & Frequência' },
  { id: 'professores', label: 'Corpo Docente' },
  { id: 'tecnologia', label: 'Tecnologia' },
  { id: 'financeiro', label: 'Financeiro' },
];

const getCategoryCount = (catId: string) => {
  if (catId === 'visao_geral') return indicators.value.length;
  return indicators.value.filter((i) => i.category === catId).length;
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'evolving': return 'Evoluindo';
    case 'attention': return 'Atenção';
    case 'critical': return 'Crítico';
    case 'on_target': return 'Na Meta';
    default: return status;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'evolving':
      return 'bg-blue-950/60 border-blue-500/40 text-blue-300';
    case 'attention':
      return 'bg-amber-950/60 border-amber-500/40 text-amber-300';
    case 'critical':
      return 'bg-rose-950/60 border-rose-500/40 text-rose-300';
    case 'on_target':
      return 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300';
    default:
      return 'bg-slate-800 border-slate-700 text-slate-300';
  }
};

const getProgressPercentage = (kpi: Indicator) => {
  if (kpi.direction === 'higher_is_better') {
    return Math.min((kpi.currentValue / kpi.annualTarget) * 100, 100);
  } else {
    // For lower is better (e.g. abandonment rate)
    if (kpi.currentValue <= kpi.annualTarget) return 100;
    return Math.max(0, (1 - (kpi.currentValue - kpi.annualTarget) / kpi.annualTarget) * 100);
  }
};

const getProgressColor = (pct: number) => {
  if (pct >= 90) return 'bg-emerald-500';
  if (pct >= 70) return 'bg-blue-500';
  if (pct >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
};
</script>
