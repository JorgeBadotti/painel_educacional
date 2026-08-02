<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
    <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <SchoolIcon class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-100 uppercase tracking-tight">{{ school.name }}</h3>
            <p class="text-xs text-slate-400">INEP: {{ school.inep }} • {{ school.region }}</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 space-y-4 text-xs text-slate-200">
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div class="text-[10px] text-slate-400 uppercase font-bold">Direção Escolar</div>
            <div class="font-bold text-slate-100 mt-1">{{ school.principal }}</div>
          </div>
          <div class="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div class="text-[10px] text-slate-400 uppercase font-bold">Contato Telefônico</div>
            <div class="font-bold text-slate-100 mt-1">{{ school.phone }}</div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3 my-2">
          <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
            <div class="text-[10px] text-slate-400 uppercase font-bold">Matriculados</div>
            <div class="text-lg font-black text-slate-100 mt-1">{{ school.studentsCount }}</div>
            <div class="text-[10px] text-slate-400">{{ school.teachersCount }} docentes</div>
          </div>

          <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
            <div class="text-[10px] text-amber-400 uppercase font-bold">IDEB Escolar</div>
            <div class="text-lg font-black text-amber-300 mt-1">{{ school.ideb }}</div>
            <div class="text-[10px] text-slate-400">meta municipal: 6.0</div>
          </div>

          <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
            <div class="text-[10px] text-emerald-400 uppercase font-bold">Frequência</div>
            <div class="text-lg font-black text-emerald-300 mt-1">{{ school.frequency }}%</div>
            <div class="text-[10px] text-slate-400">frequência média</div>
          </div>
        </div>

        <div class="bg-rose-950/30 border border-rose-500/30 p-3 rounded-xl">
          <div class="flex items-center gap-2 text-rose-300 font-bold mb-1">
            <AlertTriangle class="w-4 h-4" />
            <span>Atenção a Alunos em Risco</span>
          </div>
          <p class="text-[11px] text-slate-300 leading-normal">
            Esta unidade possui <strong>{{ school.riskCount }} estudantes</strong> identificados com risco de abandono escolar ou com mais de 3 faltas consecutivas.
          </p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-3 bg-slate-800/80 border-t border-slate-700 flex justify-end">
        <button
          @click="$emit('close')"
          class="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors text-xs"
        >
          Fechar
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { School as SchoolIcon, X, AlertTriangle } from 'lucide-vue-next';
import { School } from '../types';

defineProps<{ school: School }>();
defineEmits(['close']);
</script>
