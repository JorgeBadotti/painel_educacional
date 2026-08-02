<template>
  <div class="w-full bg-[#180e07] border-t border-[#3d2413] py-6 px-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col items-center justify-center">
    <!-- Wood grain pattern overlay -->
    <div class="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#3d2413_1px,transparent_1px)] [background-size:16px_16px]"></div>

    <div class="relative z-10 flex flex-col items-center justify-center text-center">
      <!-- Golden metallic stylized book icon badge -->
      <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 p-0.5 shadow-2xl mb-2 flex items-center justify-center">
        <div class="w-full h-full bg-[#180e07] rounded-[14px] flex items-center justify-center">
          <BookOpen class="w-6 h-6 text-amber-400 drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)]" />
        </div>
      </div>

      <!-- Metallic Gold Typography -->
      <h2 class="text-sm md:text-base font-black uppercase tracking-[0.25em] bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight">
        EDUCAÇÃO QUE TRANSFORMA
      </h2>
      <h3 class="text-xs md:text-sm font-extrabold uppercase tracking-[0.35em] text-amber-400/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] leading-tight mt-0.5">
        FUTUROS
      </h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next';
</script>
