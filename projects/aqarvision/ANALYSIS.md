# AqarVision - Analyse Profonde du Projet

**Date:** 2026-03-10
**Version analysée:** 0.1.0

---

## 1. Vue d'ensemble

**AqarVision** est une plateforme SaaS immobilière multi-agences ciblant le marché algérien. Elle permet aux agences immobilières de créer leur vitrine en ligne avec gestion des biens, capture de leads et analytics.

### Proposition de valeur
- Mini-sites vitrines personnalisés par agence (`/agence/[slug]`)
- Système de plans (Starter / Pro / Enterprise) avec fonctionnalités différenciées
- Branding luxury pour les agences Enterprise (thèmes, vidéos hero, animations)
- Intégration réseaux sociaux (Instagram, Facebook, TikTok)
- Gestion de leads avec CRM basique
- Bilinguisme FR/AR avec support RTL

---

## 2. Stack Technique

| Couche | Technologie | Version |
|--------|------------|---------|
| Framework | Next.js (App Router) | 14.2.21 |
| Langage | TypeScript | 5.7.2 |
| Base de données | Supabase (PostgreSQL) | - |
| Auth | Supabase Auth | - |
| Styling | Tailwind CSS | 3.4.16 |
| Validation | Zod | 3.24.1 |
| Icons | lucide-react | 0.577.0 |
| Tests | Vitest | 2.1.8 |

### Dépendances notables
- **Aucun framework UI** (pas de shadcn/ui malgré ce qui est annoncé dans le README global)
- **Pas de state management** externe (React state local uniquement)
- **Pas d'ORM** - requêtes directes via le client Supabase
- **Footprint minimal** - seulement 6 dépendances de production

---

## 3. Architecture

### 3.1 Structure des fichiers (~52 fichiers source)

```
src/
├── app/                    # Pages (App Router)
│   ├── (dashboard)/        # Route group - dashboard protégé
│   └── agence/[slug]/      # Multi-tenant: pages publiques par agence
├── components/
│   ├── agency/             # 9 composants (hero, layout, formulaires)
│   └── seo/                # JSON-LD structured data
├── hooks/                  # 1 hook (scroll reveal)
├── lib/
│   ├── actions/            # Server Actions (branding, leads)
│   ├── queries/            # Requêtes DB avec React cache()
│   ├── social/             # Intégration réseaux sociaux
│   ├── supabase/           # Clients Supabase (server/browser)
│   └── validators/         # Schémas Zod
└── types/                  # Types TypeScript
```

### 3.2 Patterns architecturaux

| Pattern | Implémentation |
|---------|---------------|
| **Multi-tenant** | Routing dynamique `/agence/[slug]` |
| **Plan-based features** | Rendu conditionnel Enterprise vs Starter/Pro |
| **Server Components** | Pages et layout en RSC par défaut |
| **Client Components** | Marqués `'use client'` (hero, layout, formulaires) |
| **Server Actions** | `'use server'` pour mutations (leads, branding) |
| **Query dedup** | `React.cache()` sur les requêtes DB |
| **ISR** | `revalidate: 300` (5 min) sur les pages agence |
| **Validation** | Zod côté serveur avant insertion DB |

### 3.3 Base de données (11 tables)

```
agencies ──┬── agency_members
           ├── properties ──── property_views
           ├── leads ──── lead_notes
           ├── subscriptions
           ├── analytics_events
           ├── notifications
           ├── media
           └── favorites
```

**Points forts du schéma :**
- RLS (Row Level Security) activé sur toutes les tables
- Contraintes CHECK pour tous les enums (plan, status, etc.)
- Triggers `updated_at` automatiques
- Index sur les colonnes fréquemment filtrées
- Support des méthodes de paiement algériennes (CCP, BaridiMob, Dahabia)

---

## 4. Fonctionnalités implémentées

### 4.1 Pages publiques (agence)

| Page | Route | Status |
|------|-------|--------|
| Accueil agence | `/agence/[slug]` | Complet |
| Liste des biens | `/agence/[slug]/biens` | Complet |
| Détail d'un bien | `/agence/[slug]/biens/[id]` | Complet |
| À propos | `/agence/[slug]/a-propos` | Complet |
| Contact | `/agence/[slug]/contact` | Complet |

### 4.2 Dashboard (agence)

| Fonctionnalité | Status |
|----------------|--------|
| Formulaire branding | Complet |
| Upload couverture (Enterprise) | Complet |
| Gestion des biens | Non implémenté |
| Gestion des leads | Non implémenté |
| Analytics dashboard | Non implémenté |
| Gestion des membres | Non implémenté |

### 4.3 Fonctionnalités transversales

