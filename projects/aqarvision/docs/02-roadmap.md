# AqarVision — Roadmap Globale Produit

> Roadmap consolidee de l'ecosysteme AqarVision
> Organiser le developpement de AqarVision, AqarPro et AqarSearch par etapes claires, realistes et dependantes les unes des autres

**Version** : 1.0

Pour la vision produit, les arbitrages strategiques et le positionnement, voir [01-vision-globale.md](./01-vision-globale.md).

---

# 1. Logique de progression

La roadmap suit une logique simple :

1. Construire ce qui rend le produit **utile** (MVP)
2. Construire ce qui le rend **coherent** (V1)
3. Construire ce qui le rend **premium et differenciant** (V2)

---

# 2. MVP — Fondations commercialisables

> Est-ce qu'une agence immobiliere accepte de payer pour publier ses biens, disposer d'une mini-vitrine professionnelle et recevoir des leads dans un outil centralise ?

## 2.1 MVP — AqarPro

### Identite agence
- creation compte agence
- onboarding simple
- creation profil agence
- branding de base (logo, couverture, coordonnees)

### Annonces
- CRUD annonces
- publication / depublication
- statut brouillon / actif / archive
- champs essentiels d'un bien
- upload image simple
- image principale + galerie de base

### Mini-vitrine
- mini-site public agence
- 2 themes minimum pour Starter
- pages essentielles : accueil, biens, fiche bien, a propos, contact

### Leads
- formulaire de contact
- reception des leads
- liste des leads
- statut simple lead
- contexte du bien concerne

### Dashboard
- tableau de bord simple
- statistiques principales : nombre de biens, nombre de leads, plan actuel, completude de base

### IA
- generation de titre
- generation de description d'annonce
- reformulation simple

## 2.2 MVP — AqarSearch

### Public non connecte
- recherche libre
- filtres de base
- consultation des resultats
- consultation des fiches biens

### Compte particulier
- inscription / connexion
- redirection retour contexte

### Suivi utilisateur
- favoris
- collections de favoris
- historique de recherche
- biens deja vus

### Contact
- message a agence depuis fiche bien ou fiche agence
- demande de visite simple preremplie
- remontee vers AqarPro

### Alertes
- creation de recherche sauvegardee
- alerte simple sur nouvelle annonce correspondante

## 2.3 MVP — Technique minimale necessaire

- permissions propres agence / particulier
- separation claire des routes
- RLS correctes
- index de recherche
- tracking minimal analytics
- suppression des incoherences les plus dangereuses du legacy

---

# 3. V1 — Produit structure et coherent

## 3.1 V1 — AqarPro

### Mini-vitrines
- 5 themes pour Pro
- themes reellement differencies
- meilleure preview vitrine
- contenus plus riches
- pages editoriales supplementaires

### Dashboard
- dashboard personnalisable
- widgets reorganisables
- actions rapides personnalisables
- apercu de vitrine
- annonces a ameliorer

### Medias
- gestion media plus propre
- reorganisation galerie
- videos
- collections media agence

### Leads et messages
- pipeline leads plus riche
- notes internes
- meilleure lecture du contexte de contact
- historique de messages plus clair
- meilleure gestion des demandes de visite

### IA
- description agence
- slogan
- amelioration de texte
- aide redactionnelle sur plusieurs ecrans
- suggestions de completude

### Equipe
- roles propres
- invitation / suppression membre
- permissions plus respectees

### Analytics
- biens les plus consultes
- leads par source
- performance des annonces et de la vitrine
- bloc d'aide a la decision

## 3.2 V1 — AqarSearch

### Recherche
- experience plus propre
- meilleure qualite des cartes resultats
- meilleure continuite d'usage mobile

### Suivi personnel
- notes personnelles sur les biens
- reprise de recherche plus intelligente
- meilleure gestion des biens deja vus
- collections plus abouties

### Alertes
- gestion complete des alertes
- activation / desactivation
- historisation des alertes declenchees

### Messagerie
- historique complet
- conversations mieux classees
- lecture / non lu
- meilleur contexte agence / bien

### Reactivite agence
- premiers badges simples

### Partage
- partage plus soigne
- meilleure experience multi-supports

## 3.3 V1 — Produit global

- coherence marque AqarVision
- coherence design AqarPro / AqarSearch
- meilleure stabilite et qualite de donnees
- reduction du legacy

---

# 4. V2 — Montee en gamme et differenciation

## 4.1 V2 — AqarPro

### Themes et vitrines
- catalogue complet de themes
- personnalisation avancee Enterprise
- sections plus riches
- pages supplementaires : equipe, services, zones couvertes, temoignages

### IA transverse
- assistance sur plus d'ecrans
- messages commerciaux, contenus sociaux, emails
- optimisation des annonces
- suggestions editoriales contextuelles

