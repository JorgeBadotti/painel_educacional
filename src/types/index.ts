export type IndicatorCategory =
  | 'visao_geral'
  | 'aprendizagem'
  | 'permanencia'
  | 'professores'
  | 'gestao_escolar'
  | 'infraestrutura'
  | 'tecnologia'
  | 'financeiro'
  | 'inclusao';

export type IndicatorStatus = 'evolving' | 'attention' | 'critical' | 'on_target';
export type IndicatorTrend = 'up' | 'down' | 'stable';

export interface IndicatorSeriesPoint {
  period: string;
  value: number;
}

export interface Indicator {
  indicatorId: string;
  name: string;
  subtitle?: string | null;
  category: IndicatorCategory;
  icon: string;
  unit: string;
  decimals?: number;
  direction: 'higher_is_better' | 'lower_is_better';
  historicalSeries: IndicatorSeriesPoint[];
  postImplementationSeries: IndicatorSeriesPoint[];
  currentValue: number;
  annualTarget: number;
  excellenceTarget: number;
  status: IndicatorStatus;
  trend: IndicatorTrend;
  description?: string;
  recommendedAction?: string;
  updatedAt?: string;
}

export interface TopCard {
  cardId: string;
  title: string;
  value: string;
  subvalue?: string;
  trendText?: string;
  badgeType?: string;
  detail?: Record<string, any>;
}

export interface Alert {
  id?: string | number;
  alertId: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category?: string;
  schoolName?: string;
  date?: string;
  resolved: boolean;
}

export interface Highlight {
  highlightId: string;
  title: string;
  description: string;
  category?: string;
  icon?: string;
}

export interface MainGoal {
  goalId: string;
  title: string;
  targetValue: number;
  targetUnit: string;
  targetYear: number;
  currentValue: number;
  motto: string;
  description: string;
}

export interface School {
  schoolId: string;
  name: string;
  inep?: string;
  region?: string;
  address?: string;
  principal?: string;
  phone?: string;
  studentsCount?: number;
  teachersCount?: number;
  ideb?: number;
  frequency?: number;
  riskCount?: number;
  status?: string;
}

export interface ActionPlan {
  planId: string;
  title: string;
  indicatorId?: string;
  schoolName?: string;
  owner?: string;
  deadline?: string;
  status: string;
  priority: string;
  progress: number;
  description?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: string;
}

export type SyncState = 'online' | 'offline' | 'syncing' | 'synced' | 'error';