| Fonctionnalité | Status | Détails |
|----------------|--------|---------|
| i18n (FR/AR) | Complet | ~55 clés de traduction, support RTL |
| SEO | Complet | Metadata dynamique, JSON-LD, sitemap, robots.txt |
| Social feed | Complet | API Meta + TikTok avec fallback oEmbed |
| Lead capture | Complet | Formulaire + validation Zod |
| WhatsApp | Complet | Bouton flottant + deep link avec message pré-rempli |
| Géolocalisation | Partiel | Composant carte conditionnel (iframe) |
| Tests | Partiel | 3 fichiers (validators, social, i18n) |

---

## 5. Qualité du Code

### 5.1 Points forts

1. **TypeScript strict** - Mode strict activé, types bien définis pour toutes les entités DB
2. **Validation robuste** - Zod côté serveur avec messages d'erreur en français
3. **Séparation des responsabilités** - Actions/queries/validators/types bien isolés
4. **Performance** -
   - React `cache()` pour déduplication des requêtes
   - ISR avec revalidation de 5 minutes
   - YouTube facade pattern (économie ~500KB-1MB au chargement)
   - Animations CSS au lieu de JS (préférence reduced-motion respectée)
5. **Accessibilité** -
   - Skip to content
   - Focus trap dans le menu mobile
   - Gestion Escape pour fermer les modals
   - `aria-label`, `aria-expanded`, `aria-controls` sur les éléments interactifs
   - `aria-hidden` sur les éléments décoratifs
6. **Sécurité** -
   - RLS sur toutes les tables
   - Validation des inputs côté serveur
   - Vérification du plan avant les opérations Enterprise
   - Nettoyage des anciens fichiers lors de l'upload
7. **i18n bien structuré** - Système léger mais fonctionnel avec interpolation

### 5.2 Points faibles et problèmes identifiés

#### Critique

1. **Pas d'authentification dans le dashboard** - Le formulaire branding (`(dashboard)/dashboard/branding`) n'a pas de middleware d'authentification. N'importe qui peut y accéder. Il manque un `middleware.ts` pour protéger les routes `/dashboard/*`.

2. **Server Actions sans vérification d'autorisation** - `updateAgencyBranding()` et `updateAgencyCoverImage()` vérifient le plan mais pas si l'utilisateur courant est bien le propriétaire de l'agence. L'`agencyId` est passé en paramètre et peut être manipulé.

3. **Requête properties sans filtre status** - `getAgencyProperties()` retourne tous les biens sans filtrer par `status = 'active'`. Les biens en draft, archivés ou vendus apparaissent sur le site public.

#### Important

4. **Pas de pagination côté client** - Les pages de listing chargent 6 biens maximum. Il n'y a pas de mécanisme "voir plus" / "page suivante" malgré les clés de traduction `pagination.*` présentes.

5. **Images non optimisées (Starter/Pro)** - La page agence Starter/Pro utilise `<img>` natif au lieu de `<Image>` de Next.js, perdant le bénéfice de l'optimisation automatique (lazy loading, responsive, WebP).

6. **Pas de gestion d'erreur dans les queries** - `getAgencyBySlug()` et `getAgencyProperties()` ignorent silencieusement les erreurs Supabase (`const { data } = ...` sans vérifier `error`).

7. **Social feed tokens globaux** - Les tokens Meta/TikTok sont en variables d'environnement globales, pas par agence. Impossible pour chaque agence d'avoir ses propres tokens.

8. **i18n non utilisé partout** - Les composants luxury (hero, layout, about, properties) utilisent des chaînes en dur en français au lieu du système i18n. La traduction arabe ne fonctionnera pas pour ces composants.

#### Mineur

9. **Pas de loading states** - Seul `/agence/[slug]/loading.tsx` existe. Pas de Suspense boundaries pour les composants individuels.

10. **Tests limités** - Seulement des tests unitaires pour les validators, extracteurs sociaux et i18n. Aucun test de composants, d'intégration ou e2e.

11. **Pas de rate limiting** - Les server actions `createLead()` ne limitent pas le nombre de soumissions. Risque de spam.

12. **Cache React.cache non adapté pour la pagination** - `getAgencyProperties` avec `cache()` et paramètres `limit/offset` peut créer des entrées de cache multiples.

---

## 6. Schéma de sécurité

### RLS (Row Level Security)

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| agencies | Public | Owner (auth) | Owner | Owner |
| properties | Public (active) + Owner | Members | Members | Members |
| leads | Members | **Public** | Members | Members |
| property_views | Members | **Public** | - | - |
| analytics_events | Members | **Public** | - | - |
| subscriptions | Owner | **Backend only** | Backend only | - |
| notifications | Own user | - | Own user | - |
| media | Public | Members | Members | Members |
| favorites | Own user | Own user | Own user | Own user |

### Risques identifiés

