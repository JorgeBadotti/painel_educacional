<template>
  <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm border"
    :class="[
      isOnline
        ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
        : 'bg-amber-950/80 border-amber-500/40 text-amber-300'
    ]"
  >
    <!-- Status Dot -->
    <span class="relative flex h-2 w-2">
      <span v-if="syncState === 'syncing'" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-2 w-2"
        :class="[
          isOnline ? 'bg-emerald-400' : 'bg-amber-400'
        ]"
      ></span>
    </span>

    <!-- Status Text -->
    <span class="font-medium tracking-wide">
      <template v-if="syncState === 'syncing'">Sincronizando...</template>
      <template v-else-if="!isOnline">Offline (Dexie local)</template>
      <template v-else>Online (PostgreSQL)</template>
    </span>

    <!-- Pending Queue Count Badge -->
    <span v-if="pendingCount > 0" class="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold animate-pulse">
      {{ pendingCount }} pendente{{ pendingCount > 1 ? 's' : '' }}
    </span>

    <!-- Manual Sync Button -->
    <button
      v-if="isOnline && syncState !== 'syncing'"
      @click="handleManualSync"
      title="Sincronizar dados agora com o servidor PostgreSQL"
      class="ml-1 text-slate-400 hover:text-emerald-300 transition-colors p-0.5 rounded hover:bg-emerald-900/50"
    >
      <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isSpinning }" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RefreshCw } from 'lucide-vue-next';
import { useSync } from '../composables/useSync';

const { isOnline, syncState, pendingCount, syncNow } = useSync();
const isSpinning = ref(false);

const handleManualSync = async () => {
  isSpinning.value = true;
  await syncNow();
  setTimeout(() => {
    isSpinning.value = false;
  }, 600);
};
</script>
