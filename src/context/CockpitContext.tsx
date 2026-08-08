import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  KpiIndicator,
  School,
  AlertItem,
  PositiveHighlight,
  ActionPlan,
  UserProfile,
  MunicipalityConfig,
  KpiCategory,
  TeachingStage,
  RiskLevel
} from '../types';
import {
  INITIAL_KPIS,
  INITIAL_SCHOOLS,
  INITIAL_ALERTS,
  INITIAL_HIGHLIGHTS,
  INITIAL_ACTION_PLANS
} from '../data/mockData';
import { PRESET_MUNICIPALITIES, generateSchoolsForMunicipality } from '../data/municipalityPresets';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

export type ActiveTab = 'cockpit' | 'escolas' | 'comparativo' | 'planos_acao' | 'alertas' | 'api_integracao' | 'radar_recursos' | 'mobile_escola' | 'configuracao';

interface CockpitContextType {
  kpis: KpiIndicator[];
  schools: School[];
  alerts: AlertItem[];
  highlights: PositiveHighlight[];
  actionPlans: ActionPlan[];
  municipalityConfig: MunicipalityConfig;
  setMunicipalityConfig: (config: MunicipalityConfig) => void;
  selectedCategory: KpiCategory;
  setSelectedCategory: (cat: KpiCategory) => void;
  selectedSchoolId: string | null;
  setSelectedSchoolId: (id: string | null) => void;
  selectedStage: TeachingStage;
  setSelectedStage: (stage: TeachingStage) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  isTvMode: boolean;
  setIsTvMode: (val: boolean) => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  lastUpdatedTimestamp: string;
  refreshDataSimulated: () => void;
  addAlert: (alert: Omit<AlertItem, 'id' | 'dateCreated' | 'resolved'>) => void;
  resolveAlert: (id: string) => void;
  addActionPlan: (plan: Omit<ActionPlan, 'id' | 'createdDate'>) => void;
  updateActionPlanStatus: (id: string, status: ActionPlan['status']) => void;
  toggleActionStep: (planId: string, stepId: string) => void;
  filterRisk: RiskLevel | 'todas';
  setFilterRisk: (risk: RiskLevel | 'todas') => void;
  openKpiDetailModal: KpiIndicator | null;
  setOpenKpiDetailModal: (kpi: KpiIndicator | null) => void;
  updateKpiValue: (kpiId: string, newValue: number) => void;
  updateKpiGlidePath: (kpiId: string, monthlyTrajectory: number[], newStrategicTarget?: number) => void;
  addNewKpi: (kpiData: Omit<KpiIndicator, 'id'>) => void;
  isLiveStreaming: boolean;
  setIsLiveStreaming: (val: boolean) => void;
}

const CockpitContext = createContext<CockpitContextType | undefined>(undefined);

