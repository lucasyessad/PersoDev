# AqarPro — Specification Technique

> Traduction technique de la vision produit AqarPro en architecture fonctionnelle, modules, routes, donnees, permissions et logique d'implementation

**Version** : 1.0

Pour la vision produit, le positionnement et les arbitrages strategiques, voir [01-vision-globale.md](./01-vision-globale.md).
Pour la roadmap par phases, voir [02-roadmap.md](./02-roadmap.md).

---

# 1. Modules principaux

1. **Agences**
2. **Annonces**
3. **Medias**
4. **Mini-vitrines**
5. **Themes**
6. **Branding**
7. **Dashboard**
8. **Leads**
9. **Messagerie**
10. **Demandes de visite**
11. **Equipe**
12. **IA**
13. **Analytics**
14. **Abonnement / plan**
15. **Parametres**

---

# 2. Routes

```txt
src/app/aqarpro/[slug]/
  dashboard/
    page.tsx
  properties/
    page.tsx
    new/page.tsx
    [id]/edit/page.tsx
    [id]/media/page.tsx
  leads/
    page.tsx
    [id]/page.tsx
    kanban/page.tsx
  messages/
    page.tsx
    [id]/page.tsx
  visit-requests/
    page.tsx
    [id]/page.tsx
  vitrine/
    page.tsx
    preview/page.tsx
    themes/page.tsx
    pages/page.tsx
  branding/
    page.tsx
  dashboard-layout/
    page.tsx
  media/
    page.tsx
  analytics/
    page.tsx
  team/
    page.tsx
  settings/
    page.tsx
    billing/page.tsx
    verification/page.tsx
    integrations/page.tsx
```

---

# 3. Dashboard personnalisable

## Blocs candidats
- nouveaux leads
- messages recents
- demandes de visite
- biens publies
- biens brouillons
- annonces a ameliorer
- completude agence
- performance des annonces
- apercu vitrine
- actions rapides

## Stockage
Preferences dashboard dans une table dediee, niveau agence, avec override possible par utilisateur.

---

# 4. Gestion des annonces

## Fonctions
- creer, modifier, supprimer un bien
- publier, depublier, archiver
- dupliquer, marquer comme mis en avant
- gerer statut commercial, contenus texte, media principal, galerie

## Champs fonctionnels minimum
- titre, description, prix, devise
- type de bien, transaction
- surface, pieces, salles de bain
- pays, wilaya, commune, ville, adresse, coordonnees GPS
- caracteristiques, images, videos
- statut, date de publication

## Enrichissements
- version de texte generee par IA
- niveau de completude
- score qualite annonce interne

---

# 5. Gestion des medias

## Fonctions
- upload image et video
- conversion si necessaire
- previsualisation, reordonnancement, suppression
- definition de l'image principale
- assignation a un bien, a la vitrine ou au branding agence

## Types de medias
- propriete, branding, vitrine, equipe

---

# 6. Systeme de mini-vitrines

Chaque agence dispose d'un mini-site public avec :
- home agence
- biens
- page a propos
- page contact
- eventuellement : equipe, services, zones couvertes

La mini-vitrine doit etre pensee comme une vraie presence digitale, pas une simple vue technique.

---

# 7. Systeme de themes

Les themes sont de vrais templates complets, pas des skins.

## Differences structurelles possibles
- hero centre image / hero editorial
- home orientee agence / biens / premium / institutionnelle
- sections differentes, ordre different, navigation differente

## Technique recommandee
Creer un registre de themes avec :
- metadonnees theme
- disponibilites par plan
- composants sections
- regles de mise en page

---

# 8. Branding et personnalisation

## Branding de base
- logo, couverture, couleurs, slogan
- description agence, coordonnees, reseaux sociaux

## Branding avance (Enterprise)
- variations de sections
- polices ou styles encadres
- elements premium du theme
- personnalisation avancee

---

# 9. Leads, messages et demandes de visite

## Leads
Centraliser : formulaires de contact, contacts depuis fiche bien, signaux de AqarSearch, leads directs.

## Messages
Centraliser : conversations ouvertes depuis AqarSearch, liees a une agence et eventuellement a un bien.

## Demandes de visite
Recevoir comme objets lisibles, contextualises et tracables.

## Donnees de contexte minimales
- agence, bien eventuel, utilisateur ou visiteur, origine, message, date, statut

---

# 10. Gestion d'equipe et permissions

## Roles et permissions

