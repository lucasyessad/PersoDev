# AqarSearch — Technical & Product Specification

> Spécification fonctionnelle et technique de la branche particulier de AqarVision

**Version** : 1.0.0  
**Statut** : Spécification produit et technique  
**Produit parent** : AqarVision  
**Branche concernée** : AqarSearch  
**Architecture cible** : Monolithe modulaire Next.js 14 + Supabase

---

# Table des matières

1. [Définition de AqarSearch](#1-définition-de-aqarsearch)
2. [Objectif général](#2-objectif-général)
3. [Positionnement produit](#3-positionnement-produit)
4. [Relation avec AqarPro](#4-relation-avec-aqarpro)
5. [Principes UX fondamentaux](#5-principes-ux-fondamentaux)
6. [Recherche libre sans compte](#6-recherche-libre-sans-compte)
7. [Compte utilisateur particulier](#7-compte-utilisateur-particulier)
8. [Périmètre fonctionnel](#8-périmètre-fonctionnel)
9. [Fonctionnalité 1 — Recherche immobilière](#9-fonctionnalité-1--recherche-immobilière)
10. [Fonctionnalité 2 — Résultats de recherche](#10-fonctionnalité-2--résultats-de-recherche)
11. [Fonctionnalité 3 — Fiche détaillée d’un bien](#11-fonctionnalité-3--fiche-détaillée-dun-bien)
12. [Fonctionnalité 4 — Biens déjà vus](#12-fonctionnalité-4--biens-déjà-vus)
13. [Fonctionnalité 5 — Notes personnelles](#13-fonctionnalité-5--notes-personnelles)
14. [Fonctionnalité 6 — Favoris](#14-fonctionnalité-6--favoris)
15. [Fonctionnalité 7 — Collections de favoris](#15-fonctionnalité-7--collections-de-favoris)
16. [Fonctionnalité 8 — Historique de recherche](#16-fonctionnalité-8--historique-de-recherche)
17. [Fonctionnalité 9 — Recherche reprise](#17-fonctionnalité-9--recherche-reprise)
18. [Fonctionnalité 10 — Alertes de recherche](#18-fonctionnalité-10--alertes-de-recherche)
19. [Fonctionnalité 11 — Alertes enrichies](#19-fonctionnalité-11--alertes-enrichies)
20. [Fonctionnalité 12 — Messagerie sécurisée](#20-fonctionnalité-12--messagerie-sécurisée)
21. [Fonctionnalité 13 — Historique des messages](#21-fonctionnalité-13--historique-des-messages)
22. [Fonctionnalité 14 — Statut de réactivité agence](#22-fonctionnalité-14--statut-de-réactivité-agence)
23. [Fonctionnalité 15 — Demande de visite](#23-fonctionnalité-15--demande-de-visite)
24. [Fonctionnalité 16 — Partage facile](#24-fonctionnalité-16--partage-facile)
25. [Nouvelles routes Next.js](#25-nouvelles-routes-nextjs)
26. [Nouveaux modules backend](#26-nouveaux-modules-backend)
27. [Nouvelles tables SQL](#27-nouvelles-tables-sql)
28. [Index de recherche](#28-index-de-recherche)
29. [Règles de visibilité des annonces](#29-règles-de-visibilité-des-annonces)
30. [Moteur de recherche](#30-moteur-de-recherche)
31. [Favoris et organisation personnelle](#31-favoris-et-organisation-personnelle)
32. [Messagerie et demandes de visite](#32-messagerie-et-demandes-de-visite)
33. [Leads depuis AqarSearch](#33-leads-depuis-aqarsearch)
34. [Analytics et événements](#34-analytics-et-événements)
35. [Validators Zod](#35-validators-zod)
36. [Server Actions](#36-server-actions)
37. [Composants UI à créer](#37-composants-ui-à-créer)
38. [Pages à créer](#38-pages-à-créer)
39. [Sécurité et RLS](#39-sécurité-et-rls)
40. [Performance et cache](#40-performance-et-cache)
41. [Tests à ajouter](#41-tests-à-ajouter)
42. [Arborescence recommandée](#42-arborescence-recommandée)
43. [Plan d’implémentation par phases](#43-plan-dimplémentation-par-phases)
44. [Prompt maître pour Claude Code](#44-prompt-maître-pour-claude-code)

---

# 1. Définition de AqarSearch

AqarSearch est la branche **particulier** de l’écosystème AqarVision.

Elle permet aux utilisateurs finaux de :

- rechercher librement les biens publiés par les agences présentes sur AqarPro
- consulter les annonces sans créer de compte
- créer un compte pour bénéficier de fonctions de suivi avancées
- organiser leur recherche dans le temps
- communiquer avec les professionnels via un espace dédié

AqarSearch n’est pas conçu, dans sa première vision, comme un agrégateur global externe du marché immobilier.
Il est conçu comme **l’espace particulier intelligent, moderne et connecté à AqarPro**.

---

# 2. Objectif général

AqarSearch doit permettre à un particulier de :

- découvrir rapidement des biens pertinents
- reprendre facilement sa recherche
- ne pas perdre les annonces déjà vues
- organiser ses favoris
- créer des alertes sur des recherches précises
- communiquer proprement avec les agences
- demander une visite sans friction

Le produit doit être utile **sans compte**, puis devenir beaucoup plus puissant **avec compte**.

---

# 3. Positionnement produit

AqarSearch s’inspire :

- de **Airbnb** pour la qualité de l’expérience utilisateur, la simplicité de la recherche et la fluidité de navigation
- de **Jinka** pour la logique de suivi de recherche, de favoris et d’alertes intelligentes

Le produit doit être :

- simple
- moderne
- rassurant
- visuel
- mobile-first
- très lisible
- centré sur la continuité de recherche

---

# 4. Relation avec AqarPro

AqarSearch dépend directement de l’offre produite dans AqarPro.

Flux général :

1. une agence publie un bien via AqarPro
2. le bien devient visible dans AqarSearch
3. un particulier consulte le bien
4. il peut l’enregistrer, le partager, créer une alerte, envoyer un message ou demander une visite
5. les interactions utiles remontent dans AqarPro

AqarPro produit l’offre.  
AqarSearch organise la découverte, le suivi et l’interaction.

---

# 5. Principes UX fondamentaux

## 5.1 Recherche immédiate
L’utilisateur doit pouvoir commencer à chercher sans créer de compte.

## 5.2 Compte utile, pas obligatoire
Le compte ne doit jamais être un prérequis à la découverte.

## 5.3 Continuité de recherche
Le produit doit aider l’utilisateur à reprendre sa recherche là où il l’a laissée.

## 5.4 Organisation personnelle
AqarSearch doit devenir un espace où l’utilisateur peut structurer sa recherche.

## 5.5 Mise en relation fluide
Les échanges avec les professionnels doivent être simples, centralisés et compréhensibles.

---

# 6. Recherche libre sans compte

## Définition
Un visiteur non connecté peut librement :

- effectuer une recherche
- filtrer les résultats
- consulter les fiches biens
- partager une annonce
- voir les agences et leurs biens

## Objectif
Réduire la friction d’entrée.

## Limitations sans compte
Sans compte, l’utilisateur ne peut pas :

- sauvegarder durablement ses favoris
- créer des alertes persistantes
- utiliser la messagerie sécurisée
- retrouver un historique synchronisé
- organiser ses biens dans des collections

## UX attendue
Quand une action nécessite un compte, l’interface doit :
- expliquer pourquoi
- montrer le bénéfice
- permettre de se connecter puis revenir au contexte courant

---

# 7. Compte utilisateur particulier

## Objectif
Permettre à un particulier de suivre sa recherche immobilière dans la durée.

## Fonctions débloquées
Avec un compte, l’utilisateur peut :

- enregistrer des favoris
- classer ses favoris dans des collections
- ajouter des notes personnelles
- voir les biens déjà consultés
- consulter son historique de recherche
- reprendre une recherche passée
- créer des alertes
- recevoir des notifications
- échanger avec les agences
- retrouver l’historique de ses messages
- envoyer des demandes de visite suivies

## Données minimales du compte
- nom ou prénom/nom
- email
- mot de passe
- téléphone optionnel
- préférences de recherche plus tard

## Flux attendu
- inscription simple
- connexion simple
- retour vers la page ou le bien consulté après authentification

---

# 8. Périmètre fonctionnel

AqarSearch doit couvrir les blocs suivants :

- recherche immobilière
- résultats de recherche
- fiche bien
- biens déjà vus
- notes personnelles
- favoris
- collections de favoris
- historique de recherche
- recherche reprise
- alertes de recherche
- alertes enrichies
- messagerie sécurisée
- historique des messages
- statut de réactivité agence
- demande de visite
- partage facile

---

# 9. Fonctionnalité 1 — Recherche immobilière

## Définition
Le moteur de recherche permet à l’utilisateur de chercher un bien selon plusieurs critères.

## Critères principaux
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

## Résultat attendu
Le moteur doit être :
- rapide
- compréhensible
- filtrable
- stable dans son comportement

## UX attendue
Desktop :
- barre de recherche visible
- filtres lisibles
- URL synchronisée avec les filtres

Mobile :
- search bar compacte
- filtres dans un drawer
- interactions simples au pouce

---

# 10. Fonctionnalité 2 — Résultats de recherche

## Définition
Les résultats doivent être affichés sous forme de cartes claires et premium.

## Contenu minimum d’une carte
- image principale
- prix
- type de bien
- localisation courte
- surface
- nombre de pièces
- agence source
- badge éventuel
- état “déjà vu” si applicable
- bouton favori si connecté

## Objectifs
- permettre un scan rapide
- éviter la surcharge
- rendre la recherche agréable

## États possibles
- résultat standard
- résultat déjà vu
- résultat favori
- résultat avec badge agence réactive

---

# 11. Fonctionnalité 3 — Fiche détaillée d’un bien

## Définition
La fiche bien est la page de référence d’une annonce côté particulier.

## Sections minimales
- galerie photos
- titre
- prix
- localisation
- caractéristiques principales
- description
- informations agence
- actions de contact
- partage
- favori
- demande de visite

## Objectifs
- comprendre le bien rapidement
- pouvoir l’enregistrer
- pouvoir agir sans effort

## Actions principales
- enregistrer en favori
- ajouter une note
- partager
- écrire à l’agence
- demander une visite

---

# 12. Fonctionnalité 4 — Biens déjà vus

## Définition
Le produit doit mémoriser les biens déjà consultés.

## Cas sans compte
- stockage local temporaire
- dépend du navigateur

## Cas avec compte
- synchronisation dans le profil utilisateur
- historique persistant
- base pour la recherche reprise

## Rendu attendu
- badge “Déjà vu” dans les résultats
- bloc “Derniers biens consultés”
- reprise plus facile de la recherche

---

# 13. Fonctionnalité 5 — Notes personnelles

## Définition
Un utilisateur connecté peut ajouter une note privée sur chaque bien.

## Exemples
- trop cher
- quartier intéressant
- à revoir ce week-end
- à envoyer à mes parents

## Règles
- note visible uniquement par son auteur
- note modifiable
- note supprimable
- une note liée à un bien

## Objectifs
- aider à comparer
- aider à mémoriser
- rendre l’espace personnel plus utile

---

# 14. Fonctionnalité 6 — Favoris

## Définition
Un utilisateur connecté peut enregistrer des biens en favoris.

## Actions
- ajouter en favori
- retirer des favoris
- afficher la liste des favoris

## Objectif
Permettre de retrouver rapidement les biens qui intéressent l’utilisateur.

## UX
- bouton favori sur carte résultat
- bouton favori sur fiche bien
- page dédiée `/favoris`

---

# 15. Fonctionnalité 7 — Collections de favoris

## Définition
Les favoris doivent pouvoir être organisés dans des collections.

## Actions possibles
- créer une collection
- nommer une collection
- renommer une collection
- supprimer une collection
- ajouter un favori à une collection
- déplacer ou reclassement d’un bien si nécessaire

## Exemples
- Achat
- Location
- À visiter
- Investissement
- À comparer

## Objectifs
- transformer les favoris en outil d’organisation
- améliorer la valeur du compte particulier
- structurer une recherche complexe

---

# 16. Fonctionnalité 8 — Historique de recherche

## Définition
Le système conserve les recherches effectuées par l’utilisateur connecté.

## Données à conserver
- critères de recherche
- localisation
- budget
- type de bien
- date
- dernière exécution

## Actions disponibles
- revoir une recherche
- relancer une recherche
- supprimer un élément
- vider l’historique

## Objectif
Permettre à l’utilisateur de reprendre facilement une recherche passée.

---

# 17. Fonctionnalité 9 — Recherche reprise

## Définition
Quand l’utilisateur revient, AqarSearch doit lui proposer de reprendre sa recherche.

## Informations utiles
- dernière recherche effectuée
- derniers biens consultés
- derniers favoris ajoutés
- dernières alertes actives

## Rendu UX
- “Reprendre votre dernière recherche”
- “Continuer là où vous vous êtes arrêté”
- bloc de continuité sur la home ou l’espace personnel

## Objectif
Réduire la friction et augmenter la rétention.

---

# 18. Fonctionnalité 10 — Alertes de recherche

## Définition
Un utilisateur connecté peut sauvegarder une recherche et demander à être alerté.

## Paramètres d’une alerte
- nom de l’alerte
- critères associés
- fréquence
- canal

## Canaux possibles
- notification interne
- email

## Actions
- créer une alerte
- activer / désactiver
- renommer
- supprimer
- consulter les critères

## Objectif
Ne pas forcer l’utilisateur à revenir manuellement vérifier les nouveautés.

---

# 19. Fonctionnalité 11 — Alertes enrichies

## Définition
Les alertes ne se limitent pas à “nouveau bien correspondant”.

## Cas retenus
- nouveau bien correspondant à une recherche
- baisse de prix sur un bien suivi
- bien similaire à un favori
- bien similaire à une recherche enregistrée

## Objectifs
- rendre le produit proactif
- augmenter l’utilité du compte
- créer un vrai accompagnement de recherche

---

# 20. Fonctionnalité 12 — Messagerie sécurisée

## Définition
Les utilisateurs connectés peuvent communiquer avec les agences via une messagerie interne.

## Objectifs
- centraliser les échanges
- éviter de perdre des conversations
- maintenir un canal clair et sécurisé

## Règles
- la messagerie nécessite un compte
- chaque conversation doit être liée à une agence
- une conversation peut aussi être liée à un bien précis
- les messages sont horodatés
- les messages sont historisés

## Actions
- démarrer une conversation
- répondre
- voir les non lus
- consulter une conversation existante

---

# 21. Fonctionnalité 13 — Historique des messages

## Définition
L’utilisateur doit pouvoir retrouver tous ses échanges avec les agences.

## Informations à afficher
- agence
- bien concerné
- dernier message
- date du dernier échange
- état lu / non lu

## Objectif
Aider l’utilisateur à ne pas perdre le fil de ses contacts immobiliers.

---

# 22. Fonctionnalité 14 — Statut de réactivité agence

## Définition
AqarSearch peut afficher une information simple sur la réactivité d’une agence.

## Exemples
- répond généralement rapidement
- agence active récemment
- réponse habituelle rapide

## Objectifs
- rassurer les particuliers
- valoriser les agences sérieuses
- améliorer la confiance globale

## Règle UX
Utiliser des formulations simples, pas des métriques techniques.

---

# 23. Fonctionnalité 15 — Demande de visite

## Définition
L’utilisateur peut envoyer une demande de visite depuis une fiche bien.

## Différence avec la messagerie
La demande de visite est une action structurée, liée à une intention claire.

## Données transmises automatiquement
- bien concerné
- titre ou identifiant du bien
- agence destinataire
- contexte de visite

## Données utilisateur
- nom
- téléphone
- email
- message optionnel

## Objectifs
- rendre le contact plus concret
- simplifier l’action
- faciliter le traitement côté agence

---

# 24. Fonctionnalité 16 — Partage facile

## Définition
Chaque bien doit pouvoir être partagé rapidement.

## Actions minimales
- partager via WhatsApp
- copier le lien
- envoyer à un proche

## Objectifs
- faciliter la décision à plusieurs
- augmenter la diffusion naturelle des annonces
- rendre les fiches plus utiles

---

# 25. Nouvelles routes Next.js

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
  favoris/
    page.tsx
  collections/
    page.tsx
  alertes/
    page.tsx
  recherches/
    page.tsx
  messages/
    page.tsx
    [conversationId]/page.tsx
  compte/
    page.tsx

Pages principales
	•	/recherche → moteur de recherche
	•	/bien/[id] → fiche bien
	•	/favoris → liste des favoris
	•	/collections → gestion des collections
	•	/alertes → gestion des alertes
	•	/recherches → historique et recherches sauvegardées
	•	/messages → liste des conversations
	•	/messages/[conversationId] → détail conversation
	•	/compte → espace personnel

⸻

26. Nouveaux modules backend

src/lib/
  search/
  alerts/
  messaging/
  actions/
  validators/
  queries/
  history/
  favorites/

Modules attendus

lib/search/
	•	search-properties.ts
	•	filters.ts
	•	ranking.ts
	•	normalize.ts

lib/alerts/
	•	create-alert.ts
	•	match-alerts.ts
	•	send-alerts.ts

lib/messaging/
	•	create-conversation.ts
	•	send-message.ts
	•	list-conversations.ts
	•	mark-as-read.ts

lib/history/
	•	track-viewed-property.ts
	•	track-search.ts

lib/favorites/
	•	collections.ts
	•	notes.ts

⸻

27. Nouvelles tables SQL

27.1 saved_searches

Recherches sauvegardées.

27.2 search_alerts

Alertes liées aux recherches.

27.3 search_history

Historique des recherches exécutées.

27.4 viewed_properties

Biens déjà vus.

Colonnes recommandées :
	•	id
	•	user_id
	•	property_id
	•	viewed_at
	•	last_viewed_at
	•	views_count

27.5 property_notes

Notes personnelles sur les biens.

Colonnes recommandées :
	•	id
	•	user_id
	•	property_id
	•	content
	•	created_at
	•	updated_at

27.6 favorite_collections

Collections de favoris.

Colonnes recommandées :
	•	id
	•	user_id
	•	name
	•	created_at
	•	updated_at

27.7 favorite_collection_items

Association entre favoris et collections.

Colonnes recommandées :
	•	id
	•	collection_id
	•	property_id
	•	created_at

27.8 conversations

Conversations entre particulier et agence.

Colonnes recommandées :
	•	id
	•	user_id
	•	agency_id
	•	property_id nullable
	•	last_message_at
	•	created_at

27.9 messages

Messages d’une conversation.

Colonnes recommandées :
	•	id
	•	conversation_id
	•	sender_type
	•	sender_user_id nullable
	•	sender_agency_member_id nullable
	•	content
	•	is_read
	•	created_at

27.10 visit_requests

Demandes de visite.

Colonnes recommandées :
	•	id
	•	user_id nullable
	•	agency_id
	•	property_id
	•	name
	•	phone
	•	email
	•	message
	•	status
	•	created_at

27.11 agency_responsiveness_stats

Indicateurs simples de réactivité agence.

Colonnes recommandées :
	•	agency_id
	•	response_label
	•	updated_at

⸻

28. Index de recherche

Objectif

Créer une couche dédiée à la recherche publique.

Recommandation

Créer une vue SQL ou table indexée :

search_properties_index

Colonnes minimales
	•	property_id
	•	agency_id
	•	agency_name
	•	agency_slug
	•	title
	•	description
	•	price
	•	currency
	•	transaction_type
	•	type
	•	surface
	•	rooms
	•	bathrooms
	•	country
	•	wilaya
	•	commune
	•	city
	•	images_count
	•	published_at
	•	updated_at
	•	search_text

⸻

29. Règles de visibilité des annonces

Une annonce ne doit être visible dans AqarSearch que si :
	•	le bien est actif
	•	l’agence est active
	•	le bien a un titre
	•	le bien a un prix
	•	le bien a une localisation exploitable
	•	le bien a au moins une image ou une description suffisante

⸻

30. Moteur de recherche

Entrées
	•	transaction
	•	pays
	•	wilaya
	•	commune
	•	ville
	•	type de bien
	•	budget
	•	surface
	•	pièces
	•	mots-clés
	•	tri

Sorties

Chaque résultat doit renvoyer :
	•	id du bien
	•	titre
	•	image principale
	•	prix
	•	localisation courte
	•	surface
	•	pièces
	•	type
	•	agence
	•	indicateur déjà vu si applicable
	•	indicateur favori si applicable

Interface recommandée

searchProperties(input: SearchInput): Promise<SearchResultPage>


⸻

31. Favoris et organisation personnelle

Favoris
	•	ajouter
	•	retirer
	•	lister

Notes
	•	créer
	•	modifier
	•	supprimer

Collections
	•	créer
	•	renommer
	•	supprimer
	•	associer un bien
	•	désassocier un bien

L’espace personnel doit permettre une vraie organisation, pas seulement une liste plate.

⸻

32. Messagerie et demandes de visite

Messagerie
	•	création de conversation
	•	envoi de message
	•	récupération historique
	•	lecture / non lu

Demande de visite
	•	création structurée
	•	lien automatique avec le bien
	•	remontée côté agence

⸻

33. Leads depuis AqarSearch

Toutes les interactions importantes doivent pouvoir enrichir AqarPro.

Sources possibles
	•	aqarsearch_detail
	•	aqarsearch_message
	•	aqarsearch_visit_request

Données à remonter
	•	agence
	•	bien
	•	utilisateur
	•	message ou intention
	•	contexte

⸻

34. Analytics et événements

Événements à tracer :
	•	search_executed
	•	property_viewed
	•	property_marked_viewed
	•	favorite_added
	•	favorite_removed
	•	collection_created
	•	collection_renamed
	•	note_added
	•	search_alert_created
	•	message_sent
	•	visit_requested
	•	property_shared

⸻

35. Validators Zod

Créer :
	•	search.ts
	•	alert.ts
	•	favorite.ts
	•	collection.ts
	•	note.ts
	•	message.ts
	•	visit-request.ts

⸻

36. Server Actions

Créer :

favorites.ts
	•	addFavorite(propertyId)
	•	removeFavorite(propertyId)

collections.ts
	•	createCollection(name)
	•	renameCollection(id, name)
	•	deleteCollection(id)
	•	addPropertyToCollection(collectionId, propertyId)
	•	removePropertyFromCollection(collectionId, propertyId)

notes.ts
	•	savePropertyNote(propertyId, content)
	•	deletePropertyNote(propertyId)

alerts.ts
	•	createSavedSearch(formData)
	•	updateSavedSearch(id, formData)
	•	deleteSavedSearch(id)
	•	createSearchAlert(savedSearchId, frequency, channel)
	•	toggleSearchAlert(id, isActive)

search-history.ts
	•	trackSearch(query, filters)
	•	clearSearchHistory()

viewed-properties.ts
	•	trackViewedProperty(propertyId)

messaging.ts
	•	createConversation(agencyId, propertyId?)
	•	sendMessage(conversationId, content)
	•	markConversationAsRead(conversationId)

visit-requests.ts
	•	createVisitRequest(formData)

Toutes les actions doivent retourner :

{
  success: boolean
  error?: string
}


⸻

37. Composants UI à créer

src/components/search/

Composants
	•	search-bar.tsx
	•	filter-panel.tsx
	•	result-card.tsx
	•	favorite-button.tsx
	•	viewed-badge.tsx
	•	note-editor.tsx
	•	collection-selector.tsx
	•	saved-search-card.tsx
	•	alert-button.tsx
	•	conversation-list.tsx
	•	message-thread.tsx
	•	visit-request-form.tsx
	•	share-actions.tsx
	•	result-empty-state.tsx

⸻

38. Pages à créer

/recherche/page.tsx
	•	lecture des query params
	•	validation des filtres
	•	affichage résultats
	•	pagination

/bien/[id]/page.tsx
	•	chargement d’un bien public
	•	affichage fiche complète
	•	tracking vue
	•	actions utilisateur

/favoris/page.tsx
	•	liste des favoris
	•	ajout/retrait
	•	lien vers collections

/collections/page.tsx
	•	affichage des collections
	•	création / renommage / suppression

/alertes/page.tsx
	•	liste des alertes
	•	activation / désactivation

/recherches/page.tsx
	•	historique de recherche
	•	recherches sauvegardées

/messages/page.tsx
	•	liste des conversations

/messages/[conversationId]/page.tsx
	•	détail d’une conversation

/compte/page.tsx
	•	résumé du compte particulier
	•	accès rapide aux sections de suivi

⸻

39. Sécurité et RLS

Règles minimales
	•	favoris : propriétaire uniquement
	•	notes : propriétaire uniquement
	•	collections : propriétaire uniquement
	•	search history : propriétaire uniquement
	•	alerts : propriétaire uniquement
	•	conversations : participants uniquement
	•	messages : participants uniquement
	•	visit requests : lecture côté agence concernée uniquement

Vérifications côté serveur

Même avec RLS :
	•	vérifier la session
	•	vérifier les IDs
	•	vérifier que le bien est visible
	•	vérifier que l’agence existe et est active

⸻

40. Performance et cache

Cache recommandé
	•	/recherche : dynamique avec cache court
	•	/bien/[id] : ISR ou revalidate court
	•	/favoris, /collections, /alertes, /messages, /recherches : privé, pas de cache public

Pagination

Préférer :
	•	pagination serveur simple
	•	limit / offset au départ

⸻

41. Tests à ajouter

Validators
	•	search.test.ts
	•	alert.test.ts
	•	collection.test.ts
	•	note.test.ts
	•	message.test.ts
	•	visit-request.test.ts

Actions
	•	actions-favorites.test.ts
	•	actions-collections.test.ts
	•	actions-notes.test.ts
	•	actions-alerts.test.ts
	•	actions-search-history.test.ts
	•	actions-messaging.test.ts
	•	actions-visit-requests.test.ts

Logique métier
	•	biens déjà vus
	•	reprise de recherche
	•	visibilité d’un bien
	•	création d’une conversation
	•	création d’une demande de visite

⸻

42. Arborescence recommandée

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
│   ├── favoris/
│   │   └── page.tsx
│   ├── collections/
│   │   └── page.tsx
│   ├── alertes/
│   │   └── page.tsx
│   ├── recherches/
│   │   └── page.tsx
│   ├── messages/
│   │   ├── page.tsx
│   │   └── [conversationId]/
│   │       └── page.tsx
│   └── compte/
│       └── page.tsx
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
│   ├── search/
│   │   ├── search-properties.ts
│   │   ├── filters.ts
│   │   ├── ranking.ts
│   │   └── normalize.ts
│   ├── alerts/
│   │   ├── create-alert.ts
│   │   ├── match-alerts.ts
│   │   └── send-alerts.ts
│   ├── messaging/
│   │   ├── create-conversation.ts
│   │   ├── send-message.ts
│   │   ├── list-conversations.ts
│   │   └── mark-as-read.ts
│   ├── actions/
│   │   ├── favorites.ts
│   │   ├── collections.ts
│   │   ├── notes.ts
│   │   ├── alerts.ts
│   │   ├── search-history.ts
│   │   ├── viewed-properties.ts
│   │   ├── messaging.ts
│   │   └── visit-requests.ts
│   ├── validators/
│   │   ├── search.ts
│   │   ├── alert.ts
│   │   ├── favorite.ts
│   │   ├── collection.ts
│   │   ├── note.ts
│   │   ├── message.ts
│   │   └── visit-request.ts
│   └── queries/
│       ├── search.ts
│       ├── property-public.ts
│       ├── favorites.ts
│       ├── collections.ts
│       ├── alerts.ts
│       ├── history.ts
│       └── messaging.ts


⸻

43. Plan d’implémentation par phases

Phase 1 — fondations
	•	saved_searches
	•	search_alerts
	•	search_history
	•	viewed_properties
	•	property_notes
	•	favorite_collections
	•	favorite_collection_items
	•	conversations
	•	messages
	•	visit_requests
	•	search_properties_index

Phase 2 — UI publique
	•	/recherche
	•	/bien/[id]
	•	cartes résultats
	•	partage
	•	tracking biens vus

Phase 3 — espace utilisateur
	•	favoris
	•	collections
	•	notes
	•	historique
	•	recherche reprise

Phase 4 — suivi et interaction
	•	alertes
	•	messagerie
	•	historique des messages
	•	demande de visite

Phase 5 — enrichissements
	•	statut de réactivité agence
	•	alertes enrichies
	•	améliorations de continuité

⸻

44. Prompt maître pour Claude Code

Construis AqarSearch comme la branche particulier de AqarVision.

Objectif :
Créer une expérience de recherche immobilière moderne, inspirée d’Airbnb pour l’UX et de Jinka pour la logique de suivi de recherche, connectée directement aux biens publiés par les agences dans AqarPro.

Principes clés :
- la recherche doit être possible sans compte
- le compte sert à débloquer les fonctions avancées de suivi
- AqarSearch n’est pas un agrégateur global externe
- AqarVision reste la source de vérité pour les agences, les biens et les leads
- AqarSearch gère la recherche, l’organisation personnelle, les alertes et l’interaction côté particulier

À implémenter :

1. recherche libre :
- /recherche
- /bien/[id]

2. compte particulier :
- favoris
- collections de favoris
- notes personnelles
- biens déjà vus
- historique de recherche
- recherche reprise
- alertes
- messagerie sécurisée
- historique des messages
- demande de visite

3. nouvelles tables :
- saved_searches
- search_alerts
- search_history
- viewed_properties
- property_notes
- favorite_collections
- favorite_collection_items
- conversations
- messages
- visit_requests

4. composants UI :
- search-bar
- filter-panel
- result-card
- favorite-button
- viewed-badge
- note-editor
- collection-selector
- saved-search-card
- alert-button
- conversation-list
- message-thread
- visit-request-form
- share-actions

5. intégration avec AqarPro :
- consommer les annonces publiées
- générer des leads et demandes de visite côté agences
- centraliser les messages dans le bon contexte agence / bien