export const CockpitProvider: React.FC<{ children: React.ReactNode; initialUserProfile?: UserProfile }> = ({
  children,
  initialUserProfile,
}) => {
  const [kpis, setKpis] = useState<KpiIndicator[]>(() =>
    loadFromLocalStorage('educacao_kpis_data', INITIAL_KPIS)
  );
  const [schools, setSchools] = useState<School[]>(INITIAL_SCHOOLS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [highlights] = useState<PositiveHighlight[]>(INITIAL_HIGHLIGHTS);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>(INITIAL_ACTION_PLANS);
  
  const [selectedCategory, setSelectedCategory] = useState<KpiCategory>('visao_geral');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<TeachingStage>('todas');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2025-AnoLetivo');
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'todas'>('todas');
  
  const [isTvMode, setIsTvMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('cockpit');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastUpdatedTimestamp, setLastUpdatedTimestamp] = useState<string>('agora há 2 min');
  const [openKpiDetailModal, setOpenKpiDetailModal] = useState<KpiIndicator | null>(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);

  const [municipalityConfig, setMunicipalityConfigState] = useState<MunicipalityConfig>(() =>
    loadFromLocalStorage('educacao_municipality_config', PRESET_MUNICIPALITIES[0])
  );

  const [userProfile, setUserProfile] = useState<UserProfile>(
    initialUserProfile ?? {
      name: 'Dr. Fernando Vasconcelos',
      role: 'Secretário(a) de Educação',
      email: 'secretario@educacao.gov.br',
      municipality: municipalityConfig.name,
    }
  );

  const setMunicipalityConfig = (config: MunicipalityConfig) => {
    setMunicipalityConfigState(config);
    saveToLocalStorage('educacao_municipality_config', config);
    // Automatically generate schools for this municipality
    const newSchools = generateSchoolsForMunicipality(config.name);
    setSchools(newSchools);

    // Update user profile municipality
    setUserProfile((prev) => ({
      ...prev,
      municipality: config.name,
      secretaryName: config.secretaryName || prev.name,
    }));
  };

  // Simulated live clock & streaming update ticker
  useEffect(() => {
    let interval: any;
    if (isLiveStreaming) {
      interval = setInterval(() => {
        refreshDataSimulated();
      }, 5000); // 5s live ticker for real-time telemetry
    }
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const refreshDataSimulated = () => {
    // Slightly tweak random numbers to reflect live API ingestion
    setKpis((prev) =>
      prev.map((k) => {
        const delta = (Math.random() - 0.45) * 0.2;
        const newCurrent = Math.min(100, Math.max(0, parseFloat((k.currentValue + delta).toFixed(1))));
        return {
          ...k,
          currentValue: newCurrent,
        };
      })
    );
    const now = new Date();
    setLastUpdatedTimestamp(`agora às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
  };

  const updateKpiValue = (kpiId: string, newValue: number) => {
    setKpis((prev) =>
      prev.map((k) => {
        if (k.id === kpiId) {
          const formattedVal = parseFloat(newValue.toFixed(1));
          const newStatus = formattedVal >= k.targetExcellence ? 'em_evolucao' : formattedVal >= k.target2025 ? 'atencao' : 'critico';
          return {
            ...k,
            currentValue: formattedVal,
            status: newStatus,
            historyAfter: [
              ...k.historyAfter.slice(1),
              { period: 'Hoje', value: formattedVal },
            ],
          };
        }
        return k;
      })
    );
    const now = new Date();
    setLastUpdatedTimestamp(`agora às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
  };

  // Persist KPIs to localStorage when updated
  useEffect(() => {
    saveToLocalStorage('educacao_kpis_data', kpis);
  }, [kpis]);

  const updateKpiGlidePath = (kpiId: string, monthlyTrajectory: number[], newStrategicTarget?: number) => {
    setKpis((prev) =>
      prev.map((k) => {
        if (k.id === kpiId) {
          const finalTarget = newStrategicTarget !== undefined ? newStrategicTarget : k.target2025;
          return {
            ...k,
            target2025: finalTarget,
            metaPlanejadaMonthly: monthlyTrajectory,
          };
        }
        return k;
      })
    );
    const now = new Date();
    setLastUpdatedTimestamp(`agora às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
  };

  const addNewKpi = (kpiData: Omit<KpiIndicator, 'id'>) => {
    const newKpi: KpiIndicator = {
      ...kpiData,
      id: `kpi-custom-${Date.now()}`,
    };
    setKpis((prev) => [...prev, newKpi]);
  };

  const addAlert = (newAlert: Omit<AlertItem, 'id' | 'dateCreated' | 'resolved'>) => {
    const item: AlertItem = {
      ...newAlert,
      id: `alt-${Date.now()}`,
      dateCreated: 'Agora mesmo',
      resolved: false,
    };
    setAlerts((prev) => [item, ...prev]);
  };

  const resolveAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
  };

  const addActionPlan = (planData: Omit<ActionPlan, 'id' | 'createdDate'>) => {
    const plan: ActionPlan = {
      ...planData,
      id: `act-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setActionPlans((prev) => [plan, ...prev]);
  };

  const updateActionPlanStatus = (id: string, status: ActionPlan['status']) => {
    setActionPlans((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const completion = status === 'concluido' ? 100 : status === 'em_andamento' ? 50 : status === 'a_fazer' ? 0 : p.completionPercentage;
          return { ...p, status, completionPercentage: completion };
        }
        return p;
      })
    );
  };

  const toggleActionStep = (planId: string, stepId: string) => {
    setActionPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          const updatedSteps = p.steps.map((st) => (st.id === stepId ? { ...st, done: !st.done } : st));
          const doneCount = updatedSteps.filter((st) => st.done).length;
          const completion = Math.round((doneCount / updatedSteps.length) * 100);
          const newStatus = completion === 100 ? 'concluido' : completion > 0 ? 'em_andamento' : 'a_fazer';
          return { ...p, steps: updatedSteps, completionPercentage: completion, status: newStatus };
        }
        return p;
      })
    );
  };

  return (
    <CockpitContext.Provider
      value={{
        kpis,
        schools,
        alerts,
        highlights,
        actionPlans,
        municipalityConfig,
        setMunicipalityConfig,
        selectedCategory,
        setSelectedCategory,
        selectedSchoolId,
        setSelectedSchoolId,
        selectedStage,
        setSelectedStage,
        selectedPeriod,
        setSelectedPeriod,
        isTvMode,
        setIsTvMode,
        userProfile,
        setUserProfile,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        lastUpdatedTimestamp,
        refreshDataSimulated,
        addAlert,
        resolveAlert,
        addActionPlan,
        updateActionPlanStatus,
        toggleActionStep,
        filterRisk,
        setFilterRisk,
        openKpiDetailModal,
        setOpenKpiDetailModal,
        updateKpiValue,
        updateKpiGlidePath,
        addNewKpi,
        isLiveStreaming,
        setIsLiveStreaming,
      }}
    >
      {children}
    </CockpitContext.Provider>
  );
};

export const useCockpit = () => {
  const context = useContext(CockpitContext);
  if (!context) {
    throw new Error('useCockpit must be used within a CockpitProvider');
  }
  return context;
};