| Role | Droits |
|------|--------|
| Owner | Tous les droits |
| Admin | Annonces, leads, messages, branding, equipe partielle, analytics |
| Agent | Annonces limitees, leads, messages, demandes de visite |
| Viewer | Lecture seulement |

## Actions
- invitation, suppression, changement de role

Les permissions doivent s'appuyer sur une vraie logique de role, pas seulement un owner_id.

---

# 11. IA integree

## Cas d'usage

### Annonce
- generer titre et description
- reformuler, ameliorer style
- proposer version courte ou premium

### Agence
- generer description agence et slogan
- reformuler page a propos

### Communication
- rediger email, reponse type, message marketing, post social

### Qualite
- suggerer ce qui manque
- detecter une annonce trop faible

## Regle UX
Toujours contextuel : bouton discret, action courte, resultat editable.

---

# 12. Analytics et pilotage

## Donnees utiles
- nombre de biens et leads
- messages recus, demandes de visite
- biens les plus consultes
- annonces incompletes
- performance des themes et de la vitrine

## Affichages possibles
- cartes de synthese, listes actionnables, alertes d'amelioration, vues par periode

---

# 13. Integration avec AqarSearch

**Recevoir depuis AqarSearch** : vues, clics, messages, favoris (signal agrege), demandes de visite, leads

**Exposer vers AqarSearch** : biens actifs, agences visibles, metadonnees publiques, branding public, contexte de reactivite agence

---

# 14. Modele de donnees

## Tables principales
- `agencies`
- `agency_members`
- `properties`
- `media`
- `leads`
- `lead_notes`
- `conversations`
- `messages`
- `visit_requests`
- `subscriptions`
- `notifications`
- `analytics_events`

## Tables d'enrichissement
- `agency_theme_settings` — theme selectionne, variantes, reglages de sections, options par plan
- `agency_vitrine_pages` — contenus editoriaux (accueil, a propos, services, equipe, zones)
- `agency_dashboard_preferences` — ordre des widgets, widgets masques/epingles
- `agency_ai_generations` — historique des contenus generes par IA (type, contexte, texte, version, auteur)
- `agency_media_collections` — organisation des medias (branding, vitrines, institutionnel, biens)

---

# 15. Regles de visibilite et d'exposition

Une annonce est visible publiquement si :
- elle est publiee
- elle appartient a une agence active
- les minima de qualite sont atteints
- aucun blocage n'existe

Une vitrine est visible si :
- l'agence est active
- le theme est valide
- la configuration publique est coherente

Les elements internes ne doivent jamais fuiter : notes internes, preferences dashboard, donnees privees equipe, brouillons.

---

# 16. Configuration centralisee

Le fichier de config doit inclure :
- plans et nombre de themes par plan
- quotas medias
- limites equipe
- options IA, branding, vitrines et analytics par plan

---

# 17. Validators Zod

Creer ou renforcer :
- `agency.ts`, `branding.ts`, `property.ts`, `property-media.ts`
- `theme.ts`, `dashboard-preferences.ts`
- `lead.ts`, `message.ts`, `visit-request.ts`
- `team.ts`, `ai.ts`

Chaque validator doit couvrir : structure, types, tailles maximales, coherence metier minimale.

---

# 18. Server Actions

## `properties.ts`
- createProperty, updateProperty, deleteProperty
- publishProperty, archiveProperty, duplicateProperty

## `media.ts`
- uploadPropertyMedia, deleteMedia, reorderMedia, setPrimaryMedia

## `branding.ts`
- updateAgencyBranding, updateAgencyTheme, updateThemeSettings

## `vitrine.ts`
- updateVitrinePage, previewVitrine, publishVitrineChanges

## `dashboard-preferences.ts`
- saveDashboardPreferences, resetDashboardPreferences

## `leads.ts`
- updateLeadStatus, assignLead, addLeadNote

## `messaging.ts`
- sendAgencyMessage, markConversationRead

## `visit-requests.ts`
- updateVisitRequestStatus

## `team.ts`
- inviteMember, updateMemberRole, removeMember

## `ai.ts`
- generatePropertyTitle, generatePropertyDescription
- improveAgencyDescription, generateMarketingText

Contrat de retour :
```ts
{ success: boolean; error?: string }
```

---

# 19. Queries

- `agency.ts`, `agency-theme.ts`, `agency-vitrine.ts`, `agency-dashboard.ts`
- `properties.ts`, `media.ts`, `leads.ts`, `messages.ts`
- `visit-requests.ts`, `analytics.ts`, `team.ts`

