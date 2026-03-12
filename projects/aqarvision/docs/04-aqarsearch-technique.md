# AqarSearch — Specification Technique

> Traduction technique de la vision produit AqarSearch en architecture fonctionnelle, routes, donnees, permissions et logique d'implementation

**Version** : 1.0

Pour la vision produit, la regle d'acces et les arbitrages strategiques, voir [01-vision-globale.md](./01-vision-globale.md).
Pour la roadmap par phases, voir [02-roadmap.md](./02-roadmap.md).

---

# 1. Modules principaux

1. **Recherche**
2. **Resultats**
3. **Fiche bien**
4. **Compte utilisateur**
5. **Biens vus**
6. **Notes**
7. **Favoris**
8. **Collections**
9. **Historique**
10. **Alertes**
11. **Messagerie**
12. **Demandes de visite**
13. **Reactivite agence**
14. **Partage**
15. **Analytics**

---

# 2. Routes publiques et privees

```txt
src/app/
  recherche/
    page.tsx
    loading.tsx
    error.tsx
  bien/
    [id]/
      page.tsx
      loading.tsx
      error.tsx
  agence/
    [slug]/
      page.tsx
  espace/
    page.tsx
    favoris/page.tsx
    collections/page.tsx
    recherches/page.tsx
    alertes/page.tsx
    messages/page.tsx
    messages/[conversationId]/page.tsx
    profil/page.tsx
```

## Routes publiques
- `/recherche`
- `/bien/[id]`
- `/agence/[slug]` (si exposee publiquement)

## Routes privees
- `/espace` et toutes ses sous-routes

---

# 3. Recherche immobiliere

## Entrees de recherche
- transaction : vente / location
- pays, wilaya, commune, ville
- type de bien
- budget min / max
- surface min / max
- nombre de pieces
- mots-cles eventuels
- tri

## Exigences
- recherche rapide
- filtres clairs
- URL synchronisee avec les filtres
- pagination serveur simple
- rendu mobile-first

---

# 4. Resultats de recherche

## Contenu minimum d'une carte
- image principale, prix, type de bien
- localisation courte, surface, pieces
- agence source
- bouton favori (si connecte)
- marqueur "deja vu" (si applicable)
- CTA vers detail

## Objectifs
- scan rapide, eviter la surcharge, differencier facilement les resultats, design premium

---

# 5. Fiche detaillee d'un bien

## Sections minimales
- galerie photos, titre, prix, localisation
- caracteristiques, description
- agence concernee
- actions : partage, favori, demande de visite, contact/messagerie

## Actions par statut

| Sans compte | Avec compte |
|------------|-------------|
| Consulter, partager | + Favori, note, message, demande de visite, suivi personnel |

---

# 6. Compte utilisateur particulier

## Donnees minimales
- nom ou prenom/nom, email, mot de passe, telephone optionnel

## Flux recommande
- inscription simple, connexion simple, retour au contexte apres authentification

---

# 7. Biens deja vus

## Cas sans compte
- stockage local temporaire (depend du navigateur)

## Cas avec compte
- stockage persistant, synchronisation cote profil, affichage dans l'espace personnel

## Rendu attendu
- badge "Deja vu" dans les resultats
- bloc "recemment consultes"
- base de la recherche reprise

---

# 8. Notes personnelles

L'utilisateur connecte peut ajouter une note privee sur un bien.
- visible uniquement par son auteur
- modifiable, supprimable
- liee a un bien

---

# 9. Favoris

## Actions
- ajouter, retirer, lister

## UX
- bouton sur carte resultat et fiche bien
- acces dedie dans l'espace personnel

---

# 10. Collections de favoris

## Actions
- creer, nommer, renommer, supprimer une collection
- ajouter / retirer un bien d'une collection

## Regle structurante
Un bien peut appartenir a **plusieurs collections**.

---

# 11. Historique de recherche

## Donnees a stocker
- criteres, localisation, budget, type de bien, date, derniere execution

## Actions
- revoir, relancer, supprimer un element, vider l'historique

---

# 12. Recherche reprise

## Sources
- derniere recherche, derniers biens vus, derniers favoris, dernieres alertes

## Rendu UX
- "Reprendre votre derniere recherche"
- "Continuer la ou vous vous etes arrete"

---

# 13. Alertes de recherche

## Parametres
- nom libre, criteres, frequence, canal (email, notification interne)

## Actions
- creer, activer / desactiver, renommer, supprimer

---

# 14. Alertes enrichies

