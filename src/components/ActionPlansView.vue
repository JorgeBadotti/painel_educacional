<template>
  <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-6">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
      <div>
        <h2 class="text-base font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
          <ListTodo class="w-5 h-5 text-amber-400" />
          Planos de Ação e Intervenção Pedagógica
        </h2>
        <p class="text-xs text-slate-400">Projetos estratégicos para atingimento de metas municipais</p>
      </div>

      <button
        @click="showCreateModal = true"
        class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 transition-all self-start sm:self-auto"
      >
        <PlusCircle class="w-4 h-4" />
        <span>Novo Plano de Ação</span>
      </button>
    </div>

    <!-- Plans Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="plan in actionPlans"
        :key="plan.planId"
        class="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-600 transition-all"
      >
        <div>
          <div class="flex items-start justify-between gap-2 mb-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase"
              :class="[
                plan.priority === 'alta' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              ]"
            >
              Prioridade {{ plan.priority }}
            </span>

            <span class="text-[11px] text-slate-400 font-semibold">Prazo: {{ plan.deadline }}</span>
          </div>

          <h3 class="text-xs font-bold text-slate-100 leading-snug">
            {{ plan.title }}
          </h3>

          <p class="text-[11px] text-slate-400 my-2 leading-relaxed">
            {{ plan.description }}
          </p>
        </div>

        <div class="pt-3 border-t border-slate-700/50 space-y-2">
          <div class="flex justify-between text-[11px]">
            <span class="text-slate-400 font-medium">Responsável: <strong class="text-slate-200">{{ plan.owner }}</strong></span>
            <span class="font-bold text-blue-400">{{ plan.progress }}%</span>
          </div>

          <!-- Progress bar -->
          <div class="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              class="h-full bg-blue-500 rounded-full transition-all duration-500"
              :style="{ width: `${plan.progress}%` }"
            ></div>
          </div>

          <div class="text-[10px] text-slate-500 truncate">
            Unidade: {{ plan.schoolName || 'Rede Municipal' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Create Action Plan Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
        
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 class="text-sm font-bold text-slate-100 uppercase">Novo Plano de Ação</h3>
          <button @click="showCreateModal = false" class="text-slate-400 hover:text-white">
            <X class="w-4 h-4" />
          </button>
        </div>

        <form @submit.prevent="handleCreatePlan" class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-300 mb-1">Título do Plano</label>
            <input
              v-model="newPlanForm.title"
              type="text"
              required
              placeholder="Ex: Reforço Escolar de Matemática"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Responsável</label>
            <input
              v-model="newPlanForm.owner"
              type="text"
              required
              placeholder="Ex: Profeª Heloísa Silva"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Prazo</label>
              <input
                v-model="newPlanForm.deadline"
                type="date"
                required
                class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Prioridade</label>
              <select
                v-model="newPlanForm.priority"
                class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Descrição detalhada</label>
            <textarea
              v-model="newPlanForm.description"
              rows="3"
              placeholder="Descreva os objetivos e etapas..."
              class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-amber-500"
            ></textarea>
          </div>

          <div class="pt-2 flex justify-end gap-2">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shadow-md"
            >
              Salvar Plano
            </button>
          </div>
        </form>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ListTodo, PlusCircle, X } from 'lucide-vue-next';
import { useCockpit } from '../composables/useCockpit';

const { actionPlans, createActionPlan } = useCockpit();

const showCreateModal = ref(false);
const newPlanForm = ref({
  title: '',
  owner: '',
  deadline: '',
  priority: 'alta',
  description: '',
  schoolName: 'Rede Municipal',
  status: 'em_andamento',
  progress: 10,
});

const handleCreatePlan = async () => {
  if (!newPlanForm.value.title || !newPlanForm.value.owner) return;
  await createActionPlan({ ...newPlanForm.value });
  showCreateModal.value = false;
  newPlanForm.value = {
    title: '',
    owner: '',
    deadline: '',
    priority: 'alta',
    description: '',
    schoolName: 'Rede Municipal',
    status: 'em_andamento',
    progress: 10,
  };
};
</script>