---

# 20. API routes eventuelles

A utiliser si necessaire pour :
- `/api/upload`
- `/api/ai/generate-property-description`
- `/api/ai/generate-agency-copy`
- `/api/webhooks/stripe`
- `/api/webhooks/social`

---

# 21. Composants UI

```txt
src/components/aqarpro/
  dashboard/
  properties/
  media/
  vitrine/
  branding/
  leads/
  messages/
  team/
  analytics/
  ai/
```

### Composants cles
- `dashboard-widget.tsx`, `dashboard-layout-editor.tsx`
- `property-form.tsx`, `property-status-badge.tsx`
- `media-manager.tsx`, `media-gallery-editor.tsx`
- `theme-picker.tsx`, `theme-preview-card.tsx`, `vitrine-preview.tsx`
- `branding-form.tsx`
- `lead-list.tsx`, `lead-kanban.tsx`
- `conversation-list.tsx`, `message-thread.tsx`
- `visit-request-list.tsx`
- `team-table.tsx`
- `ai-action-button.tsx`, `ai-generated-panel.tsx`

---

# 22. Permissions et securite

## Sans authentification
Aucun acces AqarPro.

## Authentifie hors agence
Pas d'acces sauf onboarding agence.

## Membres agence
Acces limite selon role (voir section 10).

## RLS
Toutes les donnees agence sensibles doivent etre protegees : configuration interne, dashboard preferences, messages internes, notes leads, donnees equipe, abonnement, contenus IA non publics.

## Verifications cote serveur
Meme avec RLS : verifier session, role, agence cible, contexte du bien ou de la conversation.

---

# 23. Tests a ajouter

## Validators
- agency-branding.test.ts, theme-settings.test.ts, dashboard-preferences.test.ts
- media.test.ts, ai.test.ts

## Actions
- actions-properties.test.ts, actions-media.test.ts, actions-branding.test.ts
- actions-dashboard-preferences.test.ts, actions-team.test.ts
- actions-messaging.test.ts, actions-visit-requests.test.ts, actions-ai.test.ts

## Logique metier
- permissions par role
- disponibilite des themes par plan
- personnalisation dashboard
- publication vitrine
- gestion image principale
- visibilite publique d'une annonce

---

# 24. Arborescence recommandee

```txt
src/
+-- app/
|   +-- aqarpro/
|       +-- [slug]/
|           +-- dashboard/page.tsx
|           +-- properties/
|           +-- leads/
|           +-- messages/
|           +-- visit-requests/
|           +-- vitrine/
|           +-- branding/
|           +-- media/
|           +-- analytics/
|           +-- team/
|           +-- settings/
|
+-- components/
|   +-- aqarpro/
|       +-- dashboard/
|       +-- properties/
|       +-- media/
|       +-- vitrine/
|       +-- branding/
|       +-- leads/
|       +-- messages/
|       +-- team/
|       +-- analytics/
|       +-- ai/
|
+-- lib/
    +-- actions/
    |   +-- properties.ts, media.ts, branding.ts, vitrine.ts
    |   +-- dashboard-preferences.ts, leads.ts, messaging.ts
    |   +-- visit-requests.ts, team.ts, ai.ts
    +-- queries/
    |   +-- agency.ts, agency-theme.ts, agency-vitrine.ts, agency-dashboard.ts
    |   +-- properties.ts, media.ts, leads.ts, messages.ts
    |   +-- visit-requests.ts, analytics.ts, team.ts
    +-- validators/
        +-- agency.ts, branding.ts, property.ts, property-media.ts
        +-- theme.ts, dashboard-preferences.ts, lead.ts, message.ts
        +-- visit-request.ts, team.ts, ai.ts
```

---

# 25. Plan d'implementation par phases

## Phase 1 — socle agence
- structure AqarPro propre, routes principales, permissions, annonces, branding

## Phase 2 — vitrines et themes
- registre de themes, disponibilite par plan, mini-vitrines structurees, preview vitrine

## Phase 3 — dashboard et medias
- dashboard personnalisable, media manager, image principale, galeries

## Phase 4 — leads et relation client
- leads, messages, demandes de visite, contexte bien/agence

## Phase 5 — IA et montee en gamme
- actions IA, generation de contenus, assistance qualite, enrichissements premium

## Phase 6 — analytics et optimisation
- analytics utiles, pilotage, optimisation UX, amelioration des workflows