## Cas retenus
- nouveau bien correspondant a une recherche
- baisse de prix sur un bien suivi
- bien similaire a un favori
- bien similaire a une recherche enregistree

---

# 15. Messagerie securisee

## Regle structurante
La messagerie doit etre initiee depuis un **contexte precis** : fiche bien, fiche agence, ou contexte immobilier dans la recherche.

## Contexte d'une conversation
- agence obligatoire, bien optionnel, origine de l'echange, date du dernier message

## Actions
- creer une conversation, envoyer un message, lire les reponses, marquer comme lu

---

# 16. Historique des messages

## Donnees utiles
- agence, bien concerne (si applicable), dernier message, date, etat lu / non lu

---

# 17. Statut de reactivite agence

## Exemples de rendu
- "repond generalement rapidement"
- "agence active recemment"
- "reponse habituelle rapide"

---

# 18. Demande de visite

## Preremplissage
- informations du bien, reference du bien, agence concernee, contexte de la demande

## Champs modifiables
- nom, telephone, email, message

---

# 19. Partage facile

## Actions minimales
- partager via WhatsApp, copier le lien, envoyer a un proche

---

# 20. Integration avec AqarPro

**Consommer depuis AqarPro** : biens publies, agences visibles, donnees publiques de branding, signaux de reactivite

**Renvoyer vers AqarPro** : vues, clics utiles, messages, demandes de visite, leads, signaux d'interet

---

# 21. Modele de donnees

## Tables principales
- `favorites`
- `favorite_collections`
- `favorite_collection_items`
- `search_history`
- `saved_searches`
- `search_alerts`
- `viewed_properties`
- `property_notes`
- `conversations`
- `messages`
- `visit_requests`

## Tables d'enrichissement
- `agency_responsiveness_stats`
- `user_search_preferences`
- `search_alert_deliveries`

---

# 22. Index de recherche

Creer une vue SQL ou table indexee `search_properties_index` avec :

| Colonne | Description |
|---------|-------------|
| property_id | ID du bien |
| agency_id, agency_name, agency_slug | Agence source |
| title, description | Texte du bien |
| price, currency | Prix |
| transaction_type, type | Type de transaction et de bien |
| surface, rooms, bathrooms | Caracteristiques |
| country, wilaya, commune, city | Localisation |
| images_count | Nombre d'images |
| published_at, updated_at | Dates |
| search_text | Texte de recherche fulltext |

Objectif : eviter des requetes brutes trop complexes sur `properties` a chaque recherche.

---

# 23. Regles de visibilite des annonces

Une annonce est visible publiquement si :
- elle est active
- l'agence est active
- elle possede au minimum : un titre, un prix, une localisation exploitable, une image ou une description suffisante

Les annonces non publiees, brouillons ou internes ne doivent jamais etre exposees.

---

# 24. Validators Zod

Creer ou renforcer :
- `search.ts`, `saved-search.ts`, `alert.ts`
- `favorite.ts`, `collection.ts`, `note.ts`
- `message.ts`, `visit-request.ts`

Chaque validator doit couvrir : structure, typage, limites de longueur, coherence metier minimale.

---

# 25. Server Actions

## `favorites.ts`
- addFavorite, removeFavorite

## `collections.ts`
- createCollection, renameCollection, deleteCollection
- addPropertyToCollection, removePropertyFromCollection

## `notes.ts`
- savePropertyNote, deletePropertyNote

## `search-history.ts`
- trackSearch, clearSearchHistory

## `viewed-properties.ts`
- trackViewedProperty

## `alerts.ts`
- createSavedSearch, updateSavedSearch, deleteSavedSearch
- createSearchAlert, toggleSearchAlert

## `messaging.ts`
- createConversation, sendMessage, markConversationAsRead

## `visit-requests.ts`
- createVisitRequest

Contrat de retour :
```ts
{ success: boolean; error?: string }
```

---

# 26. Queries

- `search.ts`, `property-public.ts`
- `favorites.ts`, `collections.ts`
- `alerts.ts`, `history.ts`
- `messaging.ts`, `visit-requests.ts`
- `agency-public.ts`

---

# 27. API routes eventuelles

- `/api/alerts/dispatch`
- `/api/messages/send`
- `/api/visit-requests/create`
- `/api/historique`
- `/api/favoris`

---

# 28. Composants UI

```txt
src/components/search/
```

