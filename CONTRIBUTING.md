# Guide de Contribution - PersoDev

Merci de votre intérêt pour contribuer à PersoDev ! 🎉

Ce document explique comment contribuer efficacement à ce projet.

---

## 📋 Table des Matières

- [Code of Conduct](#code-of-conduct)
- [Comment Contribuer](#comment-contribuer)
- [Structure du Projet](#structure-du-projet)
- [Standards et Conventions](#standards-et-conventions)
- [Process de Contribution](#process-de-contribution)

---

## 🤝 Code of Conduct

Ce projet suit les principes de respect mutuel et de collaboration. Soyez respectueux, constructif et bienveillant.

---

## 💡 Comment Contribuer

### Types de Contributions

Toutes les contributions sont bienvenues :

- 🐛 **Rapporter des bugs**
- ✨ **Proposer de nouvelles fonctionnalités**
- 📝 **Améliorer la documentation**
- 🔧 **Ajouter des ressources** (skills, subagents, workflows)
- 🌐 **Suggérer de nouveaux templates GitHub**
- 🎨 **Améliorer les scripts**

---

## 📁 Structure du Projet

### Principes d'Organisation

#### `resources/` - Sources Git (READ-ONLY)
- ✅ Contient les dépôts Git originaux
- ✅ Mise à jour via `git pull`
- ❌ Ne jamais modifier directement
- ❌ Ne pas commit dans ce dossier

#### `library/` - Bibliothèque de Travail
- ✅ Ressources organisées pour usage quotidien
- ✅ Peut être modifié et customisé
- ✅ Organisation par cas d'usage
- ✅ Commit autorisé

#### `projects/` - Vos Projets
- ✅ Projets de développement
- ✅ Chaque projet a son propre git
- ❌ Ne pas commit dans le repo principal

#### `templates/` - Templates Réutilisables
- ✅ Templates locaux (skills, planning)
- ✅ Scripts de clonage
- ❌ Templates GitHub (trop lourds - dans .gitignore)

---

## 📏 Standards et Conventions

### Ajouter un Skill

```bash
# 1. Créer le dossier
mkdir -p library/skills/<categorie>/<nom-skill>

# 2. Créer SKILL.md avec frontmatter
cat > library/skills/<categorie>/<nom-skill>/SKILL.md << 'EOF'
---
name: mon-skill
description: Description courte du skill
---

# Instructions

[Vos instructions pour Claude]
EOF

# 3. Documenter dans README si nécessaire
```

### Ajouter un Subagent

```bash
# 1. Créer le fichier dans la bonne catégorie
touch library/subagents/<domaine>/<nom-subagent>.md

# 2. Format standard
cat > library/subagents/<domaine>/<nom-subagent>.md << 'EOF'
# Nom du Subagent

## Description
[Description du rôle]

## Expertise
- Compétence 1
- Compétence 2

## Quand l'utiliser
- Cas d'usage 1
- Cas d'usage 2
EOF
```

### Ajouter un Template GitHub

1. Tester le template
2. Ajouter à `templates/GITHUB_TEMPLATES.md`
3. Ajouter le type à `templates/clone-template.sh`
4. Mettre à jour la documentation

### Nommage

- **Dossiers** : `kebab-case` (ex: `my-skill`, `api-template`)
- **Fichiers** : `kebab-case.md` ou `UPPERCASE.md` pour principaux
- **Scripts** : `kebab-case.sh`, exécutables (`chmod +x`)

---

## 🔄 Process de Contribution

### 1. Fork & Clone

```bash
# Fork le projet sur GitHub
git clone https://github.com/votre-username/PersoDev.git
cd PersoDev
```

### 2. Créer une Branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-bug
# ou
git checkout -b docs/amelioration-documentation
```

**Convention de nommage des branches :**
- `feature/` - Nouvelle fonctionnalité
- `fix/` - Correction de bug
- `docs/` - Documentation
- `refactor/` - Refactoring
- `chore/` - Maintenance

### 3. Faire vos Changements

```bash
# Modifier les fichiers nécessaires

# Vérifier l'intégrité
./scripts/verify.sh

# Tester vos changements
```

### 4. Commit

```bash
git add .
git commit -m "feat: ajoute nouveau skill pour XYZ"
```

**Convention de commit (Conventional Commits) :**
- `feat:` - Nouvelle fonctionnalité
- `fix:` - Correction de bug
- `docs:` - Documentation
- `style:` - Formatage
- `refactor:` - Refactoring
- `test:` - Tests
- `chore:` - Maintenance

### 5. Push & Pull Request

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

Puis créer une Pull Request sur GitHub avec :
- **Titre clair** décrivant le changement
- **Description** expliquant pourquoi et comment
- **Tests effectués** si applicable

---

## ✅ Checklist Avant PR

- [ ] Code testé et fonctionnel
- [ ] `./scripts/verify.sh` passe sans erreur
- [ ] Documentation mise à jour si nécessaire
- [ ] CHANGELOG.md mis à jour
- [ ] Commits suivent la convention
- [ ] Pas de fichiers lourds ou sensibles

---

## 📝 Mise à Jour de la Documentation

### README.md
Mettre à jour si :
- Nouvelle fonctionnalité majeure
- Changement de structure
- Nouvelles instructions d'utilisation

### CLAUDE.md
Mettre à jour si :
- Nouveaux workflows pour Claude
- Nouvelles ressources dans library/
- Changements de conventions

### CHANGELOG.md
**TOUJOURS** mettre à jour pour documenter vos changements.

---

## 🐛 Rapporter un Bug

Créer une issue sur GitHub avec :

**Template :**
```markdown
## Description
[Description claire du bug]

## Étapes pour Reproduire
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

## Comportement Attendu
[Ce qui devrait se passer]

## Comportement Actuel
[Ce qui se passe réellement]

## Environnement
- OS: [ex: macOS, Linux, Windows]
- Version: [ex: 1.0.0]

## Screenshots
[Si applicable]
```

---

## 💡 Proposer une Fonctionnalité

Créer une issue sur GitHub avec :

**Template :**
```markdown
## Problème à Résoudre
[Quel problème cette fonctionnalité résout-elle ?]

## Solution Proposée
[Comment voudriez-vous que ça fonctionne ?]

## Alternatives Considérées
[Autres solutions envisagées]

## Contexte Additionnel
[Informations supplémentaires]
```

---

## 🎓 Ressources

- [Structure du Projet](README.md#structure-du-projet)
- [Guide Claude Code](CLAUDE.md)
- [Templates GitHub](templates/GITHUB_TEMPLATES.md)
- [Quick Reference](docs/references/quick-reference.md)

---

## ❓ Questions

Des questions ? N'hésitez pas à :
- Ouvrir une issue sur GitHub
- Consulter la documentation
- Demander dans les discussions

---

**Merci de contribuer à PersoDev ! 🚀**
