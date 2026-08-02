import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import App from './App.vue';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Workbox Service Worker for offline PWA functionality
if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('Nova versão do PWA disponível. Atualizando...');
    },
    onOfflineReady() {
      console.log('PWA pronto para funcionar 100% offline via Workbox!');
    },
  });
}

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'system',
    }
  }
});

app.mount('#app');