### Composants cles
- `search-bar.tsx`, `filter-panel.tsx`
- `result-card.tsx`, `result-empty-state.tsx`
- `favorite-button.tsx`, `viewed-badge.tsx`
- `note-editor.tsx`, `collection-selector.tsx`
- `saved-search-card.tsx`, `alert-button.tsx`
- `conversation-list.tsx`, `message-thread.tsx`
- `visit-request-form.tsx`, `share-actions.tsx`

---

# 29. Permissions et securite

## Visiteur non connecte
- recherche, consultation, partage autorises

## Utilisateur connecte
- acces a l'espace personnel et toutes les fonctionnalites de suivi

## Application des permissions
- dans l'UI, les layouts, les actions, les queries et les policies RLS

## RLS
Toutes les donnees personnelles de suivi doivent etre protegees : favoris, collections, notes, historique, alertes, conversations, messages, demandes de visite.

## Verifications cote serveur
Meme avec RLS : verifier session, contexte, visibilite du bien, agence concernee.

---

# 30. Analytics et evenements

Evenements a tracer :
- `search_executed`, `search_filter_changed`
- `property_viewed`, `property_shared`
- `favorite_added`, `favorite_removed`
- `collection_created`, `collection_renamed`
- `note_added`
- `saved_search_created`, `alert_created`
- `message_sent`, `visit_requested`

---

# 31. Performance et cache

| Route | Strategie |
|-------|-----------|
| `/recherche` | Dynamique avec cache court si necessaire |
| `/bien/[id]` | ISR ou revalidate court |
| `/espace/*` | Prive, pas de cache public |

Pagination : serveur simple, limit / offset au depart.

---

# 32. Tests a ajouter

## Validators
- search.test.ts, alert.test.ts, collection.test.ts
- note.test.ts, message.test.ts, visit-request.test.ts

## Actions
- actions-favorites.test.ts, actions-collections.test.ts, actions-notes.test.ts
- actions-search-history.test.ts, actions-alerts.test.ts
- actions-messaging.test.ts, actions-visit-requests.test.ts

## Logique metier
- recherche libre sans compte
- redirection sur action protegee
- biens deja vus et reprise de recherche
- creation de conversation depuis fiche agence ou fiche bien
- demande de visite contextuelle

---

# 33. Arborescence recommandee

```txt
src/
+-- app/
|   +-- recherche/
|   |   +-- page.tsx, loading.tsx, error.tsx
|   +-- bien/
|   |   +-- [id]/
|   |       +-- page.tsx, loading.tsx, error.tsx
|   +-- espace/
|       +-- page.tsx
|       +-- favoris/page.tsx
|       +-- collections/page.tsx
|       +-- recherches/page.tsx
|       +-- alertes/page.tsx
|       +-- messages/page.tsx
|       +-- messages/[conversationId]/page.tsx
|       +-- profil/page.tsx
|
+-- components/
|   +-- search/
|       +-- search-bar.tsx, filter-panel.tsx
|       +-- result-card.tsx, result-empty-state.tsx
|       +-- favorite-button.tsx, viewed-badge.tsx
|       +-- note-editor.tsx, collection-selector.tsx
|       +-- saved-search-card.tsx, alert-button.tsx
|       +-- conversation-list.tsx, message-thread.tsx
|       +-- visit-request-form.tsx, share-actions.tsx
|
+-- lib/
    +-- actions/
    |   +-- favorites.ts, collections.ts, notes.ts
    |   +-- search-history.ts, viewed-properties.ts
    |   +-- alerts.ts, messaging.ts, visit-requests.ts
    +-- queries/
    |   +-- search.ts, property-public.ts
    |   +-- favorites.ts, collections.ts
    |   +-- alerts.ts, history.ts
    |   +-- messaging.ts, visit-requests.ts, agency-public.ts
    +-- validators/
        +-- search.ts, saved-search.ts, alert.ts
        +-- favorite.ts, collection.ts, note.ts
        +-- message.ts, visit-request.ts
```

---

# 34. Plan d'implementation par phases

## Phase 1 — socle public
- recherche, resultats, fiche bien, index de recherche, visibilite publique

## Phase 2 — compte et suivi personnel
- compte particulier, favoris, collections, notes, biens deja vus, historique de recherche

## Phase 3 — continuite et retention
- recherche reprise, saved searches, alertes, alertes enrichies

## Phase 4 — interaction agence
- messagerie, historique des messages, demande de visite, signaux de reactivite agence

## Phase 5 — optimisation
- analytics, amelioration UX, optimisation des parcours proteges, enrichissement qualite des resultats
