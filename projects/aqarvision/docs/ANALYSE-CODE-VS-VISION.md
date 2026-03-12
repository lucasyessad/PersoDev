# AqarVision — Analyse Code vs Vision

> Comparaison detaillee entre l'implementation actuelle du codebase et la vision produit documentee dans `docs/`

**Date** : 2026-03-12

---

# 1. Synthese globale

| Dimension | Code | Vision | Ecart |
|-----------|------|--------|-------|
| Routes AqarPro | 20+ pages | 25+ pages prevues | ~80% |
| Routes AqarSearch | 12+ pages | 14 pages prevues | ~85% |
| Server Actions | 25 fichiers | 10 fichiers prevus | **Depasse la vision** |
| Queries | 10 fichiers | 11 fichiers prevus | ~90% |
| Validators Zod | 9 fichiers (certains couvrent 2+ schemas) | 8 prevus AqarSearch + 11 prevus AqarPro | ~65% |
| Composants UI | 70+ composants | ~30 prevus | **Depasse la vision** |
| Tables DB | 15+ tables | 12 + 6 enrichissement AqarPro + 3 enrichissement AqarSearch | ~60% |
| Tests | 27 fichiers | 13 fichiers prevus AqarSearch + 11 fichiers prevus AqarPro | ~Aligne |
| Edge Functions | 6 fonctions | Non specifies dans la vision | **Bonus** |

**Score d'alignement global : ~80%**

Le code est substantiel et couvre la majorite des cas MVP. Il depasse meme la vision sur certains aspects (composants, edge functions, integrations, scoring). Mais des ecarts structurels existent.

---

# 2. AqarPro — Analyse detaillee

## 2.1 Ce qui est IMPLEMENTE et ALIGNE avec la vision

### Gestion des annonces — ALIGNE
- CRUD complet (`actions/properties.ts`)
- Publication / depublication / archivage
- Champs : titre, description, prix, type, transaction, surface, pieces, localisation
- 16 amenites avec icones
- Upload images via Cloudinary
- Statuts : brouillon, actif, vendu, loue, archive
- IA generation de description (`actions/ai.ts`, `api/generer-description`)

### Leads et CRM — ALIGNE (depasse la vision)
- Capture de leads (`actions/leads.ts`) avec rate limiting IP (5 req/60s)
- Notes internes sur leads (`actions/lead-notes.ts`)
- Scoring de leads sophistique (`lib/lead-scoring.ts`) — algorithme pondere : contact (25%), message (20%), cible (15%), budget (15%), criteres (10%), source (15%). Niveaux : hot (70+), warm (40-69), cold (0-39)
- Gestion de statut et priorite (`actions/lead-management.ts`)
- Export CSV (gate par plan)
- Vue Kanban (`leads/kanban/page.tsx`, `dashboard/leads-kanban.tsx`)
- Verification des limites mensuelles de leads par plan

### Messagerie — ALIGNE
- Conversations contextualisees (`api/conversations/create`, `actions/messaging.ts`)
- Liste conversations + thread messages
- Composants : `conversation-list.tsx`, `message-thread.tsx`, `message-input.tsx`
- Badge non-lu (`unread-badge.tsx`)

