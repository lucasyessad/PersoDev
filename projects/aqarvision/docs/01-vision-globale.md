# AqarVision — Vision Produit Globale

> Vision consolidee de la plateforme AqarVision, de ses deux branches AqarPro et AqarSearch, et des arbitrages strategiques valides

**Version** : 1.1
**Statut** : Vision produit consolidee

---

# 1. Presentation generale

**AqarVision** est une plateforme immobiliere moderne concue pour connecter efficacement :

- les **professionnels de l'immobilier**
- les **particuliers a la recherche d'un bien**

La plateforme repose sur deux branches complementaires :

- **AqarPro** — la branche professionnelle dediee aux agences immobilieres
- **AqarSearch** — la branche particulier dediee aux utilisateurs finaux

Ces deux branches fonctionnent ensemble dans un meme ecosysteme :

- **AqarPro produit et structure l'offre**
- **AqarSearch organise la decouverte, le suivi et l'interaction**
- **AqarVision relie les deux**

---

# 2. Architecture produit

```text
AqarVision
|
+-- AqarPro
|   Plateforme professionnelle pour les agences
|
+-- AqarSearch
    Plateforme de recherche immobiliere pour les particuliers
```

AqarSearch n'est pas une marque independante. Il s'agit de la branche particulier de AqarVision.

---

# 3. Positionnement

AqarVision a vocation a devenir une plateforme immobiliere nouvelle generation, plus moderne, plus premium et plus coherente que les portails immobiliers classiques.

Inspirations principales :

- **Airbnb** pour l'experience de recherche, la fluidite et la simplicite d'usage
- **Jinka** pour la logique de suivi de recherche, d'alertes et de favoris
- **Sotheby's** pour l'esthetique immobiliere haut de gamme
- **Stripe / Linear** pour la qualite du dashboard SaaS

Le produit doit combiner :

- la qualite d'image des grandes agences
- l'efficacite d'un vrai outil pro
- la simplicite d'un produit grand public bien pense

---

# 4. Vision de AqarPro

AqarPro permet aux agences immobilieres de :

- publier et gerer leurs annonces
- valoriser leur image et leur branding
- disposer d'une mini-vitrine professionnelle (vrai site, pas une page catalogue)
- centraliser leads, messages et demandes de visite
- piloter leur presence digitale
- gagner du temps grace a l'IA

L'ambition produit :

> Transformer une agence immobiliere en marque digitale structuree

### Les 5 piliers

1. **Publier** — creer, enrichir, publier et gerer les annonces
2. **Valoriser** — mettre en scene l'agence via des mini-vitrines premium
3. **Convertir** — recevoir et traiter leads, messages et demandes de visite
4. **Piloter** — suivre performances, completude, activite et signaux utiles
5. **Gagner du temps** — utiliser l'IA pour reduire les taches repetitives

---

# 5. Vision de AqarSearch

AqarSearch permet aux utilisateurs finaux de :

- rechercher des biens simplement
- consulter librement les annonces sans compte
- organiser leur recherche dans le temps (avec compte)
- suivre les biens qui les interessent
- recevoir des alertes
- echanger avec les professionnels
- demander une visite

AqarSearch ne doit pas etre un simple catalogue d'annonces. Il doit devenir un **espace personnel de recherche immobiliere**.

---

# 6. Regle d'acces AqarSearch

## Utilisateur public non connecte

Peut uniquement :
- rechercher des biens
- filtrer les resultats
- consulter les fiches annonces
- decouvrir les agences presentes

## Utilisateur connecte

Peut en plus :
- enregistrer des favoris
- creer et renommer des collections de favoris
- ajouter des notes personnelles sur les biens
- retrouver les biens deja vus
- consulter son historique de recherche
- reprendre sa recherche
- creer et gerer des alertes
- recevoir des notifications
- utiliser la messagerie securisee
- consulter l'historique de ses echanges
- envoyer une demande de visite suivie

## Regle UX obligatoire

Toute action reservee a un utilisateur connecte doit declencher :
- une redirection vers la creation de compte ou la connexion
- puis un retour automatique vers le contexte initial apres authentification

---

# 7. Arbitrages strategiques valides

## Systeme de themes des mini-vitrines

