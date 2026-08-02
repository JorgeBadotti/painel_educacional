import { db } from './index';
import { indicators, topCards, alerts, highlights, mainGoals, schools, actionPlans } from './schema';
import { eq } from 'drizzle-orm';

import dashboardJson from '../data/dashboard.json';
import indicatorsJson from '../data/indicators.json';
import alertsJson from '../data/alerts.json';
import highlightsJson from '../data/highlights.json';
import goalsJson from '../data/goals.json';

export async function seedDatabaseIfEmpty() {
  try {
    const existingIndicators = await db.select().from(indicators);
    if (existingIndicators.length === 0) {
      console.log('Seeding database with initial educational data...');

      // Seed Indicators
      for (const ind of indicatorsJson) {
        await db.insert(indicators).values({
          indicatorId: ind.indicatorId,
          name: ind.name,
          subtitle: ind.subtitle,
          category: ind.category,
          icon: ind.icon,
          unit: ind.unit,
          decimals: ind.decimals || 1,
          direction: ind.direction,
          historicalSeries: ind.historicalSeries,
          postImplementationSeries: ind.postImplementationSeries,
          currentValue: ind.currentValue,
          annualTarget: ind.annualTarget,
          excellenceTarget: ind.excellenceTarget,
          status: ind.status,
          trend: ind.trend,
          description: ind.description,
          recommendedAction: ind.recommendedAction,
        }).onConflictDoNothing();
      }

      // Seed Top Cards
      for (const card of dashboardJson.topCards) {
        await db.insert(topCards).values({
          cardId: card.id,
          title: card.title,
          value: card.value,
          subvalue: card.subvalue,
          trendText: card.trendText,
          badgeType: card.badgeType,
          detail: card.detail || null,
        }).onConflictDoNothing();
      }

      // Seed Alerts
      for (const alert of alertsJson) {
        await db.insert(alerts).values({
          alertId: alert.id,
          title: alert.title,
          description: alert.description,
          severity: alert.severity,
          category: alert.category,
          schoolName: alert.schoolName,
          date: alert.date,
          resolved: alert.resolved,
        }).onConflictDoNothing();
      }

      // Seed Highlights
      for (const hl of highlightsJson) {
        await db.insert(highlights).values({
          highlightId: hl.id,
          title: hl.title,
          description: hl.description,
          category: hl.category,
          icon: hl.icon,
        }).onConflictDoNothing();
      }

      // Seed Main Goal
      await db.insert(mainGoals).values({
        goalId: 'main_goal_2027',
        title: goalsJson.title,
        targetValue: goalsJson.targetValue,
        targetUnit: goalsJson.targetUnit,
        targetYear: goalsJson.targetYear,
        currentValue: goalsJson.currentValue,
        motto: goalsJson.motto,
        description: goalsJson.description,
      }).onConflictDoNothing();

      // Seed Schools
      const initialSchools = [
        {
          schoolId: 'sch_1',
          name: 'EMEF Maria de Lourdes',
          inep: '35012345',
          region: 'Região Central',
          address: 'Rua das Flores, 120',
          principal: 'Profª Cláudia Silva',
          phone: '(11) 3456-7890',
          studentsCount: 650,
          teachersCount: 32,
          ideb: 6.2,
          frequency: 94.5,
          riskCount: 8,
          status: 'destaque',
        },
        {
          schoolId: 'sch_2',
          name: 'EMEF João Alves de Siqueira',
          inep: '35012346',
          region: 'Região Sul',
          address: 'Av. Paulista, 890',
          principal: 'Prof. Roberto Santos',
          phone: '(11) 3456-7891',
          studentsCount: 820,
          teachersCount: 41,
          ideb: 4.8,
          frequency: 88.2,
          riskCount: 45,
          status: 'atencao',
        },
        {
          schoolId: 'sch_3',
          name: 'EMEF Monte Castelo',
          inep: '35012347',
          region: 'Região Norte',
          address: 'Rua do Bosque, 45',
          principal: 'Profª Márcia Lima',
          phone: '(11) 3456-7892',
          studentsCount: 430,
          teachersCount: 22,
          ideb: 4.2,
          frequency: 84.0,
          riskCount: 62,
          status: 'critico',
        },
        {
          schoolId: 'sch_4',
          name: 'EMEF Dom Pedro I',
          inep: '35012348',
          region: 'Região Leste',
          address: 'Rua 15 de Novembro, 300',
          principal: 'Prof. André Oliveira',
          phone: '(11) 3456-7893',
          studentsCount: 510,
          teachersCount: 28,
          ideb: 5.5,
          frequency: 91.0,
          riskCount: 18,
          status: 'normal',
        },
        {
          schoolId: 'sch_5',
          name: 'EMEF Cecília Meireles',
          inep: '35012349',
          region: 'Região Oeste',
          address: 'Av. das Nações, 1500',
          principal: 'Profª Patricia Gomes',
          phone: '(11) 3456-7894',
          studentsCount: 740,
          teachersCount: 38,
          ideb: 5.9,
          frequency: 93.1,
          riskCount: 12,
          status: 'destaque',
        },
      ];

      for (const sch of initialSchools) {
        await db.insert(schools).values(sch).onConflictDoNothing();
      }

      // Seed Action Plans
      const initialPlans = [
        {
          planId: 'plan_1',
          title: 'Reforço de Leitura no 2º Ano - Escola João Alves',
          indicatorId: 'ind_alfabetizacao',
          schoolName: 'EMEF João Alves de Siqueira',
          owner: 'Coordenadora Heloísa',
          deadline: '2025-08-30',
          status: 'em_andamento',
          priority: 'alta',
          progress: 60,
          description: 'Aplicações quinzenais de testes de fluência leitora e agrupamentos flexíveis.',
        },
        {
          planId: 'plan_2',
          title: 'Busca Ativa Escolar Intensiva - Região Sul',
          indicatorId: 'ind_frequencia',
          schoolName: 'Unidades da Região Sul',
          owner: 'Assistente Social Marcos',
          deadline: '2025-06-15',
          status: 'em_andamento',
          priority: 'alta',
          progress: 40,
          description: 'Visitas domiciliares para alunos com mais de 3 faltas consecutivas injustificadas.',
        },
        {
          planId: 'plan_3',
          title: 'Formação em Tecnologias Educacionais',
          indicatorId: 'ind_tecnologia',
          schoolName: 'Rede Municipal (Todas as Escolas)',
          owner: 'Departamento de TI e Pedagogia',
          deadline: '2025-10-15',
          status: 'planejado',
          priority: 'media',
          progress: 15,
          description: 'Oficinas presenciais e assíncronas para 63 professores com baixo uso de plataformas.',
        },
      ];

      for (const plan of initialPlans) {
        await db.insert(actionPlans).values(plan).onConflictDoNothing();
      }

      console.log('Database seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}
