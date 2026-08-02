import { ref, onMounted, onUnmounted } from 'vue';
import { offlineDb, PendingSyncItem } from '../db/offlineDb';
import { SyncState } from '../types';

const isOnline = ref<boolean>(navigator.onLine);
const syncState = ref<SyncState>(navigator.onLine ? 'synced' : 'offline');
const lastSyncTime = ref<string>(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
const pendingCount = ref<number>(0);

export function useSync() {
  const updatePendingCount = async () => {
    try {
      pendingCount.value = await offlineDb.pendingSync.count();
    } catch {
      pendingCount.value = 0;
    }
  };

  const syncNow = async (): Promise<boolean> => {
    if (!navigator.onLine) {
      syncState.value = 'offline';
      return false;
    }

    syncState.value = 'syncing';
    try {
      const items = await offlineDb.pendingSync.toArray();
      if (items.length > 0) {
        const response = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData.processedIds && Array.isArray(resData.processedIds)) {
            await offlineDb.pendingSync.bulkDelete(resData.processedIds);
          }
        }
      }

      await updatePendingCount();
      syncState.value = 'synced';
      lastSyncTime.value = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return true;
    } catch (err) {
      console.error('Offline sync error:', err);
      syncState.value = 'error';
      return false;
    }
  };

  const queueOfflineAction = async (type: PendingSyncItem['type'], payload: any) => {
    await offlineDb.pendingSync.add({
      type,
      payload,
      createdAt: new Date().toISOString(),
    });
    await updatePendingCount();

    if (navigator.onLine) {
      await syncNow();
    } else {
      syncState.value = 'offline';
    }
  };

  const handleOnline = async () => {
    isOnline.value = true;
    syncState.value = 'syncing';
    console.log('Conexão estabelecida! Iniciando sincronização automática com servidor PostgreSQL...');
    await syncNow();
  };

  const handleOffline = () => {
    isOnline.value = false;
    syncState.value = 'offline';
    console.log('Modo Offline ativado. Dados serão armazenados em IndexedDB via Dexie.');
  };

  onMounted(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    updatePendingCount();
  });

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  });

  return {
    isOnline,
    syncState,
    lastSyncTime,
    pendingCount,
    syncNow,
    queueOfflineAction,
    updatePendingCount,
  };
}
