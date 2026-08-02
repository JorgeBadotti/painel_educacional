import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index";
import { indicators, topCards, alerts, highlights, mainGoals, schools, actionPlans, users } from "./src/db/schema";
import { eq } from "drizzle-orm";
import { seedDatabaseIfEmpty } from "./src/db/seed";
import { optionalAuth, AuthRequest } from "./src/middleware/auth";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Attempt to seed DB if connected & empty
  await seedDatabaseIfEmpty();

  // Healthcheck endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // REST API Routes

  // Get full dashboard data
  app.get("/api/dashboard", optionalAuth, async (req: AuthRequest, res) => {
    try {
      const allIndicators = await db.select().from(indicators);
      const allTopCards = await db.select().from(topCards);
      const allAlerts = await db.select().from(alerts);
      const allHighlights = await db.select().from(highlights);
      const goals = await db.select().from(mainGoals);
      const allSchools = await db.select().from(schools);
      const allPlans = await db.select().from(actionPlans);

      res.json({
        metadata: {
          municipality: "Município Modelo",
          title: "PAINEL DE INTELIGÊNCIA EDUCACIONAL",
          subtitle: "Gestão que transforma resultados",
          lastUpdated: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          currentScore: 72.4,
          maxScore: 100,
          scoreComparison: "↑ 8,7 pts vs. ano anterior"
        },
        topCards: allTopCards,
        indicators: allIndicators,
        alerts: allAlerts,
        highlights: allHighlights,
        mainGoal: goals[0] || null,
        schools: allSchools,
        actionPlans: allPlans
      });
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ error: "Erro ao buscar dados do servidor" });
    }
  });

  // Get indicators
  app.get("/api/indicators", async (req, res) => {
    try {
      const result = await db.select().from(indicators);
      res.json(result);
    } catch (error: any) {
      console.error("Error fetching indicators:", error);
      res.status(500).json({ error: "Erro ao carregar indicadores" });
    }
  });

  // Update an indicator value
  app.put("/api/indicators/:indicatorId", async (req, res) => {
    try {
      const { indicatorId } = req.params;
      const { currentValue } = req.body;

      if (currentValue === undefined || typeof currentValue !== "number") {
        return res.status(400).json({ error: "currentValue é obrigatório e deve ser numérico" });
      }

      const existing = await db.select().from(indicators).where(eq(indicators.indicatorId, indicatorId));
      if (existing.length === 0) {
        return res.status(404).json({ error: "Indicador não encontrado" });
      }

      const ind = existing[0];
      const series = ind.postImplementationSeries as Array<{ period: string; value: number }>;
      if (series && series.length > 0) {
        series[series.length - 1].value = currentValue;
      }

      const updated = await db
        .update(indicators)
        .set({
          currentValue: currentValue,
          postImplementationSeries: series,
          updatedAt: new Date(),
        })
        .where(eq(indicators.indicatorId, indicatorId))
        .returning();

      res.json(updated[0]);
    } catch (error: any) {
      console.error("Error updating indicator:", error);
      res.status(500).json({ error: "Erro ao atualizar indicador" });
    }
  });

  // Get alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const result = await db.select().from(alerts);
      res.json(result);
    } catch (error: any) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ error: "Erro ao buscar alertas" });
    }
  });

  // Resolve alert
  app.put("/api/alerts/:alertId/resolve", async (req, res) => {
    try {
      const { alertId } = req.params;
      const updated = await db
        .update(alerts)
        .set({ resolved: true })
        .where(eq(alerts.alertId, alertId))
        .returning();

      res.json(updated[0] || { success: true });
    } catch (error: any) {
      console.error("Error resolving alert:", error);
      res.status(500).json({ error: "Erro ao resolver alerta" });
    }
  });

  // Get action plans
  app.get("/api/action-plans", async (req, res) => {
    try {
      const result = await db.select().from(actionPlans);
      res.json(result);
    } catch (error: any) {
      console.error("Error fetching action plans:", error);
      res.status(500).json({ error: "Erro ao buscar planos de ação" });
    }
  });

  // Create action plan
  app.post("/api/action-plans", async (req, res) => {
    try {
      const { planId, title, indicatorId, schoolName, owner, deadline, status, priority, progress, description } = req.body;
      const newPlan = await db.insert(actionPlans).values({
        planId: planId || `plan_${Date.now()}`,
        title,
        indicatorId,
        schoolName,
        owner,
        deadline,
        status: status || 'em_andamento',
        priority: priority || 'media',
        progress: progress || 0,
        description,
      }).returning();

      res.status(201).json(newPlan[0]);
    } catch (error: any) {
      console.error("Error creating action plan:", error);
      res.status(500).json({ error: "Erro ao criar plano de ação" });
    }
  });

  // Batch sync endpoint for offline queue sync
  app.post("/api/sync", async (req, res) => {
    try {
      const { items } = req.body; // Array of pending items
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: "Formato de sincronização inválido" });
      }

      const processedIds: number[] = [];

      for (const item of items) {
        if (item.type === "indicator_update") {
          const { indicatorId, currentValue } = item.payload;
          const existing = await db.select().from(indicators).where(eq(indicators.indicatorId, indicatorId));
          if (existing.length > 0) {
            const series = existing[0].postImplementationSeries as Array<{ period: string; value: number }>;
            if (series && series.length > 0) {
              series[series.length - 1].value = currentValue;
            }
            await db
              .update(indicators)
              .set({ currentValue, postImplementationSeries: series, updatedAt: new Date() })
              .where(eq(indicators.indicatorId, indicatorId));
          }
        } else if (item.type === "action_plan_create") {
          const p = item.payload;
          await db.insert(actionPlans).values({
            planId: p.planId || `plan_${Date.now()}`,
            title: p.title,
            indicatorId: p.indicatorId,
            schoolName: p.schoolName,
            owner: p.owner,
            deadline: p.deadline,
            status: p.status || 'em_andamento',
            priority: p.priority || 'media',
            progress: p.progress || 0,
            description: p.description,
          }).onConflictDoNothing();
        } else if (item.type === "alert_update") {
          const { alertId, resolved } = item.payload;
          await db.update(alerts).set({ resolved }).where(eq(alerts.alertId, alertId));
        }

        if (item.id) {
          processedIds.push(item.id);
        }
      }

      res.json({ success: true, processedIds });
    } catch (error: any) {
      console.error("Error running batch sync:", error);
      res.status(500).json({ error: "Falha no servidor durante sincronização de dados" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
