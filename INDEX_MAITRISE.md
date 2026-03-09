# Index de Maîtrise - PersoDev Resources

> Guide de référence complet pour utiliser efficacement toutes les ressources PersoDev

**Répertoire de travail** : `/Users/lounis/Antigravity/Github/PersoDev`

---

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Skills (17)](#1-skills-17)
3. [Subagents (83)](#2-subagents-83)
4. [Workflows (11)](#3-workflows-11)
5. [Generators (3)](#4-generators-3)
6. [Resources (6 repos sources)](#5-resources-6-repos-sources)
7. [Templates (12)](#6-templates-12)
8. [Index alphabétique](#index-alphabétique)
9. [Index par cas d'usage](#index-par-cas-dusage)

---

## Vue d'ensemble

PersoDev est un workspace de développement personnel qui centralise les meilleures ressources Claude Code :
- **resources/** : Repos sources (git-managed, read-only)
- **library/** : Ressources organisées pour usage quotidien
- **templates/** : Templates de projets starter
- **projects/** : Projets en développement

---

## 1. Skills (17)

### Documents (4 skills)

#### `/Users/lounis/Antigravity/Github/PersoDev/library/skills/documents/pdf`
- **Objectif** : Manipulation complète des fichiers PDF (lecture, extraction, création, modification)
- **Capacités** :
  - Lecture/extraction de texte et tableaux (pdfplumber, pypdf)
  - Fusion, séparation, rotation de pages
  - Création de PDFs (reportlab)
  - OCR sur PDFs scannés (pytesseract)
  - Remplissage de formulaires
  - Encryption/décryption
  - Extraction d'images
  - Ajout de watermarks
- **Bibliothèques** : pypdf, pdfplumber, reportlab, pytesseract, pdf2image
- **Outils CLI** : pdftotext, qpdf, pdftk
- **Cas d'usage** :
  - "Extract tables from this PDF report"
  - "Merge these 5 PDF documents"
  - "Fill out this PDF form with data from the spreadsheet"
  - "Add watermark to all pages"
- **Exemples** :
```python
# Extraction de tableaux
import pdfplumber
with pdfplumber.open("document.pdf") as pdf:
    for page in pdf.pages:
        tables = page.extract_tables()
```
```bash
# Fusion de PDFs
qpdf --empty --pages file1.pdf file2.pdf -- merged.pdf
```

#### `/Users/lounis/Antigravity/Github/PersoDev/library/skills/documents/docx`
- **Objectif** : Création, édition et analyse de documents Word (.docx)
- **Capacités** :
  - Lecture de contenu (pandoc)
  - Création de nouveaux documents (docx-js)
  - Édition XML avancée (unpack → edit → pack)
  - Gestion des tracked changes
  - Tables, images, en-têtes/pieds de page
  - Tables des matières
  - Commentaires et révisions
- **Approche** : Les .docx sont des archives ZIP contenant du XML
- **Workflow d'édition** :
  1. Unpack : `python scripts/office/unpack.py document.docx unpacked/`
  2. Edit XML : Modification directe des fichiers XML
  3. Pack : `python scripts/office/pack.py unpacked/ output.docx`
- **Cas d'usage** :
  - "Create a professional report with table of contents"
  - "Add tracked changes to this contract"
  - "Extract text from Word doc preserving formatting"
- **Exemples** :
```javascript
// Création avec docx-js
const doc = new Document({
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 } } // US Letter
    },
    children: [
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Title")]
      })
    ]
  }]
});
```

#### `/Users/lounis/Antigravity/Github/PersoDev/library/skills/documents/pptx`
- **Objectif** : Création et édition de présentations PowerPoint
- **Capacités** :
  - Lecture/extraction de contenu (markitdown)
  - Édition via XML (unpack → edit → pack)
  - Création from scratch (pptxgenjs)
  - Design professionnel (palettes de couleurs, typographie)
  - Génération de thumbnails
- **Workflow** :
  1. **Reading** : `python -m markitdown presentation.pptx`
  2. **Editing** : Template-based manipulation
  3. **Creating** : pptxgenjs pour création complète
- **Design Guidelines** :
  - Choisir une palette cohérente (10 palettes pré-définies)
  - Typographie : Headers 36-44pt, Body 14-16pt
  - Éviter : Centrer le body text, lignes d'accent sous titres, slides text-only
- **QA requis** :
  - Content QA : `python -m markitdown output.pptx`
  - Visual QA : Conversion en images via subagents
- **Cas d'usage** :
  - "Create a pitch deck with our brand colors"
  - "Extract speaker notes from this presentation"
  - "Update slide 5 with new data"
- **Exemples** :
```bash
# Conversion en images pour QA
python scripts/office/soffice.py --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
```

#### `/Users/lounis/Antigravity/Github/PersoDev/library/skills/documents/xlsx`
- **Objectif** : Création, édition et analyse de feuilles de calcul Excel
- **Capacités** :
  - Lecture/analyse (pandas)
  - Création/édition avancée (openpyxl)
  - Formules Excel (pas de hardcoding Python)
  - Formatage professionnel (couleurs, fonts)
  - Standards financiers (color-coding, number formatting)
- **Règle critique** : TOUJOURS utiliser des formules Excel, jamais hardcoder des valeurs calculées en Python
- **Standards financiers** :
  - Texte bleu : Inputs hardcodés
  - Texte noir : Formules
  - Texte vert : Liens inter-sheets
  - Texte rouge : Liens externes
  - Fond jaune : Assumptions clés
- **Workflow** :
  1. Create/Load avec openpyxl
  2. Add formulas (strings)
  3. Save
  4. **Recalculate** : `python scripts/recalc.py output.xlsx`
  5. Verify errors
- **Cas d'usage** :
  - "Build a financial model with revenue projections"
  - "Clean this messy CSV and convert to xlsx"
  - "Add formulas to calculate profit margins"
- **Exemples** :
```python
# ✅ CORRECT - Using Excel formulas
sheet['B10'] = '=SUM(B2:B9)'
sheet['C5'] = '=(C4-C2)/C2'

# ❌ WRONG - Hardcoding values
total = df['Sales'].sum()
sheet['B10'] = total  # Ne pas faire ça
```

---

### Design (4 skills)

#### `/Users/lounis/Antigravity/Github/PersoDev/library/skills/design/algorithmic-art`
- **Objectif** : Création d'art algorithmique avec p5.js (generative art)
- **Capacités** :
  - Philosophie algorithmique → Expression en code
  - Art génératif avec seeded randomness
  - Flow fields, particle systems, noise patterns
  - Interactive parameter exploration
  - Viewer HTML avec contrôles intégrés
- **Process** :
  1. Créer une philosophie algorithmique (.md) - 4-6 paragraphes
  2. Implémenter avec p5.js dans HTML artifact
- **Template** : `templates/viewer.html` (TOUJOURS utiliser comme base)
- **Concepts clés** :
  - Seeded randomness (Art Blocks pattern)
  - Parameter-driven generation
  - Emergence over static design
  - Master-level craftsmanship
- **Cas d'usage** :
  - "Create flow field art with organic turbulence"
  - "Generate particle system following noise patterns"
  - "Make interactive generative art I can explore"
- **Exemples philosophiques** :
  - "Organic Turbulence" : Flow fields + Perlin noise + particle trails
  - "Quantum Harmonics" : Phase interference patterns
  - "Stochastic Crystallization" : Circle packing + Voronoi

#### `/Users/lounis/Antigravity/Github/PersoDev/library/skills/design/canvas-design`
- **Objectif** : Création d'art visuel et posters avec philosophie de design
- **Capacités** :
  - Philosophie de design → Expression visuelle
  - Art statique (PDF/PNG)
  - Typographie sophistiquée
  - Composition spatiale
  - Minimal text, maximum visual impact
- **Process** :
  1. Créer philosophie de design (.md) - 4-6 paragraphes
  2. Exprimer visuellement sur canvas (PDF/PNG)
- **Principes** :
  - Text minimal, intégré visuellement
  - Fonts : Chercher dans `./canvas-fonts`
  - Craftsmanship museum-quality
  - Pas d'overlap, marges parfaites
- **Exemples philosophiques** :
  - "Concrete Poetry" : Monumental forms + bold geometry
  - "Chromatic Language" : Color as primary information system
  - "Analog Meditation" : Texture + vast negative space
- **Cas d'usage** :
  - "Create a poster for our design conference"
  - "Make abstract art based on quantum physics"
  - "Design a museum-quality print"

#### `/Users/lounis/Antigravity/Github/PersoDev/library/skills/design/frontend-design`
- **Objectif** : Interfaces web production-grade avec design distinctif
- **Capacités** :
  - Composants web, pages, applications
  - Design bold et mémorable
  - Évite les aesthetics "AI slop"
  - HTML/CSS/JS, React, Vue
- **Focus Design** :
  - **Typography** : Fonts unique et beau (ÉVITER Inter, Roboto, Arial)
  - **Color** : Aesthetic cohésif, CSS variables
  - **Motion** : Animations CSS + Motion library pour React
  - **Spatial** : Layouts inattendus, asymétrie, overlap
  - **Backgrounds** : Gradients, textures, patterns vs solid colors
- **Anti-patterns** :
  - ❌ Purple gradients on white
  - ❌ Generic fonts (Inter, Space Grotesk)
  - ❌ Predictable layouts
  - ❌ Cookie-cutter design
- **Cas d'usage** :
  - "Build a landing page with brutalist aesthetic"
  - "Create a dashboard with art deco geometry"
  - "Design a web app with organic/natural theme"

#### `/Users/lounis/Antigravity/Github/PersoDev/library/skills/design/theme-factory`
- **Objectif** : Toolkit de thèmes professionnels pour artifacts
- **Capacités** :
  - 10 thèmes pré-définis (colors + fonts)
  - Application à slides, docs, HTML pages
  - Génération de thèmes custom
- **Workflow** :
  1. Afficher `theme-showcase.pdf`
  2. User choisit thème
  3. Appliquer aux artifacts
- **Thèmes disponibles** :
  1. Ocean Depths - Maritime calme
  2. Sunset Boulevard - Sunset vibrant
  3. Forest Canopy - Earth tones naturels
  4. Modern Minimalist - Grayscale contemporain
  5. Golden Hour - Autumnal chaud
  6. Arctic Frost - Winter crisp
  7. Desert Rose - Dusty sophistiqué
  8. Tech Innovation - Tech bold
  9. Botanical Garden - Garden organique
  10. Midnight Galaxy - Cosmic dramatique
- **Cas d'usage** :
  - "Apply Ocean Depths theme to my presentation"
  - "Create a custom theme for our brand"

---

### Development (5 skills)

#### `/Users/lounis/Antigravity/Github/PersoDev/library/skills/development/mcp-builder`
- **Objectif** : Création de serveurs MCP (Model Context Protocol) de haute qualité
- **Capacités** :
  - Serveurs Python (FastMCP) ou TypeScript (MCP SDK)
  - Intégration d'APIs externes
  - Tools, Resources, Prompts
  - Evaluations complètes
- **Process en 4 phases** :
  1. **Research & Planning**
     - Étudier MCP spec + framework docs
     - Planifier coverage API vs workflow tools
  2. **Implementation**
     - Setup projet (voir guides TypeScript/Python)
     - Core infrastructure (API client, error handling)
     - Implement tools avec schemas (Zod/Pydantic)
  3. **Review & Test**
     - Code quality review
     - Build & test avec MCP Inspector
  4. **Evaluations**
     - Créer 10 questions complexes
     - Format XML avec Q&A pairs
- **Stack recommandé** :
  - Language : TypeScript (meilleur SDK)
  - Transport : Streamable HTTP (remote), stdio (local)
- **Cas d'usage** :
  - "Build an MCP server for GitHub API"
  - "Create MCP tools for Notion integration"
  - "Add evaluation suite to this MCP server"
- **References** :
  - `reference/mcp_best_practices.md`
  - `reference/node_mcp_server.md` (TypeScript)
  - `reference/python_mcp_server.md` (Python)
  - `reference/evaluation.md`

#### `/Users/lounis/Antigravity/Github/PersoDev/library/skills/development/skill-creator`
- **Objectif** : Créer, modifier et optimiser des skills Claude Code
- **Capacités** :
  - Création de skills from scratch
  - Amélioration itérative avec evals
  - Benchmarking avec variance analysis
  - Optimisation des descriptions (triggering)
- **Workflow complet** :
  1. **Capture Intent** : Comprendre objectif, triggers, output
  2. **Interview & Research** : Edge cases, formats, exemples
  3. **Write SKILL.md** : name, description (pushy), instructions
  4. **Test Cases** : 2-3 prompts réalistes → `evals/evals.json`
  5. **Run & Evaluate** :
     - Spawn subagents (with-skill + baseline)
     - Grade avec assertions
     - Aggregate benchmark
     - Launch viewer : `eval-viewer/generate_review.py`
  6. **Iterate** : Améliorer skill basé sur feedback
  7. **Description Optimization** : 20 trigger evals → optimize loop
  8. **Package** : `scripts/package_skill.py`
- **Anatomie d'un Skill** :
```
skill-name/
├── SKILL.md (required - name + description + instructions)
├── scripts/ (optional - code exécutable)
├── references/ (optional - docs)
└── assets/ (optional - templates, icons)
```
- **Progressive Disclosure** :
  - Metadata : ~100 words (always loaded)
  - SKILL.md body : <500 lines (loaded when triggered)
  - Resources : Unlimited (loaded as needed)
- **Cas d'usage** :
  - "Create a skill for API documentation generation"
  - "Improve the PDF skill's triggering accuracy"
  - "Run evals on this skill to measure performance"
- **Tools** :
  - `scripts/run_loop.py` : Description optimization
  - `eval-viewer/generate_review.py` : Results viewer
  - `scripts/aggregate_benchmark.py` : Stats aggregation

#### `/Users/lounis/Antigravity/Github/PersoDev/library/skills/development/web-artifacts-builder`
- **Objectif** : Création d'artifacts claude.ai complexes avec React + shadcn/ui
- **Capacités** :
  - Multi-component artifacts
  - State management, routing
  - 40+ shadcn/ui components pré-installés
  - Bundle en single HTML file
- **Stack** : React 18 + TypeScript + Vite + Parcel + Tailwind CSS + shadcn/ui
- **Workflow** :
  1. Init : `bash scripts/init-artifact.sh <project-name>`
  2. Develop : Éditer les fichiers générés
  3. Bundle : `bash scripts/bundle-artifact.sh` → `bundle.html`
  4. Share : Présenter bundle.html comme artifact
  5. Test (optional) : Playwright/Puppeteer si nécessaire
- **Design Guidelines** :
  - ❌ ÉVITER : Centered layouts, purple gradients, Inter font
  - ✅ UTILISER : Designs distinctifs, fonts originaux
- **Cas d'usage** :
  - "Build a multi-page dashboard with routing"
  - "Create a complex form with shadcn/ui components"
  - "Make an artifact with client-side state management"
- **Config auto** :
  - Path aliases (`@/`)
  - Radix UI dependencies
  - Node 18+ compatibility

#### `/Users/lounis/Antigravity/Github/PersoDev/library/skills/development/claude-api`
- **Objectif** : Intégration de l'API Claude dans différents langages
- **Langages supportés** :
  - Python (claude-api + agent-sdk)
  - TypeScript (claude-api + agent-sdk)
  - C#, Go, Java, PHP, Ruby
  - cURL (exemples)
- **Structure** :
```
claude-api/
├── SKILL.md
├── python/
│   ├── agent-sdk/
│   └── claude-api/
├── typescript/
│   ├── agent-sdk/
│   └── claude-api/
├── csharp/, go/, java/, php/, ruby/
└── shared/ (docs communes)
```
- **Cas d'usage** :
  - "Integrate Claude API in my Python backend"
  - "Use Agent SDK for multi-step workflows"
  - "Call Claude API from Node.js"

#### `/Users/lounis/Antigravity/Github/PersoDev/library/skills/development/webapp-testing`
- **Objectif** : Testing automatisé d'applications web
- **Capacités** :
  - Tests end-to-end
  - Testing frameworks
  - Exemples de tests
  - Scripts utilitaires
- **Structure** :
```
webapp-testing/
├── SKILL.md
├── examples/
└── scripts/
```
- **Cas d'usage** :
  - "Write E2E tests for this React app"
  - "Set up testing pipeline"

---

### Communication (4 skills)

#### `/Users/lounis/Antigravity/Github/PersoDev/library/skills/communication/internal-comms`
- **Objectif** : Communications internes professionnelles
- **Capacités** :
  - Rédaction d'emails, memos, annonces
  - Ton professionnel adapté au contexte
  - Templates et exemples
- **Structure** :
```
internal-comms/
├── SKILL.md
└── examples/
```
- **Cas d'usage** :
  - "Draft announcement for new product launch"
  - "Write professional email to stakeholders"

#### `/Users/lounis/Antigravity/Github/PersoDev/library/skills/communication/slack-gif-creator`
- **Objectif** : Création de GIFs pour Slack
- **Capacités** :
  - GIFs animés pour communications
  - Intégration Slack
  - Core utilities
- **Structure** :
```
slack-gif-creator/
├── SKILL.md
└── core/
```

#### `/Users/lounis/Antigravity/Github/PersoDev/library/skills/communication/brand-guidelines`
- **Objectif** : Définition et application de guidelines de marque
- **Cas d'usage** :
  - "Create brand guidelines document"
  - "Apply brand style to these materials"

#### `/Users/lounis/Antigravity/Github/PersoDev/library/skills/communication/doc-coauthoring`
- **Objectif** : Co-rédaction collaborative de documents
- **Cas d'usage** :
  - "Help me co-author this technical spec"
  - "Collaborate on writing this proposal"

---

## 2. Subagents (83)

Les subagents sont des assistants IA spécialisés par domaine. Ils sont organisés en 5 catégories principales.

### Languages (25+ subagents)

**Path** : `/Users/lounis/Antigravity/Github/PersoDev/library/subagents/languages/`

Spécialistes par langage de programmation :

- **python-pro.md** : Expert Python (optimisation, best practices)
- **javascript-pro.md** : Expert JavaScript (ES6+, async patterns)
- **typescript-pro.md** : Expert TypeScript (types avancés, generics)
- **react-specialist.md** : Spécialiste React (hooks, performance)
- **nextjs-developer.md** : Expert Next.js (SSR, routing, API routes)
- **angular-architect.md** : Architecte Angular (modules, services)
- **vue-expert.md** : Expert Vue.js
- **golang-pro.md** : Expert Go (concurrency, interfaces)
- **rust-engineer.md** : Ingénieur Rust (ownership, lifetimes)
- **java-architect.md** : Architecte Java (design patterns, Spring)
- **kotlin-specialist.md** : Spécialiste Kotlin
- **swift-expert.md** : Expert Swift (iOS development)
- **cpp-pro.md** : Expert C++ (modern C++, templates)
- **csharp-developer.md** : Développeur C#
- **dotnet-core-expert.md** : Expert .NET Core
- **dotnet-framework-4.8-expert.md** : Expert .NET Framework 4.8
- **php-pro.md** : Expert PHP
- **laravel-specialist.md** : Spécialiste Laravel
- **ruby-expert.md** : Expert Ruby
- **rails-expert.md** : Expert Ruby on Rails
- **elixir-expert.md** : Expert Elixir
- **django-developer.md** : Développeur Django
- **spring-boot-engineer.md** : Ingénieur Spring Boot
- **flutter-expert.md** : Expert Flutter
- **sql-pro.md** : Expert SQL (queries, optimisation)
- **powershell-5.1-expert.md** : Expert PowerShell 5.1
- **powershell-7-expert.md** : Expert PowerShell 7

**Quand les utiliser** :
- Optimisation de code spécifique à un langage
- Design patterns et best practices
- Refactoring et modernisation
- Debugging complexe
- Performance tuning

**Exemple d'activation** :
```
Activate the Python specialist to optimize this data processing pipeline
```

---

### Infrastructure (13 subagents)

**Path** : `/Users/lounis/Antigravity/Github/PersoDev/library/subagents/infrastructure/`

- **devops-engineer.md** : DevOps général (CI/CD, automation)
- **sre-engineer.md** : Site Reliability Engineering
- **platform-engineer.md** : Platform Engineering
- **docker-expert.md** : Expert Docker (containerization)
- **kubernetes-expert.md** : Expert Kubernetes (orchestration)
- **terraform-expert.md** : Expert Terraform (IaC)
- **terragrunt-expert.md** : Expert Terragrunt
- **aws-architect.md** : Architecte AWS
- **azure-infra-engineer.md** : Ingénieur Azure
- **gcp-specialist.md** : Spécialiste Google Cloud
- **database-administrator.md** : DBA (MySQL, PostgreSQL, etc.)
- **devops-incident-responder.md** : Réponse aux incidents
- **cloud-architect.md** : Architecte Cloud multi-provider

**Quand les utiliser** :
- Setup d'infrastructure
- CI/CD pipelines
- Container orchestration
- Cloud migrations
- Database optimization
- Incident response

---

### Testing (14 subagents)

**Path** : `/Users/lounis/Antigravity/Github/PersoDev/library/subagents/testing/`

- **qa-expert.md** : Expert QA (stratégie de test)
- **test-automator.md** : Automatisation de tests
- **security-auditor.md** : Audit de sécurité
- **penetration-tester.md** : Penetration testing
- **performance-engineer.md** : Ingénierie de performance
- **code-reviewer.md** : Review de code
- **debugger.md** : Debugging systématique
- **error-detective.md** : Détective d'erreurs
- **chaos-engineer.md** : Chaos engineering
- **compliance-auditor.md** : Audit de conformité
- **accessibility-tester.md** : Tests d'accessibilité
- **architect-reviewer.md** : Review d'architecture
- **powershell-security-hardening.md** : Hardening sécurité PowerShell
- **ad-security-reviewer.md** : Review sécurité Active Directory

**Quand les utiliser** :
- Test automation setup
- Security audits
- Performance optimization
- Code quality reviews
- Accessibility compliance
- Penetration testing

---

### Data & AI (13 subagents)

**Path** : `/Users/lounis/Antigravity/Github/PersoDev/library/subagents/data-ai/`

- **data-scientist.md** : Data Science (analyse, modélisation)
- **data-engineer.md** : Data Engineering (pipelines, ETL)
- **data-analyst.md** : Analyse de données
- **ml-engineer.md** : Machine Learning Engineering
- **machine-learning-engineer.md** : ML Engineer (variante)
- **mlops-engineer.md** : MLOps (deployment, monitoring)
- **ai-engineer.md** : AI Engineering général
- **llm-architect.md** : Architecture LLM
- **nlp-engineer.md** : Natural Language Processing
- **prompt-engineer.md** : Prompt Engineering
- **database-optimizer.md** : Optimisation de bases de données
- **postgres-pro.md** : Expert PostgreSQL
- **data-platform-architect.md** : Architecture de plateforme data

**Quand les utiliser** :
- Data pipeline design
- ML model development
- LLM integration
- Database optimization
- NLP tasks
- MLOps setup

---

### Workflows (11 subagents)

**Path** : `/Users/lounis/Antigravity/Github/PersoDev/library/subagents/workflows/`

Meta-orchestration et coordination :

- **multi-agent-coordinator.md** : Coordination multi-agents
- **workflow-orchestrator.md** : Orchestration de workflows
- **task-distributor.md** : Distribution de tâches
- **agent-installer.md** : Installation d'agents
- **agent-organizer.md** : Organisation d'agents
- **context-manager.md** : Gestion de contexte
- **knowledge-synthesizer.md** : Synthèse de connaissances
- **error-coordinator.md** : Coordination d'erreurs
- **performance-monitor.md** : Monitoring de performance
- **it-ops-orchestrator.md** : Orchestration IT Ops
- **process-optimizer.md** : Optimisation de processus

**Quand les utiliser** :
- Tâches complexes nécessitant coordination
- Workflows multi-étapes
- Gestion de contexte large
- Orchestration de plusieurs agents

---

## 3. Workflows (11)

**Path** : `/Users/lounis/Antigravity/Github/PersoDev/library/workflows/`

### Planning (4 workflows)

#### `/Users/lounis/Antigravity/Github/PersoDev/library/workflows/planning/manus-style`
- **Objectif** : Système de planification enterprise-grade (96.7% pass rate)
- **Capacités** :
  - Planning files-based
  - Task decomposition
  - Progress tracking
  - Multi-IDE support (.claude, .cursor, .continue, etc.)
- **Structure** : Skills multi-IDE avec templates et scripts
- **Source** : OthmanAdi/planning-with-files
- **Cas d'usage** :
  - "Plan this marketplace project using Manus methodology"
  - "Create detailed execution plan for migration"

#### `/Users/lounis/Antigravity/Github/PersoDev/library/workflows/planning/brainstorming`
- **Objectif** : Techniques de brainstorming structuré
- **Cas d'usage** : Génération d'idées, exploration créative

#### `/Users/lounis/Antigravity/Github/PersoDev/library/workflows/planning/executing-plans`
- **Objectif** : Exécution méthodique de plans établis
- **Cas d'usage** : Suivi et exécution de roadmaps

#### `/Users/lounis/Antigravity/Github/PersoDev/library/workflows/planning/writing-plans`
- **Objectif** : Rédaction de plans détaillés
- **Cas d'usage** : Documentation de stratégies

---

### Git Strategies (2 workflows)

#### `/Users/lounis/Antigravity/Github/PersoDev/library/workflows/git-strategies/finishing-a-development-branch`
- **Objectif** : Finaliser proprement une branche de développement
- **Étapes** : Cleanup, review, merge strategy
- **Cas d'usage** :
  - "Finish this feature branch properly"
  - "Prepare branch for PR"

#### `/Users/lounis/Antigravity/Github/PersoDev/library/workflows/git-strategies/using-git-worktrees`
- **Objectif** : Utilisation avancée de git worktrees
- **Cas d'usage** :
  - "Set up worktrees for parallel development"
  - "Work on multiple branches simultaneously"

---

### Code Review (2 workflows)

#### `/Users/lounis/Antigravity/Github/PersoDev/library/workflows/code-review/receiving-code-review`
- **Objectif** : Recevoir et intégrer feedback de code review
- **Cas d'usage** : Processus de review du côté reviewé

#### `/Users/lounis/Antigravity/Github/PersoDev/library/workflows/code-review/requesting-code-review`
- **Objectif** : Demander efficacement une code review
- **Cas d'usage** : Préparation et demande de review

---

### Debugging (2 workflows)

#### `/Users/lounis/Antigravity/Github/PersoDev/library/workflows/debugging/systematic-debugging`
- **Objectif** : Approche systématique du debugging
- **Méthodologie** : Reproduce → Isolate → Fix → Verify
- **Cas d'usage** :
  - "Debug this intermittent issue systematically"
  - "Find root cause of production bug"

#### `/Users/lounis/Antigravity/Github/PersoDev/library/workflows/debugging/test-driven-development`
- **Objectif** : TDD methodology (Red → Green → Refactor)
- **Cas d'usage** :
  - "Implement this feature using TDD"
  - "Write tests first for this module"

---

### Autres Workflows

#### `/Users/lounis/Antigravity/Github/PersoDev/library/workflows/dispatching-parallel-agents`
- **Objectif** : Dispatch de tâches vers agents parallèles
- **Cas d'usage** : Coordination multi-agents

#### `/Users/lounis/Antigravity/Github/PersoDev/library/workflows/subagent-driven-development`
- **Objectif** : Développement piloté par subagents
- **Cas d'usage** : Orchestration de développement

#### `/Users/lounis/Antigravity/Github/PersoDev/library/workflows/using-superpowers`
- **Objectif** : Utilisation des superpowers (obra/superpowers)
- **Cas d'usage** : Workflows avancés

#### `/Users/lounis/Antigravity/Github/PersoDev/library/workflows/verification-before-completion`
- **Objectif** : Vérification avant finalisation
- **Cas d'usage** : QA final

#### `/Users/lounis/Antigravity/Github/PersoDev/library/workflows/writing-skills`
- **Objectif** : Écriture de nouvelles skills
- **Structure** : Examples + templates
- **Cas d'usage** : Création de skills custom

---

## 4. Generators (3)

### Prompts

#### `/Users/lounis/Antigravity/Github/PersoDev/library/generators/prompts/intelligent-generator`
- **Objectif** : Génération intelligente de prompts avec framework YAML
- **Capacités** :
  - Domain classification
  - Prompt analysis et extraction
  - Generation multi-domaines (product, art, design, video)
  - Universal learning
- **Structure** :
```
intelligent-generator/
├── .claude/skills/
│   ├── domain-classifier/
│   ├── prompt-analyzer/
│   ├── prompt-extractor/
│   ├── prompt-generator/
│   ├── prompt-master/
│   ├── prompt-xray/
│   ├── art-master/
│   ├── design-master/
│   ├── product-master/
│   ├── video-master/
│   └── universal-learner/
├── core/
├── design-logic/
├── knowledge_base/
└── variables/
```
- **Domaines** :
  - Product : Landing pages, features, apps
  - Art : Generative art, algorithmic art
  - Design : Visual design, posters
  - Video : Scripts, storyboards
- **Cas d'usage** :
  - "Generate a skill prompt for API documentation"
  - "Create product description for landing page"
  - "Generate art prompt for generative algorithm"
- **Source** : huangserva/skill-prompt-generator

---

### UI Components

#### `/Users/lounis/Antigravity/Github/PersoDev/library/generators/ui-components/ui-ux-pro`
- **Objectif** : Génération professionnelle d'UI/UX avec CLI
- **Capacités** :
  - UI components generation
  - UX patterns
  - Multi-stack support
  - Professional templates
- **Structure** :
```
ui-ux-pro/
├── .claude/skills/ui-ux-pro-max/
│   ├── data/stacks/
│   └── scripts/
└── cli/ (outil ligne de commande)
```
- **Stacks supportés** : React, Vue, Angular, etc.
- **Cas d'usage** :
  - "Generate dashboard UI components"
  - "Create form with validation UX"
  - "Build navigation component"
- **Source** : nextlevelbuilder/ui-ux-pro-max-skill

---

### Templates

#### `/Users/lounis/Antigravity/Github/PersoDev/library/generators/templates/skill-templates`
- **Objectif** : Templates pour créer de nouvelles skills
- **Structure** :
```
skill-templates/
└── examples/
```
- **Cas d'usage** :
  - "Create a new skill from template"
  - "Bootstrap skill structure"
- **Utilisation** : Utilisé par skill-creator

---

## 5. Resources (6 repos sources)

**Path** : `/Users/lounis/Antigravity/Github/PersoDev/resources/`

### skills
- **Source** : anthropics/skills
- **License** : Apache 2.0 / Source-available
- **Contenu** : Skills officiels Anthropic
- **Path** : `resources/skills/`
- **Usage** : Source pour library/skills

### awesome-subagents
- **Source** : VoltAgent/awesome-claude-code-subagents
- **Contenu** : 127+ subagents communautaires
- **Path** : `resources/awesome-subagents/`
- **Categories** :
  - 01-languages
  - 02-frameworks
  - 03-infrastructure
  - 04-quality-security
  - 05-data-ai
  - 06-product-design
  - 07-business-ops
  - 08-specialized-domains
  - 09-meta-orchestration
- **Tools** : Subagent catalog (search, list, fetch)
- **Usage** : Source pour library/subagents

### planning-system
- **Source** : OthmanAdi/planning-with-files
- **Contenu** : Manus-style planning (96.7% pass rate)
- **Path** : `resources/planning-system/`
- **Multi-IDE** : Support pour .claude, .cursor, .continue, .gemini, etc.
- **Usage** : Source pour library/workflows/planning/manus-style

### prompt-generator
- **Source** : huangserva/skill-prompt-generator
- **Contenu** : Intelligent prompt generation avec YAML
- **Path** : `resources/prompt-generator/`
- **Structure** :
  - core/ : Framework YAML
  - design-logic/ : Patterns de design
  - knowledge_base/ : Base de connaissances
- **Usage** : Source pour library/generators/prompts/intelligent-generator

### ui-ux-tools
- **Source** : nextlevelbuilder/ui-ux-pro-max-skill
- **Contenu** : Professional UI/UX generation
- **Path** : `resources/ui-ux-tools/`
- **Components** :
  - CLI tool
  - Skill templates
  - Stack configurations
- **Usage** : Source pour library/generators/ui-components/ui-ux-pro

### superpowers
- **Source** : obra/superpowers
- **Contenu** : Advanced development workflows
- **Path** : `resources/superpowers/`
- **Structure** :
  - agents/ : Agent definitions
  - commands/ : Custom commands
  - skills/ : Advanced skills
  - hooks/ : Git hooks
- **Usage** : Source pour library/workflows/using-superpowers

---

## 6. Templates (12)

**Path** : `/Users/lounis/Antigravity/Github/PersoDev/templates/`

### Web Apps (2 templates)

#### github-web-apps/nextjs-boilerplate
- **Stack** : Next.js + TypeScript + Tailwind
- **Features** : SSR, API routes, auth
- **Files** : README.md, AGENTS.md, CLAUDE.md
- **Usage** :
  - "Bootstrap Next.js project with best practices"
  - "Start web app with TypeScript"

#### github-web-apps/saas-boilerplate
- **Stack** : Full-stack SaaS template
- **Features** : Auth, billing, multi-tenant
- **Usage** :
  - "Start SaaS application"
  - "Multi-tenant platform template"

---

### API (3 templates)

#### github-api/fastapi-backend
- **Stack** : FastAPI + Python
- **Features** : Async, OpenAPI, auth
- **Structure** : backend/ + docs
- **Usage** :
  - "Create FastAPI backend"
  - "Build REST API with Python"

#### github-api/fastapi-fullstack
- **Stack** : FastAPI + React fullstack
- **Features** : Backend + Frontend + deployment
- **Docs** : deployment.md, development.md, SECURITY.md
- **Usage** :
  - "Full-stack application template"
  - "API + frontend together"

#### github-api/node-express-boilerplate
- **Stack** : Express.js + Node
- **Features** : REST API, middleware, testing
- **Docs** : CONTRIBUTING.md, CHANGELOG.md
- **Usage** :
  - "Node.js API server"
  - "Express backend template"

---

### Mobile (2 templates)

#### github-mobile/react-native-boilerplate
- **Stack** : React Native
- **Features** : Navigation, state management
- **Usage** :
  - "Mobile app with React Native"
  - "Cross-platform mobile"

#### github-mobile/react-native-obytes
- **Stack** : React Native (Obytes variant)
- **Features** : Enhanced boilerplate
- **Usage** : Alternative React Native setup

---

### SaaS (3 templates)

#### github-saas/open-saas
- **Stack** : Open-source SaaS template
- **Features** : Auth, payments, blog
- **Structure** : app/, blog/, tools/
- **Special** : .cursor/example-prompts.md
- **Usage** :
  - "Open-source SaaS starter"
  - "Full SaaS with blog"

#### github-saas/nextjs-saas-starter
- **Stack** : Next.js SaaS
- **Features** : Stripe, auth, dashboards
- **Usage** : Next.js-specific SaaS

#### github-saas/boxyhq-saas
- **Stack** : Enterprise SaaS (BoxyHQ)
- **Features** : SSO, audit logs, security
- **Usage** : Enterprise-grade SaaS

---

### Data Science (2 templates)

#### github-data-science/cookiecutter-ds
- **Stack** : Data Science project structure
- **Features** : Best practices, reproducibility
- **Docs** : Extensive mkdocs documentation
- **Topics** :
  - Using the template
  - Opinions and philosophy
  - Related projects
- **Usage** :
  - "Data science project setup"
  - "ML project structure"

#### github-data-science/equinor-ds
- **Stack** : Equinor Data Science template
- **Features** : Corporate DS standards
- **Docs** : Code of conduct, process documentation
- **Usage** : Enterprise DS projects

---

## Index alphabétique

- accessibility-tester → testing/accessibility-tester.md
- ad-security-reviewer → testing/ad-security-reviewer.md
- agent-installer → workflows/agent-installer.md
- agent-organizer → workflows/agent-organizer.md
- ai-engineer → data-ai/ai-engineer.md
- algorithmic-art → skills/design/algorithmic-art
- angular-architect → languages/angular-architect.md
- architect-reviewer → testing/architect-reviewer.md
- awesome-subagents → resources/awesome-subagents
- boxyhq-saas → templates/github-saas/boxyhq-saas
- brainstorming → workflows/planning/brainstorming
- brand-guidelines → skills/communication/brand-guidelines
- canvas-design → skills/design/canvas-design
- chaos-engineer → testing/chaos-engineer.md
- claude-api → skills/development/claude-api
- code-reviewer → testing/code-reviewer.md
- compliance-auditor → testing/compliance-auditor.md
- context-manager → workflows/context-manager.md
- cookiecutter-ds → templates/github-data-science/cookiecutter-ds
- cpp-pro → languages/cpp-pro.md
- csharp-developer → languages/csharp-developer.md
- data-analyst → data-ai/data-analyst.md
- data-engineer → data-ai/data-engineer.md
- data-scientist → data-ai/data-scientist.md
- database-administrator → infrastructure/database-administrator.md
- database-optimizer → data-ai/database-optimizer.md
- debugger → testing/debugger.md
- devops-engineer → infrastructure/devops-engineer.md
- devops-incident-responder → infrastructure/devops-incident-responder.md
- dispatching-parallel-agents → workflows/dispatching-parallel-agents
- django-developer → languages/django-developer.md
- doc-coauthoring → skills/communication/doc-coauthoring
- docker-expert → infrastructure/docker-expert.md
- docx → skills/documents/docx
- dotnet-core-expert → languages/dotnet-core-expert.md
- dotnet-framework-4.8-expert → languages/dotnet-framework-4.8-expert.md
- elixir-expert → languages/elixir-expert.md
- equinor-ds → templates/github-data-science/equinor-ds
- error-coordinator → workflows/error-coordinator.md
- error-detective → testing/error-detective.md
- executing-plans → workflows/planning/executing-plans
- fastapi-backend → templates/github-api/fastapi-backend
- fastapi-fullstack → templates/github-api/fastapi-fullstack
- finishing-a-development-branch → workflows/git-strategies/finishing-a-development-branch
- flutter-expert → languages/flutter-expert.md
- frontend-design → skills/design/frontend-design
- golang-pro → languages/golang-pro.md
- intelligent-generator → generators/prompts/intelligent-generator
- internal-comms → skills/communication/internal-comms
- it-ops-orchestrator → workflows/it-ops-orchestrator.md
- java-architect → languages/java-architect.md
- javascript-pro → languages/javascript-pro.md
- knowledge-synthesizer → workflows/knowledge-synthesizer.md
- kotlin-specialist → languages/kotlin-specialist.md
- laravel-specialist → languages/laravel-specialist.md
- llm-architect → data-ai/llm-architect.md
- machine-learning-engineer → data-ai/machine-learning-engineer.md
- manus-style → workflows/planning/manus-style
- mcp-builder → skills/development/mcp-builder
- ml-engineer → data-ai/ml-engineer.md
- mlops-engineer → data-ai/mlops-engineer.md
- multi-agent-coordinator → workflows/multi-agent-coordinator.md
- nextjs-boilerplate → templates/github-web-apps/nextjs-boilerplate
- nextjs-developer → languages/nextjs-developer.md
- nextjs-saas-starter → templates/github-saas/nextjs-saas-starter
- nlp-engineer → data-ai/nlp-engineer.md
- node-express-boilerplate → templates/github-api/node-express-boilerplate
- open-saas → templates/github-saas/open-saas
- pdf → skills/documents/pdf
- penetration-tester → testing/penetration-tester.md
- performance-engineer → testing/performance-engineer.md
- performance-monitor → workflows/performance-monitor.md
- php-pro → languages/php-pro.md
- planning-system → resources/planning-system
- platform-engineer → infrastructure/platform-engineer.md
- postgres-pro → data-ai/postgres-pro.md
- powershell-5.1-expert → languages/powershell-5.1-expert.md
- powershell-7-expert → languages/powershell-7-expert.md
- powershell-security-hardening → testing/powershell-security-hardening.md
- pptx → skills/documents/pptx
- prompt-engineer → data-ai/prompt-engineer.md
- prompt-generator → resources/prompt-generator
- python-pro → languages/python-pro.md
- qa-expert → testing/qa-expert.md
- rails-expert → languages/rails-expert.md
- react-native-boilerplate → templates/github-mobile/react-native-boilerplate
- react-native-obytes → templates/github-mobile/react-native-obytes
- react-specialist → languages/react-specialist.md
- receiving-code-review → workflows/code-review/receiving-code-review
- requesting-code-review → workflows/code-review/requesting-code-review
- rust-engineer → languages/rust-engineer.md
- saas-boilerplate → templates/github-web-apps/saas-boilerplate
- security-auditor → testing/security-auditor.md
- skill-creator → skills/development/skill-creator
- skill-templates → generators/templates/skill-templates
- skills → resources/skills
- slack-gif-creator → skills/communication/slack-gif-creator
- spring-boot-engineer → languages/spring-boot-engineer.md
- sql-pro → languages/sql-pro.md
- sre-engineer → infrastructure/sre-engineer.md
- subagent-driven-development → workflows/subagent-driven-development
- superpowers → resources/superpowers
- swift-expert → languages/swift-expert.md
- systematic-debugging → workflows/debugging/systematic-debugging
- task-distributor → workflows/task-distributor.md
- test-automator → testing/test-automator.md
- test-driven-development → workflows/debugging/test-driven-development
- terraform-expert → infrastructure/terraform-expert.md
- terragrunt-expert → infrastructure/terragrunt-expert.md
- theme-factory → skills/design/theme-factory
- typescript-pro → languages/typescript-pro.md
- ui-ux-pro → generators/ui-components/ui-ux-pro
- ui-ux-tools → resources/ui-ux-tools
- using-git-worktrees → workflows/git-strategies/using-git-worktrees
- using-superpowers → workflows/using-superpowers
- verification-before-completion → workflows/verification-before-completion
- web-artifacts-builder → skills/development/web-artifacts-builder
- webapp-testing → skills/development/webapp-testing
- workflow-orchestrator → workflows/workflow-orchestrator.md
- writing-plans → workflows/planning/writing-plans
- writing-skills → workflows/writing-skills
- xlsx → skills/documents/xlsx

---

## Index par cas d'usage

### Développement Web

**Frontend**
- Skills : frontend-design, web-artifacts-builder, theme-factory
- Subagents : react-specialist, nextjs-developer, angular-architect, typescript-pro, javascript-pro
- Templates : nextjs-boilerplate, saas-boilerplate, open-saas
- Generators : ui-ux-pro

**Backend**
- Skills : claude-api, mcp-builder
- Subagents : python-pro, nodejs-expert, golang-pro, java-architect
- Templates : fastapi-backend, fastapi-fullstack, node-express-boilerplate

**Full-Stack**
- Templates : fastapi-fullstack, nextjs-saas-starter, boxyhq-saas
- Workflows : subagent-driven-development

---

### Documentation & Communication

**Documents**
- Skills : pdf, docx, pptx, xlsx
- Workflows : writing-plans

**Communication**
- Skills : internal-comms, doc-coauthoring, brand-guidelines, slack-gif-creator

---

### Data & IA/ML

**Data Science**
- Subagents : data-scientist, data-engineer, data-analyst
- Templates : cookiecutter-ds, equinor-ds
- Skills : xlsx (pour analyse)

**Machine Learning**
- Subagents : ml-engineer, mlops-engineer, ai-engineer
- Workflows : systematic-debugging (pour ML debugging)

**LLM & NLP**
- Subagents : llm-architect, nlp-engineer, prompt-engineer
- Skills : mcp-builder (pour LLM integration), claude-api

**Databases**
- Subagents : database-administrator, database-optimizer, postgres-pro, sql-pro

---

### Infrastructure & DevOps

**Container & Orchestration**
- Subagents : docker-expert, kubernetes-expert, platform-engineer

**IaC**
- Subagents : terraform-expert, terragrunt-expert

**Cloud**
- Subagents : aws-architect, azure-infra-engineer, gcp-specialist

**Operations**
- Subagents : devops-engineer, sre-engineer, devops-incident-responder
- Workflows : it-ops-orchestrator

---

### Testing & Quality

**Testing**
- Skills : webapp-testing
- Subagents : qa-expert, test-automator, performance-engineer
- Workflows : test-driven-development

**Security**
- Subagents : security-auditor, penetration-tester, powershell-security-hardening, ad-security-reviewer

**Code Quality**
- Subagents : code-reviewer, architect-reviewer, debugger, error-detective
- Workflows : receiving-code-review, requesting-code-review, systematic-debugging

**Compliance**
- Subagents : compliance-auditor, accessibility-tester

---

### Design & Art

**Visual Design**
- Skills : canvas-design, frontend-design, theme-factory
- Generators : ui-ux-pro

**Generative Art**
- Skills : algorithmic-art
- Generators : intelligent-generator (art-master)

**Presentations**
- Skills : pptx
- Workflows : theme-factory

---

### Mobile Development

**Cross-Platform**
- Subagents : flutter-expert, react-native-expert
- Templates : react-native-boilerplate, react-native-obytes

**Native**
- Subagents : swift-expert (iOS), kotlin-specialist (Android)

---

### Planning & Workflows

**Project Planning**
- Workflows : manus-style, brainstorming, executing-plans, writing-plans

**Git Workflows**
- Workflows : finishing-a-development-branch, using-git-worktrees

**Meta-Orchestration**
- Subagents : multi-agent-coordinator, workflow-orchestrator, task-distributor
- Workflows : dispatching-parallel-agents, subagent-driven-development

---

### Skill Development

**Creating Skills**
- Skills : skill-creator
- Generators : skill-templates, intelligent-generator (prompt-master)
- Workflows : writing-skills

**MCP Servers**
- Skills : mcp-builder

---

### Languages spécifiques

**Python** : python-pro, django-developer
**JavaScript/TypeScript** : javascript-pro, typescript-pro, react-specialist, nextjs-developer
**Java/Kotlin** : java-architect, kotlin-specialist, spring-boot-engineer
**C/C++/Rust** : cpp-pro, rust-engineer
**Go** : golang-pro
**C#/.NET** : csharp-developer, dotnet-core-expert, dotnet-framework-4.8-expert
**PHP** : php-pro, laravel-specialist
**Ruby** : rails-expert
**Swift** : swift-expert
**Elixir** : elixir-expert
**PowerShell** : powershell-5.1-expert, powershell-7-expert

---

## Guide d'utilisation rapide

### Pour démarrer un nouveau projet

1. **Choisir un template** : `templates/github-*/`
2. **Créer dans projects/** : `mkdir projects/mon-projet`
3. **Référencer les ressources** : `../../library/...`
4. **Appliquer workflows** : `library/workflows/planning/manus-style`

### Pour une tâche spécifique

1. **Consulter l'index par cas d'usage** (ci-dessus)
2. **Identifier le skill ou subagent approprié**
3. **Lire le fichier SKILL.md ou README.md**
4. **Suivre les exemples fournis**

### Pour optimiser un workflow

1. **Combiner plusieurs ressources** :
   - Skill pour la tâche principale
   - Subagent pour expertise spécifique
   - Workflow pour méthodologie
2. **Exemple** :
   - Skill : `mcp-builder` (tâche)
   - Subagent : `typescript-pro` (expertise)
   - Workflow : `systematic-debugging` (méthodologie)

### Pour mettre à jour les sources

```bash
cd /Users/lounis/Antigravity/Github/PersoDev/resources/<repo-name>
git pull origin main
cd ../..
# Copy relevant updates to library/ if needed
```

---

## Ressources les plus utiles par type de projet

### Projet SaaS
- **Templates** : open-saas, nextjs-saas-starter, boxyhq-saas
- **Skills** : web-artifacts-builder, frontend-design
- **Subagents** : react-specialist, nextjs-developer, postgres-pro
- **Workflows** : manus-style (planning), test-driven-development

### Projet Data Science
- **Templates** : cookiecutter-ds, equinor-ds
- **Skills** : xlsx, pdf (rapports)
- **Subagents** : data-scientist, ml-engineer, python-pro
- **Workflows** : systematic-debugging, writing-plans

### Projet API Backend
- **Templates** : fastapi-backend, node-express-boilerplate
- **Skills** : mcp-builder, claude-api
- **Subagents** : python-pro, golang-pro, database-optimizer
- **Workflows** : test-driven-development, requesting-code-review

### Création de Skills Custom
- **Skills** : skill-creator
- **Generators** : skill-templates, intelligent-generator
- **Workflows** : writing-skills
- **Resources** : skills (examples officiels)

### Infrastructure & DevOps
- **Subagents** : devops-engineer, docker-expert, terraform-expert
- **Workflows** : it-ops-orchestrator, verification-before-completion

---

## Notes importantes

### Licensing
- **skills** : Apache 2.0 / Source-available (Anthropic)
- **awesome-subagents** : Community (vérifier licenses individuelles)
- **Autres resources** : Vérifier repos individuels

### Maintenance
- **resources/** : Read-only, git-managed
- **library/** : Curated, peut être modifié
- **projects/** : Développement actif
- Mettre à jour sources régulièrement

### Best Practices
1. Toujours lire SKILL.md ou README.md avant utilisation
2. Combiner skills + subagents + workflows pour tâches complexes
3. Référencer library/ plutôt que resources/ dans projets
4. Documenter customizations dans project README

---

**Dernière mise à jour** : 2026-03-09
**Version** : 1.0.0
**Total ressources indexées** : 120+
