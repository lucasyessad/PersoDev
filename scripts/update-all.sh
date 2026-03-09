#!/bin/bash

# Script de mise à jour de toutes les ressources sources
# Usage: ./scripts/update-all.sh

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      Mise à jour de toutes les ressources           ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}"
echo ""

RESOURCES_DIR="resources"

if [ ! -d "$RESOURCES_DIR" ]; then
    echo -e "${RED}❌ Dossier resources/ introuvable${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Mise à jour des dépôts sources...${NC}"
echo ""

# Fonction pour mettre à jour un dépôt
update_repo() {
    local dir=$1
    local name=$(basename "$dir")

    echo -e "${BLUE}→ $name${NC}"

    if [ -d "$dir/.git" ]; then
        cd "$dir"

        # Sauvegarder la branche actuelle
        current_branch=$(git branch --show-current)

        # Fetch les changements
        git fetch origin --quiet

        # Vérifier s'il y a des changements
        UPSTREAM=${current_branch}@{upstream}
        LOCAL=$(git rev-parse @)
        REMOTE=$(git rev-parse "$UPSTREAM" 2>/dev/null || echo "")

        if [ -z "$REMOTE" ]; then
            echo -e "  ${YELLOW}⚠️  Pas de remote configuré${NC}"
        elif [ "$LOCAL" = "$REMOTE" ]; then
            echo -e "  ${GREEN}✓ Déjà à jour${NC}"
        else
            # Pull les changements
            git pull origin "$current_branch" --quiet
            echo -e "  ${GREEN}✓ Mis à jour${NC}"
        fi

        cd - > /dev/null
    else
        echo -e "  ${RED}✗ Pas un dépôt Git${NC}"
    fi
    echo ""
}

# Mettre à jour tous les dépôts dans resources/
for repo in "$RESOURCES_DIR"/*; do
    if [ -d "$repo" ]; then
        update_repo "$repo"
    fi
done

echo -e "${GREEN}✅ Mise à jour terminée !${NC}"
echo ""
echo -e "${BLUE}💡 Prochaines étapes :${NC}"
echo "  • Vérifier les changelogs des dépôts"
echo "  • Re-copier les ressources pertinentes vers library/ si nécessaire"
echo "  • Tester que tout fonctionne"