### Branding — ALIGNE (depasse la vision)
- Logo, couleurs, slogan, coordonnees
- Page branding dans settings (`settings/branding/page.tsx`)
- Composant `branding-form.tsx`
- Trust badges (`branding/trust-badges.tsx`)
- Validation plan-aware : le schema Enterprise (`agencyLuxuryBrandingSchema`) ajoute hero video, couleur secondaire, font style, tagline, stats (annees d'experience, biens vendus, clients)
- Multi-wilaya avec designation du siege (`agencyWilayasSchema`)
- Calcul de completude agence (`lib/agency-completeness.ts`) — score pondere sur 13 champs avec suggestions d'amelioration

### Equipe — PARTIELLEMENT ALIGNE
- Table `agency_members` avec roles (admin, agent, viewer)
- Page team (`settings/team/page.tsx`)
- Actions team (`actions/team.ts`) : inviteMember (avec verification limites plan + prevention doublons + reactivation membres inactifs), updateMemberRole, removeMember (soft delete)
- Queries team (`queries/team.ts`) : getAgencyMembers, getAgencyMembersCount
- Verification plan : `canAddMember()` dans le plan gating
- **Manque** : permissions granulaires par role dans les **autres** actions (properties, leads, messages). Actuellement `getAgencyForCurrentUser()` verifie owner OU admin, mais pas les nuances agent/viewer dans chaque action.

### Dashboard — PARTIELLEMENT ALIGNE
- Dashboard avec 4 stat cards (biens, vues, leads, conversion)
- Leads recents et activite recente
- **Manque** : dashboard **personnalisable** (reorganisation widgets, blocs masquables, actions rapides configurables). La vision en fait un element cle, le code a un dashboard fixe.

### Analytics — PARTIELLEMENT ALIGNE
- Tracking evenements (`analytics_events`, `api/analytics/vue`, `api/analytics/clic`)
- Page analytics existe (`analytics/page.tsx`)
- **Manque** : analytics avances (biens les plus consultes, performance par theme, performance vitrine, leads par source)

### IA — PARTIELLEMENT ALIGNE (MVP couvert, V1/V2 manquant)
- Generation de description annonce — OK (`api/generer-description`, `actions/ai.ts`)
- Generation de description agence — OK (`api/generer-description-agence`)
- Pricing IA par plan (`actions/ai-pricing.ts`) — limites de generations par plan
- Composant `dashboard/ai-description-generator.tsx` integre dans le formulaire d'annonce
- **Manque pour V1** : reformulation, amelioration de texte, generation slogan, suggestions de completude automatiques
- **Manque pour V2** : messages marketing, posts sociaux, emails, assistance qualite
- La vision prevoit l'IA "presque partout de maniere discrete", le code ne l'a que sur 2 cas d'usage (descriptions annonce + agence). Le MVP est couvert mais l'expansion est necessaire.

## 2.2 Ce qui est dans le code MAIS PAS dans la vision

- **WhatsApp integration** (`api/whatsapp/send`, `api/whatsapp/webhook`, `agency/whatsapp-button.tsx`) — non prevu dans la vision
- **Social media feed** (`social/fetch-feed.ts`, `agency/social-feed-section.tsx`) — Instagram/Facebook/TikTok integration non prevue
- **Chatbot vitrine** (`vitrine/chatbot-vitrine.tsx`) — non prevu
- **Calculateur pret** (`calculateur/page.tsx`, `property/mortgage-calculator.tsx`) — non prevu
- **Estimateur de prix** (`estimer/page.tsx`, `property/price-estimator.tsx`) — non prevu
- **Comparateur** (`comparer/page.tsx`, `search/compare-button.tsx`, `search/compare-bar.tsx`) — non prevu
- **Prix immobilier / analyse marche** (`prix-immobilier/page.tsx`) — non prevu
- **SEO landing pages** (`(seo)/immobilier/`, `seo/json-ld.tsx`) — non prevu
- **Admin panel** (`admin/dashboard`, `admin/analytics`, `admin/users`, `admin/verifications`) — non prevu dans la vision (mais utile)
- **Onboarding wizard** (`onboarding/OnboardingProvider.tsx`, `onboarding/OnboardingWizard.tsx`) — non prevu mais tres utile
- **Edge Functions Supabase** (6 fonctions : responsiveness, price changes, match properties, notifications, social publish, alert emails) — non prevues mais bonne architecture
- **Systeme d'abonnement complet** (`actions/subscription.ts`) — creation, annulation, calcul de date de fin, mise a jour du plan agence. Modes de paiement locaux : CCP, Baridi Mob, Virement, Cash, Dahabia. Cycles : mensuel, trimestriel (-10%), annuel (-20%)
- **Verification agence** (`actions/verification.ts`) — upload registre de commerce + piece d'identite, workflow de validation
- **Onboarding** (`api/onboarding/complete`, `api/onboarding/status`, composants OnboardingProvider + OnboardingWizard)

## 2.3 Ce qui est dans la vision MAIS PAS dans le code

### MANQUES CRITIQUES (MVP)

| Element manquant | Importance | Ref vision |
|-----------------|------------|------------|
| **Systeme de themes complets** | CRITIQUE | Le code a un `theme-selector.tsx` et `constants/themes.ts` mais il s'agit de variations de couleurs/styles, PAS de vrais templates avec structures differentes (hero centre/editorial, home orientee agence/biens/premium). La vision en fait un element strategique differentiant. |
| **Preview vitrine** | Haute | Route `vitrine/preview/page.tsx` prevue dans la vision, absente du code. L'agence ne peut pas previsualiser sa vitrine avant publication. |
| **Pages vitrine editorielles** | Haute | La vision prevoit des pages editables (equipe, services, zones couvertes, temoignages). Le code n'a que accueil, biens, a propos, contact. |
| **Dashboard personnalisable** | Haute | Table `agency_dashboard_preferences` et actions `saveDashboardPreferences`/`resetDashboardPreferences` prevues. Le dashboard actuel est statique. |
| **Visit requests comme module** | Moyenne | Table `visit_requests` et module dedie prevus. Le code a un `visit-request-form.tsx` mais pas de page de gestion cote agence (`aqarpro/[slug]/visit-requests/`). |

### MANQUES V1/V2

| Element manquant | Phase | Detail |
|-----------------|-------|--------|
| `agency_theme_settings` | V1 | Table pour stocker theme + variantes + reglages de sections par plan |
| `agency_vitrine_pages` | V1 | Table pour contenus editoriaux des pages vitrine |
| `agency_ai_generations` | V1 | Historique des contenus generes par IA |
| `agency_media_collections` | V1 | Organisation des medias par categorie |
| Registre de themes | V1 | Metadonnees, disponibilites par plan, composants sections |
| IA transverse | V2 | Reformulation, slogan, emails, posts sociaux, suggestions qualite |
| Score qualite annonce | V2 | Mecanisme interne de scoring de la qualite d'une annonce |

---

# 3. AqarSearch — Analyse detaillee

## 3.1 Ce qui est IMPLEMENTE et ALIGNE

### Recherche — ALIGNE (depasse la vision)
- Page `/recherche` avec filtres, resultats, pagination
- Composants : `search-bar.tsx`, `filter-panel.tsx`, `result-card.tsx`
- Vue carte avec Leaflet (`results-with-map.tsx`, `search-map.tsx`) — support bounds geographiques
- Filtres : type, transaction, prix, surface, pieces, localisation, mots-cles fulltext
- URL synchronisee avec les filtres
- **`search_properties_view`** : vue SQL dediee a la recherche publique (equivalent du `search_properties_index` prevu dans la vision)
- Trust score (`lib/search/trust-score.ts`) — algorithme pondere : images (25%), description (20%), prix (15%), localisation (15%), plan agence (25%). Niveaux : high (80+), medium (50-79), low (0-49)
- Badges de reactivite agence
- Query builder dynamique (`lib/search/filters.ts`) avec full-text search, fuzzy location, range queries, map bounds

### Fiche bien — ALIGNE
- Page `/bien/[id]` complete
- Galerie, prix, localisation, caracteristiques, description
- Agence source affichee
- Actions : favori, contact, demande de visite, partage
- OpenGraph meta tags

### Compte particulier — ALIGNE
- Inscription / connexion (`auth/visiteur/login`, `auth/visiteur/register`)
- Layout espace utilisateur avec sidebar desktop + nav mobile
- Middleware de redirection pour routes protegees

### Favoris — ALIGNE
- `actions/favorites.ts`, `queries/favorites.ts`
- `search/favorite-button.tsx`
- Page `/espace/favoris`

### Collections — ALIGNE
- `actions/collections.ts`, `queries/collections.ts`, `validators/collections.ts`
- `search/collection-picker.tsx`
- Pages `/espace/collections` et `/espace/collections/[id]`

### Historique — ALIGNE
- `actions/search-history.ts`
- Page `/espace/historique`
- `api/historique`

### Alertes — ALIGNE
- `queries/alerts.ts`, `validators/alert.ts`
- `search/alert-button.tsx`, `search/saved-search-card.tsx`
- Page `/espace/alertes`

### Messagerie — ALIGNE
- Pages `/espace/messages` et `/espace/messages/[id]`
- Composants messaging complets

### Biens deja vus — PARTIELLEMENT ALIGNE
- `actions/viewed-properties.ts` (track + recupere les 200 derniers IDs)
- Hook `use-viewed-properties.ts` — systeme hybride : localStorage (500 items) + serveur (`viewed_properties` table), merge des deux sources
- `search/viewed-badge.tsx` (badge "deja vu")
- **Manque** : bloc "recemment consultes" dans l'espace personnel

### Notes — PARTIELLEMENT ALIGNE
- `actions/notes.ts`, `validators/notes.ts`
- `search/property-note.tsx`
- **Manque** : page dediee dans l'espace personnel pour retrouver toutes ses notes

### Demande de visite — PARTIELLEMENT ALIGNE
- `search/visit-request-form.tsx`
- `actions/visit-requests.ts`, `validators/visit-request.ts`
- **Bonne integration** : la creation d'une demande de visite cree automatiquement un lead avec `source='aqarsearch'` et prefixe le message avec "[Demande de visite]"
- **Manque** : suivi des demandes envoyees dans l'espace personnel

## 3.2 Ce qui est MANQUANT

| Element | Importance | Detail |
|---------|------------|--------|
| **Recherche reprise** | Haute | "Reprendre votre derniere recherche" — Le composant `search-resume-banner.tsx` existe mais la logique complete (sources : derniere recherche + biens vus + favoris + alertes) n'est pas claire |
| **Alertes enrichies** | Moyenne | Baisse de prix, biens similaires. Les edge functions `detect-price-changes` et `match-new-property` existent cote serveur mais l'UI cote utilisateur n'est pas implementee |
| **Reactivite agence (module complet)** | Moyenne | Le badge existe (`responsiveness-badge.tsx`) et l'edge function `calculate-responsiveness` aussi, mais l'affichage dans la fiche agence et les labels ("repond rapidement") ne sont pas complets |
| **Partage enrichi** | Faible | Le composant `bouton-partage.tsx` existe dans vitrine mais pas le `share-actions.tsx` prevu dans la vision (WhatsApp, copier lien, envoyer a un proche) pour AqarSearch |
| ~~`search_properties_index`~~ | ~~Moyenne~~ | **CORRIGE** : la vue `search_properties_view` existe et est utilisee par `queries/search.ts`. Alignement confirme. |
| `favorite_collections` + `favorite_collection_items` | Moyenne | Le modele many-to-many prevu (un bien dans plusieurs collections) est implemente via `actions/collections.ts` (createCollection, addToCollection, removeFromCollection) avec limite de 20 collections par utilisateur. A verifier si le schema de tables correspond exactement au modele prevu. |
| `user_search_preferences` | Faible | Table de preferences de recherche utilisateur |
| `search_alert_deliveries` | Faible | Historique des alertes envoyees |

---

# 4. Architecture et qualite technique

## 4.1 Points forts

- **Middleware solide** : CSRF, security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy), auth redirect, locale detection
- **Separation des responsabilites** : actions / queries / validators / composants — propre
- **RLS active** sur toutes les tables
- **Plan gating tres complet** (`lib/plan-gate.ts`) : factory pattern avec `hasFeature()`, `canPublishProperty()`, `canReceiveLead()`, `canAddMember()`, `canFeatureProperty()`, `remainingStorage()`, `canUpload()`, `isPlanAtLeast()`. Depasse ce que la vision prevoit.
- **Rate limiting** avec Upstash Redis (leads : 5 req/60s)
- **Sentry** configure (client, server, edge)
- **27 tests** couvrant actions, validators, et logique metier
- **i18n** FR/AR/EN avec RTL
- **Edge Functions** pour le traitement asynchrone (bonne architecture)
- **Algorithmes de scoring** : trust score (biens), lead score, completude agence — tous ponderes et bien structures
- **Auth sophistiquee** : `getAgencyForCurrentUser()` verifie owner OU admin member, type guards avec `isAuthError()`
- **Supabase multi-client** : browser, server, admin (service_role) — bien separes
- **React `cache()`** sur toutes les queries pour deduplication intra-requete