1. **INSERT public sur leads/analytics** - Nécessaire fonctionnellement mais risque de spam/DDoS sur les tables. Aucun rate limiting côté DB ou API.
2. **SELECT public sur agencies** - Expose toutes les données de branding, y compris les tokens sociaux qui pourraient être stockés.
3. **Absence de middleware Next.js** - Les routes dashboard ne sont pas protégées au niveau du routing.

---

## 7. Performance

### Points positifs
- ISR avec revalidation 5 min (`revalidate: 300`)
- Requêtes parallèles avec `Promise.all()` (properties + social feed)
- YouTube facade (lazy iframe loading)
- CSS animations avec `@media (prefers-reduced-motion)` support
- `priority` sur les images hero (LCP optimization)
- Google Fonts préchargées dans le layout

### Points d'amélioration
- Pas de `generateStaticParams()` pour la pré-génération des pages agence
- Pas d'image placeholder / blur pour le lazy loading
- Le social feed est fetché côté serveur même si aucun token n'est configuré
- Pas de pagination pour les biens - tous chargés d'un coup

---

## 8. Complétude fonctionnelle

### Ce qui est fait (MVP vitrine)
- Sites publics multi-agences avec branding personnalisé
- 3 niveaux d'affichage (Starter basique / Pro / Enterprise luxury)
- Capture de leads via formulaires
- Intégration WhatsApp
- SEO complet (metadata, JSON-LD, sitemap)
- Bilinguisme FR/AR

### Ce qui manque pour un MVP complet

| Fonctionnalité | Priorité | Complexité |
|----------------|----------|------------|
| **Auth & middleware** | Critique | Faible |
| **CRUD biens** (dashboard) | Haute | Moyenne |
| **Dashboard leads** | Haute | Moyenne |
| **Pagination biens** | Haute | Faible |
| **Upload images biens** | Haute | Moyenne |
| **Dashboard analytics** | Moyenne | Haute |
| **Gestion membres** | Moyenne | Moyenne |
| **Système de paiement** | Moyenne | Haute |
| **Notifications temps réel** | Basse | Moyenne |
| **Recherche/filtres biens** | Haute | Moyenne |
| **Email notifications** | Moyenne | Moyenne |
| **Page pricing/plans** | Moyenne | Faible |

---

## 9. Recommandations prioritaires

### Phase 1 - Sécurité (urgent)

1. **Ajouter `middleware.ts`** pour protéger `/dashboard/*` avec Supabase Auth
2. **Vérifier `auth.uid()`** dans les server actions avant toute mutation
3. **Filtrer `status = 'active'`** dans `getAgencyProperties()` pour les pages publiques
4. **Ajouter un rate limiter** basique sur `createLead()` (par IP ou cookie)

### Phase 2 - Fonctionnalités core

5. **Implémenter le CRUD biens** dans le dashboard (formulaire + upload images)
6. **Ajouter la pagination** des biens sur les pages publiques
7. **Dashboard leads** avec tableau, filtres, et actions (assigner, changer status)
8. **Utiliser `<Image>`** partout au lieu de `<img>` pour l'optimisation automatique

### Phase 3 - Améliorations

9. **Internationaliser les composants luxury** avec le système i18n existant
10. **Ajouter `generateStaticParams()`** pour pré-générer les pages des agences populaires
11. **Tokens sociaux par agence** au lieu de globaux
12. **Tests d'intégration** avec Vitest + happy-dom pour les composants clés
13. **Monitoring erreurs** (Sentry ou équivalent)

---

## 10. Métriques du projet

| Métrique | Valeur |
|----------|--------|
| Fichiers source | ~52 |
| Tables DB | 11 |
| Composants React | 10 |
| Server Actions | 3 |
| Tests | 3 fichiers (~30 tests) |
| Dépendances prod | 6 |
| Dépendances dev | 9 |
| Langues supportées | 2 (FR, AR) |
| Clés de traduction | ~55 par langue |
| Couverture fonctionnelle | ~40% du MVP complet |

---

## 11. Conclusion

AqarVision est un projet bien structuré avec des bases solides pour une v0.1.0. L'architecture est propre, le code est typé et validé, et les patterns Next.js 14 sont correctement utilisés (RSC, Server Actions, React cache, ISR).

Les **priorités immédiates** sont :
1. Sécuriser les routes dashboard et les server actions (authentification/autorisation)
2. Compléter le CRUD des biens et la gestion des leads
3. Corriger le filtre `status` sur les requêtes publiques

Le projet a un bon potentiel pour le marché algérien grâce à :
- L'intégration WhatsApp (canal de communication dominant)
- Le support des méthodes de paiement locales (CCP, BaridiMob, Dahabia)
- Le bilinguisme FR/AR avec RTL
- L'adaptation aux 58 wilayas d'Algérie