### Medias premium
- meilleure gestion video
- pipeline media plus riche
- rendu plus haut de gamme

### Pilotage avance
- analytics plus pousses
- qualite d'annonce
- suivi de performance par theme
- vue plus business

## 4.2 V2 — AqarSearch

### Alertes enrichies
- baisse de prix
- biens similaires
- detection plus intelligente de proximite avec les recherches sauvegardees

### Suivi personnel plus fort
- espace utilisateur plus riche
- meilleure orchestration entre historique, favoris, alertes et messages

### Reactivite agence
- systeme d'evaluation comportementale plus robuste
- labels plus fiables

### Qualite de recherche
- resultats mieux hierarchises
- ranking ameliore
- enrichissement des signaux de qualite

## 4.3 V2 — Produit global

- experience plus premium
- meilleure retention particulier
- meilleure valeur percue cote agence
- meilleur levier de conversion commerciale

---

# 5. Dependances entre modules

## 5.1 Dependances coeur AqarPro
- branding depend du profil agence
- mini-vitrine depend du branding + themes + annonces publiees
- dashboard depend des annonces + leads + messages + preferences
- leads dependent des formulaires / messages / demandes de visite
- IA depend du contexte de contenu

## 5.2 Dependances coeur AqarSearch
- recherche depend de l'index des biens publies
- favoris dependent du compte utilisateur
- collections dependent des favoris
- biens deja vus dependent de la consultation
- recherche reprise depend de l'historique + biens vus
- alertes dependent des recherches sauvegardees
- messagerie depend d'un contexte agence ou bien
- demande de visite depend du bien + agence

## 5.3 Dependances transverses
- AqarSearch depend de la qualite de publication cote AqarPro
- la qualite de lead depend de la qualite de la fiche bien
- la valeur d'un theme depend de la qualite du branding et des contenus
- la valeur de l'IA depend de la qualite des champs de saisie et des workflows

---

# 6. Roadmaps detaillees par domaine

## 6.1 Roadmap IA

| Phase | Fonctionnalites |
|-------|----------------|
| MVP | Titre annonce, description annonce, reformulation simple |
| V1 | Description agence, slogan, amelioration textes, assistance redactionnelle multi-ecrans |
| V2 | Assistance partout (discrete), messages commerciaux, emails, contenus sociaux, suggestions qualite |

## 6.2 Roadmap design et experience

| Phase | Fonctionnalites |
|-------|----------------|
| MVP | Interface propre, coherence minimale, recherche lisible, mini-vitrine credible |
| V1 | Coherence forte AqarVision/AqarPro/AqarSearch, meilleures cartes, dashboard plus premium |
| V2 | Experience haut de gamme, themes plus puissants, qualite visuelle superieure |

## 6.3 Roadmap technique et architecture

| Phase | Fonctionnalites |
|-------|----------------|
| MVP | Routes propres, base permissions, RLS, index de recherche, nettoyage doublons |
| V1 | Unification modules, reduction legacy, meilleure separation domaines, meilleures queries/actions/validators |
| V2 | Optimisation performance, raffinement architecture, observabilite |

---

# 7. Indicateurs de succes par phase

| Phase | Indicateurs |
|-------|------------|
| MVP | Agences onboardees, biens publies, premieres vitrines actives, premiers leads generes |
| V1 | Usage recurrent agences, usage reel AqarSearch avec compte, taux activation favoris/alertes/messages, retention |
| V2 | Montee en gamme des plans, valeur percue plus forte, plus de leads qualifies, meilleure differenciation marche |

---

# 8. Points de vigilance

1. **Risque de dispersion** — trop de modules en parallele peut affaiblir la qualite des blocs coeur
2. **Risque de produit trop large** — AqarPro et AqarSearch ensemble representent beaucoup, il faut sequencer
3. **Risque de dette technique** — le legacy et les doublons doivent etre traites progressivement
4. **Risque de design incoherent** — themes, dashboards et espaces particuliers doivent rester dans la meme famille de marque
5. **Risque de sur-IA** — l'IA doit rester utile et discrete, pas devenir une surcouche confuse

---

# 9. Resume strategique

**D'abord** — MVP commercialisable : agences, annonces, mini-vitrines, leads, recherche, compte particulier, suivi simple

**Ensuite** — V1 coherente : themes enrichis, dashboard personnalisable, medias plus forts, messagerie plus claire, IA plus presente, suivi particulier plus solide

**Enfin** — V2 premium : montee en gamme visuelle, IA transverse, analytics puissants, alertes enrichies, meilleure retention, meilleure valeur percue

Le produit doit sequencer clairement ce qui : cree la valeur, cree la coherence, cree la differenciation.
