# AqarVision — Prompts Maitres pour Claude Code

> Prompts autonomes utilisables directement avec Claude Code pour construire AqarPro et AqarSearch

---

# 1. Prompt AqarPro

```txt
Construis AqarPro comme la branche professionnelle de AqarVision.

Objectif :
Creer une plateforme professionnelle complete permettant aux agences immobilieres de gerer leurs annonces, leurs vitrines, leurs contenus, leurs leads, leurs messages, leurs medias, leur equipe et une partie de leur production assistee par IA depuis un espace unique.

Contraintes :
- AqarPro doit rester simple, premium et credible
- ce n'est pas un simple back-office d'annonces
- les mini-vitrines doivent etre de vrais themes complets
- le nombre de themes depend du plan :
  - Starter : 2
  - Pro : 5
  - Enterprise : tous + personnalisation avancee
- le dashboard doit etre personnalisable
- l'IA doit etre presente presque partout, mais de maniere discrete
- toutes les permissions doivent etre respectees selon les roles

A structurer :
1. dashboard agence
2. gestion des annonces
3. gestion des medias
4. systeme de mini-vitrines
5. systeme de themes
6. branding
7. leads
8. messagerie
9. demandes de visite
10. gestion d'equipe
11. analytics
12. actions IA

A produire :
- routes propres
- modules metier
- server actions
- validators
- queries
- composants UI
- regles de permissions
- logique de plans
- tables ou enrichissements necessaires

Le resultat attendu :
AqarPro doit devenir un cockpit digital professionnel, elegant, credible et reellement utile pour une agence immobiliere.
```

---

# 2. Prompt AqarSearch

```txt
Construis AqarSearch comme la branche particulier de AqarVision.

Objectif :
Creer une experience de recherche immobiliere moderne, simple et premium, qui permet de consulter librement les annonces sans compte, puis d'utiliser un compte pour organiser, suivre et approfondir sa recherche.

Contraintes :
- AqarSearch n'est pas une marque autonome
- AqarSearch depend des biens et agences publies dans AqarPro
- sans compte, seules la recherche, le filtrage et la consultation sont autorises
- toute autre action doit rediriger vers creation de compte ou connexion avec retour au contexte
- la messagerie doit toujours partir d'un contexte precis
- un bien peut appartenir a plusieurs collections de favoris
- la demande de visite doit etre un formulaire simple prerempli
- le code doit rester propre, modulaire, type et compatible avec Next.js 14 + Supabase

A structurer :
1. recherche publique
2. fiche bien
3. compte particulier
4. biens deja vus
5. notes personnelles
6. favoris
7. collections
8. historique
9. recherche reprise
10. alertes
11. messagerie
12. demandes de visite
13. evenements analytics

A produire :
- routes propres
- modeles de donnees
- server actions
- queries
- validators
- composants UI
- permissions
- logique de redirection
- logique de contexte pour messagerie et demandes de visite

Le resultat attendu :
AqarSearch doit devenir un espace personnel de recherche immobiliere, simple sans compte, beaucoup plus utile avec un compte, et parfaitement relie a AqarPro.
```
