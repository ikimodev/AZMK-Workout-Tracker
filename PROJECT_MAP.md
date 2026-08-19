# PROJECT_MAP.md — AZMK (عزمك) Core Architecture

**Version**: 1.0.0  
**Last Updated**: 2026-08-19  
**Role**: Staff Software Engineer & Technical Lead  

---

## 1. [SYSTEM_FLOW] — End-to-End User Journey

```
[Entry Point: InitialSetupScreen / Onboarding]
   │ (Auto-detect Language: ar/en)
   ▼
[Dashboard: Daily Routine & Overload Target]
   │
   ├──► [Start Workout] ──► [ActiveWorkoutLogger]
   │                           ├── Autocomplete last performance
   │                           ├── Brzycki Target (+2.5kg or reps)
   │                           ├── Numeric input & haptic feedback
   │                           └── On Finish ──► Save to localStorage & calc PRs
   │
   ├──► [Calendar & Activities] ──► Monthly/Weekly view & Cardio Stopwatch
   ├──► [Coach Azzam AI] ──► Bilingual Assistant (5 queries/day on Free)
   ├──► [Programs View] ──► 4-Week Cycle & Manual Workout Builder
   └──► [Analytics / PRs] ──► Real Brzycki 1RM & Volume Delta Math
```

---

## 2. [CORE_ARCHITECTURE & MODULES]

### A. Context & State Engine (`src/context/WorkoutContext.tsx`)
- **Single Source of Truth**: User profile, active workout, history, PRs, calendar activities, i18n language state (`ar` / `en`).
- **Persistence**: `localStorage` with reactive state synchronization.

### B. Core Mathematical & AI Services (`src/services/`)
- `geminiService.ts`: Real Google Gemini 1.5 Flash / 2.0 Flash REST integration with structured JSON multi-day split parser and Coach Azzam grounded LLM persona.
- `progressiveOverload.ts`: Brzycki 1RM formula ($1\text{RM} = W \times (1 + R/30)$), historical delta calculations, dashboard analytics.
- `aiProgramGenerator.ts`: Dynamic 4-week periodized splits (2–6 days, 5–7 exercises/session).
- `aiCoachEngine.ts`: Coach Azzam contextual rule & data reasoning engine (offline fallback).
- `aiWorkoutParser.ts`: Natural language workout parser.

### C. UI & Presentation Layer (`src/components/`)
- `layout/`: `Navbar.tsx` (compact top bar), `BottomNav.tsx` (5-tab mobile bar + slide-up more drawer), `Sidebar.tsx` (desktop navigation & tool gating).
- `dashboard/`: `DashboardView.tsx` (5 mathematical metrics, daily schedule card, rest day advice).
- `workout/`: `ActiveWorkoutLogger.tsx`, `WorkoutHistoryView.tsx`, `ExerciseReplaceModal.tsx`.
- `calendar/`: `CalendarView.tsx` (interactive calendar grid + cardio activity stopwatch logger).
- `ai/`: `AICoachView.tsx` (Coach Azzam chat + quota tracking), `AIProgramGeneratorModal.tsx`, `AIWorkoutImportModal.tsx`.
- `common/`: `InitialSetupScreen.tsx`, `PWAInstallPrompt.tsx`, `PRCelebrationModal.tsx`, `WorkoutSummaryModal.tsx`, `RestTimerFloat.tsx`.

---

## 3. [ORPHANS & PENDING]

| Item | Status | Priority | Description |
|------|--------|----------|-------------|
| *Awaiting user's specific feedback points* | PENDING | HIGH | Precise surgical audit and restructuring based on user review |

---

## 4. [SURGICAL CONSTRAINTS]
- **Simplicity First**: Minimum code, maximum reliability. No micro-file fragmentation.
- **Strict Verification**: Build must pass (`tsc -b && vite build`) with zero regressions.
- **Production-Ready**: Zero placeholders or `// TODO` comments.
