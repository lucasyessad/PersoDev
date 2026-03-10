#!/bin/bash

# Script de clonage rapide de templates GitHub
# Usage: ./clone-template.sh <type> <nom-projet>

set -e

TEMPLATE_TYPE=$1
PROJECT_NAME=$2
PROJECTS_DIR="../projects"

# Couleurs pour output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

if [ -z "$TEMPLATE_TYPE" ] || [ -z "$PROJECT_NAME" ]; then
    echo -e "${RED}❌ Usage: ./clone-template.sh <type> <nom-projet>${NC}"
    echo ""
    echo "Types disponibles:"
    echo "  nextjs       - Next.js Boilerplate (ixartz)"
    echo "  saas         - Open SaaS (Wasp)"
    echo "  saas-nextjs  - SaaS Boilerplate Next.js (ixartz)"
    echo "  api-node     - Node.js Express Boilerplate"
    echo "  api-fastapi  - FastAPI Full-Stack Template"
    echo "  mobile       - React Native Template (Obytes)"
    echo "  ds           - Data Science (Cookiecutter)"
    echo ""
    echo "Exemple: ./clone-template.sh saas mon-app-saas"
    exit 1
fi

echo -e "${BLUE}📦 Clonage du template '$TEMPLATE_TYPE' dans '$PROJECT_NAME'...${NC}"

mkdir -p "$PROJECTS_DIR"

case $TEMPLATE_TYPE in
  "nextjs")
    echo -e "${BLUE}🌐 Clonage Next.js Boilerplate...${NC}"
    git clone https://github.com/ixartz/Next-js-Boilerplate "$PROJECTS_DIR/$PROJECT_NAME"
    cd "$PROJECTS_DIR/$PROJECT_NAME"
    echo -e "${GREEN}✅ Next.js Boilerplate cloné !${NC}"
    echo -e "${BLUE}📝 Prochaines étapes:${NC}"
    echo "  cd projects/$PROJECT_NAME"
    echo "  npm install"
    echo "  npm run dev"
    ;;

  "saas")
    echo -e "${BLUE}💰 Clonage Open SaaS...${NC}"
    git clone https://github.com/wasp-lang/open-saas "$PROJECTS_DIR/$PROJECT_NAME"
    cd "$PROJECTS_DIR/$PROJECT_NAME"
    echo -e "${GREEN}✅ Open SaaS cloné !${NC}"
    echo -e "${BLUE}📝 Prochaines étapes:${NC}"
    echo "  cd projects/$PROJECT_NAME"
    echo "  npm install"
    ;;

  "saas-nextjs")
    echo -e "${BLUE}💰 Clonage SaaS Boilerplate Next.js...${NC}"
    git clone https://github.com/ixartz/SaaS-Boilerplate "$PROJECTS_DIR/$PROJECT_NAME"
    cd "$PROJECTS_DIR/$PROJECT_NAME"
    echo -e "${GREEN}✅ SaaS Boilerplate cloné !${NC}"
    ;;

  "api-node")
    echo -e "${BLUE}🔌 Clonage Node.js Express Boilerplate...${NC}"
    git clone https://github.com/hagopj13/node-express-boilerplate "$PROJECTS_DIR/$PROJECT_NAME"
    cd "$PROJECTS_DIR/$PROJECT_NAME"
    echo -e "${GREEN}✅ Express API cloné !${NC}"
    ;;

  "api-fastapi")
    echo -e "${BLUE}🐍 Clonage FastAPI Full-Stack Template...${NC}"
    git clone https://github.com/fastapi/full-stack-fastapi-template "$PROJECTS_DIR/$PROJECT_NAME"
    cd "$PROJECTS_DIR/$PROJECT_NAME"
    echo -e "${GREEN}✅ FastAPI Template cloné !${NC}"
    ;;

  "mobile")
    echo -e "${BLUE}📱 Clonage React Native Template (Obytes)...${NC}"
    git clone https://github.com/obytes/react-native-template-obytes "$PROJECTS_DIR/$PROJECT_NAME"
    cd "$PROJECTS_DIR/$PROJECT_NAME"
    echo -e "${GREEN}✅ React Native Template cloné !${NC}"
    ;;

  "ds")
    echo -e "${BLUE}📊 Création projet Data Science (Cookiecutter)...${NC}"
    if ! command -v ccds &> /dev/null; then
        echo -e "${BLUE}📦 Installation de cookiecutter-data-science...${NC}"
        pip install cookiecutter-data-science
    fi
    cd "$PROJECTS_DIR"
    ccds "$PROJECT_NAME"
    echo -e "${GREEN}✅ Projet Data Science créé !${NC}"
    ;;

  *)
    echo -e "${RED}❌ Type inconnu: $TEMPLATE_TYPE${NC}"
    exit 1
    ;;
esac

echo ""
echo -e "${GREEN}✨ Template prêt !${NC}"
echo -e "${BLUE}📍 Location: projects/$PROJECT_NAME${NC}"
