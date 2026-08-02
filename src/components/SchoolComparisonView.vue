<template>
  <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
      <div>
        <h2 class="text-base font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
          <School class="w-5 h-5 text-blue-400" />
          Rede Municipal de Ensino — Matriz de Escolas
        </h2>
        <p class="text-xs text-slate-400">Acompanhamento comparativo de unidades escolares e fatores de risco</p>
      </div>

      <!-- Region Filter -->
      <div class="flex items-center gap-2">
        <label class="text-xs text-slate-400 font-medium">Região:</label>
        <select
          v-model="selectedRegion"
          class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="todas">Todas as Regiões</option>
          <option value="Região Central">Região Central</option>
          <option value="Região Sul">Região Sul</option>
          <option value="Região Norte">Região Norte</option>
          <option value="Região Leste">Região Leste</option>
          <option value="Região Oeste">Região Oeste</option>
        </select>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <th class="py-3 px-3">Escola</th>
            <th class="py-3 px-3">Região</th>
            <th class="py-3 px-3 text-center">Matriculados</th>
            <th class="py-3 px-3 text-center">IDEB</th>
            <th class="py-3 px-3 text-center">Frequência</th>
            <th class="py-3 px-3 text-center">Alunos em Risco</th>
            <th class="py-3 px-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60 text-xs text-slate-200">
          <tr
            v-for="sch in filteredSchools"
            :key="sch.schoolId"
            @click="selectedSchool = sch"
            class="hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <td class="py-3.5 px-3">
              <div class="font-bold text-slate-100 hover:text-blue-300 transition-colors">
                {{ sch.name }}
              </div>
              <div class="text-[11px] text-slate-400">
                Diretor(a): {{ sch.principal }} • INEP: {{ sch.inep }}
              </div>
            </td>

            <td class="py-3.5 px-3 text-slate-300">
              {{ sch.region }}
            </td>

            <td class="py-3.5 px-3 text-center font-semibold">
              {{ sch.studentsCount }} alunos
            </td>

            <td class="py-3.5 px-3 text-center font-bold text-amber-400">
              {{ sch.ideb }}
            </td>

            <td class="py-3.5 px-3 text-center font-bold text-emerald-400">
              {{ sch.frequency }}%
            </td>

            <td class="py-3.5 px-3 text-center">
              <span class="px-2 py-0.5 rounded-full font-bold text-xs"
                :class="[
                  (sch.riskCount || 0) > 30
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-slate-800 text-slate-300'
                ]"
              >
                {{ sch.riskCount }} alunos
              </span>
            </td>

            <td class="py-3.5 px-3 text-center">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                :class="[
                  sch.status === 'destaque' ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' :
                  sch.status === 'atencao' ? 'bg-amber-950/60 border-amber-500/40 text-amber-300' :
                  sch.status === 'critico' ? 'bg-rose-950/60 border-rose-500/40 text-rose-300' :
                  'bg-slate-800 border-slate-700 text-slate-300'
                ]"
              >
                {{ sch.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- School Detail Modal -->
    <SchoolDetailView v-if="selectedSchool" :school="selectedSchool" @close="selectedSchool = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { School } from 'lucide-vue-next';
import { useCockpit } from '../composables/useCockpit';
import SchoolDetailView from './SchoolDetailView.vue';

const { schools, selectedSchool } = useCockpit();
const selectedRegion = ref<string>('todas');

const filteredSchools = computed(() => {
  if (selectedRegion.value === 'todas') return schools.value;
  return schools.value.filter((s) => s.region === selectedRegion.value);
});
</script>
