import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { registerAuthRoutes, requireAuth } from './server/auth';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Identity provider shared with the smart-teacher app: its frontend calls
// /api/auth/* on this server directly (cross-origin), so it needs to be in
// the allowlist. ALLOWED_ORIGINS is a comma-separated list; unset = same
// origin only (fine when this server's own frontend is the only caller).
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins.length > 0 ? allowedOrigins : false }));

app.use(express.json());

registerAuthRoutes(app);

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY setup missing in environment.');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Cockpit de Inteligência Educacional' });
});

// Generates the Radar de Recursos executive analysis with Gemini. This used
// to run client-side in RadarAiAnalysis.tsx with GEMINI_API_KEY bridged into
// the browser bundle; it now runs here so the key never leaves the server.
app.post('/api/radar-analysis', requireAuth, async (req, res) => {
  try {
    const { programs, metrics } = req.body as {
      programs?: Array<{
        program: string;
        daysToDeadline: number;
        eligibilityStatus: string;
        checklist: Array<{ uploaded: boolean }>;
      }>;
      metrics?: { totalPotentialValue: number; iarIndex: number };
    };

    if (!Array.isArray(programs) || !metrics) {
      res.status(400).json({ error: 'Payload inválido: "programs" e "metrics" são obrigatórios.' });
      return;
    }

    const urgentPrograms = programs.filter((p) => p.daysToDeadline <= 15 && p.eligibilityStatus !== 'encerrado');
    const docPendingPrograms = programs.filter(
      (p) => p.eligibilityStatus === 'pendente' || p.checklist.some((c) => !c.uploaded)
    );

    const promptText = `Você é o Consultor Chefe de Inteligência Financeira Educacional para Secretarias Municipais do Brasil.
Com base nos dados abaixo do município:
- Total de Programas: ${programs.length}
- Valor Potencial Total: R$ ${metrics.totalPotentialValue}
- Programas com Prazo em < 15 dias: ${urgentPrograms.map((p) => p.program).join(', ')}
- Programas em Risco/Pendentes: ${docPendingPrograms.map((p) => p.program).join(', ')}
- Pontuação IAR Atual: ${metrics.iarIndex}/100

Gere um parecer executivo sucinto (3 parágrafos curtos) em tom altamente profissional e objetivo com:
1. Recomendação prioritária para o Secretário de Educação
2. Plano de saneamento documental de curto prazo
3. Estimativa de impacto financeiro no orçamento municipal.`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
    });

    res.json({ text: response.text || 'Análise gerada com sucesso.' });
  } catch (err: any) {
    console.error('Error in /api/radar-analysis:', err);
    res.status(500).json({ error: err.message || 'Erro ao gerar análise com IA.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Cockpit de Inteligência Educacional] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
