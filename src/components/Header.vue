<template>
  <header class="bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 px-4 lg:px-8 py-3">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      <!-- Brand & Municipality Name -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-blue-500/20">
          <div class="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
            <GraduationCap class="w-5 h-5 text-amber-400" />
          </div>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-sm md:text-base font-bold text-slate-100 tracking-tight uppercase">
              PAINEL DE INTELIGÊNCIA EDUCACIONAL
            </h1>
            <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              MUNICÍPIO MODELO
            </span>
          </div>
          <p class="text-xs text-slate-400">Gestão que transforma resultados • PWA Offline / PostgreSQL</p>
        </div>
      </div>

      <!-- Center Search & View Tabs -->
      <div class="flex items-center gap-2 flex-1 max-w-lg mx-0 md:mx-4">
        <div class="relative w-full">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar indicador, escola ou alerta..."
            class="w-full bg-slate-900/90 border border-slate-700/60 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <!-- Right Actions: Navigation, Sync Badge, TV Mode, User -->
      <div class="flex items-center gap-2 md:gap-3 flex-wrap justify-end">
        <!-- Navigation View Selector -->
        <nav class="flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          <button
            @click="activeTab = 'dashboard'"
            class="px-3 py-1 rounded-md text-xs font-semibold transition-all"
            :class="[
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            ]"
          >
            Dashboard
          </button>
          <button
            @click="activeTab = 'escolas'"
            class="px-3 py-1 rounded-md text-xs font-semibold transition-all"
            :class="[
              activeTab === 'escolas'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            ]"
          >
            Escolas
          </button>
          <button
            @click="activeTab = 'planos_acao'"
            class="px-3 py-1 rounded-md text-xs font-semibold transition-all"
            :class="[
              activeTab === 'planos_acao'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            ]"
          >
            Planos de Ação
          </button>
        </nav>

        <!-- Offline Sync Status Badge -->
        <OfflineSyncBadge />

        <!-- TV Mode Toggle -->
        <button
          @click="isTvMode = true"
          title="Modo Apresentação TV"
          class="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors shadow-sm"
        >
          <Tv class="w-3.5 h-3.5 text-amber-400" />
          <span class="hidden lg:inline">Modo TV</span>
        </button>

        <!-- User Profile / Auth Button -->
        <button
          v-if="userProfile"
          @click="signOutUser"
          title="Clique para Sair"
          class="flex items-center gap-2 px-2.5 py-1 bg-slate-800 hover:bg-red-950/40 text-slate-200 hover:text-red-300 text-xs font-medium rounded-lg border border-slate-700 hover:border-red-500/30 transition-all"
        >
          <img
            v-if="userProfile.photoURL"
            :src="userProfile.photoURL"
            class="w-5 h-5 rounded-full object-cover"
            alt="Avatar"
          />
          <User v-else class="w-4 h-4 text-blue-400" />
          <span class="max-w-[100px] truncate hidden sm:inline">{{ userProfile.displayName || userProfile.email }}</span>
          <LogOut class="w-3.5 h-3.5 text-slate-400" />
        </button>
        <button
          v-else
          @click="isAuthModalOpen = true"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/10"
        >
          <LogIn class="w-3.5 h-3.5" />
          <span>Entrar com Google</span>
        </button>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import { GraduationCap, Search, Tv, LogIn, LogOut, User } from 'lucide-vue-next';
import { useCockpit } from '../composables/useCockpit';
import OfflineSyncBadge from './OfflineSyncBadge.vue';

const {
  searchQuery,
  activeTab,
  isTvMode,
  userProfile,
  isAuthModalOpen,
  signOutUser
} = useCockpit();
</script>
