<template>
  <div class="min-h-screen bg-[#0b1324] text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
    <!-- Main Header -->
    <Header />

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 flex items-center justify-center">
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin"></div>
        <p class="text-xs text-slate-400 font-semibold uppercase tracking-widest">Carregando dados do servidor PostgreSQL e IndexedDB...</p>
      </div>
    </div>

    <!-- Main Content Area -->
    <main v-else class="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
      <!-- Top Summary KPI Cards -->
      <TopKpiCards />

      <!-- Active View Tab Content -->
      <div v-if="activeTab === 'dashboard'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <KpiMatrixTable />
        </div>
        <div class="space-y-6">
          <RightSidebarPanels />
        </div>
      </div>

      <div v-else-if="activeTab === 'escolas'">
        <SchoolComparisonView />
      </div>

      <div v-else-if="activeTab === 'planos_acao'">
        <ActionPlansView />
      </div>
    </main>

    <!-- Institutional Wood Plaque Footer -->
    <InstitutionalWoodPlaque />

    <!-- Modals & Overlays -->
    <KpiDetailModal v-if="isModalOpen && selectedKpi" :kpi="selectedKpi" @close="closeKpiModal" />
    <TvPresentationMode v-if="isTvMode" />
    <AuthModal />
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue';
import TopKpiCards from './components/TopKpiCards.vue';
import KpiMatrixTable from './components/KpiMatrixTable.vue';
import RightSidebarPanels from './components/RightSidebarPanels.vue';
import SchoolComparisonView from './components/SchoolComparisonView.vue';
import ActionPlansView from './components/ActionPlansView.vue';
import InstitutionalWoodPlaque from './components/InstitutionalWoodPlaque.vue';
import KpiDetailModal from './components/KpiDetailModal.vue';
import TvPresentationMode from './components/TvPresentationMode.vue';
import AuthModal from './components/AuthModal.vue';

import { useCockpit } from './composables/useCockpit';

const {
  activeTab,
  isLoading,
  isModalOpen,
  selectedKpi,
  closeKpiModal,
  isTvMode
} = useCockpit();
</script>