Les themes ne sont pas de simples variations de couleurs. Chaque theme correspond a une **vraie structure de site** avec hierarchie, composition et ambiance differentes.

Familles de themes : minimaliste, moderne, premium, institutionnel, luxe, promoteur, urbain editorial.

### Repartition par plan

| Plan | Themes | Personnalisation |
|------|--------|-----------------|
| Starter | 2 themes | Base |
| Pro | 5 themes | Standard |
| Enterprise | Tous les themes | Avancee |

## IA integree

L'IA doit etre presente presque partout dans AqarPro, mais de maniere **discrete** — actions contextuelles simples (generer, reformuler, ameliorer, enrichir, proposer).

Cas d'usage :
- **Annonces** : titre, description, reformulation, amelioration
- **Agence** : description, slogan, textes de presentation
- **Communication** : emails, messages commerciaux, contenus sociaux
- **Qualite** : suggestions de completude, detection d'annonces faibles

## Messagerie

La messagerie doit etre accessible uniquement depuis un **contexte precis** :
- fiche bien
- fiche agence
- action contextualisee dans la recherche

Une conversation est liee obligatoirement a une agence, optionnellement a un bien. Aucune messagerie libre sans contexte.

## Demande de visite

Formulaire simple prerempli contenant automatiquement :
- informations du bien
- reference du bien
- agence concernee
- contexte de la demande

Les champs restent modifiables par l'utilisateur.

## Collections de favoris

Un bien peut appartenir a **plusieurs collections**.

## Gestion d'equipe AqarPro

Roles : owner, admin, agent, viewer — avec permissions differenciees appliquees dans l'UI, les layouts, les actions, les queries et les policies RLS.

## Dashboard personnalisable

L'agence peut choisir l'ordre des blocs, masquer certains blocs, epingler des blocs importants et definir ses actions rapides prioritaires. Elle ne peut pas construire une interface totalement ouverte.

---

# 8. Interaction AqarPro / AqarSearch

Flux general :

1. Une agence publie un bien dans AqarPro
2. Le bien devient visible dans AqarSearch
3. Un particulier consulte le bien
4. Il peut le suivre, le partager, contacter l'agence ou demander une visite
5. Les leads, messages et demandes remontent dans AqarPro

AqarPro est la **source de verite** pour : agences, biens, statuts, pilotage commercial.
AqarSearch gere le **suivi utilisateur** : historiques, favoris, collections, notes, alertes, conversations cote particulier.

---

# 9. Promesse produit

## AqarPro
Permettre aux agences d'avoir une presence digitale credible, moderne et efficace, avec des outils de publication, de branding, de communication et de gestion commerciale.

## AqarSearch
Permettre aux particuliers de chercher librement, puis de suivre intelligemment leur recherche immobiliere dans un espace personnel moderne.

## AqarVision
Creer un ecosysteme immobilier moderne ou les agences publient et pilotent leur activite, et ou les particuliers decouvrent, organisent et suivent leur recherche.

---

# 10. Indicateurs de reussite

Les deux indicateurs principaux :

1. **Agences onboardees** — sans agences, pas d'offre
2. **Leads generes** — sans leads, la valeur percue par les agences reste insuffisante

Pilotage avec une double logique : acquisition/activation des agences + generation d'opportunites concretes.

---

# 11. Regles de conception produit

1. AqarPro doit rester lisible — eviter l'usine a gaz
2. Chaque fonctionnalite doit avoir une valeur metier claire
3. Le rendu doit rester premium
4. L'IA doit aider, pas envahir
5. Les themes vitrines sont un element strategique

---

# 12. Experience utilisateur attendue

AqarPro doit offrir une experience : claire, calme, premium, efficace, rassurante.

L'interface ne doit pas ressembler a :
- un simple back-office technique
- un WordPress immobilier maladroit
- un outil froid sans identite
- un CRM trop lourd

---

# 13. Vision long terme

AqarVision a vocation a devenir :

- une plateforme immobiliere moderne
- un outil professionnel fort pour les agences
- un espace de recherche utile et rassurant pour les particuliers
- une experience digitale plus premium que les portails classiques

A terme : renforcer la presence digitale des agences, professionnaliser la publication, fluidifier la mise en relation, structurer le suivi de recherche, creer un cercle vertueux entre offre et demande qualifiee.
