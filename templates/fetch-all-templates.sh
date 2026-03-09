#!/bin/bash

# Script pour cloner tous les meilleurs templates dans templates/
# Usage: ./fetch-all-templates.sh

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Clonage des Meilleurs Templates GitHub dans        ║${NC}"
echo -e "${BLUE}║  templates/                                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}"
echo ""

# Créer les dossiers
mkdir -p github-web-apps github-api github-mobile github-saas github-data-science

echo -e "${YELLOW}📦 Clonage des templates...${NC}"
echo ""

# WEB APPS
echo -e "${BLUE}🌐 Web Apps${NC}"
echo "  → Next.js Boilerplate..."
git clone --depth 1 https://github.com/ixartz/Next-js-Boilerplate github-web-apps/nextjs-boilerplate 2>/dev/null || echo "    Déjà cloné"

echo "  → SaaS Boilerplate (ixartz)..."
git clone --depth 1 https://github.com/ixartz/SaaS-Boilerplate github-web-apps/saas-boilerplate 2>/dev/null || echo "    Déjà cloné"

echo ""

# API
echo -e "${BLUE}🔌 API & Backend${NC}"
echo "  → Node Express Boilerplate..."
git clone --depth 1 https://github.com/hagopj13/node-express-boilerplate github-api/node-express-boilerplate 2>/dev/null || echo "    Déjà cloné"

echo "  → FastAPI Full-Stack..."
git clone --depth 1 https://github.com/fastapi/full-stack-fastapi-template github-api/fastapi-fullstack 2>/dev/null || echo "    Déjà cloné"

echo "  → FastAPI Backend Template..."
git clone --depth 1 https://github.com/Aeternalis-Ingenium/FastAPI-Backend-Template github-api/fastapi-backend 2>/dev/null || echo "    Déjà cloné"

echo ""

# MOBILE
echo -e "${BLUE}📱 Mobile${NC}"
echo "  → React Native (Obytes)..."
git clone --depth 1 https://github.com/obytes/react-native-template-obytes github-mobile/react-native-obytes 2>/dev/null || echo "    Déjà cloné"

echo "  → React Native Boilerplate..."
git clone --depth 1 https://github.com/thecodingmachine/react-native-boilerplate github-mobile/react-native-boilerplate 2>/dev/null || echo "    Déjà cloné"

echo ""

# SAAS
echo -e "${BLUE}💰 SaaS${NC}"
echo "  → Open SaaS (Wasp)..."
git clone --depth 1 https://github.com/wasp-lang/open-saas github-saas/open-saas 2>/dev/null || echo "    Déjà cloné"

echo "  → Next.js SaaS Starter (Vercel)..."
git clone --depth 1 https://github.com/nextjs/saas-starter github-saas/nextjs-saas-starter 2>/dev/null || echo "    Déjà cloné"

echo "  → BoxyHQ SaaS Starter..."
git clone --depth 1 https://github.com/boxyhq/saas-starter-kit github-saas/boxyhq-saas 2>/dev/null || echo "    Déjà cloné"

echo ""

# DATA SCIENCE
echo -e "${BLUE}📊 Data Science${NC}"
echo "  → Cookiecutter Data Science..."
git clone --depth 1 https://github.com/drivendata/cookiecutter-data-science github-data-science/cookiecutter-ds 2>/dev/null || echo "    Déjà cloné"

echo "  → Equinor Data Science Template..."
git clone --depth 1 https://github.com/equinor/data-science-template github-data-science/equinor-ds 2>/dev/null || echo "    Déjà cloné"

echo ""
echo -e "${GREEN}✅ Tous les templates ont été clonés !${NC}"
echo ""
echo -e "${BLUE}📁 Structure créée:${NC}"
echo "  templates/"
echo "    ├── github-web-apps/     (2 templates)"
echo "    ├── github-api/          (3 templates)"
echo "    ├── github-mobile/       (2 templates)"
echo "    ├── github-saas/         (3 templates)"
echo "    └── github-data-science/ (2 templates)"
echo ""
echo -e "${YELLOW}💡 Total: 12 templates prêts à l'emploi !${NC}"

