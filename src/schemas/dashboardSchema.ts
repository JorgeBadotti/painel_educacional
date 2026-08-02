import { z } from 'zod';

export const IndicatorSeriesPointSchema = z.object({
  period: z.string(),
  value: z.number(),
});

export const IndicatorSchema = z.object({
  indicatorId: z.string(),
  name: z.string(),
  subtitle: z.string().nullable().optional(),
  category: z.enum([
    'visao_geral',
    'aprendizagem',
    'permanencia',
    'professores',
    'gestao_escolar',
    'infraestrutura',
    'tecnologia',
    'financeiro',
    'inclusao'
  ]).default('visao_geral'),
  icon: z.string(),
  unit: z.string(), // 'percentage', 'pts', 'R$', 'unid', 'ratio', etc.
  decimals: z.number().default(1),
  direction: z.enum(['higher_is_better', 'lower_is_better']),
  historicalSeries: z.array(IndicatorSeriesPointSchema),
  postImplementationSeries: z.array(IndicatorSeriesPointSchema),
  currentValue: z.number(),
  annualTarget: z.number(),
  excellenceTarget: z.number(),
  status: z.enum(['evolving', 'attention', 'critical', 'on_target']),
  trend: z.enum(['up', 'down', 'stable']),
  description: z.string().optional(),
  recommendedAction: z.string().optional(),
});

export const TopCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  value: z.string(),
  subvalue: z.string().optional(),
  trendText: z.string().optional(),
  badgeType: z.string().optional(),
  detail: z.record(z.string(), z.any()).optional(),
});

export const AlertSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  severity: z.enum(['high', 'medium', 'low']),
  category: z.string().optional(),
  schoolName: z.string().optional(),
  date: z.string().optional(),
  resolved: z.boolean().default(false),
});

export const HighlightSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string().optional(),
  icon: z.string().optional(),
});

export const MainGoalSchema = z.object({
  title: z.string(),
  targetValue: z.number(),
  targetUnit: z.string(),
  targetYear: z.number(),
  currentValue: z.number(),
  motto: z.string(),
  description: z.string(),
});

export const DashboardDataSchema = z.object({
  municipality: z.string(),
  title: z.string(),
  subtitle: z.string(),
  lastUpdated: z.string(),
  currentScore: z.number(),
  maxScore: z.number(),
  scoreComparison: z.string(),
});
