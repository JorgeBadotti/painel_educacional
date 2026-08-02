import { z } from 'zod';
import {
  IndicatorSchema,
  AlertSchema,
  HighlightSchema,
  MainGoalSchema,
  DashboardDataSchema,
  TopCardSchema
} from '../schemas/dashboardSchema';

export type Indicator = z.infer<typeof IndicatorSchema>;
export type Alert = z.infer<typeof AlertSchema>;
export type Highlight = z.infer<typeof HighlightSchema>;
export type MainGoal = z.infer<typeof MainGoalSchema>;
export type DashboardMetadata = z.infer<typeof DashboardDataSchema>;
export type TopCard = z.infer<typeof TopCardSchema>;

export interface FullDashboardState {
  metadata: DashboardMetadata;
  topCards: TopCard[];
  indicators: Indicator[];
  alerts: Alert[];
  highlights: Highlight[];
  mainGoal: MainGoal;
}
