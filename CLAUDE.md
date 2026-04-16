# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite) at localhost:5173
npm run build      # Type-check + production build
npm run lint       # ESLint
npm run preview    # Preview production build
```

No test suite is configured yet.

## Environment

Requires `.env.local` with:
```
VITE_API_BASE_URL=http://localhost:8080
```

## Architecture

**Stack:** React 19, TypeScript, Vite (rolldown-vite), Tailwind CSS v4, shadcn/ui (new-york style), Framer Motion, React Router v7, Axios.

**Path alias:** `@/` maps to `src/`.

### Folder structure

```
src/
  app/
    App.tsx            # Route definitions (BrowserRouter)
    layout/            # AppLayout (Navbar + max-width wrapper), AuthLayout
    routes/            # One file per page/route
  features/
    auth/              # Login/signup API calls, session management
    dashboard/         # DashboardShell + tab panels
  shared/
    api/               # Axios instance + per-resource API modules
    types/api.ts       # All DTO types mirroring backend payloads
  components/ui/       # shadcn/ui generated components (do not edit manually)
```

### Auth & session

- JWT stored in `localStorage` under key `blinkpay_token` (via `src/shared/api/token.ts`).
- User metadata (`firstName`, `email`) stored under `blinkpay_user`.
- `startSession` / `endSession` in `src/features/auth/session.ts` manage both keys and fire a `auth:changed` window event so the Navbar can react without a global store.
- The Axios instance (`src/shared/api/http.ts`) auto-attaches the Bearer token via a request interceptor.

### Dashboard

`DashboardShell` renders a pill-tab switcher (Instant Pay, Split Pay, Wallet, History, Friends, Settle Up). Each tab is a self-contained panel component under `src/features/dashboard/components/`. Tab transitions use Framer Motion `AnimatePresence`.

### API layer

Each resource has its own module in `src/shared/api/` (`payments.ts`, `wallet.ts`, `users.ts`, `friends.ts`, `debts.ts`, `history.ts`). All use the shared `http` Axios instance. DTOs are defined centrally in `src/shared/types/api.ts`.

### shadcn/ui

Add new components with:
```bash
npx shadcn add <component>
```
Components land in `src/components/ui/`. The `cn()` utility is at `src/lib/utils.ts`.
