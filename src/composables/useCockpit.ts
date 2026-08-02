import { ref, computed, onMounted } from 'vue';
import {
  Indicator,
  TopCard,
  Alert,
  Highlight,
  MainGoal,
  School,
  ActionPlan,
  UserProfile
} from '../types';
import { offlineDb, LocalIndicator, LocalAlert } from '../db/offlineDb';
import { useSync } from './useSync';
import { auth, googleAuthProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const indicators = ref<Indicator[]>([]);
const topCards = ref<TopCard[]>([]);
const alerts = ref<Alert[]>([]);
const highlights = ref<Highlight[]>([]);
const mainGoal = ref<MainGoal | null>(null);
const schools = ref<School[]>([]);
const actionPlans = ref<ActionPlan[]>([]);

const selectedCategory = ref<string>('visao_geral');
const searchQuery = ref<string>('');
const selectedKpi = ref<Indicator | null>(null);
const isModalOpen = ref<boolean>(false);
const activeTab = ref<'dashboard' | 'escritorio' | 'escolas' | 'planos_acao'>('dashboard');
const selectedSchool = ref<School | null>(null);
const isTvMode = ref<boolean>(false);
const isAuthModalOpen = ref<boolean>(false);
const userProfile = ref<UserProfile | null>(null);
const isLoading = ref<boolean>(true);

export function useCockpit() {
  const { queueOfflineAction } = useSync();

  // Load initial data from server or Dexie IndexedDB cache
  const loadDashboardData = async () => {
    isLoading.value = true;
    try {
      if (navigator.onLine) {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const data = await res.json();
          indicators.value = data.indicators || [];
          topCards.value = data.topCards || [];
          alerts.value = data.alerts || [];
          highlights.value = data.highlights || [];
          mainGoal.value = data.mainGoal || null;
          schools.value = data.schools || [];
          actionPlans.value = data.actionPlans || [];

          // Cache in IndexedDB for offline access
          await offlineDb.indicators.clear();
          await offlineDb.indicators.bulkAdd(indicators.value as LocalIndicator[]);
          await offlineDb.alerts.clear();
          const localAlerts: LocalAlert[] = alerts.value.map(a => ({
            id: String(a.id || a.alertId),
            alertId: a.alertId,
            title: a.title,
            description: a.description,
            severity: a.severity,
            category: a.category,
            schoolName: a.schoolName,
            date: a.date,
            resolved: a.resolved,
          }));
          await offlineDb.alerts.bulkAdd(localAlerts);
          await offlineDb.schools.clear();
          await offlineDb.schools.bulkAdd(schools.value);
          await offlineDb.actionPlans.clear();
          await offlineDb.actionPlans.bulkAdd(actionPlans.value);

          isLoading.value = false;
          return;
        }
      }

      // Offline fallback: load from IndexedDB
      console.log('Carregando dados do banco local IndexedDB...');
      const cachedIndicators = await offlineDb.indicators.toArray();
      const cachedAlerts = await offlineDb.alerts.toArray();
      const cachedSchools = await offlineDb.schools.toArray();
      const cachedPlans = await offlineDb.actionPlans.toArray();

      if (cachedIndicators.length > 0) {
        indicators.value = cachedIndicators as Indicator[];
        alerts.value = cachedAlerts.map(a => ({ ...a, id: a.id }));
        schools.value = cachedSchools;
        actionPlans.value = cachedPlans;
      }
    } catch (err) {
      console.error('Erro ao carregar dados do cockpit:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Update Indicator value (Online -> Server + Cache; Offline -> IndexedDB + Queue)
  const updateIndicatorValue = async (indicatorId: string, newValue: number) => {
    const ind = indicators.value.find((i) => i.indicatorId === indicatorId);
    if (ind) {
      ind.currentValue = newValue;
      if (ind.postImplementationSeries.length > 0) {
        ind.postImplementationSeries[ind.postImplementationSeries.length - 1].value = newValue;
      }

      // Update in local IndexedDB
      await offlineDb.indicators.put(ind as LocalIndicator);

      if (navigator.onLine) {
        try {
          await fetch(`/api/indicators/${indicatorId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentValue: newValue }),
          });
        } catch {
          await queueOfflineAction('indicator_update', { indicatorId, currentValue: newValue });
        }
      } else {
        await queueOfflineAction('indicator_update', { indicatorId, currentValue: newValue });
      }
    }
  };

  // Resolve Alert
  const resolveAlert = async (alertId: string) => {
    const alertItem = alerts.value.find((a) => a.alertId === alertId);
    if (alertItem) {
      alertItem.resolved = true;
      const localAlertItem: LocalAlert = {
        id: String(alertItem.id || alertItem.alertId),
        alertId: alertItem.alertId,
        title: alertItem.title,
        description: alertItem.description,
        severity: alertItem.severity,
        category: alertItem.category,
        schoolName: alertItem.schoolName,
        date: alertItem.date,
        resolved: alertItem.resolved
      };
      await offlineDb.alerts.put(localAlertItem);

      if (navigator.onLine) {
        try {
          await fetch(`/api/alerts/${alertId}/resolve`, { method: 'PUT' });
        } catch {
          await queueOfflineAction('alert_update', { alertId, resolved: true });
        }
      } else {
        await queueOfflineAction('alert_update', { alertId, resolved: true });
      }
    }
  };

  // Create Action Plan
  const createActionPlan = async (plan: Omit<ActionPlan, 'planId'>) => {
    const planId = `plan_${Date.now()}`;
    const newPlan: ActionPlan = { ...plan, planId };
    actionPlans.value.push(newPlan);

    await offlineDb.actionPlans.put(newPlan);

    if (navigator.onLine) {
      try {
        await fetch('/api/action-plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPlan),
        });
      } catch {
        await queueOfflineAction('action_plan_create', newPlan);
      }
    } else {
      await queueOfflineAction('action_plan_create', newPlan);
    }
  };

  // Auth Handlers
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      userProfile.value = {
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || 'Gestor Educacional',
        photoURL: result.user.photoURL || undefined,
        role: 'Secretário / Gestor',
      };
      isAuthModalOpen.value = false;
    } catch (err) {
      console.error('Google Auth Error:', err);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      userProfile.value = null;
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  // Computed filtered indicators
  const filteredIndicators = computed(() => {
    let list = indicators.value;
    if (selectedCategory.value && selectedCategory.value !== 'visao_geral') {
      list = list.filter((i) => i.category === selectedCategory.value);
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      list = list.filter(
        (i) => i.name.toLowerCase().includes(q) || (i.subtitle && i.subtitle.toLowerCase().includes(q))
      );
    }
    return list;
  });

  const openKpiModal = (kpi: Indicator) => {
    selectedKpi.value = kpi;
    isModalOpen.value = true;
  };

  const closeKpiModal = () => {
    isModalOpen.value = false;
    selectedKpi.value = null;
  };

  onMounted(() => {
    loadDashboardData();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userProfile.value = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Gestor Educacional',
          photoURL: user.photoURL || undefined,
          role: 'Secretário / Gestor',
        };
      }
    });
  });

  return {
    indicators,
    topCards,
    alerts,
    highlights,
    mainGoal,
    schools,
    actionPlans,
    selectedCategory,
    searchQuery,
    selectedKpi,
    isModalOpen,
    activeTab,
    selectedSchool,
    isTvMode,
    isAuthModalOpen,
    userProfile,
    isLoading,
    filteredIndicators,
    openKpiModal,
    closeKpiModal,
    updateIndicatorValue,
    resolveAlert,
    createActionPlan,
    signInWithGoogle,
    signOutUser,
    loadDashboardData,
  };
}