## 4.2 Points d'attention

### Routing legacy
Le code a DEUX systemes de dashboard :
- `/dashboard/` (ancien, reference dans CLAUDE.md)
- `/aqarpro/[slug]/` (nouveau, aligne avec la vision)

Le dossier `dashboard/` devrait etre migre vers `aqarpro/[slug]/` ou supprime pour eviter la confusion.

### Routes dupliqueees
Les routes i18n (`[locale]/[agence]/`) et les routes agence (`agence/[slug]/`) coexistent. La strategie de migration n'est pas claire.

### Types legacy
Deux fichiers de types coexistent :
- `types/database.ts` — types modernes avec enums
- `types/index.ts` — types legacy (`TypeBien`, `StatutDocument`, `Listing`)

Ils devraient etre unifies.

### Validators : couverture partielle
9 validators existent avec des schemas solides :
- `property.ts` (titre 3-200 chars, prix, surface, 16 champs)
- `lead.ts` (nom 2+, phone 9+, email optionnel, source enum, status enum)
- `agency.ts` (base + luxury schema Enterprise avec hero_video, stats, font_style)
- `search.ts` (filtres + savedSearchSchema)
- `alert.ts` (saved_search_id, channel, frequency)
- `collections.ts` (nom 1-100 chars)
- `visit-request.ts` (property_id, agency_id, nom, phone, message 500 max)
- `notes.ts` (property_id, content 1-1000 chars)

