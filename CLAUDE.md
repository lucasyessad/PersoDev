# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TabibPro** is a comprehensive medical practice management software specifically designed for the Algerian healthcare context. It includes AI-powered diagnostic assistance, multi-language support (French, Arabic, Berber, English with RTL), offline-first capabilities, and compliance with Algeria's Law 18-07 data protection regulations.

The system integrates Algeria-specific features including CNAS/CASNOS insurance, Carte Chifa support, Algerian pharmacopoeia (ANPP), the Algerian weekend schedule (Friday-Saturday), and support for Algerian Darija dialect in AI interactions.

## Architecture

This is a **Turborepo monorepo** using **pnpm workspaces**:

```
tabibpro/
├── apps/
│   ├── api/              # NestJS 11 backend (20+ modules)
│   ├── web/              # Next.js 15 professional interface
│   ├── patient-portal/   # Next.js 15 patient portal
│   ├── desktop/          # Electron wrapper (Windows/macOS)
│   └── mobile/           # React Native Expo app (iOS/Android)
├── packages/
│   ├── db-medical/       # Prisma schema — medical database (local only)
│   ├── db-service/       # Prisma schema — service database
│   ├── shared/           # Shared TypeScript types, constants, utilities
│   ├── ui/               # Shared React components
│   └── config/           # Shared configuration
├── docker/               # Docker configs, init scripts, backups
└── docs/                 # Documentation & compliance docs
```

### Dual Database Architecture

**Critical architectural decision**: TabibPro uses **two separate PostgreSQL databases** for compliance with Law 18-07:

1. **`db-medical`** (Prisma schema in `packages/db-medical/`)
   - Stores all sensitive medical data (patient records, consultations, prescriptions)
   - **MUST remain local-only** (never cloud-hosted)
   - Uses pgvector extension for AI embeddings
   - Contains: Patients, Consultations, Ordonnances, Documents, Vaccinations, etc.

2. **`db-service`** (Prisma schema in `packages/db-service/`)
   - Non-sensitive operational data (appointments, messaging, analytics)
   - Can be hosted locally or in the cloud (configurable via `CLOUD_MODE` env var)
   - Contains: RDV, Messages, Notifications, Audit logs

**When modifying models**: Always verify which database the entity belongs to based on data sensitivity.

### Backend Architecture (NestJS)

The API (`apps/api/src/`) is organized into **20+ functional modules**:

**Core Medical**: `patients`, `consultations`, `ordonnances`, `medicaments`, `vaccinations`, `documents`
**Practice Management**: `rdv` (appointments with WebSocket queue), `facturation`, `stock`, `messagerie`, `notifications`
**AI Features**: `ai` (diagnostic assistance, Darija translator, medical dictation)
**Algeria-Specific**: `algeria` (Algerian calendar, holidays, CNAS integration)
**Infrastructure**: `database`, `i18n`, `sync`, `pdf`, `scanner`, `analytics`, `health`

**Key architectural patterns**:
- JWT authentication with role-based access control (RBAC)
- BullMQ queues for async tasks (email, notifications, AI processing)
- Audit interceptor logs all data access (Law 18-07 compliance)
- Locale middleware for multi-language support

### Frontend Architecture (Next.js)

Both `apps/web` and `apps/patient-portal` use:
- **Next.js 15** with App Router
- **next-intl** for i18n (4 languages with RTL support)
- **Zustand** for state management
- **React Query** for server state
- **shadcn/ui** components with Tailwind CSS 4
- **Service Worker + IndexedDB** for offline-first PWA

**Offline capabilities**: The web app functions without internet for consultations, prescriptions, stock management, and daily appointments. AI features require connectivity.

### AI Integration

Uses **Anthropic Claude API** with two modes:
- **Fast model** (`claude-sonnet-4-6`): Quick suggestions, interactions checks
- **Deep model** (`claude-opus-4-6`): Complex diagnostic reasoning

**Critical anonymization flow**: Before sending to external AI API, all patient identifiers are stripped by `apps/api/src/ai/anonymisation.service.ts` (Law 18-07 compliance).

**Unique feature**: Algerian Darija dialect → Medical French translator (`apps/api/src/ai/providers/darija.provider.ts`)

## Development Commands

### Initial Setup

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env
# Edit .env with your values (DB passwords, API keys, etc.)

# Start infrastructure services (PostgreSQL, Redis, Meilisearch, MinIO)
docker compose --profile local-service up -d

# Run database migrations
pnpm db:migrate

# Seed databases with test data
pnpm db:seed
```

### Development

```bash
# Run all apps in dev mode (uses Turborepo)
pnpm dev

# Run specific app
pnpm --filter @tabibpro/api dev
pnpm --filter @tabibpro/web dev
pnpm --filter @tabibpro/patient-portal dev

# Desktop app development
pnpm desktop:dev
```

### Building

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter @tabibpro/api build
```

