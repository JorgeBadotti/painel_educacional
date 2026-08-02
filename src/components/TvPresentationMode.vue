<template>
  <div class="fixed inset-0 z-50 bg-[#070d19] text-slate-100 flex flex-col justify-between p-6 lg:p-10 select-none animate-fade-in">
    
    <!-- TV Header -->
    <div class="flex items-center justify-between border-b border-slate-800 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-amber-500 p-0.5 shadow-xl">
          <div class="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <GraduationCap class="w-6 h-6 text-amber-400" />
          </div>
        </div>
        <div>
          <h1 class="text-xl lg:text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            PAINEL EXECUTIVO DE INTELIGÊNCIA EDUCACIONAL
          </h1>
          <p class="text-xs lg:text-sm text-slate-400 font-semibold">
            MUNICÍPIO MODELO • MODA TV TRANSMISSÃO AO VIVO
          </p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-400">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>SINAL AO VIVO • {{ currentTime }}</span>
        </div>

        <button
          @click="isTvMode = false"
          class="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
          title="Sair do Modo TV"
        >
          <X class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- TV Main Slide Content -->
    <div class="my-auto py-6">
      
      <!-- Slide 0: General Score & Main Goal -->
      <div v-if="activeSlide === 0" class="space-y-8 max-w-5xl mx-auto text-center">
        <span class="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-bold uppercase tracking-widest border border-amber-500/20">
          Índice Geral de Desempenho Educacional
        </span>

        <div class="flex items-center justify-center gap-6 my-6">
          <div class="text-7xl lg:text-9xl font-black text-white tracking-tight">
            72.4 <span class="text-3xl text-slate-500 font-normal">/ 100</span>
          </div>
        </div>

        <div v-if="mainGoal" class="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl max-w-3xl mx-auto shadow-2xl">
          <div class="text-xs uppercase font-extrabold text-amber-400 tracking-wider mb-2">
            META MUNICIPAL A PERSEGUIR ATÉ {{ mainGoal.targetYear }}
          </div>
          <div class="text-2xl font-black text-slate-100">
            Atingir {{ mainGoal.targetValue }} {{ mainGoal.targetUnit }}
          </div>
          <div class="w-full bg-slate-950 rounded-full h-3 my-4 border border-slate-800">
            <div
              class="h-full bg-gradient-to-r from-blue-500 to-amber-400 rounded-full"
              :style="{ width: `${(mainGoal.currentValue / mainGoal.targetValue) * 100}%` }"
            ></div>
          </div>
          <p class="text-xs text-slate-400 italic">"{{ mainGoal.motto }}" — {{ mainGoal.description }}</p>
        </div>
      </div>

      <!-- Slide 1: Primary Indicators -->
      <div v-else-if="activeSlide === 1" class="max-w-6xl mx-auto space-y-6">
        <div class="text-center mb-6">
          <h2 class="text-xl lg:text-2xl font-black uppercase text-amber-400 tracking-wider">
            Indicadores de Aprendizagem & Proficiência
          </h2>
          <p class="text-xs text-slate-400">Acompanhamento contínuo dos índices educacionais</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="kpi in indicators.slice(0, 3)"
            :key="kpi.indicatorId"
            class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl"
          >
            <div>
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ kpi.subtitle }}</span>
              <h3 class="text-lg font-black text-slate-100 mt-1">{{ kpi.name }}</h3>
            </div>

            <div class="my-6 text-center">
              <span class="text-5xl font-black text-amber-300">{{ kpi.currentValue }}</span>
              <span class="text-sm font-semibold text-slate-400 ml-1">{{ kpi.unit }}</span>
            </div>

            <div class="pt-4 border-t border-slate-800 flex justify-between text-xs font-semibold">
              <span class="text-slate-400">Meta: {{ kpi.annualTarget }} {{ kpi.unit }}</span>
              <span class="text-emerald-400">Evolução Positiva</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 2: Critical Alerts -->
      <div v-else-if="activeSlide === 2" class="max-w-5xl mx-auto space-y-6">
        <div class="text-center mb-6">
          <h2 class="text-xl lg:text-2xl font-black uppercase text-rose-400 tracking-wider">
            Central de Alertas e Ações Prioritárias
          </h2>
          <p class="text-xs text-slate-400">Pontos que exigem intervenção imediata das equipes</p>
        </div>

        <div class="space-y-4">
          <div
            v-for="alert in alerts.slice(0, 3)"
            :key="alert.alertId"
            class="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between"
          >
            <div>
              <div class="text-sm font-bold text-rose-200">{{ alert.title }}</div>
              <p class="text-xs text-slate-300 mt-1">{{ alert.description }}</p>
              <div class="text-[10px] text-slate-400 mt-2">Unidade: {{ alert.schoolName }}</div>
            </div>
            <span class="px-3 py-1 rounded-full bg-rose-500 text-slate-950 text-xs font-black uppercase shrink-0">
              Urgente
            </span>
          </div>
        </div>
      </div>

    </div>

    <!-- TV Footer Controls -->
    <div class="border-t border-slate-800 pt-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
          v-for="s in [0, 1, 2]"
          :key="s"
          @click="activeSlide = s"
          class="w-3 h-3 rounded-full transition-all"
          :class="activeSlide === s ? 'bg-amber-400 w-8' : 'bg-slate-700'"
        ></button>
      </div>

      <div class="text-xs text-slate-400 font-medium">
        Modo Apresentação TV • Slide {{ activeSlide + 1 }} de 3
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="prevSlide"
          class="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
        <button
          @click="nextSlide"
          class="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Institutional Wood Plaque Footer -->
    <div class="mt-4 -mx-6 -mb-6">
      <InstitutionalWoodPlaque />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { GraduationCap, X, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useCockpit } from '../composables/useCockpit';
import InstitutionalWoodPlaque from './InstitutionalWoodPlaque.vue';

const { isTvMode, mainGoal, indicators, alerts } = useCockpit();

const activeSlide = ref(0);
const currentTime = ref(new Date().toLocaleTimeString('pt-BR'));
let timeInterval: any = null;
let slideInterval: any = null;

const nextSlide = () => {
  activeSlide.value = (activeSlide.value + 1) % 3;
};

const prevSlide = () => {
  activeSlide.value = (activeSlide.value - 1 + 3) % 3;
};

onMounted(() => {
  timeInterval = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString('pt-BR');
  }, 1000);

  slideInterval = setInterval(() => {
    nextSlide();
  }, 10000);
});

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval);
  if (slideInterval) clearInterval(slideInterval);
});
</script>
