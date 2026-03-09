# Guide de Maintenance - PersoDev

Guide complet pour maintenir votre workspace PersoDev à jour et optimisé.

---

## 📋 Table des Matières

- [Maintenance Quotidienne](#-maintenance-quotidienne)
- [Maintenance Hebdomadaire](#-maintenance-hebdomadaire)
- [Maintenance Mensuelle](#-maintenance-mensuelle)
- [Scripts Automatiques](#-scripts-automatiques)
- [Résolution de Problèmes](#-résolution-de-problèmes)

---

## 🌅 Maintenance Quotidienne

### Vérifier l'Intégrité

```bash
./scripts/verify.sh
```

Vérifie que :
- Tous les dossiers essentiels sont présents
- Les dépôts Git sont intacts
- La structure est correcte

**Fréquence :** Au début de chaque session de travail

---

## 📅 Maintenance Hebdomadaire

### 1. Mettre à Jour les Ressources Sources

```bash
./scripts/update-all.sh
```

Met à jour tous les dépôts dans `resources/` :
- skills
- awesome-subagents
- planning-system
- prompt-generator
- ui-ux-tools
- superpowers

**Actions après mise à jour :**
1. Lire les changelogs
2. Tester les nouvelles fonctionnalités
3. Re-copier vers `library/` si pertinent

### 2. Nettoyer les Fichiers Temporaires

```bash
# Trouver et supprimer les fichiers temporaires
find . -name "*.tmp" -delete
find . -name "*.log" -delete
find . -name ".DS_Store" -delete
```

### 3. Vérifier l'Espace Disque

```bash
# Taille totale
du -sh .

# Taille par dossier
du -sh */ | sort -hr
```

---

## 📆 Maintenance Mensuelle

### 1. Backup Complet

```bash
./scripts/backup.sh
```

Crée un backup dans `backups/` :
- Garde les 5 derniers backups
- Exclut resources/ et templates GitHub (trop lourds)
- Archive : library/, projects/, docs/, templates/

**Stockage externe recommandé :**
```bash
# Copier sur disque externe ou cloud
cp backups/persodev-backup-*.tar.gz /Volumes/External/Backups/
```

### 2. Audit des Ressources

#### Ressources Utilisées
```bash
# Identifier skills utilisés récemment
find library/skills -type f -name "*.md" -atime -30

# Projets actifs
ls -lt projects/ | head -10
```

#### Ressources Non Utilisées
```bash
# Ressources jamais accédées (>90 jours)
find library/ -type f -atime +90
```

### 3. Mettre à Jour les Templates GitHub

```bash
cd templates/
./fetch-all-templates.sh
```

Re-télécharge les dernières versions des templates GitHub.

### 4. Réviser la Documentation

- [ ] README.md à jour ?
- [ ] CHANGELOG.md complété ?
- [ ] Nouveaux guides nécessaires ?
- [ ] Screenshots à jour ?

---

## 🤖 Scripts Automatiques

### update-all.sh

**Usage :**
```bash
./scripts/update-all.sh
```

**Ce qu'il fait :**
- Parcourt tous les dépôts dans `resources/`
- Fetch les changements
- Pull si des mises à jour disponibles
- Affiche le statut de chaque dépôt

**Quand l'utiliser :**
- Chaque semaine
- Avant de démarrer un nouveau projet
- Après une longue période d'inactivité

---

### backup.sh

**Usage :**
```bash
./scripts/backup.sh
```

**Ce qu'il fait :**
- Crée un tarball dans `backups/`
- Exclut resources/ et templates GitHub
- Garde les 5 derniers backups
- Nettoie automatiquement les vieux backups

**Restauration :**
```bash
tar -xzf backups/persodev-backup-YYYYMMDD_HHMMSS.tar.gz
```

**Quand l'utiliser :**
- Chaque mois
- Avant modification majeure
- Avant mise à jour importante

---

### verify.sh

**Usage :**
```bash
./scripts/verify.sh
```

**Ce qu'il fait :**
- Vérifie structure des dossiers
- Vérifie fichiers essentiels
- Vérifie dépôts Git
- Affiche statistiques

**Exit codes :**
- `0` - Tout OK
- `1` - Erreurs détectées

**Quand l'utiliser :**
- Quotidien (début de session)
- Après modification de structure
- Pour diagnostiquer problèmes

---

## 🔧 Résolution de Problèmes

### Problème : Dépôt Git Corrompu

**Symptôme :**
```
fatal: not a git repository
```

**Solution :**
```bash
# Re-cloner le dépôt source
cd resources/
rm -rf <depot-probleme>
git clone <url-original> <depot-probleme>
```

---

### Problème : Espace Disque Insuffisant

**Symptôme :**
```
No space left on device
```

**Solution :**
```bash
# 1. Identifier gros fichiers
du -sh resources/* library/* templates/* | sort -hr

# 2. Nettoyer templates GitHub si pas utilisés
rm -rf templates/github-*

# 3. Nettoyer vieux backups
rm -rf backups/persodev-backup-2024*

# 4. Re-télécharger templates au besoin
cd templates && ./fetch-all-templates.sh
```

---

### Problème : Templates GitHub Manquants

**Symptôme :**
```
templates/github-saas/ not found
```

**Solution :**
```bash
cd templates/
./fetch-all-templates.sh
```

---

### Problème : Ressources Library Non Synchronisées

**Symptôme :**
Library ne reflète pas les dernières versions de resources/

**Solution :**
```bash
# 1. Mettre à jour resources
./scripts/update-all.sh

# 2. Identifier différences
diff -r resources/skills/skills/ library/skills/

# 3. Re-copier manuellement si nécessaire
cp -r resources/skills/skills/<nouveau-skill> library/skills/<categorie>/
```

---

### Problème : Script Permission Denied

**Symptôme :**
```
Permission denied: ./scripts/verify.sh
```

**Solution :**
```bash
chmod +x scripts/*.sh
chmod +x templates/*.sh
```

---

## 📊 Checklist Mensuelle

- [ ] `./scripts/update-all.sh` - Mise à jour sources
- [ ] `./scripts/backup.sh` - Backup complet
- [ ] `./scripts/verify.sh` - Vérification intégrité
- [ ] Nettoyer fichiers temporaires
- [ ] Réviser CHANGELOG.md
- [ ] Audit ressources utilisées/non-utilisées
- [ ] Mettre à jour templates GitHub si nécessaire
- [ ] Vérifier espace disque
- [ ] Tester que tout fonctionne

---

## 🎓 Bonnes Pratiques

### DO ✅

- Faire des backups réguliers
- Vérifier l'intégrité hebdomadairement
- Garder resources/ en lecture seule
- Documenter les modifications
- Tester après mise à jour

### DON'T ❌

- Modifier directement dans resources/
- Garder des backups > 6 mois
- Ignorer les erreurs de verify.sh
- Commit de gros fichiers
- Skip documentation

---

## 📞 Support

**Problème non résolu ?**

1. Vérifier la documentation
2. Consulter [CONTRIBUTING.md](../../CONTRIBUTING.md)
3. Ouvrir une issue sur GitHub

---

**Maintenance régulière = Workspace performant ! 🚀**
