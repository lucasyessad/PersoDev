# CLAUDE.md — AqarVision

## Project Overview

**AqarVision** is a B2B SaaS platform for Algerian real estate agencies. It provides agency storefronts, property management, lead management, analytics, and branding customization with 3 pricing tiers (Starter, Pro, Enterprise).

## Tech Stack

- **Framework**: Next.js 14 (App Router, SSR/ISR)
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **Styling**: Tailwind CSS + shadcn/ui (Radix)
- **Validation**: Zod
- **Testing**: Vitest
- **Payments**: Stripe
- **Monitoring**: Sentry
- **AI**: Anthropic SDK (description generation)
- **Maps**: Leaflet / React-Leaflet
- **Images**: Cloudinary
- **Email**: Resend
- **Rate Limiting**: Upstash Redis

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest (watch)
npm run test:run     # Vitest (single run)
npm run test:coverage # Vitest with coverage
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login, signup, callback)
│   ├── (seo)/immobilier/  # SEO landing pages
│   ├── [locale]/[agence]/ # i18n agency storefronts
│   ├── admin/             # Admin dashboard (analytics, users, verifications)
│   ├── agence/[slug]/     # Agency mini-site pages
│   ├── aqarpro/[slug]/    # AqarPro pages
│   ├── dashboard/         # Agency dashboard (annonces, leads, branding, analytics, messages)
│   ├── espace/            # User space (favoris, historique, messages, profil)
│   ├── api/               # API routes (admin, analytics, messages, stripe, upload, whatsapp)
│   └── ...                # Other pages (recherche, bien, pricing, calculateur, etc.)
├── components/            # React components
│   ├── agency/            # Agency-specific components
│   ├── analytics/         # Analytics widgets
│   ├── branding/          # Branding customization
│   ├── dashboard/         # Dashboard components
│   ├── property/          # Property display/management
│   ├── recherche/         # Search components
│   ├── ui/                # shadcn/ui base components
│   └── vitrine/           # Agency storefront components
├── lib/                   # Business logic
│   ├── actions/           # Server Actions
│   ├── queries/           # Supabase queries
│   ├── validators/        # Zod schemas
│   ├── supabase/          # Supabase client/server setup
│   ├── utils/             # Utilities
│   └── search/            # Search engine logic
├── hooks/                 # React hooks
├── config/                # App configuration
├── types/                 # TypeScript types
└── __tests__/             # Test suites
```

## Key Conventions

- **Server Actions** in `src/lib/actions/` — all mutations go through server actions
- **Zod validators** in `src/lib/validators/` — validate all inputs
- **Supabase RLS** — Row Level Security enforced on all tables
- **i18n** — Multi-locale support via `[locale]` route segments
- **SaaS gating** — Plan-based feature limits (Starter/Pro/Enterprise)
- **Images** — Always use `next/image`, never `<img>`
- **Error handling** — Use `isAuthError` type guard for auth vs valid results

## PersoDev Library Integration

This project leverages skills, subagents, and workflows from the PersoDev library (`../../library/`).

### Skills to Apply

#### Frontend Design (`../../library/skills/design/frontend-design/`)
Use for all UI/page creation. Key rules:
- Choose a BOLD aesthetic direction — avoid generic AI aesthetics
- No default fonts (Inter, Arial, Roboto) — use distinctive typography
- No clichéd purple gradients or predictable layouts
- Meticulous attention to spatial composition, motion, and visual details
- Production-grade code with animations and micro-interactions

#### Frontend Design Plugin (`../../library/skills/design/frontend-design-plugin/`)
Automatically applies to frontend work — generates distinctive, production-ready code.

#### Theme Factory (`../../library/skills/design/theme-factory/`)
Use for agency branding customization and luxury branding (Enterprise plan).
Apply consistent color palettes and typography across agency storefronts.

#### Web App Testing (`../../library/skills/development/webapp-testing/`)
Use for testing the running application with Playwright:
- Reconnaissance first (screenshot/DOM inspection)
- Wait for `networkidle` before inspecting
- Inspect rendered state to discover selectors

#### Context7 (`../../library/skills/development/context7/`)
MCP server for up-to-date Next.js 14, Supabase, Tailwind, and other library documentation.
Use to avoid hallucinated or outdated API usage.

### Subagents to Activate

#### Next.js Developer (`../../library/subagents/languages/nextjs-developer.md`)
Activate for architectural decisions and feature implementation:
- Next.js 14+ App Router best practices
- Core Web Vitals > 90, SEO score > 95
- Edge runtime compatibility
- ISR/SSR optimization

#### TypeScript Pro (`../../library/subagents/languages/typescript-pro.md`)
Activate for type system work:
- Strict mode, no `any` without justification
- 100% type coverage for public APIs
- Advanced patterns: discriminated unions, branded types for IDs
- Zod schema inference for type safety

#### QA Expert (`../../library/subagents/testing/qa-expert.md`)
Activate for test strategy:
- Target 90%+ coverage
- Test design techniques for server actions, API routes, components
- Continuous testing practices

#### Security Engineer (`../../library/subagents/infrastructure/security-engineer.md`)
Activate for security review:
- Supabase RLS policy audit
- API route protection
- Input validation (Zod at boundaries)
- Secrets management
- OWASP top 10 prevention

### Workflows to Follow

#### Verification Before Completion (`../../library/workflows/verification-before-completion/`)
**MANDATORY** — Never claim work is complete without fresh verification:
1. Identify the verification command (`npm run build`, `npm run test:run`, `npm run lint`)
2. RUN the command fresh
3. READ the output and check exit code
4. VERIFY output confirms the claim
5. ONLY THEN mark as complete

#### Automated Code Review (`../../library/workflows/code-review/automated-code-review/`)
Run `/code-review` on PRs — uses 4 parallel agents to check:
- CLAUDE.md compliance
- Bug detection
- Git history context
- Score threshold: 80+ confidence

#### Planning (`../../library/workflows/planning/manus-style/`)
Use Manus-style planning for major features:
- Structured phases with clear deliverables
- Task breakdown with dependencies
- Verification checkpoints

## Database Schema (11 tables)

Key tables: `agencies`, `properties`, `leads`, `agency_members`, `conversations`, `messages`, `favorites`, `search_alerts`, `analytics_events`, `agency_verifications`, `profiles`

## Environment Variables

Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ANTHROPIC_API_KEY`, `CLOUDINARY_*`, `RESEND_API_KEY`, `UPSTASH_REDIS_*`, `SENTRY_*`