La vision en prevoit 19 (11 AqarPro + 8 AqarSearch). Il manque :
- `property-media.ts`, `theme.ts`, `dashboard-preferences.ts`, `team.ts`, `ai.ts` (AqarPro)
- `favorite.ts` (AqarSearch)

Note : `branding.ts` est en realite couvert dans `agency.ts` (agencyBrandingSchema + agencyLuxuryBrandingSchema). `saved-search.ts` est couvert dans `search.ts` (savedSearchSchema).

### Config monolithique
`config/index.ts` (426 lignes) melange : locales, plans, pricing, cache, rate limiting, upload, pagination, social media, storage, templates de messages. Un decoupage en fichiers separes serait plus maintenable.

---

# 5. Ecarts critiques par rapport a la vision — Priorites

## Priorite 1 — BLOQUANTS pour le MVP

| # | Ecart | Impact | Effort estime |
|---|-------|--------|---------------|
| 1 | **Systeme de themes** : le code n'a que des variations de couleurs, la vision demande de vrais templates complets avec structures differentes | Bloquant pour la differenciation et la montee en gamme des plans | Eleve |
| 2 | **Dashboard personnalisable** : le dashboard est statique | Bloquant pour la valeur percue AqarPro | Moyen |
| 3 | **Gestion des demandes de visite cote agence** : pas de page `/aqarpro/[slug]/visit-requests/` | L'agence ne peut pas voir/gerer les demandes de visite | Faible |

