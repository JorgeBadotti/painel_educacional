# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is Bun (`bun.lock` present).

```bash
bun install          # install dependencies
bun run dev           # start Vite dev server on port 3000 (--host=0.0.0.0)
bun run build          # production build (vite build)
bun run preview        # preview the production build
bun run lint            # type-check only: `tsc --noEmit` (no ESLint config in the repo)
bun run clean            # rm -rf dist
```

There is no test framework configured in this repo — do not assume Jest/Vitest exist.

## Environment

This is a Google AI Studio applet (`metadata.json` declares `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`). It runs purely client-side (no backend server): `GEMINI_API_KEY` and `APP_URL` are normally injected by AI Studio's Secrets panel at runtime. For local dev, copy `.env.example` to `.env` and set `GEMINI_API_KEY`. `vite.config.ts` bridges `GEMINI_API_KEY` from `.env` into `process.env.GEMINI_API_KEY` in the client bundle via `define` (only `VITE_`-prefixed vars are exposed by default otherwise) — the key ends up in the shipped browser bundle, which is expected for this AI Studio deployment model but worth keeping in mind when touching `vite.config.ts`.

`DISABLE_HMR=true` turns off Vite's HMR/file-watch (used by the AI Studio agent runtime to avoid flicker during automated edits).

## Architecture

**Single Context, no external state library.** Almost all app state (KPIs, schools, alerts, highlights, action plans, municipality config, active tab, selected filters, TV mode, live-streaming toggle, auth/user profile) lives in one provider: `src/context/CockpitContext.tsx`, consumed via the `useCockpit()` hook. `App.tsx` is a thin tab switcher driven by `activeTab` (`ActiveTab` union) that renders one top-level view component per tab, plus a special fullscreen `isTvMode` branch (`TvPresentationMode`) that bypasses the normal layout entirely.

**Two parallel, non-connected data layers — know which one is live.**
- **Live path** (what the UI actually renders): `src/data/mockData.ts` (KPIs, schools, alerts, highlights, action plans) and `src/data/municipalityPresets.ts` (multi-municipality presets + `generateSchoolsForMunicipality`) are consumed directly by `CockpitContext`.
- **Unused path**: `src/services/dashboardService.ts` + `src/schemas/dashboardSchema.ts` (Zod-validated) + the JSON files in `src/data/` (`dashboard.json`, `indicators.json`, `alerts.json`, `highlights.json`, `goals.json`) form a separate, self-contained data-access layer that is not imported by any component. Treat it as legacy/scaffolding unless a task specifically asks to wire it in — don't assume it reflects what's on screen.

**Persistence** is localStorage-based, not a database: `CockpitContext` persists KPIs under `educacao_kpis_data` and the selected municipality under `educacao_municipality_config`, restoring them on mount. Switching municipality (`setMunicipalityConfig`) regenerates the school list via `generateSchoolsForMunicipality` and updates the user profile in place.

**Simulated real-time telemetry**: while `isLiveStreaming` is true, a `setInterval` in `CockpitContext` perturbs KPI `currentValue`s every 5s and updates `lastUpdatedTimestamp` — this is a UI demo effect, not a real data feed.

**Radar de Recursos feature area** (`src/components/radar/*`, tab `radar_recursos`) is the one part of the app with its own persistence and AI integration, independent of `CockpitContext`:
- `src/utils/indexedDbService.ts` (`RadarIndexedDbService`) persists `EducationResourceProgram` records in browser IndexedDB (`CockpitRadarDB`), seeding from `INITIAL_RADAR_PROGRAMS` (`src/data/radarRecursosData.ts`) on first read and falling back to that same in-memory data if IndexedDB is unavailable.
- `src/components/radar/RadarAiAnalysis.tsx` is the only place that calls the Gemini API directly from the browser via `@google/genai`'s `GoogleGenAI`.

**PDF export** (`src/utils/pdfExporter.ts`, `exportCockpitPdf`, triggered from `Header.tsx`) builds an executive-summary PDF client-side with `jspdf` from the current KPI/school/alert/action-plan state — it's drawn manually (coordinates/text placement), not generated from a template.

**Path alias**: `@/*` maps to the repo root (see `tsconfig.json` and `vite.config.ts`), not to `src/`.

**Styling**: Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js` — v4 uses CSS-based config in `src/index.css`).
