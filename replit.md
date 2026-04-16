# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### WhatsToday (Mobile App)
- **Kind**: Expo (React Native)
- **Path**: `artifacts/whatstoday/`
- **Preview**: `/`
- **Description**: Indian calendar app (Kalnirnay-inspired) showing Tithi, Nakshatra, festivals, and motivational quotes. Features Marathi/English toggle, shareable cards, daily notifications, reminders, and dark mode.

### API Server
- **Kind**: API (Express)
- **Path**: `artifacts/api-server/`
- **Preview**: `/api`

### Canvas (Mockup Sandbox)
- **Kind**: Design
- **Path**: `artifacts/mockup-sandbox/`
- **Preview**: `/__mockup`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## WhatsToday App Structure

```
artifacts/whatstoday/
├── app/
│   ├── _layout.tsx          # Root layout with providers
│   ├── settings.tsx         # Settings screen
│   └── (tabs)/
│       ├── _layout.tsx      # Tab layout
│       └── index.tsx        # Main "What's Today" screen
├── components/
│   ├── TodayCard.tsx        # Main shareable card component
│   ├── DateStrip.tsx        # Horizontal date picker
│   └── ErrorBoundary.tsx    # Error boundary
├── context/
│   └── AppContext.tsx       # Global state (language, darkMode, reminders)
├── data/
│   └── festivals.ts         # Indian calendar data + logic
├── services/
│   └── notifications.ts     # Expo Notifications service
├── constants/
│   └── colors.ts            # Saffron/orange Indian-themed palette
└── hooks/
    └── useColors.ts         # Color scheme hook
```
