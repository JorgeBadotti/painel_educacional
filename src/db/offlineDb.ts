import Dexie, { Table } from 'dexie';

export interface LocalIndicator {
  indicatorId: string;
  name: string;
  subtitle?: string | null;
  category: string;
  icon: string;
  unit: string;
  decimals?: number;
  direction: 'higher_is_better' | 'lower_is_better';
  historicalSeries: Array<{ period: string; value: number }>;
  postImplementationSeries: Array<{ period: string; value: number }>;
  currentValue: number;
  annualTarget: number;
  excellenceTarget: number;
  status: 'evolving' | 'attention' | 'critical' | 'on_target';
  trend: 'up' | 'down' | 'stable';
  description?: string;
  recommendedAction?: string;
  updatedAt?: string;
  synced?: number; // 0 = unsynced, 1 = synced
}

export interface LocalAlert {
  id: string;
  alertId: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category?: string;
  schoolName?: string;
  date?: string;
  resolved: boolean;
  synced?: number;
}

export interface LocalSchool {
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
  synced?: number;
}

export interface LocalActionPlan {
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
  synced?: number;
}

export interface PendingSyncItem {
  id?: number;
  type: 'indicator_update' | 'alert_update' | 'action_plan_create' | 'action_plan_update';
  payload: any;
  createdAt: string;
}

export class EduCockpitOfflineDB extends Dexie {
  indicators!: Table<LocalIndicator, string>;
  alerts!: Table<LocalAlert, string>;
  schools!: Table<LocalSchool, string>;
  actionPlans!: Table<LocalActionPlan, string>;
  pendingSync!: Table<PendingSyncItem, number>;

  constructor() {
    super('EduCockpitOfflineDB');
    this.version(1).stores({
      indicators: 'indicatorId, category, status, synced',
      alerts: 'alertId, severity, resolved, synced',
      schools: 'schoolId, region, status, synced',
      actionPlans: 'planId, indicatorId, status, synced',
      pendingSync: '++id, type, createdAt'
    });
  }
}

export const offlineDb = new EduCockpitOfflineDB();
