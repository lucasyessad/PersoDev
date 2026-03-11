# Système d'Onboarding AqarVision

Système d'accueil et de guidage pour les nouvelles agences qui rejoignent AqarVision.

## Vue d'ensemble

Le système d'onboarding guide les nouvelles agences à travers 5 étapes essentielles :

1. **Bienvenue** - Introduction à AqarVision
2. **Profil** - Compléter le profil agence (logo, description, coordonnées)
3. **Première annonce** - Créer et publier un bien immobilier
4. **Mini-site** - Personnaliser la vitrine en ligne
5. **Prêt** - Récapitulatif et prochaines étapes

## Architecture

### Composants

#### `OnboardingWizard.tsx`
Composant principal du wizard en dialog modal.

**Props:**
```typescript
interface OnboardingWizardProps {
  isOpen: boolean;              // Afficher/masquer le wizard
  onClose: () => void;          // Callback de fermeture
  profileComplete?: boolean;    // Étape 2 complétée
  hasListings?: boolean;        // Étape 3 complétée
  hasBranding?: boolean;        // Étape 4 complétée
}
```

**Features:**
- Navigation pas à pas (Précédent/Suivant)
- Actions contextuelles (redirection vers pages de configuration)
- Indicateur de progression visuel
- Possibilité de passer des étapes
- Design responsive et accessible

#### `OnboardingProvider.tsx`
Provider qui gère l'affichage automatique de l'onboarding.

**Logique:**
- Vérifie le statut d'onboarding au chargement
- Affiche le wizard si pas complété
- Mécanisme de "vu aujourd'hui" via localStorage
- Mise à jour temps réel de l'état

### API Routes

#### `POST /api/onboarding/complete`
Marque l'onboarding comme complété.

**Response:**
```json
{ "success": true }
```

#### `GET /api/onboarding/status`
Récupère l'état d'onboarding de l'utilisateur.

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "is_completed": false,
  "profile_completed": true,
  "first_listing_created": false,
  "branding_customized": false,
  "current_step": 2,
  "created_at": "2026-03-09T...",
  "updated_at": "2026-03-09T..."
}
```

**Logique:**
- Vérifie automatiquement l'état de chaque étape
- Crée un nouvel état si inexistant
- Met à jour l'état avec les valeurs actuelles

### Base de données

#### Table `onboarding_state`

```sql
CREATE TABLE onboarding_state (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  profile_completed BOOLEAN DEFAULT false,
  first_listing_created BOOLEAN DEFAULT false,
  branding_customized BOOLEAN DEFAULT false,
  current_step INTEGER DEFAULT 1,
  skipped_steps INTEGER[] DEFAULT '{}',
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  UNIQUE(user_id)
);
```

**Triggers:**
- `trigger_create_onboarding_on_signup` - Crée automatiquement un état pour chaque nouvel utilisateur
- `trigger_update_onboarding_updated_at` - Met à jour `updated_at` automatiquement

**Functions:**
- `is_onboarding_complete(user_id)` - Vérifie si l'onboarding est complété
- `complete_onboarding(user_id)` - Marque l'onboarding comme complété

## Migration

### Appliquer la migration

```bash
# Via Supabase CLI
supabase db push

# Ou manuellement dans le dashboard Supabase
# Exécuter: supabase/migrations/20260309_add_onboarding.sql
```

## Usage

### Intégration dans le layout

Le `OnboardingProvider` est déjà intégré dans [dashboard/layout.tsx](../../app/dashboard/layout.tsx):

```tsx
import { OnboardingProvider } from "@/components/onboarding";

export default function DashboardLayout({ children }) {
  return (
    <div>
      {/* Layout content */}
      <OnboardingProvider />
    </div>
  );
}
```

### Affichage manuel

Pour afficher le wizard manuellement (ex: depuis un bouton "Aide"):

```tsx
"use client";

import { useState } from "react";
import { OnboardingWizard } from "@/components/onboarding";