### Testing

```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm --filter @tabibpro/api test

# Run E2E tests (Playwright)
pnpm --filter @tabibpro/web test:e2e
```

### Database Operations

```bash
# Run migrations on both databases
pnpm db:migrate

# Migrate specific database
pnpm --filter @tabibpro/db-medical db:migrate
pnpm --filter @tabibpro/db-service db:migrate

# Generate Prisma clients after schema changes
pnpm --filter @tabibpro/db-medical generate
pnpm --filter @tabibpro/db-service generate

# Prisma Studio (database GUI)
pnpm --filter @tabibpro/db-medical studio
pnpm --filter @tabibpro/db-service studio

# Reset database (DEV ONLY)
pnpm --filter @tabibpro/db-medical db:reset
```

### Desktop Application

```bash
# Development
pnpm desktop:dev

# Build installers
pnpm desktop:build
pnpm desktop:package:win    # Windows installer
pnpm desktop:package:mac    # macOS DMG
pnpm desktop:package:all    # All platforms
```

### Docker

```bash
# Start all services
pnpm docker:up

# Stop all services
pnpm docker:down

# View logs
pnpm docker:logs
```

## Key Technologies

| Layer | Technology |
|-------|------------|
| Monorepo | Turborepo + pnpm workspaces |
| Backend | NestJS 11, TypeScript 5, Node.js 22+ |
| Frontend | Next.js 15 (App Router), React 19 |
| Mobile | React Native 0.76, Expo 52 |
| Desktop | Electron 33 |
| Databases | PostgreSQL 17 (dual), Prisma 6 |
| Cache/Queues | Redis 7, BullMQ |
| Search | Meilisearch (Arabic support) |
| Storage | MinIO (S3-compatible) |
| AI | Anthropic Claude API |
| UI | Tailwind CSS 4, shadcn/ui, Radix UI |
| State | Zustand, React Query |
| i18n | next-intl (FR/AR/BER/EN, RTL) |

## Algeria-Specific Considerations

### Locale & Calendar

- **Default locale**: French (medical professionals use French)
- **Weekend**: Friday + Saturday (`WEEKEND_DAYS=5,6`)
- **Timezone**: `Africa/Algiers` (UTC+1, no DST)
- **Currency**: Algerian Dinar (DZD)
- **Holidays**: National + religious (Hijri calendar) in `apps/api/src/algeria/calendrier/`

### Healthcare System Integration

- **CNAS** (Caisse Nationale des Assurances Sociales) for employees
- **CASNOS** (Caisse Nationale de Sécurité Sociale des Non-Salariés)
- **Carte Chifa**: 20-digit national health card number
- **ANPP Pharmacopoeia**: Algerian national drug nomenclature
- **PEV**: Algerian national vaccination calendar

### Prescription Regulations

Algerian prescriptions have specific formats:
- **Bi-zone prescriptions**: CNAS/CASNOS reimbursable vs. non-reimbursable
- **Narcotics prescriptions**: Special regulations for controlled substances
- **ALD prescriptions**: Long-term illness (Affection Longue Durée) protocols

See `apps/api/src/ordonnances/` for implementation.

### Payment Methods

Supported Algerian payment systems:
- Cash (most common)
- **CIB** (Carte Interbancaire)
- **Edahabia** (Algérie Poste)
- **BaridiMob** (mobile payment)
- **CCP** (Compte Courant Postal)

## Law 18-07 Compliance

**Critical**: This software handles sensitive medical data under Algeria's **Law 18-07** (data protection). See `docs/conformite/loi-18-07-conformite.md` for full details.

**Key requirements implemented**:
1. **Patient consent**: Explicit, revocable consent required (`consentementDonnees` field)
2. **Data localization**: Medical data stored locally only (never cloud)
3. **Encryption**: AES-256 at rest, TLS 1.3 in transit
4. **Audit trail**: All data access logged via `apps/api/src/common/interceptors/audit.interceptor.ts`
5. **Anonymization**: Patient identifiers stripped before external AI calls
6. **Patient rights**: Export, rectification, deletion endpoints implemented
7. **Access control**: RBAC with role guards

**When adding features that touch patient data**: Ensure audit logging, check consent, and maintain data localization.

## Important Notes

- **Node version**: Requires Node.js 22+
- **Package manager**: Use `pnpm` (version 9.14.0+), not npm or yarn
- **Environment variables**: Never commit `.env` files; use `.env.example` as template
- **Database migrations**: Always test migrations on both `db-medical` and `db-service`
- **Multi-language**: All user-facing strings must support FR/AR/BER/EN (use i18n)
- **RTL support**: UI must work correctly in Arabic/Berber (right-to-left)
- **Offline-first**: Web app must handle offline mode gracefully
- **Algerian context**: Weekend is Fri-Sat, not Sat-Sun
