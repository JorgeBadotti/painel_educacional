import { pgTable, serial, text, integer, doublePrecision, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('gestor'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const indicators = pgTable('indicators', {
  id: serial('id').primaryKey(),
  indicatorId: text('indicator_id').notNull().unique(),
  name: text('name').notNull(),
  subtitle: text('subtitle'),
  category: text('category').notNull(),
  icon: text('icon').notNull(),
  unit: text('unit').notNull(),
  decimals: integer('decimals').default(1),
  direction: text('direction').notNull(),
  historicalSeries: jsonb('historical_series').notNull(),
  postImplementationSeries: jsonb('post_implementation_series').notNull(),
  currentValue: doublePrecision('current_value').notNull(),
  annualTarget: doublePrecision('annual_target').notNull(),
  excellenceTarget: doublePrecision('excellence_target').notNull(),
  status: text('status').notNull(),
  trend: text('trend').notNull(),
  description: text('description'),
  recommendedAction: text('recommended_action'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const topCards = pgTable('top_cards', {
  id: serial('id').primaryKey(),
  cardId: text('card_id').notNull().unique(),
  title: text('title').notNull(),
  value: text('value').notNull(),
  subvalue: text('subvalue'),
  trendText: text('trend_text'),
  badgeType: text('badge_type'),
  detail: jsonb('detail'),
});

export const alerts = pgTable('alerts', {
  id: serial('id').primaryKey(),
  alertId: text('alert_id').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  severity: text('severity').notNull(),
  category: text('category'),
  schoolName: text('school_name'),
  date: text('date'),
  resolved: boolean('resolved').default(false),
});

export const highlights = pgTable('highlights', {
  id: serial('id').primaryKey(),
  highlightId: text('highlight_id').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category'),
  icon: text('icon'),
});

export const mainGoals = pgTable('main_goals', {
  id: serial('id').primaryKey(),
  goalId: text('goal_id').notNull().unique(),
  title: text('title').notNull(),
  targetValue: doublePrecision('target_value').notNull(),
  targetUnit: text('target_unit').notNull(),
  targetYear: integer('target_year').notNull(),
  currentValue: doublePrecision('current_value').notNull(),
  motto: text('motto').notNull(),
  description: text('description').notNull(),
});

export const schools = pgTable('schools', {
  id: serial('id').primaryKey(),
  schoolId: text('school_id').notNull().unique(),
  name: text('name').notNull(),
  inep: text('inep'),
  region: text('region'),
  address: text('address'),
  principal: text('principal'),
  phone: text('phone'),
  studentsCount: integer('students_count'),
  teachersCount: integer('teachers_count'),
  ideb: doublePrecision('ideb'),
  frequency: doublePrecision('frequency'),
  riskCount: integer('risk_count'),
  status: text('status'),
});

export const actionPlans = pgTable('action_plans', {
  id: serial('id').primaryKey(),
  planId: text('plan_id').notNull().unique(),
  title: text('title').notNull(),
  indicatorId: text('indicator_id'),
  schoolName: text('school_name'),
  owner: text('owner'),
  deadline: text('deadline'),
  status: text('status').default('em_andamento'),
  priority: text('priority').default('media'),
  progress: integer('progress').default(0),
  description: text('description'),
});
