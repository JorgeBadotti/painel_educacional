import dashboardJson from '../data/dashboard.json';
import indicatorsJson from '../data/indicators.json';
import alertsJson from '../data/alerts.json';
import highlightsJson from '../data/highlights.json';
import goalsJson from '../data/goals.json';

import {
  DashboardDataSchema,
  IndicatorSchema,
  AlertSchema,
  HighlightSchema,
  MainGoalSchema
} from '../schemas/dashboardSchema';

import {
  Indicator,
  Alert,
  Highlight,
  MainGoal,
  DashboardMetadata,
  TopCard,
  FullDashboardState
} from '../types/dashboard';

class DashboardService {
  private indicators: Indicator[] = [];
  private alerts: Alert[] = [];
  private highlights: Highlight[] = [];
  private mainGoal: MainGoal;
  private metadata: DashboardMetadata;
  private topCards: TopCard[];

  constructor() {
    // Validate metadata
    this.metadata = DashboardDataSchema.parse(dashboardJson.metadata);
    this.topCards = dashboardJson.topCards as TopCard[];

    // Validate indicators
    this.indicators = indicatorsJson.map((item) => IndicatorSchema.parse(item));

    // Validate alerts
    this.alerts = alertsJson.map((item) => AlertSchema.parse(item));

    // Validate highlights
    this.highlights = highlightsJson.map((item) => HighlightSchema.parse(item));

    // Validate main goal
    this.mainGoal = MainGoalSchema.parse(goalsJson);
  }

  public getDashboardMetadata(): DashboardMetadata {
    return this.metadata;
  }

  public getTopCards(): TopCard[] {
    return this.topCards;
  }

  public getIndicators(category?: string): Indicator[] {
    if (!category || category === 'visao_geral') {
      return this.indicators;
    }
    return this.indicators.filter((ind) => ind.category === category);
  }

  public getIndicatorById(id: string): Indicator | undefined {
    return this.indicators.find((ind) => ind.indicatorId === id);
  }

  public getAlerts(): Alert[] {
    return this.alerts;
  }

  public getHighlights(): Highlight[] {
    return this.highlights;
  }

  public getMainGoal(): MainGoal {
    return this.mainGoal;
  }

  public getFullDashboardData(): FullDashboardState {
    return {
      metadata: this.metadata,
      topCards: this.topCards,
      indicators: this.indicators,
      alerts: this.alerts,
      highlights: this.highlights,
      mainGoal: this.mainGoal,
    };
  }

  public updateIndicatorValue(indicatorId: string, newValue: number): Indicator | undefined {
    const ind = this.indicators.find((i) => i.indicatorId === indicatorId);
    if (ind) {
      ind.currentValue = newValue;
      // Update last post-implementation series point
      if (ind.postImplementationSeries.length > 0) {
        ind.postImplementationSeries[ind.postImplementationSeries.length - 1].value = newValue;
      }
    }
    return ind;
  }
}

export const dashboardService = new DashboardService();