## Priorite 2 — IMPORTANTS pour la V1

| # | Ecart | Impact |
|---|-------|--------|
| 4 | Pages vitrine editorielles (equipe, services, zones) | Limite la richesse des vitrines |
| 5 | Preview vitrine | L'agence ne voit pas le rendu avant publication |
| 6 | IA etendue (reformulation, slogan, emails, suggestions) | Limite le pilier "Gagner du temps" |
| 7 | Recherche reprise complete | Diminue la retention utilisateur |
| 8 | Table `agency_theme_settings` | Pas de stockage des preferences de theme |
| 9 | Nettoyage routes legacy (`/dashboard/` vs `/aqarpro/[slug]/`) | Confusion et dette technique |
| 10 | Unification des types (`types/database.ts` vs `types/index.ts`) | Risque d'incoherence |

## Priorite 3 — ENRICHISSEMENTS V2

| # | Ecart |
|---|-------|
| 11 | Alertes enrichies (baisse prix, biens similaires) — UI cote utilisateur |
| 12 | Score qualite annonce |
| 13 | Analytics avances (par theme, par source de lead) |
| 14 | IA transverse (contenus sociaux, emails marketing) |
| 15 | Registre complet de themes avec metadonnees |

---

# 6. Elements du code NON prevus dans la vision

Ces elements devraient etre integres dans la vision ou evalues pour suppression :

| Element | Recommandation |
|---------|---------------|
| WhatsApp integration | **Garder** — canal de communication pertinent pour le marche algerien |
| Social media feed (Instagram/FB/TikTok) | **Garder** — enrichit les vitrines Enterprise |
| Calculateur de pret | **Garder** — valeur ajoutee pour AqarSearch |
| Estimateur de prix | **Evaluer** — necessite des donnees de marche fiables |
| Comparateur de biens | **Garder** — fonctionnalite utile pour les particuliers |
| Prix immobilier / analyse marche | **Evaluer** — meme prerequis de donnees |
| SEO landing pages par wilaya | **Garder** — excellent pour l'acquisition organique |
| Admin panel | **Garder** — indispensable pour la gestion de la plateforme |
| Onboarding wizard | **Garder** — ameliore le taux d'activation |
| Chatbot vitrine | **Evaluer** — a confirmer si pertinent |
| Edge Functions | **Garder** — bonne architecture pour les traitements asynchrones |

---

# 7. Recommandations

1. **Mettre a jour la vision** pour integrer les elements precieux du code qui ne sont pas documentes (WhatsApp, SEO, onboarding, admin, edge functions, comparateur)

2. **Prioriser le systeme de themes** — c'est le plus gros ecart et le plus strategique. Sans vrais themes complets, la montee en gamme Starter > Pro > Enterprise perd sa valeur

3. **Implementer le dashboard personnalisable** — table `agency_dashboard_preferences` + composants de reorganisation

4. **Nettoyer le legacy** — supprimer `/dashboard/` au profit de `/aqarpro/[slug]/`, unifier les types, decouper la config

5. **Completer les validators manquants** — les actions sans validators sont des failles de securite potentielles

6. **Ajouter le module demandes de visite cote agence** — faible effort, fort impact sur la completude du flux AqarPro/AqarSearch
