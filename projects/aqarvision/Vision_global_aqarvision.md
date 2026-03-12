# AqarVision — Roadmap Globale Produit

> Roadmap consolidée de l’écosystème AqarVision  
> Objectif : organiser le développement de AqarVision, AqarPro et AqarSearch par étapes claires, réalistes et dépendantes les unes des autres

**Version** : 1.0  
**Statut** : Roadmap produit consolidée  
**Périmètre** :
- **AqarVision** → écosystème global
- **AqarPro** → branche professionnelle pour agences
- **AqarSearch** → branche particulier pour recherche et suivi

---

# Table des matières

1. [Vision de la roadmap](#1-vision-de-la-roadmap)
2. [Principes de priorisation](#2-principes-de-priorisation)
3. [Lecture globale des phases](#3-lecture-globale-des-phases)
4. [MVP — Fondations commercialisables](#4-mvp--fondations-commercialisables)
5. [V1 — Produit structuré et cohérent](#5-v1--produit-structuré-et-cohérent)
6. [V2 — Montée en gamme et différenciation](#6-v2--montée-en-gamme-et-différenciation)
7. [Dépendances entre modules](#7-dépendances-entre-modules)
8. [Roadmap détaillée AqarPro](#8-roadmap-détaillée-aqarpro)
9. [Roadmap détaillée AqarSearch](#9-roadmap-détaillée-aqarsearch)
10. [Roadmap IA](#10-roadmap-ia)
11. [Roadmap design et expérience](#11-roadmap-design-et-expérience)
12. [Roadmap technique et architecture](#12-roadmap-technique-et-architecture)
13. [Indicateurs de succès par phase](#13-indicateurs-de-succès-par-phase)
14. [Points de vigilance](#14-points-de-vigilance)
15. [Résumé stratégique](#15-résumé-stratégique)

---

# 1. Vision de la roadmap

La roadmap de AqarVision doit respecter une logique simple :

- construire d’abord ce qui rend le produit **utile**
- ensuite ce qui le rend **cohérent**
- ensuite ce qui le rend **premium**
- enfin ce qui le rend **différenciant à grande échelle**

Le produit ne doit pas être pensé comme une accumulation de modules.
Il doit être pensé comme un écosystème dont la valeur repose sur :

- la qualité de **AqarPro** pour les agences
- la qualité de **AqarSearch** pour les particuliers
- la qualité de la **relation entre les deux**

---

# 2. Principes de priorisation

## 2.1 Priorité à la valeur métier
Ce qui aide une agence à publier, paraître crédible et recevoir des leads passe avant le reste.

## 2.2 Priorité à l’usage réel
Ce qui aide un particulier à chercher, suivre et contacter passe avant les fonctions plus “impressionnantes”.

## 2.3 Priorité à la cohérence
Mieux vaut peu de fonctionnalités bien reliées entre elles qu’un grand nombre de briques isolées.

## 2.4 Priorité à la finition des blocs cœur
Les blocs centraux doivent être soignés avant les blocs périphériques :
- annonce
- vitrine
- recherche
- lead
- message
- demande de visite

## 2.5 Priorité à la maintenabilité
La roadmap doit aussi tenir compte des refactors nécessaires pour éviter d’empiler du legacy.

---

# 3. Lecture globale des phases

## MVP
Construire un produit lançable, vendable et compréhensible.

## V1
Construire un produit structuré, cohérent et agréable à utiliser au quotidien.

## V2
Construire un produit différenciant, plus premium, plus puissant et plus difficile à copier.

---

# 4. MVP — Fondations commercialisables

Le MVP doit permettre de répondre à une question simple :

> Est-ce qu’une agence immobilière accepte de payer pour publier ses biens, disposer d’une mini-vitrine professionnelle et recevoir des leads dans un outil centralisé ?

## 4.1 MVP — AqarPro

### Identité agence
- création compte agence
- onboarding simple
- création profil agence
- branding de base
- logo
- couverture
- coordonnées

### Annonces
- CRUD annonces
- publication / dépublication
- statut brouillon / actif / archivé
- champs essentiels d’un bien
- upload image simple
- image principale
- galerie de base

### Mini-vitrine
- mini-site public agence
- 2 thèmes minimum pour Starter
- pages essentielles :
  - accueil
  - biens
  - fiche bien
  - à propos
  - contact

### Leads
- formulaire de contact
- réception des leads
- liste des leads
- statut simple lead
- contexte du bien concerné

### Dashboard
- tableau de bord simple
- statistiques principales :
  - nombre de biens
  - nombre de leads
  - plan actuel
  - complétude de base

### IA
- génération de titre
- génération de description d’annonce
- reformulation simple

---

## 4.2 MVP — AqarSearch

### Public non connecté
- recherche libre
- filtres de base
- consultation des résultats
- consultation des fiches biens

### Compte particulier
- inscription
- connexion
- redirection retour contexte

### Suivi utilisateur
- favoris
- collections de favoris
- historique de recherche
- biens déjà vus

### Contact
- message à agence depuis fiche bien ou fiche agence
- demande de visite simple préremplie
- remontée vers AqarPro

### Alertes
- création de recherche sauvegardée
- alerte simple sur nouvelle annonce correspondante

---

## 4.3 MVP — Technique minimale nécessaire

- permissions propres agence / particulier
- séparation claire des routes
- RLS correctes
- index de recherche
- tracking minimal analytics
- suppression des incohérences les plus dangereuses du legacy

---

# 5. V1 — Produit structuré et cohérent

La V1 doit transformer le MVP en produit réellement stable, cohérent et plus crédible.

## 5.1 V1 — AqarPro

### Mini-vitrines
- 5 thèmes pour Pro
- thèmes réellement différenciés
- meilleure preview vitrine
- contenus plus riches
- pages éditoriales supplémentaires

### Dashboard
- dashboard personnalisable
- widgets réorganisables
- actions rapides personnalisables
- aperçu de vitrine
- annonces à améliorer

### Médias
- gestion média plus propre
- réorganisation galerie
- vidéos
- collections média agence
- meilleure expérience de gestion visuelle

### Leads et messages
- pipeline leads plus riche
- notes internes
- meilleure lecture du contexte de contact
- historique de messages plus clair
- meilleure gestion des demandes de visite

### IA
- description agence
- slogan
- amélioration de texte
- aide rédactionnelle sur plusieurs écrans
- suggestions de complétude

### Équipe
- rôles propres
- invitation membre
- suppression membre
- permissions plus respectées

### Analytics
- biens les plus consultés
- leads par source
- performance des annonces
- performance vitrine
- bloc d’aide à la décision

---

## 5.2 V1 — AqarSearch

### Recherche
- expérience de recherche plus propre
- meilleure qualité des cartes résultats
- meilleure continuité d’usage mobile

### Suivi personnel
- notes personnelles sur les biens
- reprise de recherche plus intelligente
- meilleure gestion des biens déjà vus
- collections plus abouties

### Alertes
- gestion complète des alertes
- activation / désactivation
- historisation des alertes déclenchées si besoin

### Messagerie
- historique complet
- conversations mieux classées
- lecture / non lu
- meilleur contexte agence / bien

### Réactivité agence
- premiers badges simples
- logique d’affichage plus claire

### Partage
- partage plus soigné
- meilleure expérience multi-supports

---

## 5.3 V1 — Produit global

- cohérence marque AqarVision
- cohérence design AqarPro / AqarSearch
- meilleure stabilité
- meilleure qualité de données
- documentation plus propre
- réduction du legacy

---

# 6. V2 — Montée en gamme et différenciation

La V2 doit faire de AqarVision un produit plus premium, plus difficile à copier et plus fort face au marché.

## 6.1 V2 — AqarPro

### Thèmes et vitrines
- catalogue complet de thèmes
- personnalisation avancée Enterprise
- sections plus riches
- pages supplémentaires :
  - équipe
  - services
  - zones couvertes
  - témoignages
- variations premium plus fortes

### IA partout de manière discrète
- assistance sur plus d’écrans
- messages commerciaux
- contenus sociaux
- emails
- optimisation des annonces
- suggestions éditoriales contextuelles

### Médias premium
- meilleure gestion vidéo
- meilleure optimisation visuelle
- pipeline média plus riche
- rendu plus haut de gamme

### Pilotage avancé
- analytics plus poussés
- qualité d’annonce
- suivi de performance par thème
- vue plus business

---

## 6.2 V2 — AqarSearch

### Alertes enrichies
- baisse de prix
- biens similaires
- détection plus intelligente de proximité avec les recherches sauvegardées

### Suivi personnel plus fort
- espace utilisateur plus riche
- meilleure orchestration entre historique, favoris, alertes et messages

### Réactivité agence
- système d’évaluation comportementale plus robuste
- labels plus fiables

### Qualité de recherche
- résultats mieux hiérarchisés
- ranking amélioré
- enrichissement des signaux de qualité

---

## 6.3 V2 — Produit global

- expérience plus premium
- meilleure rétention particulier
- meilleure valeur perçue côté agence
- meilleur levier de conversion commerciale

---

# 7. Dépendances entre modules

## 7.1 Dépendances cœur AqarPro
- branding dépend du profil agence
- mini-vitrine dépend du branding + thèmes + annonces publiées
- dashboard dépend des annonces + leads + messages + préférences
- leads dépendent des formulaires / messages / demandes de visite
- IA dépend du contexte de contenu

## 7.2 Dépendances cœur AqarSearch
- recherche dépend de l’index des biens publiés
- favoris dépendent du compte utilisateur
- collections dépendent des favoris
- biens déjà vus dépendent de la consultation
- recherche reprise dépend de l’historique + biens vus
- alertes dépendent des recherches sauvegardées
- messagerie dépend d’un contexte agence ou bien
- demande de visite dépend du bien + agence

## 7.3 Dépendances transverses
- AqarSearch dépend de la qualité de publication côté AqarPro
- la qualité de lead dépend de la qualité de la fiche bien
- la valeur d’un thème dépend de la qualité du branding et des contenus
- la valeur de l’IA dépend de la qualité des champs de saisie et des workflows

---

# 8. Roadmap détaillée AqarPro

## MVP
- onboarding agence
- branding de base
- CRUD biens
- upload image simple
- mini-vitrine simple
- leads simples
- dashboard simple
- IA annonce minimale

## V1
- thèmes enrichis
- dashboard personnalisable
- médias avancés
- leads plus propres
- messagerie plus claire
- équipe
- IA étendue
- analytics utiles

## V2
- thèmes premium avancés
- personnalisation Enterprise forte
- IA transverse
- analytics avancés
- pilotage plus business
- expérience média premium

---

# 9. Roadmap détaillée AqarSearch

## MVP
- recherche libre
- fiche bien
- compte particulier
- favoris
- collections
- historique
- biens vus
- message contextuel
- demande de visite simple
- alertes simples

## V1
- notes personnelles
- recherche reprise
- meilleure messagerie
- meilleure gestion des alertes
- badges simples de réactivité
- meilleure UX de suivi

## V2
- alertes enrichies
- ranking amélioré
- signaux de qualité renforcés
- espace personnel plus intelligent
- meilleure orchestration entre tous les blocs

---

# 10. Roadmap IA

## MVP
- titre annonce
- description annonce
- reformulation simple

## V1
- description agence
- slogan
- amélioration de textes
- assistance rédactionnelle sur plusieurs écrans

## V2
- assistance partout de manière discrète
- messages commerciaux
- emails
- contenus sociaux
- suggestions qualité
- optimisation de complétude

---

# 11. Roadmap design et expérience

## MVP
- interface propre
- cohérence minimale
- recherche lisible
- mini-vitrine crédible

## V1
- cohérence forte AqarVision / AqarPro / AqarSearch
- meilleures cartes
- meilleures pages agence
- dashboard plus premium

## V2
- expérience vraiment haut de gamme
- thèmes plus puissants
- qualité visuelle supérieure
- meilleure sensation de produit “grand groupe”

---

# 12. Roadmap technique et architecture

## MVP
- structuration propre des routes
- base permissions
- RLS propres
- index de recherche
- nettoyage des plus gros doublons

## V1
- unification plus forte des modules
- réduction du legacy
- meilleure séparation des domaines
- meilleures queries / actions / validators

## V2
- optimisation performance
- raffinement architecture
- observabilité
- qualité technique renforcée

---

# 13. Indicateurs de succès par phase

## MVP
- agences onboardées
- biens publiés
- premières mini-vitrines actives
- premiers leads générés

## V1
- usage récurrent des agences
- usage réel de AqarSearch avec compte
- taux d’activation des favoris / alertes / messages
- rétention meilleure

## V2
- montée en gamme des plans
- valeur perçue plus forte
- plus de leads qualifiés
- meilleure différenciation marché

---

# 14. Points de vigilance

## 14.1 Risque de dispersion
Trop de modules en parallèle peut affaiblir la qualité des blocs cœur.

## 14.2 Risque de produit trop large
AqarPro et AqarSearch ensemble représentent déjà beaucoup.
Il faut séquencer proprement.

## 14.3 Risque de dette technique
Le legacy et les doublons doivent être traités progressivement pour ne pas polluer la suite.

## 14.4 Risque de design incohérent
Les thèmes, dashboards et espaces particuliers doivent tous rester dans la même famille de marque.

## 14.5 Risque de sur-IA
L’IA doit rester utile et discrète, pas devenir une surcouche confuse.

---

# 15. Résumé stratégique

La roadmap globale de AqarVision doit suivre cette logique :

## D’abord
Construire un **MVP commercialisable** :
- agences
- annonces
- mini-vitrines
- leads
- recherche
- compte particulier
- suivi simple

## Ensuite
Construire une **V1 cohérente et structurée** :
- thèmes enrichis
- dashboard personnalisable
- médias plus forts
- messagerie plus claire
- IA plus présente
- suivi particulier plus solide

## Enfin
Construire une **V2 premium et différenciante** :
- montée en gamme visuelle
- IA transverse
- analytics plus puissants
- alertes enrichies
- meilleure rétention
- meilleure valeur perçue

AqarVision doit donc être développé comme un produit complet, mais en séquençant clairement ce qui :
- crée la valeur
- crée la cohérence
- crée la différenciation

# AqarSearch — Document Global Technique

> Traduction technique de la vision produit AqarSearch en architecture fonctionnelle, routes, données, permissions et logique d’implémentation

**Version** : 1.0  
**Statut** : Spécification technique consolidée  
**Produit parent** : AqarVision  
**Branche concernée** : AqarSearch  
**Objectif** : définir une base technique propre, cohérente et exploitable pour la branche particulier de la plateforme

---

# Table des matières

1. [Définition de AqarSearch](#1-définition-de-aqarsearch)
2. [Objectif technique](#2-objectif-technique)
3. [Rôle dans l’écosystème AqarVision](#3-rôle-dans-lécosystème-aqarvision)
4. [Principes d’architecture](#4-principes-darchitecture)
5. [Règle d’accès fondamentale](#5-règle-daccès-fondamentale)
6. [Périmètre fonctionnel](#6-périmètre-fonctionnel)
7. [Modules principaux](#7-modules-principaux)
8. [Routes publiques et privées](#8-routes-publiques-et-privées)
9. [Recherche immobilière](#9-recherche-immobilière)
10. [Résultats de recherche](#10-résultats-de-recherche)
11. [Fiche détaillée d’un bien](#11-fiche-détaillée-dun-bien)
12. [Compte utilisateur particulier](#12-compte-utilisateur-particulier)
13. [Biens déjà vus](#13-biens-déjà-vus)
14. [Notes personnelles](#14-notes-personnelles)
15. [Favoris](#15-favoris)
16. [Collections de favoris](#16-collections-de-favoris)
17. [Historique de recherche](#17-historique-de-recherche)
18. [Recherche reprise](#18-recherche-reprise)
19. [Alertes de recherche](#19-alertes-de-recherche)
20. [Alertes enrichies](#20-alertes-enrichies)
21. [Messagerie sécurisée](#21-messagerie-sécurisée)
22. [Historique des messages](#22-historique-des-messages)
23. [Statut de réactivité agence](#23-statut-de-réactivité-agence)
24. [Demande de visite](#24-demande-de-visite)
25. [Partage facile](#25-partage-facile)
26. [Intégration avec AqarPro](#26-intégration-avec-aqarpro)
27. [Modèle de données recommandé](#27-modèle-de-données-recommandé)
28. [Tables à créer ou enrichir](#28-tables-à-créer-ou-enrichir)
29. [Index de recherche](#29-index-de-recherche)
30. [Règles de visibilité des annonces](#30-règles-de-visibilité-des-annonces)
31. [Validators Zod](#31-validators-zod)
32. [Server Actions](#32-server-actions)
33. [Queries](#33-queries)
34. [API routes éventuelles](#34-api-routes-éventuelles)
35. [Composants UI à créer](#35-composants-ui-à-créer)
36. [Règles de permissions](#36-règles-de-permissions)
37. [Sécurité et RLS](#37-sécurité-et-rls)
38. [Analytics et événements](#38-analytics-et-événements)
39. [Performance et cache](#39-performance-et-cache)
40. [Tests à ajouter](#40-tests-à-ajouter)
41. [Arborescence recommandée](#41-arborescence-recommandée)
42. [Plan d’implémentation par phases](#42-plan-dimplémentation-par-phases)
43. [Prompt maître pour Claude Code](#43-prompt-maître-pour-claude-code)

---

# 1. Définition de AqarSearch

AqarSearch est la branche particulier de AqarVision.

Elle permet aux utilisateurs finaux de :

- rechercher des biens publiés par les agences présentes sur AqarPro
- consulter librement les annonces sans créer de compte
- créer un compte pour bénéficier de fonctionnalités avancées de suivi
- organiser leur recherche immobilière dans la durée
- échanger avec les professionnels
- demander une visite
- retrouver plus facilement ce qu’ils ont vu, aimé ou sauvegardé

AqarSearch n’est pas une marque autonome.  
C’est la partie visible de AqarVision côté particulier.

AqarSearch n’est pas non plus, dans sa première vision, un agrégateur global externe du marché.  
Il s’appuie d’abord sur l’offre produite dans AqarPro.

---

# 2. Objectif technique

Sur le plan technique, AqarSearch doit fournir une base claire, modulaire et évolutive pour :

- la recherche publique de biens
- la consultation libre des annonces
- le suivi de recherche pour les utilisateurs connectés
- la gestion des favoris et des collections
- la gestion des notes et des biens vus
- les alertes de recherche
- la messagerie sécurisée avec les agences
- les demandes de visite
- la remontée de signaux utiles vers AqarPro

Le système doit rester :

- modulaire
- propre
- typé
- compatible avec Next.js App Router
- compatible avec Supabase et RLS
- cohérent avec les règles d’accès public / connecté

---

# 3. Rôle dans l’écosystème AqarVision

AqarSearch a pour rôle de :

- rendre visibles les biens publiés dans AqarPro
- capter la demande côté particulier
- transformer la recherche libre en recherche suivie
- centraliser les interactions côté utilisateur final
- enrichir AqarPro avec des signaux de comportement et des demandes qualifiées

AqarSearch dépend donc de AqarPro pour :

- les agences
- les biens
- les statuts de publication
- les métadonnées publiques
- certains signaux de réactivité

---

# 4. Principes d’architecture

## 4.1 Recherche libre, suivi connecté
Le produit doit être utilisable sans compte pour la découverte, mais les fonctionnalités avancées doivent être réservées aux utilisateurs connectés.

## 4.2 AqarPro reste la source de vérité
Les agences, les biens et les leads métier restent gérés côté AqarPro.

## 4.3 AqarSearch gère le suivi utilisateur
Les historiques, favoris, collections, notes, alertes et conversations côté particulier relèvent de AqarSearch.

## 4.4 Monolithe modulaire
AqarSearch doit vivre dans le même repo que AqarPro, avec une séparation claire des domaines.

## 4.5 Cohérence des contextes
Les conversations et demandes de visite doivent toujours garder un contexte lisible :
- agence concernée
- bien concerné si applicable
- origine de l’action

---

# 5. Règle d’accès fondamentale

## Utilisateur public non connecté
Peut uniquement :
- rechercher
- filtrer
- consulter les résultats
- consulter les fiches biens
- consulter les agences si elles sont exposées publiquement

## Utilisateur connecté
Peut en plus :
- enregistrer des favoris
- créer des collections
- renommer ses collections
- ajouter des notes personnelles
- voir les biens déjà vus
- consulter son historique de recherche
- reprendre sa recherche
- créer des alertes
- recevoir des notifications
- utiliser la messagerie sécurisée
- consulter l’historique des messages
- envoyer une demande de visite suivie

## Règle UX
Toute tentative d’utiliser une fonctionnalité réservée doit provoquer :
- une redirection vers création de compte ou connexion
- un retour automatique vers la page d’origine après authentification

---

# 6. Périmètre fonctionnel

AqarSearch doit couvrir :

- recherche immobilière
- résultats de recherche
- fiche bien
- compte utilisateur particulier
- biens déjà vus
- notes personnelles
- favoris
- collections de favoris
- historique de recherche
- reprise de recherche
- alertes
- alertes enrichies
- messagerie
- historique des messages
- statut de réactivité agence
- demande de visite
- partage facile

---

# 7. Modules principaux

Les grands modules de AqarSearch sont :

1. **Recherche**
2. **Résultats**
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
13. **Réactivité agence**
14. **Partage**
15. **Analytics**

---

# 8. Routes publiques et privées

Structure recommandée :

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
- `/agence/[slug]` si exposée publiquement

## Routes privées
- `/espace`
- `/espace/favoris`
- `/espace/collections`
- `/espace/recherches`
- `/espace/alertes`
- `/espace/messages`
- `/espace/messages/[conversationId]`
- `/espace/profil`

---

# 9. Recherche immobilière

## Entrées de recherche
Le moteur doit accepter :
- transaction : vente / location
- pays
- wilaya
- commune
- ville
- type de bien
- budget min / max
- surface min / max
- nombre de pièces
- mots-clés éventuels
- tri

## Exigences
- recherche rapide
- filtres clairs
- URL synchronisée avec les filtres
- pagination serveur simple
- rendu mobile-first

## Objectif
Donner une expérience de recherche simple, lisible et premium.

---

# 10. Résultats de recherche

## Contenu minimum d’une carte résultat
- image principale
- prix
- type de bien
- localisation courte
- surface
- pièces
- agence source
- bouton favori si connecté
- marqueur “déjà vu” si applicable
- CTA vers détail

## Objectifs
- permettre un scan rapide
- éviter la surcharge
- différencier facilement les résultats
- maintenir un design premium

---

# 11. Fiche détaillée d’un bien

## Sections minimales
- galerie photos
- titre
- prix
- localisation
- caractéristiques
- description
- agence concernée
- actions principales
- partage
- favori
- demande de visite
- contact / messagerie

## Actions disponibles
### Sans compte
- consulter
- partager

### Avec compte
- favori
- note
- message
- demande de visite
- suivi personnel

## Objectif
Aider à comprendre, mémoriser et agir rapidement.

---

# 12. Compte utilisateur particulier

## Données minimales
- nom ou prénom/nom
- email
- mot de passe
- téléphone optionnel

## Fonctions débloquées
- favoris
- collections
- notes
- biens vus
- historique
- recherche reprise
- alertes
- messagerie
- historique des messages
- demandes de visite suivies

## Flux recommandé
- inscription simple
- connexion simple
- retour au contexte après authentification

---

# 13. Biens déjà vus

## Définition
Le système mémorise les biens déjà consultés par l’utilisateur.

## Cas sans compte
- stockage local temporaire possible
- dépend du navigateur

## Cas avec compte
- stockage persistant
- synchronisation côté profil
- affichage dans l’espace personnel

## Rendu attendu
- badge “Déjà vu” dans les résultats
- bloc “récemment consultés”
- base de la recherche reprise

---

# 14. Notes personnelles

## Définition
L’utilisateur connecté peut ajouter une note privée sur un bien.

## Exemples
- trop cher
- intéressant
- à revoir
- à montrer à la famille

## Règles
- visible uniquement par son auteur
- modifiable
- supprimable
- liée à un bien

## Objectif
Créer un vrai outil de suivi personnel, pas seulement une liste de biens.

---

# 15. Favoris

## Définition
L’utilisateur connecté peut enregistrer des biens en favoris.

## Actions
- ajouter
- retirer
- lister

## UX
- bouton sur carte résultat
- bouton sur fiche bien
- accès dédié dans l’espace personnel

---

# 16. Collections de favoris

## Définition
Les favoris doivent être organisables dans plusieurs collections.

## Actions
- créer une collection
- nommer une collection
- renommer une collection
- supprimer une collection
- ajouter un bien à une ou plusieurs collections
- retirer un bien d’une collection

## Règle structurante
Un bien peut appartenir à **plusieurs collections**.

## Exemples
- Achat
- Location
- À visiter
- Investissement
- À comparer

---

# 17. Historique de recherche

## Définition
Le système conserve les recherches exécutées par l’utilisateur connecté.

## Données à stocker
- critères
- localisation
- budget
- type de bien
- date
- dernière exécution

## Actions
- revoir une recherche
- relancer une recherche
- supprimer un élément
- vider l’historique

---

# 18. Recherche reprise

## Définition
Le produit doit proposer à l’utilisateur de reprendre sa recherche.

## Sources
- dernière recherche
- derniers biens vus
- derniers favoris
- dernières alertes

## Rendu UX
- “Reprendre votre dernière recherche”
- “Continuer là où vous vous êtes arrêté”

---

# 19. Alertes de recherche

## Définition
L’utilisateur connecté peut sauvegarder une recherche et demander une alerte.

## Paramètres
- nom libre
- critères
- fréquence
- canal

## Canaux initiaux
- email
- notification interne

## Actions
- créer
- activer / désactiver
- renommer
- supprimer

---

# 20. Alertes enrichies

## Cas retenus
- nouveau bien correspondant à une recherche
- baisse de prix sur un bien suivi
- bien similaire à un favori
- bien similaire à une recherche enregistrée

## Objectif
Rendre le produit proactif et renforcer la valeur du compte.

---

# 21. Messagerie sécurisée

## Définition
Les utilisateurs connectés peuvent échanger avec une agence via une messagerie interne.

## Règle structurante
La messagerie ne doit pas être totalement libre.  
Elle doit être initiée depuis un **contexte précis** :
- fiche bien
- fiche agence
- contexte immobilier précis dans la recherche

## Contexte d’une conversation
- agence obligatoire
- bien optionnel
- origine de l’échange
- date du dernier message

## Actions
- créer une conversation
- envoyer un message
- lire les réponses
- marquer comme lu

---

# 22. Historique des messages

## Définition
L’utilisateur doit pouvoir retrouver l’ensemble de ses conversations.

## Données utiles
- agence
- bien concerné si applicable
- dernier message
- date
- état lu / non lu

## Objectif
Ne pas perdre le fil de la relation avec les agences.

---

# 23. Statut de réactivité agence

## Définition
Le système peut afficher une indication simple de réactivité.

## Exemples de rendu
- répond généralement rapidement
- agence active récemment
- réponse habituelle rapide

## Objectif
Rassurer les particuliers et valoriser les agences sérieuses.

---

# 24. Demande de visite

## Définition
L’utilisateur peut envoyer une demande de visite depuis une fiche bien.

## Règle validée
La demande de visite est un **formulaire simple prérempli**.

## Préremplissage
- informations du bien
- référence du bien
- agence concernée
- contexte de la demande

## Champs modifiables
- nom
- téléphone
- email
- message

## Objectif
Créer une action simple, claire et exploitable côté agence.

---

# 25. Partage facile

## Actions minimales
- partager via WhatsApp
- copier le lien
- envoyer à un proche

## Objectif
Faciliter la décision à plusieurs et augmenter la diffusion naturelle des annonces.

---

# 26. Intégration avec AqarPro

AqarSearch doit consommer depuis AqarPro :
- les biens publiés
- les agences visibles
- les données publiques de branding
- certains signaux de réactivité

AqarSearch doit renvoyer vers AqarPro :
- vues
- clics utiles
- messages
- demandes de visite
- leads
- signaux d’intérêt

AqarPro reste la source de vérité pour :
- agences
- biens
- statuts
- pilotage commercial

---

# 27. Modèle de données recommandé

Le modèle AqarSearch doit couvrir au minimum :

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

Enrichissements possibles :
- `agency_responsiveness_stats`
- `user_search_preferences`
- `search_alert_deliveries`

---

# 28. Tables à créer ou enrichir

## 28.1 `favorites`
Favoris utilisateur.

## 28.2 `favorite_collections`
Collections créées par utilisateur.

## 28.3 `favorite_collection_items`
Association many-to-many entre biens favoris et collections.

## 28.4 `search_history`
Historique des recherches.

## 28.5 `saved_searches`
Recherches sauvegardées.

## 28.6 `search_alerts`
Alertes actives associées aux recherches.

## 28.7 `viewed_properties`
Biens déjà vus.

## 28.8 `property_notes`
Notes privées sur les biens.

## 28.9 `conversations`
Conversations entre particulier et agence.

## 28.10 `messages`
Messages d’une conversation.

## 28.11 `visit_requests`
Demandes de visite contextualisées.

## 28.12 `agency_responsiveness_stats`
Indicateurs simples de réactivité agence.

---

# 29. Index de recherche

## Objectif
Créer une couche dédiée à la recherche publique.

## Recommandation
Créer une vue SQL ou table indexée :

```sql
search_properties_index
```

## Colonnes minimales
- property_id
- agency_id
- agency_name
- agency_slug
- title
- description
- price
- currency
- transaction_type
- type
- surface
- rooms
- bathrooms
- country
- wilaya
- commune
- city
- images_count
- published_at
- updated_at
- search_text

## Objectif
Éviter des requêtes brutes trop complexes sur `properties` à chaque recherche.

---

# 30. Règles de visibilité des annonces

Une annonce est visible publiquement si :
- elle est active
- l’agence est active
- elle possède au minimum :
  - un titre
  - un prix
  - une localisation exploitable
  - une image ou une description suffisante

Les annonces non publiées, brouillons ou internes ne doivent jamais être exposées.

---

# 31. Validators Zod

Créer ou renforcer :

- `search.ts`
- `saved-search.ts`
- `alert.ts`
- `favorite.ts`
- `collection.ts`
- `note.ts`
- `message.ts`
- `visit-request.ts`

Chaque validator doit couvrir :
- structure
- typage
- limites de longueur
- cohérence métier minimale

---

# 32. Server Actions

Créer ou structurer :

## `favorites.ts`
- addFavorite
- removeFavorite

## `collections.ts`
- createCollection
- renameCollection
- deleteCollection
- addPropertyToCollection
- removePropertyFromCollection

## `notes.ts`
- savePropertyNote
- deletePropertyNote

## `search-history.ts`
- trackSearch
- clearSearchHistory

## `viewed-properties.ts`
- trackViewedProperty

## `alerts.ts`
- createSavedSearch
- updateSavedSearch
- deleteSavedSearch
- createSearchAlert
- toggleSearchAlert

## `messaging.ts`
- createConversation
- sendMessage
- markConversationAsRead

## `visit-requests.ts`
- createVisitRequest

Toutes les actions doivent retourner :

```ts
{
  success: boolean
  error?: string
}
```

---

# 33. Queries

Prévoir ou renforcer :

- `search.ts`
- `property-public.ts`
- `favorites.ts`
- `collections.ts`
- `alerts.ts`
- `history.ts`
- `messaging.ts`
- `visit-requests.ts`
- `agency-public.ts`

L’objectif est d’éviter la logique de requête directement dans les pages.

---

# 34. API routes éventuelles

À utiliser si nécessaire pour :
- webhooks d’alertes
- intégrations email
- endpoints de partage
- endpoints publics spécifiques
- traitement asynchrone d’envoi d’alertes

Exemples :
- `/api/alerts/dispatch`
- `/api/messages/send`
- `/api/visit-requests/create`
- `/api/historique`
- `/api/favoris`

---

# 35. Composants UI à créer

```txt
src/components/search/
```

## Composants clés
- `search-bar.tsx`
- `filter-panel.tsx`
- `result-card.tsx`
- `favorite-button.tsx`
- `viewed-badge.tsx`
- `note-editor.tsx`
- `collection-selector.tsx`
- `saved-search-card.tsx`
- `alert-button.tsx`
- `conversation-list.tsx`
- `message-thread.tsx`
- `visit-request-form.tsx`
- `share-actions.tsx`
- `result-empty-state.tsx`

---

# 36. Règles de permissions

## Visiteur non connecté
- recherche autorisée
- consultation autorisée
- partage autorisé

## Utilisateur connecté
- accès à l’espace personnel
- favoris
- collections
- notes
- historique
- alertes
- messagerie
- demandes de visite

## Règle
Les permissions doivent être appliquées :
- dans l’UI
- dans les layouts
- dans les actions
- dans les queries
- dans les policies RLS

---

# 37. Sécurité et RLS

Toutes les données personnelles de suivi doivent être protégées.

## À restreindre strictement
- favoris utilisateur
- collections
- notes
- historique
- alertes
- conversations
- messages
- demandes de visite privées

## Vérifications côté serveur
Même avec RLS :
- vérifier session
- vérifier contexte
- vérifier visibilité du bien
- vérifier agence concernée

---

# 38. Analytics et événements

Événements à tracer :
- `search_executed`
- `search_filter_changed`
- `property_viewed`
- `favorite_added`
- `favorite_removed`
- `collection_created`
- `collection_renamed`
- `note_added`
- `saved_search_created`
- `alert_created`
- `message_sent`
- `visit_requested`
- `property_shared`

Objectifs :
- comprendre l’usage
- améliorer l’expérience
- enrichir les signaux remontés vers AqarPro

---

# 39. Performance et cache

## Cache recommandé
- `/recherche` : dynamique avec cache court si nécessaire
- `/bien/[id]` : ISR ou revalidate court
- `/espace/*` : privé, pas de cache public

## Pagination
Préférer :
- pagination serveur simple
- limit / offset au départ

## Objectifs
- rapidité
- faible coût de requête
- bon comportement mobile

---

# 40. Tests à ajouter

## Validators
- `search.test.ts`
- `alert.test.ts`
- `collection.test.ts`
- `note.test.ts`
- `message.test.ts`
- `visit-request.test.ts`

## Actions
- `actions-favorites.test.ts`
- `actions-collections.test.ts`
- `actions-notes.test.ts`
- `actions-search-history.test.ts`
- `actions-alerts.test.ts`
- `actions-messaging.test.ts`
- `actions-visit-requests.test.ts`

## Logique métier
- recherche libre sans compte
- redirection sur action protégée
- biens déjà vus
- reprise de recherche
- création de conversation depuis fiche agence
- création de conversation depuis fiche bien
- demande de visite contextuelle

---

# 41. Arborescence recommandée

```txt
src/
├── app/
│   ├── recherche/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── bien/
│   │   └── [id]/
│   │       ├── page.tsx
│   │       ├── loading.tsx
│   │       └── error.tsx
│   ├── espace/
│   │   ├── page.tsx
│   │   ├── favoris/page.tsx
│   │   ├── collections/page.tsx
│   │   ├── recherches/page.tsx
│   │   ├── alertes/page.tsx
│   │   ├── messages/page.tsx
│   │   ├── messages/[conversationId]/page.tsx
│   │   └── profil/page.tsx
│
├── components/
│   └── search/
│       ├── search-bar.tsx
│       ├── filter-panel.tsx
│       ├── result-card.tsx
│       ├── favorite-button.tsx
│       ├── viewed-badge.tsx
│       ├── note-editor.tsx
│       ├── collection-selector.tsx
│       ├── saved-search-card.tsx
│       ├── alert-button.tsx
│       ├── conversation-list.tsx
│       ├── message-thread.tsx
│       ├── visit-request-form.tsx
│       ├── share-actions.tsx
│       └── result-empty-state.tsx
│
├── lib/
│   ├── actions/
│   │   ├── favorites.ts
│   │   ├── collections.ts
│   │   ├── notes.ts
│   │   ├── search-history.ts
│   │   ├── viewed-properties.ts
│   │   ├── alerts.ts
│   │   ├── messaging.ts
│   │   └── visit-requests.ts
│   ├── queries/
│   │   ├── search.ts
│   │   ├── property-public.ts
│   │   ├── favorites.ts
│   │   ├── collections.ts
│   │   ├── alerts.ts
│   │   ├── history.ts
│   │   ├── messaging.ts
│   │   ├── visit-requests.ts
│   │   └── agency-public.ts
│   └── validators/
│       ├── search.ts
│       ├── saved-search.ts
│       ├── alert.ts
│       ├── favorite.ts
│       ├── collection.ts
│       ├── note.ts
│       ├── message.ts
│       └── visit-request.ts
```

---

# 42. Plan d’implémentation par phases

## Phase 1 — socle public
- recherche
- résultats
- fiche bien
- index de recherche
- visibilité publique

## Phase 2 — compte et suivi personnel
- compte particulier
- favoris
- collections
- notes
- biens déjà vus
- historique de recherche

## Phase 3 — continuité et rétention
- recherche reprise
- saved searches
- alertes
- alertes enrichies

## Phase 4 — interaction agence
- messagerie
- historique des messages
- demande de visite
- signaux de réactivité agence

## Phase 5 — optimisation
- analytics
- amélioration UX
- optimisation des parcours protégés
- enrichissement de la qualité des résultats

---

# 43. Prompt maître pour Claude Code

```txt
Construis AqarSearch comme la branche particulier de AqarVision.

Objectif :
Créer une expérience de recherche immobilière moderne, simple et premium, qui permet de consulter librement les annonces sans compte, puis d’utiliser un compte pour organiser, suivre et approfondir sa recherche.

Contraintes :
- AqarSearch n’est pas une marque autonome
- AqarSearch dépend des biens et agences publiés dans AqarPro
- sans compte, seules la recherche, le filtrage et la consultation sont autorisés
- toute autre action doit rediriger vers création de compte ou connexion avec retour au contexte
- la messagerie doit toujours partir d’un contexte précis
- un bien peut appartenir à plusieurs collections de favoris
- la demande de visite doit être un formulaire simple prérempli
- le code doit rester propre, modulaire, typé et compatible avec Next.js 14 + Supabase

À structurer :
1. recherche publique
2. fiche bien
3. compte particulier
4. biens déjà vus
5. notes personnelles
6. favoris
7. collections
8. historique
9. recherche reprise
10. alertes
11. messagerie
12. demandes de visite
13. événements analytics

À produire :
- routes propres
- modèles de données
- server actions
- queries
- validators
- composants UI
- permissions
- logique de redirection
- logique de contexte pour messagerie et demandes de visite

Le résultat attendu :
AqarSearch doit devenir un espace personnel de recherche immobilière, simple sans compte, beaucoup plus utile avec un compte, et parfaitement relié à AqarPro.
```
# AqarPro — Document Global Technique

> Traduction technique de la vision produit AqarPro en architecture fonctionnelle, modules, routes, données, permissions et logique d’implémentation

**Version** : 1.0  
**Statut** : Spécification technique consolidée  
**Produit parent** : AqarVision  
**Branche concernée** : AqarPro  
**Objectif** : définir la base technique propre de la branche professionnelle destinée aux agences immobilières

---

# Table des matières

1. [Définition de AqarPro](#1-définition-de-aqarpro)
2. [Objectif technique](#2-objectif-technique)
3. [Rôle dans l’écosystème AqarVision](#3-rôle-dans-lécosystème-aqarvision)
4. [Principes d’architecture](#4-principes-darchitecture)
5. [Périmètre fonctionnel](#5-périmètre-fonctionnel)
6. [Modules principaux](#6-modules-principaux)
7. [Nouvelles routes AqarPro](#7-nouvelles-routes-aqarpro)
8. [Structure de dashboard recommandée](#8-structure-de-dashboard-recommandée)
9. [Gestion des annonces](#9-gestion-des-annonces)
10. [Gestion des médias](#10-gestion-des-médias)
11. [Système de mini-vitrines](#11-système-de-mini-vitrines)
12. [Système de thèmes](#12-système-de-thèmes)
13. [Branding et personnalisation](#13-branding-et-personnalisation)
14. [Dashboard personnalisable](#14-dashboard-personnalisable)
15. [Leads, messages et demandes de visite](#15-leads-messages-et-demandes-de-visite)
16. [Gestion d’équipe et permissions](#16-gestion-déquipe-et-permissions)
17. [IA intégrée dans AqarPro](#17-ia-intégrée-dans-aqarpro)
18. [Analytics et pilotage](#18-analytics-et-pilotage)
19. [Intégration avec AqarSearch](#19-intégration-avec-aqarsearch)
20. [Modèle de données recommandé](#20-modèle-de-données-recommandé)
21. [Tables à créer ou enrichir](#21-tables-à-créer-ou-enrichir)
22. [Règles de visibilité et d’exposition](#22-règles-de-visibilité-et-dexposition)
23. [Validators Zod](#23-validators-zod)
24. [Server Actions](#24-server-actions)
25. [Queries](#25-queries)
26. [API routes éventuelles](#26-api-routes-éventuelles)
27. [Composants UI à créer](#27-composants-ui-à-créer)
28. [Règles de permissions](#28-règles-de-permissions)
29. [Sécurité et RLS](#29-sécurité-et-rls)
30. [Configuration centralisée](#30-configuration-centralisée)
31. [Tests à ajouter](#31-tests-à-ajouter)
32. [Arborescence recommandée](#32-arborescence-recommandée)
33. [Plan d’implémentation par phases](#33-plan-dimplémentation-par-phases)
34. [Prompt maître pour Claude Code](#34-prompt-maître-pour-claude-code)

---

# 1. Définition de AqarPro

AqarPro est la branche professionnelle de AqarVision.

Elle permet à une agence immobilière de :

- gérer ses annonces
- gérer ses médias
- gérer son branding
- publier une mini-vitrine
- centraliser ses leads
- centraliser ses messages
- suivre les demandes de visite
- gérer une petite équipe
- exploiter des aides IA intégrées
- piloter sa présence digitale depuis un espace unique

AqarPro n’est pas un simple back-office d’annonces.  
C’est un **cockpit digital professionnel**.

---

# 2. Objectif technique

Sur le plan technique, AqarPro doit fournir une base claire, modulaire et évolutive pour :

- l’administration agence
- la production d’annonces
- la gestion éditoriale
- la gestion commerciale légère
- la personnalisation de la présence digitale
- l’intégration des signaux venant de AqarSearch

Le système doit rester :

- modulaire
- propre
- typé
- compatible avec Next.js App Router
- compatible avec Supabase et RLS
- facile à faire évoluer sans casser l’existant

---

# 3. Rôle dans l’écosystème AqarVision

AqarPro est la source de vérité principale pour :

- agences
- branding
- propriétés
- statuts de publication
- leads
- membres d’agence
- demandes de visite
- conversations agence
- configuration de mini-vitrine
- thèmes appliqués
- contenus générés par IA liés à l’agence

AqarSearch dépend de AqarPro pour exposer l’offre publique.

---

# 4. Principes d’architecture

## 4.1 Source de vérité
AqarPro reste la source métier centrale pour tous les objets “agence”.

## 4.2 Monolithe modulaire
AqarPro doit vivre dans le même repo que AqarSearch et les autres briques AqarVision, mais avec une séparation claire des domaines.

## 4.3 Logique métier centralisée
Les règles métier ne doivent pas être dispersées dans les pages.
Elles doivent être isolées dans des modules dédiés :
- actions
- queries
- services
- validators

## 4.4 Interface premium mais pragmatique
Le système doit viser une expérience haut de gamme sans créer une architecture inutilement complexe.

---

# 5. Périmètre fonctionnel

AqarPro doit couvrir :

- dashboard agence
- gestion des annonces
- gestion des médias
- mini-vitrines
- thèmes vitrines
- branding
- dashboard personnalisable
- leads
- messagerie
- demandes de visite
- gestion d’équipe
- IA intégrée
- analytics utiles
- paramètres agence
- gestion du plan et de la montée en gamme

---

# 6. Modules principaux

Les grands modules de AqarPro sont :

1. **Agences**
2. **Annonces**
3. **Médias**
4. **Mini-vitrines**
5. **Thèmes**
6. **Branding**
7. **Dashboard**
8. **Leads**
9. **Messagerie**
10. **Demandes de visite**
11. **Équipe**
12. **IA**
13. **Analytics**
14. **Abonnement / plan**
15. **Paramètres**

---

# 7. Nouvelles routes AqarPro

Structure recommandée :

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

# 8. Structure de dashboard recommandée

Le dashboard doit être structuré autour de blocs réorganisables.

## Blocs candidats
- nouveaux leads
- messages récents
- demandes de visite
- biens publiés
- biens brouillons
- annonces à améliorer
- complétude agence
- performance des annonces
- aperçu vitrine
- actions rapides

## Principe technique
Le dashboard doit pouvoir stocker une préférence de layout par agence ou par utilisateur propriétaire.

---

# 9. Gestion des annonces

## Fonctions attendues
- créer un bien
- modifier un bien
- supprimer un bien
- publier
- dépublier
- archiver
- dupliquer
- marquer comme mis en avant
- gérer statut commercial
- gérer contenus texte
- gérer média principal
- gérer galerie

## Champs fonctionnels minimum
- titre
- description
- prix
- devise
- type de bien
- transaction
- surface
- pièces
- salles de bain
- pays
- wilaya
- commune
- ville
- adresse
- coordonnées GPS
- caractéristiques
- images
- vidéos
- statut
- date de publication

## Enrichissements
- version de texte générée par IA
- niveau de complétude
- score qualité annonce interne

---

# 10. Gestion des médias

## Objectif
Faire des médias un module fort, pas un simple champ annexe.

## Fonctions
- upload image
- upload vidéo
- conversion si nécessaire
- prévisualisation
- réordonnancement
- suppression
- définition de l’image principale
- assignation à un bien ou à la vitrine
- assignation au branding agence

## Types de médias
- propriété
- branding
- vitrine
- équipe
- document si besoin plus tard

---

# 11. Système de mini-vitrines

Chaque agence dispose d’un mini-site public.

## Fonctions
- générer une home agence
- afficher les biens
- afficher la page à propos
- afficher la page contact
- afficher éventuellement équipe, services, zones couvertes
- afficher des sections différentes selon le thème

## Principe
La mini-vitrine ne doit pas être une simple vue technique du catalogue.
Elle doit être pensée comme une vraie présence digitale.

---

# 12. Système de thèmes

## Règle produit
Les thèmes sont de vrais templates complets, pas des skins.

## Différences structurelles possibles
- hero centré image
- hero éditorial
- home orientée agence
- home orientée biens
- home orientée premium / luxe
- home orientée institutionnelle
- sections différentes
- ordre différent des blocs
- navigation différente

## Règle par plan
- Starter : 2 thèmes
- Pro : 5 thèmes
- Enterprise : tous les thèmes + personnalisation avancée

## Technique recommandée
Créer un registre de thèmes :
- métadonnées thème
- disponibilités par plan
- composants sections
- règles de mise en page

---

# 13. Branding et personnalisation

## Branding de base
- logo
- couverture
- couleurs
- slogan
- description agence
- coordonnées
- réseaux sociaux

## Branding avancé
- variations de sections
- polices ou styles encadrés
- éléments premium du thème
- choix de mise en avant de certaines sections
- personnalisation avancée réservée à Enterprise

## Objectif
Permettre à l’agence de se différencier sans casser la cohérence du système.

---

# 14. Dashboard personnalisable

## Vision
Le dashboard doit être personnalisable, mais dans un cadre maîtrisé.

## Ce que l’agence peut faire
- choisir l’ordre des blocs
- masquer certains blocs
- épingler des blocs importants
- définir ses actions rapides prioritaires

## Ce que l’agence ne doit pas faire
- construire librement une interface totalement ouverte
- casser les usages centraux du produit

## Stockage recommandé
Préférences dashboard dans une table dédiée :
- niveau agence
- éventuellement override par utilisateur

---

# 15. Leads, messages et demandes de visite

## Leads
AqarPro doit centraliser :
- formulaires de contact
- contacts depuis fiche bien
- signaux de AqarSearch
- leads directs

## Messages
AqarPro doit centraliser :
- conversations ouvertes depuis AqarSearch
- conversations liées à une agence
- conversations éventuellement liées à un bien

## Demandes de visite
AqarPro doit recevoir les demandes de visite comme objets lisibles, contextualisés, traçables.

## Données de contexte minimales
- agence
- bien éventuel
- utilisateur ou visiteur
- origine
- message
- date
- statut

---

# 16. Gestion d’équipe et permissions

## Rôles
- owner
- admin
- agent
- viewer

## Actions possibles
- invitation
- suppression
- changement de rôle

## Permissions recommandées
### Owner
- tous les droits

### Admin
- annonces
- leads
- messages
- branding
- équipe partielle selon règle
- analytics

### Agent
- annonces limitées
- leads
- messages
- demandes de visite

### Viewer
- lecture seulement ou très limitée

## Point important
Les permissions ne doivent pas se résumer à owner_id.  
Il faut une vraie logique de rôle.

---

# 17. IA intégrée dans AqarPro

## Vision
L’IA est un ensemble de micro-assistances discrètes.

## Cas d’usage
### Annonce
- générer titre
- générer description
- reformuler
- améliorer style
- proposer une version courte ou premium

### Agence
- générer description agence
- générer slogan
- reformuler page à propos

### Communication
- rédiger email
- rédiger réponse type
- rédiger message marketing
- rédiger post social

### Qualité
- suggérer ce qui manque
- suggérer des améliorations
- détecter une annonce trop faible

## Règle UX
Toujours contextuel :
- bouton discret
- action courte
- résultat éditable

---

# 18. Analytics et pilotage

## Données utiles
- nombre de biens
- nombre de leads
- messages reçus
- demandes de visite
- biens les plus consultés
- annonces incomplètes
- performance des thèmes
- performance de la vitrine
- performance des annonces

## Objectif
Aider à piloter, pas juste à afficher des chiffres.

## Affichages possibles
- cartes de synthèse
- listes actionnables
- alertes d’amélioration
- vues par période

---

# 19. Intégration avec AqarSearch

AqarPro doit recevoir depuis AqarSearch :
- vues
- clics
- messages
- favoris si utile comme signal agrégé
- demandes de visite
- leads

AqarPro doit exposer vers AqarSearch :
- biens actifs
- agences visibles
- métadonnées publiques
- branding public
- contexte de réactivité agence

---

# 20. Modèle de données recommandé

Le modèle de données AqarPro doit couvrir au minimum :

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

Enrichissements recommandés :
- `agency_theme_settings`
- `agency_vitrine_pages`
- `agency_dashboard_preferences`
- `agency_ai_generations`
- `agency_media_collections`
- `agency_verifications`

---

# 21. Tables à créer ou enrichir

## 21.1 `agency_theme_settings`
Stocke :
- thème sélectionné
- variantes
- réglages de sections
- options de personnalisation liées au plan

## 21.2 `agency_vitrine_pages`
Permet de gérer des contenus éditoriaux :
- accueil
- à propos
- services
- équipe
- zones couvertes

## 21.3 `agency_dashboard_preferences`
Stocke :
- ordre des widgets
- widgets masqués
- widgets épinglés

## 21.4 `agency_ai_generations`
Historise les contenus générés par IA :
- type
- contexte
- texte généré
- version retenue
- auteur

## 21.5 `visit_requests`
Si la table n’existe pas ou n’est pas suffisante, elle doit devenir un objet propre.

## 21.6 `agency_media_collections`
Permet d’organiser les médias d’agence :
- branding
- vitrines
- institutionnel
- biens

---

# 22. Règles de visibilité et d’exposition

Une annonce peut être visible publiquement si :
- elle est publiée
- elle appartient à une agence active
- les minima de qualité sont atteints
- aucun blocage n’existe

Une vitrine peut être visible si :
- l’agence est active
- le thème est valide
- la configuration publique est cohérente

Les éléments internes ne doivent jamais fuiter :
- notes internes
- préférences dashboard
- données privées équipe
- brouillons non publiés

---

# 23. Validators Zod

Créer ou renforcer :

- `agency.ts`
- `branding.ts`
- `property.ts`
- `property-media.ts`
- `theme.ts`
- `dashboard-preferences.ts`
- `lead.ts`
- `message.ts`
- `visit-request.ts`
- `team.ts`
- `ai.ts`

Chaque validator doit couvrir :
- structure
- types
- tailles maximales
- cohérence métier minimale

---

# 24. Server Actions

Créer ou structurer :

## `properties.ts`
- createProperty
- updateProperty
- deleteProperty
- publishProperty
- archiveProperty
- duplicateProperty

## `media.ts`
- uploadPropertyMedia
- deleteMedia
- reorderMedia
- setPrimaryMedia

## `branding.ts`
- updateAgencyBranding
- updateAgencyTheme
- updateThemeSettings

## `vitrine.ts`
- updateVitrinePage
- previewVitrine
- publishVitrineChanges

## `dashboard-preferences.ts`
- saveDashboardPreferences
- resetDashboardPreferences

## `leads.ts`
- updateLeadStatus
- assignLead
- addLeadNote

## `messaging.ts`
- sendAgencyMessage
- markConversationRead

## `visit-requests.ts`
- updateVisitRequestStatus

## `team.ts`
- inviteMember
- updateMemberRole
- removeMember

## `ai.ts`
- generatePropertyTitle
- generatePropertyDescription
- improveAgencyDescription
- generateMarketingText

Toutes les actions doivent retourner un contrat simple :
```ts
{
  success: boolean
  error?: string
}
```

---

# 25. Queries

Prévoir ou renforcer :

- `agency.ts`
- `agency-theme.ts`
- `agency-vitrine.ts`
- `agency-dashboard.ts`
- `properties.ts`
- `media.ts`
- `leads.ts`
- `messages.ts`
- `visit-requests.ts`
- `analytics.ts`
- `team.ts`

L’objectif est d’éviter la logique de requête directement dispersée dans les pages.

---

# 26. API routes éventuelles

À utiliser seulement si nécessaire pour :
- upload
- webhooks
- intégrations externes
- génération IA asynchrone
- endpoints REST externes

Exemples :
- `/api/upload`
- `/api/ai/generate-property-description`
- `/api/ai/generate-agency-copy`
- `/api/webhooks/stripe`
- `/api/webhooks/social`

---

# 27. Composants UI à créer

```txt
src/components/aqarpro/
```

## Dossiers recommandés
- `dashboard/`
- `properties/`
- `media/`
- `vitrine/`
- `branding/`
- `leads/`
- `messages/`
- `team/`
- `analytics/`
- `ai/`

## Composants clés
- `dashboard-widget.tsx`
- `dashboard-layout-editor.tsx`
- `property-form.tsx`
- `property-status-badge.tsx`
- `media-manager.tsx`
- `media-gallery-editor.tsx`
- `theme-picker.tsx`
- `theme-preview-card.tsx`
- `vitrine-preview.tsx`
- `branding-form.tsx`
- `lead-list.tsx`
- `lead-kanban.tsx`
- `conversation-list.tsx`
- `message-thread.tsx`
- `visit-request-list.tsx`
- `team-table.tsx`
- `ai-action-button.tsx`
- `ai-generated-panel.tsx`

---

# 28. Règles de permissions

## Sans authentification
Aucun accès AqarPro.

## Authentifié hors agence
Pas d’accès à AqarPro, sauf onboarding agence si prévu.

## Owner agence
Accès total.

## Membres agence
Accès limité selon rôle.

## Règle
Les permissions doivent être appliquées :
- dans les layouts
- dans les actions
- dans les requêtes
- dans les policies RLS

---

# 29. Sécurité et RLS

Toutes les données agence sensibles doivent être protégées.

## À restreindre strictement
- configuration interne
- dashboard preferences
- messages internes
- notes leads
- données équipe
- abonnement
- contenus IA non publics

## Vérifications côté serveur
Même avec RLS :
- vérifier session
- vérifier rôle
- vérifier agence cible
- vérifier contexte du bien ou de la conversation

---

# 30. Configuration centralisée

Le fichier de config doit inclure :

- plans
- nombre de thèmes par plan
- quotas médias
- limites équipe
- options IA par plan
- options branding par plan
- options vitrines par plan
- limites analytics par plan

---

# 31. Tests à ajouter

## Validators
- agency-branding.test.ts
- theme-settings.test.ts
- dashboard-preferences.test.ts
- media.test.ts
- ai.test.ts

## Actions
- actions-properties.test.ts
- actions-media.test.ts
- actions-branding.test.ts
- actions-dashboard-preferences.test.ts
- actions-team.test.ts
- actions-messaging.test.ts
- actions-visit-requests.test.ts
- actions-ai.test.ts

## Logique métier
- permissions par rôle
- disponibilité des thèmes par plan
- personnalisation dashboard
- publication vitrine
- gestion image principale
- visibilité publique d’une annonce

---

# 32. Arborescence recommandée

```txt
src/
├── app/
│   └── aqarpro/
│       └── [slug]/
│           ├── dashboard/page.tsx
│           ├── properties/
│           ├── leads/
│           ├── messages/
│           ├── visit-requests/
│           ├── vitrine/
│           ├── branding/
│           ├── media/
│           ├── analytics/
│           ├── team/
│           └── settings/
│
├── components/
│   └── aqarpro/
│       ├── dashboard/
│       ├── properties/
│       ├── media/
│       ├── vitrine/
│       ├── branding/
│       ├── leads/
│       ├── messages/
│       ├── team/
│       ├── analytics/
│       └── ai/
│
├── lib/
│   ├── actions/
│   │   ├── properties.ts
│   │   ├── media.ts
│   │   ├── branding.ts
│   │   ├── vitrine.ts
│   │   ├── dashboard-preferences.ts
│   │   ├── leads.ts
│   │   ├── messaging.ts
│   │   ├── visit-requests.ts
│   │   ├── team.ts
│   │   └── ai.ts
│   ├── queries/
│   │   ├── agency.ts
│   │   ├── agency-theme.ts
│   │   ├── agency-vitrine.ts
│   │   ├── agency-dashboard.ts
│   │   ├── properties.ts
│   │   ├── media.ts
│   │   ├── leads.ts
│   │   ├── messages.ts
│   │   ├── visit-requests.ts
│   │   ├── analytics.ts
│   │   └── team.ts
│   └── validators/
│       ├── agency.ts
│       ├── branding.ts
│       ├── property.ts
│       ├── property-media.ts
│       ├── theme.ts
│       ├── dashboard-preferences.ts
│       ├── lead.ts
│       ├── message.ts
│       ├── visit-request.ts
│       ├── team.ts
│       └── ai.ts
```

---

# 33. Plan d’implémentation par phases

## Phase 1 — socle agence
- structure AqarPro propre
- routes principales
- permissions
- annonces
- branding

## Phase 2 — vitrines et thèmes
- registre de thèmes
- disponibilité par plan
- mini-vitrines structurées
- preview vitrine

## Phase 3 — dashboard et médias
- dashboard personnalisable
- média manager
- image principale
- galeries

## Phase 4 — leads et relation client
- leads
- messages
- demandes de visite
- contexte bien/agence

## Phase 5 — IA et montée en gamme
- actions IA
- génération de contenus
- assistance qualité
- enrichissements premium

## Phase 6 — analytics et optimisation
- analytics utiles
- pilotage
- optimisation UX
- amélioration des workflows

---

# 34. Prompt maître pour Claude Code

```txt
Construis AqarPro comme la branche professionnelle de AqarVision.

Objectif :
Créer une plateforme professionnelle complète permettant aux agences immobilières de gérer leurs annonces, leurs vitrines, leurs contenus, leurs leads, leurs messages, leurs médias, leur équipe et une partie de leur production assistée par IA depuis un espace unique.

Contraintes :
- AqarPro doit rester simple, premium et crédible
- ce n’est pas un simple back-office d’annonces
- les mini-vitrines doivent être de vrais thèmes complets
- le nombre de thèmes dépend du plan :
  - Starter : 2
  - Pro : 5
  - Enterprise : tous + personnalisation avancée
- le dashboard doit être personnalisable
- l’IA doit être présente presque partout, mais de manière discrète
- toutes les permissions doivent être respectées selon les rôles

À structurer :
1. dashboard agence
2. gestion des annonces
3. gestion des médias
4. système de mini-vitrines
5. système de thèmes
6. branding
7. leads
8. messagerie
9. demandes de visite
10. gestion d’équipe
11. analytics
12. actions IA

À produire :
- routes propres
- modules métier
- server actions
- validators
- queries
- composants UI
- règles de permissions
- logique de plans
- tables ou enrichissements nécessaires

Le résultat attendu :
AqarPro doit devenir un cockpit digital professionnel, élégant, crédible et réellement utile pour une agence immobilière.
```
# AqarPro — Document Global de Vision Produit

> Vision consolidée de la branche professionnelle de AqarVision, dédiée aux agences immobilières

**Version** : 1.0  
**Statut** : Vision produit consolidée  
**Objectif** : définir clairement le rôle, les ambitions, les fonctionnalités clés et les arbitrages structurants de AqarPro

---

# Table des matières

1. [Présentation générale](#1-présentation-générale)
2. [Rôle de AqarPro dans AqarVision](#2-rôle-de-aqarpro-dans-aqarvision)
3. [Vision produit](#3-vision-produit)
4. [Promesse de AqarPro](#4-promesse-de-aqarpro)
5. [Les 5 piliers de AqarPro](#5-les-5-piliers-de-aqarpro)
6. [Gestion des annonces](#6-gestion-des-annonces)
7. [Présence digitale et mini-vitrines](#7-présence-digitale-et-mini-vitrines)
8. [Système de thèmes vitrines](#8-système-de-thèmes-vitrines)
9. [Branding et personnalisation](#9-branding-et-personnalisation)
10. [Dashboard personnalisable](#10-dashboard-personnalisable)
11. [Gestion des médias](#11-gestion-des-médias)
12. [Leads, messages et demandes de visite](#12-leads-messages-et-demandes-de-visite)
13. [IA intégrée dans AqarPro](#13-ia-intégrée-dans-aqarpro)
14. [Gestion d’équipe](#14-gestion-déquipe)
15. [Analytics et pilotage](#15-analytics-et-pilotage)
16. [Plans et montée en gamme](#16-plans-et-montée-en-gamme)
17. [Expérience utilisateur attendue](#17-expérience-utilisateur-attendue)
18. [Règles de conception produit](#18-règles-de-conception-produit)
19. [Vision long terme](#19-vision-long-terme)
20. [Résumé stratégique](#20-résumé-stratégique)

---

# 1. Présentation générale

**AqarPro** est la branche professionnelle de **AqarVision**.

Elle est conçue pour permettre aux agences immobilières de :

- gérer leurs annonces
- valoriser leur image
- publier des contenus immobiliers de qualité
- centraliser leurs contacts
- suivre leurs leads
- gérer leurs médias
- piloter leur présence digitale
- gagner du temps grâce à l’automatisation et à l’intelligence artificielle

AqarPro ne doit pas être perçu comme un simple outil de publication de biens.

Il doit être compris comme une **plateforme professionnelle complète**, pensée pour aider une agence à se structurer comme une marque digitale crédible.

---

# 2. Rôle de AqarPro dans AqarVision

Dans l’écosystème AqarVision :

- **AqarPro** est l’espace professionnel
- **AqarSearch** est l’espace particulier

Le rôle de AqarPro est de :

- produire l’offre immobilière
- structurer cette offre
- enrichir les annonces
- qualifier la présence digitale des agences
- recevoir les signaux de contact venant de AqarSearch
- centraliser le pilotage commercial et éditorial

AqarPro est donc la couche qui permet aux professionnels de transformer leur activité immobilière en présence digitale moderne et exploitable.

---

# 3. Vision produit

La vision de AqarPro est la suivante :

> **permettre à une agence immobilière de gérer toute sa présence digitale, ses annonces, ses premiers échanges commerciaux et une partie de sa production de contenu depuis un seul espace**

AqarPro doit être :

- professionnel
- premium
- simple à utiliser
- moderne
- crédible face aux grands groupes
- utile au quotidien

L’ambition n’est pas de construire un outil trop lourd ou trop bureaucratique.

L’ambition est de construire un **produit élégant, puissant et concret**, qui aide une agence à mieux publier, mieux présenter et mieux convertir.

---

# 4. Promesse de AqarPro

La promesse centrale de AqarPro est :

> **donner à une agence immobilière les outils pour exister en ligne avec un niveau de qualité, de cohérence et de présentation digne d’un grand acteur du secteur**

Cela signifie concrètement :

- mieux présenter l’agence
- mieux présenter les biens
- produire plus vite
- améliorer la qualité des annonces
- centraliser les contacts
- mieux suivre les opportunités
- renforcer l’image de marque

---

# 5. Les 5 piliers de AqarPro

## 5.1 Publier
Créer, enrichir, publier et gérer les annonces immobilières.

## 5.2 Valoriser
Mettre en scène l’agence et ses biens à travers des mini-vitrines premium.

## 5.3 Convertir
Recevoir et traiter les leads, messages et demandes de visite.

## 5.4 Piloter
Suivre les performances, la complétude, l’activité et les signaux utiles.

## 5.5 Gagner du temps
Utiliser l’IA et l’automatisation pour réduire les tâches répétitives et améliorer la qualité.

---

# 6. Gestion des annonces

La gestion des annonces est le cœur fonctionnel de AqarPro.

L’agence doit pouvoir :

- créer une annonce
- modifier une annonce
- supprimer une annonce
- publier une annonce
- dépublier ou archiver une annonce
- suivre l’état commercial du bien
- mettre en avant certains biens
- dupliquer une annonce si nécessaire
- enrichir un bien avec toutes ses caractéristiques
- gérer les informations de localisation
- gérer les photos, vidéos et médias du bien

## Objectif produit
La création d’annonce doit être :

- rapide
- claire
- guidée
- valorisante
- professionnelle

Une agence ne doit pas avoir l’impression de remplir un formulaire lourd, mais de produire une fiche bien de qualité.

---

# 7. Présence digitale et mini-vitrines

Chaque agence doit pouvoir bénéficier d’une **mini-vitrine professionnelle**.

Cette vitrine a pour rôle de :

- présenter l’agence
- afficher les biens
- mettre en avant son image
- proposer un site moderne et partageable
- rassurer les clients
- créer une présence digitale crédible

Les mini-vitrines doivent ressembler à de vrais sites immobiliers premium, et non à de simples pages générées automatiquement.

L’objectif est que l’agence puisse dire :

> “voici notre site”

et non :

> “voici une page catalogue impersonnelle”

---

# 8. Système de thèmes vitrines

Les thèmes des mini-vitrines doivent être de **vrais thèmes complets**, avec des différences profondes.

Il ne s’agit pas seulement de changer :

- les couleurs
- les polices
- les boutons

Chaque thème doit proposer :

- une structure de page différente
- une hiérarchie différente
- une mise en avant différente des contenus
- une ambiance visuelle différente
- une manière différente de présenter les biens et l’agence

## Exemples de familles de thèmes

- minimaliste
- moderne
- premium
- institutionnel
- luxe
- promoteur
- urbain éditorial

## Règle stratégique validée
Le nombre de thèmes disponibles dépend du plan.

### Starter
- accès à **2 thèmes**

### Pro
- accès à **5 thèmes**

### Enterprise
- accès à **tous les thèmes**
- accès à de la **personnalisation avancée**

## Objectif
Faire des thèmes un vrai levier de différenciation entre les plans.

---

# 9. Branding et personnalisation

AqarPro doit permettre à l’agence de personnaliser son image.

## Éléments de branding
- logo
- image de couverture
- couleurs principales
- éventuellement couleurs secondaires selon plan
- slogan
- description agence
- coordonnées
- réseaux sociaux
- ton de présentation

## Objectif
Permettre à l’agence de construire une identité digitale cohérente et rassurante.

Le branding ne doit pas être décoratif seulement.
Il doit renforcer la crédibilité commerciale de l’agence.

---

# 10. Dashboard personnalisable

Le tableau de bord AqarPro ne doit pas être figé.

L’agence doit pouvoir personnaliser ce qu’elle veut voir en priorité.

## Blocs possibles
- nouveaux leads
- derniers messages
- biens publiés
- biens brouillons
- annonces à améliorer
- statistiques clés
- actions rapides
- activité récente
- état du mini-site
- niveau de complétude

## Vision
Le dashboard doit être un **cockpit de pilotage**.

Il doit aider une agence à comprendre rapidement :

- où elle en est
- ce qu’elle doit faire
- ce qui fonctionne
- ce qui demande une action

---

# 11. Gestion des médias

AqarPro doit permettre une gestion média solide et qualitative.

## Médias concernés
- photos des biens
- vidéos des biens
- image principale d’une annonce
- galeries
- logo agence
- couverture agence
- médias utilisés dans les vitrines

## Fonctions attendues
- upload
- prévisualisation
- suppression
- réorganisation
- choix de l’image principale
- enrichissement visuel des annonces
- gestion propre des médias de branding

## Objectif
La qualité visuelle est essentielle dans l’immobilier.
Les médias ne doivent pas être traités comme un détail technique, mais comme un levier de conversion.

---

# 12. Leads, messages et demandes de visite

AqarPro doit centraliser tous les signaux utiles venant des particuliers.

## AqarPro doit recevoir :
- les formulaires de contact
- les messages issus de AqarSearch
- les demandes de visite
- les interactions liées aux annonces

## L’agence doit pouvoir :
- voir rapidement les nouveaux leads
- comprendre leur contexte
- retrouver le bien concerné
- répondre
- suivre le statut du contact
- accéder à l’historique des échanges

## Objectif
AqarPro doit devenir le point d’entrée principal de la relation digitale entre l’agence et les particuliers.

---

# 13. IA intégrée dans AqarPro

L’IA doit être présente presque partout dans AqarPro, mais de manière **discrète**.

Elle ne doit pas apparaître comme une couche artificielle indépendante, mais comme une aide contextuelle naturelle.

## Cas d’usage principaux

### 13.1 Annonces
- générer un titre
- générer une description
- reformuler un texte
- améliorer une annonce existante
- mettre en avant les points forts du bien

### 13.2 Présentation agence
- générer une description agence
- proposer des slogans
- améliorer les textes de présentation

### 13.3 Communication
- aider à rédiger un message
- aider à rédiger un email
- aider à rédiger un texte marketing
- aider à produire du contenu pour les réseaux sociaux

### 13.4 Accompagnement qualité
- suggérer d’ajouter des informations manquantes
- améliorer la complétude des annonces
- renforcer la qualité éditoriale

## Principe UX
L’IA doit apparaître sous forme d’actions simples :

- Générer
- Reformuler
- Améliorer
- Proposer
- Enrichir

---

# 14. Gestion d’équipe

AqarPro doit pouvoir supporter une logique d’équipe.

## Objectifs
- permettre à plusieurs membres d’accéder à un même espace agence
- attribuer des rôles
- mieux répartir la gestion interne

## Types de rôles possibles
- propriétaire
- admin
- agent
- viewer

## Fonctions attendues
- inviter un membre
- retirer un membre
- modifier un rôle
- contrôler certains accès

## Vision
Même si ce n’est pas toujours le bloc le plus visible, la gestion d’équipe est nécessaire pour les agences structurées et renforce la crédibilité du produit.

---

# 15. Analytics et pilotage

AqarPro doit fournir aux agences des informations utiles, pas juste des chiffres décoratifs.

## Données utiles
- nombre de biens
- nombre de leads
- biens les plus consultés
- annonces incomplètes
- performances de certaines pages
- activité récente
- répartition des contacts

## Objectif
Aider l’agence à :

- comprendre ce qui fonctionne
- améliorer ses annonces
- prioriser ses actions
- piloter sa présence digitale

## Positionnement
Il ne s’agit pas de construire un outil analytique trop complexe au départ, mais un tableau de bord suffisamment utile pour orienter les décisions.

---

# 16. Plans et montée en gamme

AqarPro doit proposer une vraie montée en gamme entre les plans.

La différence entre les plans ne doit pas reposer uniquement sur :

- des quotas
- des limites chiffrées

Elle doit aussi reposer sur :

- la richesse des thèmes
- le niveau de personnalisation
- les capacités avancées
- la perception premium

## Exemples de différences
- nombre de thèmes
- personnalisation avancée
- branding plus poussé
- analytics plus riches
- capacités équipe
- fonctions premium de visibilité
- intégrations ou automatisations supplémentaires

---

# 17. Expérience utilisateur attendue

AqarPro doit offrir une expérience :

- claire
- calme
- premium
- efficace
- rassurante

L’interface doit donner le sentiment que l’agence utilise un vrai produit professionnel moderne.

Elle ne doit pas ressembler à :

- un simple back-office technique
- un WordPress immobilier maladroit
- un outil froid sans identité
- un CRM trop lourd

L’expérience attendue est celle d’un outil :

- fluide
- crédible
- visuellement soigné
- conçu pour aider à produire et convertir

---

# 18. Règles de conception produit

## 18.1 AqarPro doit rester lisible
Il faut éviter d’en faire une usine à gaz.

## 18.2 Chaque fonctionnalité doit avoir une valeur métier claire
Chaque module doit aider l’agence à :
- mieux publier
- mieux présenter
- mieux répondre
- mieux convertir
- mieux piloter

## 18.3 Le rendu doit rester premium
Le design et l’expérience doivent être cohérents avec une cible professionnelle exigeante.

## 18.4 L’IA doit aider, pas envahir
Elle doit être utile, contextuelle et silencieuse.

## 18.5 Les thèmes vitrines sont un élément stratégique
Ils doivent être suffisamment différenciants pour justifier une vraie valeur perçue.

---

# 19. Vision long terme

À long terme, AqarPro doit devenir :

- un outil central pour l’activité digitale des agences
- une base de publication et de gestion fiable
- un levier d’image de marque
- un cockpit de relation client léger mais utile
- un accélérateur de production grâce à l’IA

AqarPro doit permettre à des agences de tailles différentes de se professionnaliser :

- petites agences
- agences structurées
- réseaux
- acteurs premium

---

# 20. Résumé stratégique

AqarPro est la branche professionnelle de AqarVision.

Sa mission est de donner aux agences les moyens de :

- publier leurs biens
- les valoriser
- construire une présence digitale crédible
- mieux gérer leurs leads et leurs messages
- utiliser l’IA pour produire plus vite et mieux
- piloter leur activité depuis un espace unique

## Arbitrages structurants validés

- AqarPro doit être un **produit complet**, pas seulement un outil d’annonces
- les **mini-vitrines** doivent être de vrais sites avec des structures différentes
- les **thèmes** sont liés au plan :
  - Starter → 2 thèmes
  - Pro → 5 thèmes
  - Enterprise → tous les thèmes + personnalisation avancée
- le **dashboard** doit être personnalisable
- la **gestion des médias** doit être forte
- l’**IA** doit être présente presque partout, mais de manière **discrète**
- AqarPro doit centraliser :
  - annonces
  - image
  - contenus
  - leads
  - messages
  - demandes de visite
  - premiers éléments de pilotage

AqarPro doit donc être pensé comme un produit premium, simple, crédible et structurant pour les agences immobilières.
# AqarVision — Document Global de Vision Produit

> Vision consolidée de la plateforme AqarVision, de ses deux branches AqarPro et AqarSearch, et des arbitrages stratégiques validés

**Version** : 1.1  
**Statut** : Vision produit consolidée  
**Objectif** : aligner la stratégie globale, clarifier les rôles de AqarPro et AqarSearch, et formaliser les choix structurants validés

---

# Table des matières

1. [Présentation générale](#1-présentation-générale)
2. [Architecture produit](#2-architecture-produit)
3. [Positionnement global](#3-positionnement-global)
4. [Vision de AqarPro](#4-vision-de-aqarpro)
5. [Fonctions clés de AqarPro](#5-fonctions-clés-de-aqarpro)
6. [Système de thèmes des mini-vitrines](#6-système-de-thèmes-des-mini-vitrines)
7. [Vision de l’IA dans AqarPro](#7-vision-de-lia-dans-aqarpro)
8. [Vision de AqarSearch](#8-vision-de-aqarsearch)
9. [Règle d’accès de AqarSearch](#9-règle-daccès-de-aqarsearch)
10. [Fonctions clés de AqarSearch](#10-fonctions-clés-de-aqarsearch)
11. [Messagerie sécurisée AqarSearch](#11-messagerie-sécurisée-aqarsearch)
12. [Demande de visite](#12-demande-de-visite)
13. [Interaction entre AqarPro et AqarSearch](#13-interaction-entre-aqarpro-et-aqarsearch)
14. [Promesse produit globale](#14-promesse-produit-globale)
15. [Indicateurs de réussite](#15-indicateurs-de-réussite)
16. [Vision long terme](#16-vision-long-terme)
17. [Résumé stratégique](#17-résumé-stratégique)

---

# 1. Présentation générale

**AqarVision** est une plateforme immobilière moderne conçue pour connecter efficacement :

- les **professionnels de l’immobilier**
- les **particuliers à la recherche d’un bien**

La plateforme repose sur deux branches complémentaires :

- **AqarPro** → la branche professionnelle dédiée aux agences immobilières
- **AqarSearch** → la branche particulière dédiée aux utilisateurs finaux

Ces deux branches ne sont pas deux produits séparés sans lien.  
Elles fonctionnent ensemble dans un même écosystème :

- **AqarPro produit et structure l’offre**
- **AqarSearch organise la découverte, le suivi et l’interaction**
- **AqarVision relie les deux**

---

# 2. Architecture produit

```text
AqarVision
│
├── AqarPro
│   Plateforme professionnelle pour les agences
│
└── AqarSearch
    Plateforme de recherche immobilière pour les particuliers
```

AqarVision est la marque et l’écosystème global.

- **AqarPro** est l’espace professionnel
- **AqarSearch** est la partie visible côté particulier

AqarSearch n’est donc pas une marque indépendante.  
Il s’agit de la branche particulier de AqarVision.

---

# 3. Positionnement global

AqarVision a vocation à devenir une plateforme immobilière nouvelle génération, plus moderne, plus premium et plus cohérente que les portails immobiliers classiques.

Inspirations principales :

- **Airbnb** pour l’expérience de recherche, la fluidité et la simplicité d’usage
- **Jinka** pour la logique de suivi de recherche, d’alertes et de favoris
- **Sotheby’s** pour l’esthétique immobilière haut de gamme
- **Stripe / Linear** pour la qualité du dashboard SaaS

Le produit doit combiner :

- la qualité d’image des grandes agences
- l’efficacité d’un vrai outil pro
- la simplicité d’un produit grand public bien pensé

---

# 4. Vision de AqarPro

AqarPro est la branche professionnelle de AqarVision.

Sa mission est de permettre aux agences immobilières de :

- publier leurs biens
- gérer leurs annonces
- valoriser leur image
- recevoir et suivre leurs leads
- centraliser leurs premiers échanges avec les particuliers
- piloter leur présence digitale

AqarPro ne doit pas être seulement un back-office d’annonces.

Il doit devenir un **outil immobilier complet**, avec un niveau de qualité proche de ce qu’on attend d’un grand groupe immobilier sur le web.

L’ambition produit de AqarPro est la suivante :

> **transformer une agence immobilière en marque digitale structurée**

---

# 5. Fonctions clés de AqarPro

## 5.1 Gestion des annonces

AqarPro doit permettre à l’agence de :

- créer des annonces
- modifier des annonces
- publier ou archiver un bien
- gérer les caractéristiques du bien
- gérer les médias
- suivre l’état commercial du bien
- mettre en avant certains biens
- organiser son catalogue de biens

## 5.2 Mini-sites vitrines professionnels

Chaque agence doit pouvoir disposer d’un site vitrine professionnel, moderne et crédible.

La mini-vitrine doit permettre de :

- présenter l’agence
- afficher les biens
- mettre en avant certaines annonces
- valoriser l’image de marque
- faciliter la prise de contact

L’objectif n’est pas simplement de fournir une page agence, mais de proposer de **véritables pages web indépendantes les unes des autres**, avec des structures différentes.

## 5.3 Personnalisation du dashboard

Le tableau de bord AqarPro ne doit pas être figé.

L’agence doit pouvoir choisir les éléments qu’elle souhaite mettre en avant :

- nouveaux leads
- biens publiés
- performances d’annonces
- annonces incomplètes
- actions rapides
- résumés utiles

Le dashboard doit être pensé comme un **outil de pilotage**, pas seulement comme une interface d’administration.

## 5.4 Gestion avancée des médias

AqarPro doit permettre de gérer :

- photos des biens
- vidéos
- image principale
- galeries
- médias de branding agence
- contenus visuels pour les mini-vitrines

Les médias doivent avoir un rôle central dans la qualité du rendu final.

## 5.5 Gestion des leads et messages

AqarPro centralise :

- formulaires de contact
- demandes de visite
- messages issus de AqarSearch
- autres signaux de contact utiles

L’agence doit pouvoir :

- retrouver le bien concerné
- comprendre le contexte du contact
- répondre rapidement
- suivre les échanges

## 5.6 Présence de l’IA dans AqarPro

L’IA doit être présente presque partout dans AqarPro, mais de manière **discrète**, intégrée naturellement dans l’interface.

Elle ne doit pas prendre la forme d’un assistant envahissant, mais d’actions contextuelles utiles comme :

- générer
- reformuler
- améliorer
- enrichir
- proposer

---

# 6. Système de thèmes des mini-vitrines

Les thèmes des mini-vitrines ne doivent pas être de simples variations de couleurs.

Chaque thème doit correspondre à une **vraie structure de site**, avec :

- une hiérarchie de contenu différente
- une composition différente
- une ambiance différente
- une manière différente de présenter l’agence et les biens

Le thème doit donc être pensé comme un **template complet de site immobilier**, et non comme un skin.

## Répartition par plan

### Starter
- accès à **2 thèmes**

### Pro
- accès à **5 thèmes**

### Enterprise
- accès à **tous les thèmes**
- accès à une **personnalisation avancée**

## Objectif
Créer une vraie montée en gamme entre les plans, où la valeur ne repose pas uniquement sur des limites quantitatives, mais aussi sur la qualité de présence digitale proposée.

---

# 7. Vision de l’IA dans AqarPro

L’IA doit être intégrée de manière transversale dans AqarPro.

## Cas d’usage principaux

### Annonces
- génération de titres
- génération de descriptions
- reformulation de descriptions existantes
- amélioration du ton et de la qualité rédactionnelle
- mise en avant des points forts du bien

### Agence
- génération de description agence
- aide à la rédaction de slogans
- aide aux textes de présentation

### Communication
- aide à la rédaction d’emails
- aide à la rédaction de messages commerciaux
- aide à la production de contenus marketing
- aide à la préparation de publications sociales

## Principe de design
L’IA doit être **présente presque partout**, mais de manière intégrée discrètement dans les interfaces, sous forme d’actions contextuelles simples.

---

# 8. Vision de AqarSearch

AqarSearch est la branche particulier de AqarVision.

Sa mission est de permettre aux utilisateurs finaux de :

- rechercher des biens simplement
- consulter librement les annonces
- organiser leur recherche dans le temps
- suivre les biens qui les intéressent
- recevoir des alertes
- échanger avec les professionnels
- demander une visite

AqarSearch s’inspire :

- de **Airbnb** pour l’expérience utilisateur
- de **Jinka** pour la logique de suivi, d’alertes et de favoris

AqarSearch n’a pas pour vocation initiale d’être un agrégateur global externe du marché.  
Il sert d’abord à rendre visibles et exploitables les biens publiés par les professionnels présents sur AqarPro.

AqarSearch ne doit pas être pensé comme un simple catalogue d’annonces.  
Il doit devenir un **espace personnel de recherche immobilière**.

---

# 9. Règle d’accès de AqarSearch

## 9.1 Utilisateur public non connecté

Un utilisateur non connecté peut uniquement :

- rechercher des biens
- filtrer les résultats
- consulter les fiches annonces
- découvrir les agences présentes

## 9.2 Utilisateur connecté

Un utilisateur connecté peut en plus :

- enregistrer des favoris
- créer des collections de favoris
- renommer ses collections
- ajouter des notes personnelles sur les biens
- retrouver les biens déjà vus
- consulter son historique de recherche
- reprendre sa recherche
- créer et gérer des alertes
- recevoir des notifications
- utiliser la messagerie sécurisée
- consulter l’historique de ses échanges
- envoyer une demande de visite suivie

## 9.3 Règle UX obligatoire

Toute action réservée à un utilisateur connecté doit déclencher :

- une redirection vers la création de compte ou la connexion
- puis un retour automatique vers le contexte initial après authentification

La règle produit est donc :

- **sans compte** → découverte simple
- **avec compte** → suivi intelligent de la recherche

---

# 10. Fonctions clés de AqarSearch

## 10.1 Recherche immobilière
L’utilisateur peut rechercher selon :

- localisation
- budget
- type de bien
- surface
- nombre de pièces
- type de transaction

## 10.2 Résultats de recherche
Les résultats sont présentés sous forme de cartes claires avec :

- image
- prix
- localisation
- caractéristiques principales

## 10.3 Fiche détaillée bien
Chaque bien possède une fiche complète avec :

- galerie
- description
- caractéristiques
- localisation
- agence responsable
- actions principales

## 10.4 Biens déjà vus
L’utilisateur peut retrouver les biens déjà consultés.

## 10.5 Notes personnelles
L’utilisateur peut ajouter des notes privées sur les biens.

## 10.6 Favoris
L’utilisateur peut enregistrer des biens en favoris.

## 10.7 Collections de favoris
L’utilisateur peut :

- créer des catégories
- nommer ses catégories
- les renommer
- organiser ses biens favoris dans ces catégories

Un bien peut appartenir à **plusieurs collections**.

## 10.8 Historique de recherche
L’utilisateur peut retrouver ses recherches passées.

## 10.9 Recherche reprise
Le produit peut proposer de reprendre la dernière recherche ou les derniers biens consultés.

## 10.10 Alertes
L’utilisateur peut créer des alertes personnalisées sur des recherches précises.

## 10.11 Alertes enrichies
Les alertes peuvent concerner :

- un nouveau bien correspondant aux critères
- une baisse de prix
- un bien similaire à un favori
- un bien proche d’une recherche enregistrée

## 10.12 Messagerie sécurisée
L’utilisateur peut échanger avec les professionnels depuis un espace dédié.

## 10.13 Historique des messages
L’utilisateur retrouve ses échanges passés avec les agences.

## 10.14 Statut de réactivité agence
AqarSearch peut afficher des informations simples sur la réactivité des agences.

## 10.15 Demande de visite
L’utilisateur peut demander une visite avec le contexte du bien automatiquement inclus.

## 10.16 Partage facile
L’utilisateur peut partager un bien facilement.

---

# 11. Messagerie sécurisée AqarSearch

La messagerie AqarSearch doit être accessible uniquement depuis un **contexte précis** :

- fiche bien
- fiche agence
- action contextualisée dans l’espace de recherche

Une conversation peut être liée :

- obligatoirement à une agence
- optionnellement à un bien
- éventuellement à un contexte de recherche ou de demande de visite

Aucune messagerie libre sans contexte ne doit être proposée au lancement.

## Objectif
Éviter les messages trop vagues, garder un contexte clair côté particulier comme côté agence, et améliorer la qualité des échanges dans AqarPro.

---

# 12. Demande de visite

La demande de visite doit rester **simple**.

Il s’agit d’un **formulaire prérempli**, contenant automatiquement :

- les informations du bien
- la référence du bien
- l’agence concernée
- le contexte de la demande

Les champs doivent rester modifiables par l’utilisateur.

L’objectif n’est pas de créer un workflow complexe au départ, mais de proposer une action claire, concrète et facile à traiter côté agence.

---

# 13. Interaction entre AqarPro et AqarSearch

Flux général :

1. une agence publie un bien dans AqarPro
2. le bien devient visible dans AqarSearch
3. un particulier consulte le bien
4. il peut le suivre, le partager, contacter l’agence ou demander une visite
5. les leads, messages et demandes remontent dans AqarPro

Ainsi :

- **AqarPro crée et gère l’offre**
- **AqarSearch capte et accompagne la demande**
- **AqarVision structure la relation entre les deux**

---

# 14. Promesse produit globale

## Promesse AqarPro
Permettre aux agences d’avoir une présence digitale crédible, moderne et efficace, avec des outils de publication, de branding, de communication et de gestion commerciale.

## Promesse AqarSearch
Permettre aux particuliers de chercher librement, puis de suivre intelligemment leur recherche immobilière dans un espace personnel moderne.

## Promesse AqarVision
Créer un écosystème immobilier moderne où les agences publient et pilotent leur activité, et où les particuliers découvrent, organisent et suivent leur recherche.

---

# 15. Indicateurs de réussite

Sur les premiers mois, les deux indicateurs les plus importants à suivre sont :

- le nombre d’**agences onboardées**
- le nombre de **leads générés**

Ces deux indicateurs sont complémentaires :

- sans agences, il n’y a pas d’offre à valoriser
- sans leads, la valeur perçue par les agences reste insuffisante

AqarVision doit donc être piloté avec une double logique :

- acquisition et activation des agences
- génération d’opportunités concrètes via la plateforme

---

# 16. Vision long terme

AqarVision a vocation à devenir :

- une plateforme immobilière moderne
- un outil professionnel fort pour les agences
- un espace de recherche utile et rassurant pour les particuliers
- une expérience digitale plus premium que les portails immobiliers classiques

À terme, la plateforme doit être capable de :

- renforcer la présence digitale des agences
- professionnaliser la publication immobilière
- fluidifier la mise en relation
- structurer le suivi de recherche côté particulier
- créer un cercle vertueux entre offre professionnelle et demande qualifiée

---

# 17. Résumé stratégique

AqarVision est un écosystème global.

## Côté professionnel : AqarPro
AqarPro donne aux agences les outils pour :

- publier
- valoriser
- communiquer
- piloter
- gagner du temps grâce à l’IA

## Côté particulier : AqarSearch
AqarSearch permet aux particuliers de :

- rechercher librement
- consulter sans compte
- puis, avec compte, bénéficier d’un espace de suivi riche :
  - favoris
  - collections
  - notes
  - historique
  - alertes
  - messagerie
  - demande de visite

## Arbitrages stratégiques validés

- **AqarSearch** n’est pas une marque autonome : c’est la partie visible de AqarVision côté particulier
- les **mini-vitrines AqarPro** doivent être de vrais thèmes complets, avec des structures différentes
- les **thèmes** sont liés au plan :
  - Starter → 2 thèmes
  - Pro → 5 thèmes
  - Enterprise → tous les thèmes + personnalisation avancée
- l’**IA** doit être présente presque partout dans AqarPro, mais de manière **discrète**
- la **messagerie** doit partir d’un contexte précis : fiche agence, fiche bien ou contexte immobilier
- un bien peut appartenir à **plusieurs collections de favoris**
- la **demande de visite** doit être un formulaire simple, prérempli avec les informations du bien
- les **deux indicateurs principaux** à suivre sont :
  - agences onboardées
  - leads générés

AqarVision doit donc être construit comme une plateforme cohérente, premium et utile des deux côtés du marché.
