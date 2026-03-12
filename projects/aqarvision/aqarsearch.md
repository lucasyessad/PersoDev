# AqarSearch — Product Specification Complète

> Spécification détaillée de la branche particulier de AqarVision  
> Objectif : donner à Claude Code une base claire, structurée et exploitable pour implémenter AqarSearch

**Version** : 1.0  
**Statut** : Product Spec  
**Produit parent** : AqarVision  
**Branche concernée** : AqarSearch  
**Public cible** : particuliers à la recherche d’un bien immobilier

---

# Table des matières

1. [Définition du produit](#1-définition-du-produit)
2. [Objectifs de AqarSearch](#2-objectifs-de-aqarsearch)
3. [Positionnement produit](#3-positionnement-produit)
4. [Relation avec AqarPro](#4-relation-avec-aqarpro)
5. [Principes UX fondamentaux](#5-principes-ux-fondamentaux)
6. [Recherche libre sans compte](#6-recherche-libre-sans-compte)
7. [Création de compte particulier](#7-création-de-compte-particulier)
8. [Fonctionnalité 1 — Recherche immobilière](#8-fonctionnalité-1--recherche-immobilière)
9. [Fonctionnalité 2 — Exploration des résultats](#9-fonctionnalité-2--exploration-des-résultats)
10. [Fonctionnalité 3 — Fiche détaillée du bien](#10-fonctionnalité-3--fiche-détaillée-du-bien)
11. [Fonctionnalité 4 — Biens déjà vus](#11-fonctionnalité-4--biens-déjà-vus)
12. [Fonctionnalité 5 — Notes personnelles](#12-fonctionnalité-5--notes-personnelles)
13. [Fonctionnalité 6 — Favoris](#13-fonctionnalité-6--favoris)
14. [Fonctionnalité 7 — Collections de favoris](#14-fonctionnalité-7--collections-de-favoris)
15. [Fonctionnalité 8 — Historique de recherche](#15-fonctionnalité-8--historique-de-recherche)
16. [Fonctionnalité 9 — Recherche reprise](#16-fonctionnalité-9--recherche-reprise)
17. [Fonctionnalité 10 — Alertes de recherche](#17-fonctionnalité-10--alertes-de-recherche)
18. [Fonctionnalité 11 — Alertes enrichies](#18-fonctionnalité-11--alertes-enrichies)
19. [Fonctionnalité 12 — Messagerie sécurisée](#19-fonctionnalité-12--messagerie-sécurisée)
20. [Fonctionnalité 13 — Historique des messages](#20-fonctionnalité-13--historique-des-messages)
21. [Fonctionnalité 14 — Statut de réactivité agence](#21-fonctionnalité-14--statut-de-réactivité-agence)
22. [Fonctionnalité 15 — Demande de visite](#22-fonctionnalité-15--demande-de-visite)
23. [Fonctionnalité 16 — Partage facile](#23-fonctionnalité-16--partage-facile)
24. [Pages à créer](#24-pages-à-créer)
25. [États utilisateur](#25-états-utilisateur)
26. [Règles de permission](#26-règles-de-permission)
27. [Modèle de données recommandé](#27-modèle-de-données-recommandé)
28. [Événements analytics à suivre](#28-événements-analytics-à-suivre)
29. [Règles de contenu et microcopy](#29-règles-de-contenu-et-microcopy)
30. [Règles de design pour Claude Code](#30-règles-de-design-pour-claude-code)
31. [Résumé d’implémentation pour Claude Code](#31-résumé-dimplémentation-pour-claude-code)

---

# 1. Définition du produit

AqarSearch est la branche **particulier** de l’écosystème AqarVision.

Son rôle est de permettre aux utilisateurs finaux de :

- rechercher des biens immobiliers publiés par les agences présentes sur AqarPro
- consulter les annonces librement sans créer de compte
- créer un compte pour suivre leur recherche dans le temps
- enregistrer des favoris
- organiser leurs favoris dans des collections
- reprendre leurs recherches passées
- créer des alertes personnalisées
- échanger avec les agences via une messagerie sécurisée
- demander une visite
- suivre les biens déjà consultés

AqarSearch n’est pas conçu, dans sa première vision, comme un agrégateur externe de tout le marché.
Il est conçu comme **l’espace particulier intelligent et moderne de la plateforme AqarVision**.

---

# 2. Objectifs de AqarSearch

Les objectifs principaux sont :

- rendre la recherche immobilière simple et agréable
- éviter de forcer la création de compte trop tôt
- augmenter la valeur perçue du compte utilisateur
- aider l’utilisateur à organiser sa recherche
- fluidifier la mise en relation avec les professionnels
- créer une expérience de suivi immobilier moderne

Le produit doit répondre à cette logique :

- **sans compte** : découvrir facilement
- **avec compte** : suivre intelligemment sa recherche

---

# 3. Positionnement produit

AqarSearch doit se situer entre :

- **Airbnb** pour la qualité de l’expérience de recherche
- **Jinka** pour la logique de suivi, d’alertes et d’organisation de recherche

Le produit doit être :

- simple
- fluide
- premium
- rassurant
- mobile-first
- très clair
- centré sur l’utilisateur final

AqarSearch ne doit pas ressembler à un portail d’annonces surchargé.

---

# 4. Relation avec AqarPro

AqarSearch est directement alimenté par les annonces publiées dans AqarPro.

Flux fonctionnel :

1. une agence publie un bien sur AqarPro
2. le bien devient visible sur AqarSearch
3. un particulier consulte le bien
4. il peut :
   - l’enregistrer
   - le partager
   - créer une alerte similaire
   - demander une visite
   - écrire à l’agence
5. les interactions utiles remontent côté AqarPro

AqarPro produit l’offre.
AqarSearch organise la découverte, le suivi et l’interaction.

---

# 5. Principes UX fondamentaux

## 5.1 Recherche d’abord
L’utilisateur doit pouvoir commencer à chercher immédiatement.

## 5.2 Pas de friction inutile
La création de compte ne doit jamais bloquer la première découverte.

## 5.3 Compte = valeur
Le compte doit apporter une vraie utilité :
- favoris
- historique
- alertes
- messagerie
- suivi

## 5.4 Continuité de recherche
L’utilisateur doit pouvoir reprendre sa recherche à tout moment sans repartir de zéro.

## 5.5 Clarté
Le produit doit toujours répondre clairement à :
- où j’en suis
- qu’ai-je déjà vu
- qu’ai-je enregistré
- quelles alertes sont actives
- avec qui ai-je échangé

---

# 6. Recherche libre sans compte

## Définition
Un visiteur non connecté peut librement utiliser AqarSearch pour :
- faire une recherche
- filtrer les résultats
- consulter les fiches biens
- voir les agences
- partager une annonce

## Objectif
Permettre une entrée immédiate dans le produit.

## Contraintes
Sans compte, l’utilisateur ne peut pas :
- sauvegarder durablement des favoris
- créer des alertes persistantes
- utiliser la messagerie sécurisée
- conserver un historique synchronisé
- gérer des collections

## UX recommandée
Lorsqu’un visiteur tente d’utiliser une fonction nécessitant un compte :
- ne pas bloquer brutalement
- afficher une incitation claire
- expliquer la valeur du compte

Exemple de message :
> Créez un compte pour enregistrer ce bien et retrouver votre recherche plus tard.

---

# 7. Création de compte particulier

## Objectif
Permettre au particulier de transformer une simple consultation en suivi structuré de sa recherche.

## Fonctions débloquées par le compte
- favoris
- collections de favoris
- notes personnelles
- historique de recherche
- biens déjà vus synchronisés
- alertes
- messagerie sécurisée
- historique des messages
- demandes de visite suivies

## Données minimales du compte
- prénom / nom ou nom affiché
- email
- mot de passe
- téléphone optionnel au départ
- préférences de recherche futures

## Flux recommandé
- inscription simple
- connexion simple
- retour vers l’annonce ou la recherche en cours après connexion

---

# 8. Fonctionnalité 1 — Recherche immobilière

## Définition
Le moteur de recherche permet à l’utilisateur de trouver des biens selon des critères structurés.

## Champs de recherche principaux
- transaction : vente / location
- localisation : wilaya, commune, ville, quartier si disponible
- budget min / max
- surface min / max
- nombre de pièces
- type de bien
- mots-clés

## Comportement attendu
- recherche rapide
- résultats lisibles
- filtres simples
- capacité à modifier facilement les critères
- conservation des filtres dans l’URL

## UX
Desktop :
- search bar visible
- panel de filtres clair
- résultats en grille ou liste

Mobile :
- search bar sticky
- filtres dans un drawer
- résultats lisibles verticalement

## Résultat attendu
Le moteur doit donner immédiatement le sentiment que la recherche est :
- compréhensible
- rapide
- utile

---

# 9. Fonctionnalité 2 — Exploration des résultats

## Définition
Les résultats de recherche doivent être présentés sous forme de cartes claires et premium.

## Contenu minimum d’une carte
- image principale
- prix
- type de bien
- localisation courte
- surface
- pièces
- badge si nécessaire
- état déjà vu si applicable
- bouton favori si connecté
- agence source

## Objectifs UX
- permettre un scan rapide
- permettre de distinguer facilement les biens
- éviter la surcharge d’informations

## Éléments visuels possibles
- badge “Nouveau”
- badge “Déjà vu”
- badge “Agence réactive”
- badge “Prix modifié” plus tard

---

# 10. Fonctionnalité 3 — Fiche détaillée du bien

## Définition
La fiche bien est la page de référence d’une annonce.

## Sections minimales
- galerie photos
- titre
- prix
- localisation
- caractéristiques
- description
- agence source
- actions principales
- biens similaires plus tard si besoin

## Actions disponibles
- partager
- enregistrer en favori
- demander une visite
- écrire à l’agence
- appeler / WhatsApp si disponible

## Objectif UX
Aider l’utilisateur à :
- comprendre rapidement le bien
- mémoriser ses points forts
- agir facilement

---

# 11. Fonctionnalité 4 — Biens déjà vus

## Définition
Le système doit mémoriser les annonces déjà consultées par l’utilisateur.

## Cas sans compte
- stockage local possible
- durée limitée
- dépend du navigateur

## Cas avec compte
- synchronisation dans le profil
- historique plus durable
- affichage multi-appareils possible plus tard

## Utilité
- éviter les reconsultations inutiles
- aider à reprendre la recherche
- ajouter un marqueur “déjà vu” dans les résultats

## Affichages attendus
- badge “déjà vu”
- page ou bloc “récemment consultés”
- proposition de reprise de recherche

---

# 12. Fonctionnalité 5 — Notes personnelles

## Définition
Chaque utilisateur connecté peut ajouter une note privée sur un bien.

## Exemples de notes
- trop cher
- quartier intéressant
- appeler demain
- à montrer à ma famille
- possible investissement

## Règles
- note visible uniquement par l’utilisateur
- une note par bien minimum
- modifiable à tout moment
- supprimable à tout moment

## Objectifs
- aider à la comparaison
- créer un vrai outil de suivi
- éviter de perdre le contexte de réflexion

## Interfaces
- bouton “Ajouter une note”
- champ texte dans la fiche bien
- prévisualisation de la note dans les favoris

---

# 13. Fonctionnalité 6 — Favoris

## Définition
Un utilisateur connecté peut enregistrer des biens en favoris.

## Actions disponibles
- ajouter en favori
- retirer des favoris
- voir la liste des favoris

## Comportement attendu
- action rapide
- feedback visuel immédiat
- synchronisation par compte

## Objectifs
- retrouver facilement les biens intéressants
- créer un début d’organisation personnelle

---

# 14. Fonctionnalité 7 — Collections de favoris

## Définition
Les favoris ne doivent pas être une simple liste plate.

Chaque utilisateur peut organiser ses favoris en collections personnalisées.

## Actions disponibles
- créer une collection
- nommer une collection
- renommer une collection
- supprimer une collection
- ajouter un favori à une ou plusieurs collections
- déplacer un bien d’une collection à une autre si besoin
- voir tous les biens d’une collection

## Exemples de collections
- Achat
- Location
- À visiter
- Investissement
- À comparer
- Famille
- Court terme

## Objectifs
- transformer les favoris en outil d’organisation
- améliorer la valeur du compte
- aider à segmenter une recherche complexe

## UX recommandée
Au moment de l’ajout en favori :
- permettre d’enregistrer directement dans une collection existante
- ou proposer de créer une collection

---

# 15. Fonctionnalité 8 — Historique de recherche

## Définition
Le système doit mémoriser les recherches effectuées par l’utilisateur connecté.

## Données à conserver
- texte de recherche éventuel
- filtres utilisés
- localisation
- budget
- date / heure
- dernière utilisation

## Objectif
Permettre à l’utilisateur de retrouver rapidement une recherche passée.

## Actions disponibles
- revoir une recherche passée
- relancer une recherche
- supprimer un élément de l’historique
- tout effacer

## Différence avec les alertes
L’historique enregistre ce qui a été cherché.
L’alerte enregistre ce qui doit être surveillé.

---

# 16. Fonctionnalité 9 — Recherche reprise

## Définition
Quand l’utilisateur revient, le produit doit lui proposer de reprendre sa recherche.

## Données utiles
- dernière recherche effectuée
- derniers biens consultés
- dernières collections ouvertes
- dernières alertes actives

## Affichages possibles
- “Reprendre votre dernière recherche”
- “Continuer là où vous vous êtes arrêté”
- “Derniers biens consultés”

## Objectifs
- réduire la friction
- améliorer la continuité
- rendre AqarSearch plus intelligent

---

# 17. Fonctionnalité 10 — Alertes de recherche

## Définition
Un utilisateur connecté peut sauvegarder une recherche et demander à être alerté lorsqu’un bien correspondant apparaît.

## Paramètres d’une alerte
- nom libre
- critères de recherche
- fréquence d’alerte
- canal de notification

## Canaux possibles
- notification interne
- email
- push plus tard

## Actions
- créer une alerte
- activer / désactiver
- renommer
- supprimer
- voir les critères associés

## Objectif
Ne pas obliger l’utilisateur à vérifier la plateforme manuellement.

---

# 18. Fonctionnalité 11 — Alertes enrichies

## Définition
Les alertes ne doivent pas se limiter à “nouveau bien correspondant”.

## Types d’alertes enrichies retenues
- nouveau bien correspondant aux critères
- baisse de prix sur un bien suivi
- bien similaire à un favori
- bien similaire à une recherche enregistrée

## Objectifs
- rendre le produit proactif
- augmenter la valeur du compte
- donner une vraie raison de revenir

## Règle UX
L’utilisateur doit comprendre clairement :
- pourquoi il reçoit l’alerte
- à quel bien ou à quelle recherche elle se rapporte

---

# 19. Fonctionnalité 12 — Messagerie sécurisée

## Définition
Les utilisateurs connectés peuvent communiquer avec les agences via une messagerie interne.

## Objectifs
- éviter la dispersion des échanges
- garder une trace claire des discussions
- centraliser la relation particulier / agence

## Règles
- la messagerie nécessite un compte
- chaque conversation doit être reliée à :
  - une agence
  - éventuellement un bien
- les messages doivent être horodatés
- les messages doivent être historisés

## Actions possibles
- démarrer une conversation depuis une fiche bien
- répondre à une conversation existante
- voir les messages non lus
- archiver plus tard si nécessaire

## Minimum UX
- liste des conversations
- vue détaillée conversation
- rappel du bien concerné
- état lu / non lu

---

# 20. Fonctionnalité 13 — Historique des messages

## Définition
Le compte particulier doit conserver l’historique des échanges avec les agences.

## Contenu de l’historique
- agence contactée
- bien concerné
- messages envoyés
- messages reçus
- date du dernier échange
- statut de lecture

## Objectifs
- ne pas perdre le fil des échanges
- aider à retrouver un contact
- éviter les doublons de demandes

## Affichages utiles
- conversations récentes
- par agence
- par bien
- dernier message visible dans la liste

---

# 21. Fonctionnalité 14 — Statut de réactivité agence

## Définition
AqarSearch peut afficher des informations simples sur la réactivité de l’agence.

## Exemples d’affichage
- répond généralement rapidement
- agence active récemment
- réponse habituelle rapide

## Objectif
Rassurer les utilisateurs finaux et valoriser les agences sérieuses.

## Règle
Ne pas afficher des métriques trop complexes.
Privilégier des formulations simples et lisibles.

---

# 22. Fonctionnalité 15 — Demande de visite

## Définition
L’utilisateur peut envoyer une demande de visite depuis une fiche bien.

## Différence avec la messagerie
La demande de visite est une action structurée, plus concrète qu’un simple message libre.

## Données automatiquement associées
- bien concerné
- titre du bien
- identifiant du bien
- agence concernée
- contexte “demande de visite”

## Données utilisateur possibles
- nom
- téléphone
- email
- message optionnel

## Objectifs
- rendre le contact plus actionnable
- faciliter le traitement côté agence
- donner une intention claire

---

# 23. Fonctionnalité 16 — Partage facile

## Définition
Chaque bien doit pouvoir être partagé facilement.

## Actions minimales
- partager via WhatsApp
- copier le lien
- partager à un proche

## Objectifs
- faciliter la prise de décision collective
- augmenter la diffusion naturelle des annonces
- rendre les fiches utiles au-delà de la simple consultation

## Règle UX
Le partage doit être visible mais discret.

---

# 24. Pages à créer

## Pages publiques
- page d’accueil AqarSearch
- page de résultats de recherche
- page détail bien
- page agence publique éventuelle si nécessaire

## Pages compte utilisateur
- connexion
- inscription
- espace personnel
- favoris
- collections
- historique de recherche
- alertes
- messagerie
- biens déjà vus

---

# 25. États utilisateur

## Visiteur non connecté
Peut :
- rechercher
- consulter
- partager

Ne peut pas :
- sauvegarder durablement
- créer des alertes persistantes
- envoyer des messages via messagerie
- organiser ses suivis

## Utilisateur connecté
Peut :
- tout rechercher
- enregistrer
- noter
- organiser
- créer des alertes
- envoyer des messages
- suivre ses échanges et ses biens

---

# 26. Règles de permission

## Sans compte
- recherche autorisée
- lecture autorisée
- partage autorisé

## Avec compte
- favoris
- notes
- collections
- alertes
- historique complet
- messagerie
- demandes de visite suivies

---

# 27. Modèle de données recommandé

Tables ou entités à prévoir :

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

Les noms exacts peuvent évoluer, mais le produit doit couvrir ces concepts.

---

# 28. Événements analytics à suivre

Événements utiles :

- recherche lancée
- filtre modifié
- bien consulté
- bien marqué comme déjà vu
- favori ajouté
- favori retiré
- collection créée
- collection renommée
- note ajoutée
- alerte créée
- alerte déclenchée
- message envoyé
- demande de visite envoyée
- partage effectué

---

# 29. Règles de contenu et microcopy

Le ton de AqarSearch doit être :

- simple
- rassurant
- moderne
- humain
- clair

Éviter :
- jargon trop technique
- formulations lourdes
- messages trop froids

Exemples :
- Enregistrer ce bien
- Ajouter une note
- Reprendre ma recherche
- Créer une alerte
- Demander une visite
- Continuer la conversation

---

# 30. Règles de design pour Claude Code

AqarSearch doit être conçu comme :

- un produit particulier premium
- inspiré d’Airbnb pour l’expérience
- inspiré de Jinka pour le suivi de recherche
- fluide sur mobile
- très lisible
- très propre visuellement

Le design doit mettre l’accent sur :

- la recherche
- les cartes biens
- les favoris
- l’espace personnel
- la clarté des actions

---

# 31. Résumé d’implémentation pour Claude Code

Claude Code doit construire AqarSearch comme un produit qui permet :

1. de rechercher librement des biens sans créer de compte
2. de créer un compte pour suivre sa recherche dans le temps
3. d’enregistrer et organiser ses favoris
4. d’ajouter des notes sur les biens
5. de revoir les biens déjà consultés
6. de retrouver son historique de recherche
7. de reprendre sa recherche facilement
8. de créer des alertes intelligentes
9. d’échanger avec les agences via une messagerie sécurisée
10. de demander une visite avec le contexte du bien
11. de partager un bien facilement

Le produit ne doit pas être pensé comme un simple catalogue d’annonces.

Il doit devenir un **espace personnel de recherche immobilière**, utile, fluide et moderne.