<template>
  <div v-if="kpi" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
    <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700 sticky top-0 z-10 backdrop-blur-md">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Award class="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-100 uppercase tracking-tight">{{ kpi.name }}</h3>
            <p v-if="kpi.subtitle" class="text-xs text-slate-400">{{ kpi.subtitle }}</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-6 space-y-6 text-xs text-slate-200">
        
        <!-- Value Overview Cards -->
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-center">
            <div class="text-[10px] text-slate-400 uppercase font-bold">Valor Atual</div>
            <div class="text-xl font-black text-slate-100 mt-1">
              {{ kpi.currentValue }} <span class="text-xs font-normal text-slate-400">{{ kpi.unit }}</span>
            </div>
          </div>

          <div class="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-center">
            <div class="text-[10px] text-blue-400 uppercase font-bold">Meta Anual</div>
            <div class="text-xl font-black text-blue-300 mt-1">
              {{ kpi.annualTarget }} <span class="text-xs font-normal text-slate-400">{{ kpi.unit }}</span>
            </div>
          </div>

          <div class="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-center">
            <div class="text-[10px] text-amber-400 uppercase font-bold">Meta Excelência</div>
            <div class="text-xl font-black text-amber-300 mt-1">
              {{ kpi.excellenceTarget }} <span class="text-xs font-normal text-slate-400">{{ kpi.unit }}</span>
            </div>
          </div>
        </div>

        <!-- Historical vs Post Implementation Series -->
        <div class="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5">
              <TrendingUp class="w-4 h-4 text-emerald-400" />
              Série Histórica e Evolução Pós-Implementação
            </h4>
            <span class="text-[10px] text-slate-400">Dados consolidados do município</span>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Historical -->
            <div>
              <div class="text-[10px] font-bold uppercase text-slate-400 mb-2">Histórico Anterior</div>
              <div class="space-y-1.5">
                <div
                  v-for="pt in kpi.historicalSeries"
                  :key="pt.period"
                  class="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-[11px]"
                >
                  <span class="text-slate-400">{{ pt.period }}</span>
                  <span class="font-bold text-slate-200">{{ pt.value }} {{ kpi.unit }}</span>
                </div>
              </div>
            </div>

            <!-- Post-Implementation -->
            <div>
              <div class="text-[10px] font-bold uppercase text-blue-400 mb-2">Pós-Implementação Programa</div>
              <div class="space-y-1.5">
                <div
                  v-for="pt in kpi.postImplementationSeries"
                  :key="pt.period"
                  class="flex items-center justify-between p-2 rounded bg-blue-950/40 border border-blue-500/30 text-[11px]"
                >
                  <span class="text-blue-300 font-semibold">{{ pt.period }}</span>
                  <span class="font-black text-amber-400">{{ pt.value }} {{ kpi.unit }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Description & Recommended Action -->
        <div class="space-y-3">
          <div v-if="kpi.description" class="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <div class="text-[10px] text-slate-400 uppercase font-bold mb-1">Descrição do Indicador</div>
            <p class="text-slate-300 leading-relaxed">{{ kpi.description }}</p>
          </div>

          <div v-if="kpi.recommendedAction" class="bg-amber-950/30 border border-amber-500/30 p-3.5 rounded-xl">
            <div class="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
              <CheckCircle class="w-4 h-4" />
              <span>Ação Recomendada pela Gestão</span>
            </div>
            <p class="text-amber-100/90 leading-relaxed">{{ kpi.recommendedAction }}</p>
          </div>
        </div>

        <!-- Interactive Value Updater -->
        <div class="bg-slate-950/90 border border-slate-800 p-4 rounded-xl space-y-3">
          <h4 class="text-xs font-bold uppercase text-slate-200 flex items-center gap-1.5">
            <Save class="w-4 h-4 text-emerald-400" />
            Atualizar Valor do Indicador (Modo Offline & Online)
          </h4>

          <div class="flex items-center gap-3">
            <input
              v-model.number="newValue"
              type="number"
              step="0.1"
              class="w-32 bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-100 focus:outline-none focus:border-amber-500"
            />
            <button
              @click="handleSave"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md transition-all flex items-center gap-1.5 text-xs"
            >
              <Check class="w-4 h-4" />
              <span>Salvar Alteração</span>
            </button>
            <span v-if="savedSuccess" class="text-xs text-emerald-400 font-semibold animate-fade-in">
              Salvo com sucesso!
            </span>
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-3 bg-slate-800/80 border-t border-slate-700 flex justify-end">
        <button
          @click="$emit('close')"
          class="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg text-xs"
        >
          Fechar
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Award, X, TrendingUp, CheckCircle, Save, Check } from 'lucide-vue-next';
import { Indicator } from '../types';
import { useCockpit } from '../composables/useCockpit';

const props = defineProps<{ kpi: Indicator }>();
defineEmits(['close']);

const { updateIndicatorValue } = useCockpit();
const newValue = ref<number>(props.kpi.currentValue);
const savedSuccess = ref(false);

watch(
  () => props.kpi,
  (newKpi) => {
    if (newKpi) {
      newValue.value = newKpi.currentValue;
    }
  },
  { immediate: true }
);

const handleSave = async () => {
  if (newValue.value === undefined || isNaN(newValue.value)) return;
  await updateIndicatorValue(props.kpi.indicatorId, newValue.value);
  savedSuccess.value = true;
  setTimeout(() => {
    savedSuccess.value = false;
  }, 2000);
};
</script>