export function HelpButton() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <>
      <button onClick={() => setShowOnboarding(true)}>
        Afficher le guide
      </button>
      <OnboardingWizard
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </>
  );
}
```

### Marquer manuellement comme complété

```typescript
await fetch("/api/onboarding/complete", { method: "POST" });
```

## Comportement

### Affichage automatique

Le wizard s'affiche automatiquement si :
- ✅ L'utilisateur n'a pas complété l'onboarding (`is_completed = false`)
- ✅ L'utilisateur n'a pas vu l'onboarding aujourd'hui (localStorage)

### Mécanisme "vu aujourd'hui"

Pour éviter d'afficher le wizard à chaque rafraîchissement de page, on stocke dans `localStorage`:

```javascript
localStorage.setItem("onboarding_seen_today", new Date().toDateString());
```

Cela permet à l'utilisateur de fermer le wizard et de le revoir le lendemain s'il n'a pas complété.

### Vérification des étapes

L'API `/api/onboarding/status` vérifie dynamiquement l'état de chaque étape :

1. **Profil** - Présence de `nom_agence`, `slug_url`, `description` dans `profiles`
2. **Annonce** - Au moins 1 listing dans `listings`
3. **Branding** - Présence de `couleur_principale` ou `banniere_url` dans `site_customization`

Ces vérifications sont faites côté serveur pour garantir la précision.

## Personnalisation

### Modifier les étapes

Éditez la constante `STEPS` dans [OnboardingWizard.tsx](./OnboardingWizard.tsx):

```typescript
const STEPS = [
  {
    id: 1,
    title: "Titre de l'étape",
    description: "Description courte",
    icon: IconComponent,
    action: { label: "Action", href: "/page" }, // Optionnel
    content: <div>Contenu JSX</div>,
  },
  // ...
];
```

### Changer les conditions d'affichage

Modifiez la logique dans [OnboardingProvider.tsx](./OnboardingProvider.tsx):

```typescript
// Exemple: afficher seulement pour les agences non vérifiées
if (!state.is_completed && !profile.est_verifie) {
  setShowOnboarding(true);
}
```

### Styling

Le wizard utilise les composants shadcn/ui :
- `Dialog` pour le modal
- `Button` pour les actions
- Classes Tailwind pour le styling

Personnalisez via les classes CSS ou en modifiant les composants.

## Tests

### Tests E2E

Les tests E2E Playwright incluent le parcours d'onboarding :

```bash
npm run test:e2e -- e2e/agency/complete-flow.spec.ts
```

Le test vérifie :
- Inscription → onboarding s'affiche
- Complétion des étapes → navigation correcte
- Wizard se ferme après complétion

### Tests unitaires (TODO)

```bash
npm run test -- onboarding
```

Tests à ajouter :
- Affichage conditionnel du wizard
- Navigation entre étapes
- Actions de redirection
- Appels API

## Analytics (Future)

Pour tracker l'efficacité de l'onboarding :

```typescript
// Dans OnboardingWizard.tsx
const trackStep = (stepId: number) => {
  analytics.track("Onboarding Step Viewed", {
    step_id: stepId,
    step_title: STEPS[stepId - 1].title,
  });
};

const trackCompletion = () => {
  analytics.track("Onboarding Completed", {
    duration_seconds: Date.now() - startTime,
  });
};
```

## Maintenance

### Ajout d'une nouvelle étape

1. Ajouter l'étape dans `STEPS` constante
2. Créer un champ dans `onboarding_state` si nécessaire :
   ```sql
   ALTER TABLE onboarding_state ADD COLUMN new_step_completed BOOLEAN DEFAULT false;
   ```
3. Mettre à jour la logique de vérification dans `/api/onboarding/status`
4. Mettre à jour les props de `OnboardingWizard`

### Supprimer l'onboarding pour un utilisateur

```sql
DELETE FROM onboarding_state WHERE user_id = 'uuid';
-- Ou marquer comme complété
UPDATE onboarding_state SET is_completed = true WHERE user_id = 'uuid';
```

## Troubleshooting

### Le wizard ne s'affiche pas

1. Vérifier que `is_completed = false` dans la DB
2. Vérifier localStorage : `localStorage.removeItem("onboarding_seen_today")`
3. Vérifier la console pour les erreurs API
4. Vérifier que l'utilisateur est bien connecté

### L'état ne se met pas à jour

1. Vérifier les RLS policies dans Supabase
2. Vérifier que l'API `/api/onboarding/status` répond correctement
3. Vérifier les logs serveur pour les erreurs de mise à jour

### Le wizard se réaffiche constamment

Vérifier que `localStorage` fonctionne. Si désactivé (navigation privée), le wizard se réaffichera à chaque chargement.

## Roadmap

- [ ] Analytics intégré
- [ ] Vidéos tutoriels dans chaque étape
- [ ] Tips contextuels dans le dashboard
- [ ] Gamification (badges, progression)
- [ ] Email de rappel si onboarding non complété après X jours
- [ ] A/B testing de différents parcours
- [ ] Support multi-langue (FR/AR)
