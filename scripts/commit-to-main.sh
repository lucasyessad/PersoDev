#!/bin/bash

# Script de commit et merge de dev vers main
# Usage: ./scripts/commit-to-main.sh "message de commit"

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

COMMIT_MESSAGE=$1

echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      Commit dev → main                               ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}"
echo ""

# Message par défaut si aucun message n'est fourni
if [ -z "$COMMIT_MESSAGE" ]; then
    COMMIT_MESSAGE="chore: mise à jour automatique"
    echo -e "${YELLOW}⚠️  Aucun message fourni, utilisation du message par défaut${NC}"
    echo -e "${BLUE}Message: ${COMMIT_MESSAGE}${NC}"
    echo ""
fi

# Vérifier qu'on est dans un repo git
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Pas un dépôt Git${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Étape 1/7 : Vérification de l'état${NC}"
# Vérifier la branche actuelle
CURRENT_BRANCH=$(git branch --show-current)
echo "  Branche actuelle: $CURRENT_BRANCH"

# S'assurer qu'on est sur dev
if [ "$CURRENT_BRANCH" != "dev" ]; then
    echo -e "${YELLOW}⚠️  Pas sur la branche dev, changement de branche...${NC}"
    git checkout dev
fi
echo -e "${GREEN}✓ Sur la branche dev${NC}"
echo ""

echo -e "${YELLOW}📋 Étape 2/7 : Vérification de l'intégrité${NC}"
if command -v ./scripts/verify.sh &> /dev/null; then
    ./scripts/verify.sh > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Vérification d'intégrité OK${NC}"
    else
        echo -e "${RED}❌ Vérification d'intégrité échouée${NC}"
        echo "Exécutez ./scripts/verify.sh pour plus de détails"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Script verify.sh non trouvé, skip${NC}"
fi
echo ""

echo -e "${YELLOW}📋 Étape 3/7 : Ajout des fichiers${NC}"
# Ajouter tous les fichiers modifiés
git add .

# Afficher les fichiers qui seront committés
echo -e "${BLUE}Fichiers à committer:${NC}"
git status --short
echo ""

# Vérifier qu'il y a des changements à committer
if git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  Aucun changement à committer${NC}"
    exit 0
fi
echo -e "${GREEN}✓ Fichiers ajoutés${NC}"
echo ""

echo -e "${YELLOW}📋 Étape 4/7 : Commit sur dev${NC}"
# Commit avec le message fourni et signature Claude
FULL_MESSAGE="$COMMIT_MESSAGE

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git commit -m "$FULL_MESSAGE"
echo -e "${GREEN}✓ Commit effectué sur dev${NC}"
echo ""

echo -e "${YELLOW}📋 Étape 5/7 : Passage sur main${NC}"
git checkout main
echo -e "${GREEN}✓ Sur la branche main${NC}"
echo ""

echo -e "${YELLOW}📋 Étape 6/7 : Merge dev → main${NC}"
# Merger dev dans main
git merge dev --no-edit

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Merge réussi${NC}"
else
    echo -e "${RED}❌ Conflit de merge détecté${NC}"
    echo ""
    echo "Résolvez les conflits manuellement, puis:"
    echo "  git add ."
    echo "  git merge --continue"
    exit 1
fi
echo ""

echo -e "${YELLOW}📋 Étape 7/7 : Retour sur dev${NC}"
git checkout dev
echo -e "${GREEN}✓ Retour sur dev${NC}"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Commit et merge réussis !${NC}"
echo ""
echo -e "${BLUE}📊 Résumé:${NC}"
echo "  • Commit sur dev: ✓"
echo "  • Merge dev → main: ✓"
echo "  • Branche actuelle: dev"
echo ""
echo -e "${BLUE}💡 Prochaines étapes:${NC}"
echo "  • git push origin dev   (pusher dev)"
echo "  • git push origin main  (pusher main)"
echo ""
echo -e "${YELLOW}⚠️  N'oubliez pas de pusher les deux branches !${NC}"
