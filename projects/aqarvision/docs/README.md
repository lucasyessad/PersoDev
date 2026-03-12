# AqarVision — Documentation Produit

Index de la documentation produit de l'ecosysteme AqarVision.

## Documents

| Fichier | Contenu | Public cible |
|---------|---------|--------------|
| [01-vision-globale.md](./01-vision-globale.md) | Vision strategique, positionnement, arbitrages valides, KPIs | Fondateurs, product owners |
| [02-roadmap.md](./02-roadmap.md) | Roadmap par phases (MVP / V1 / V2), dependances, indicateurs | Product owners, developpeurs |
| [03-aqarpro-technique.md](./03-aqarpro-technique.md) | Specification technique AqarPro (routes, donnees, actions, composants) | Developpeurs |
| [04-aqarsearch-technique.md](./04-aqarsearch-technique.md) | Specification technique AqarSearch (routes, donnees, actions, composants) | Developpeurs |
| [05-prompts-maitres.md](./05-prompts-maitres.md) | Prompts maitre pour Claude Code (AqarPro + AqarSearch) | Developpeurs IA |

## Architecture produit

```
AqarVision (ecosysteme global)
|
+-- AqarPro (B2B) — plateforme professionnelle pour agences
|
+-- AqarSearch (B2C) — recherche immobiliere pour particuliers
```

## Conventions

- Le document **01-vision-globale.md** est le document de reference pour les arbitrages strategiques. Les autres documents y renvoient au lieu de repeter.
- Les specifications techniques (03, 04) couvrent l'implementation sans repeter la vision produit.
- Les prompts maitres (05) sont des prompts autonomes utilisables directement avec Claude Code.
