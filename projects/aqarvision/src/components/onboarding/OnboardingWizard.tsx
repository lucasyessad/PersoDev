"use client";

import { useState } from "react";
import { X, Check, ArrowRight, ArrowLeft, Building2, FileText, Image, Globe, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

/**
 * OnboardingWizard - Guide en 5 étapes pour les nouvelles agences
 *
 * Étapes:
 * 1. Bienvenue
 * 2. Compléter le profil agence
 * 3. Créer la première annonce
 * 4. Personnaliser le mini-site
 * 5. Prêt à démarrer !
 */

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  profileComplete?: boolean;
  hasListings?: boolean;
  hasBranding?: boolean;
}

const STEPS = [
  {
    id: 1,
    title: "Bienvenue sur AqarVision",
    description: "Prêt à transformer votre agence immobilière ?",
    icon: Building2,
    content: (
      <div className="space-y-4">
        <p className="text-body text-muted-foreground">
          Bienvenue dans la plateforme qui va révolutionner votre activité immobilière en Algérie.
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Gestion simplifiée</p>
              <p className="text-caption text-muted-foreground">
                Gérez toutes vos annonces depuis un seul dashboard
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Mini-site professionnel</p>
              <p className="text-caption text-muted-foreground">
                Votre vitrine en ligne personnalisée
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Leads qualifiés</p>
              <p className="text-caption text-muted-foreground">
                Recevez des contacts de clients potentiels
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Complétez votre profil",
    description: "Présentez votre agence de manière professionnelle",
    icon: Building2,
    action: { label: "Compléter mon profil", href: "/dashboard/profil" },
    content: (
      <div className="space-y-4">
        <p className="text-body text-muted-foreground">
          Un profil complet inspire confiance et attire plus de clients.
        </p>
        <div className="glass-card rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
            <span className="text-body-sm text-foreground">Logo de l&apos;agence</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
            <span className="text-body-sm text-foreground">Description détaillée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
            <span className="text-body-sm text-foreground">Coordonnées complètes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
            <span className="text-body-sm text-foreground">Horaires d&apos;ouverture</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Créez votre première annonce",
    description: "Publiez un bien et commencez à générer des leads",
    icon: FileText,
    action: { label: "Créer une annonce", href: "/dashboard/annonces/nouvelle" },
    content: (
      <div className="space-y-4">
        <p className="text-body text-muted-foreground">
          Publiez votre premier bien immobilier en quelques minutes.
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-caption font-bold text-primary">1</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Informations de base</p>
              <p className="text-caption text-muted-foreground">
                Type, prix, localisation
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-caption font-bold text-primary">2</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Caractéristiques</p>
              <p className="text-caption text-muted-foreground">
                Surface, pièces, équipements
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-caption font-bold text-primary">3</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Photos</p>
              <p className="text-caption text-muted-foreground">
                Upload jusqu&apos;à 20 photos HD
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Personnalisez votre mini-site",
    description: "Créez votre vitrine en ligne unique",
    icon: Globe,
    action: { label: "Personnaliser", href: "/dashboard/branding" },
    content: (
      <div className="space-y-4">
        <p className="text-body text-muted-foreground">
          Votre mini-site est déjà en ligne ! Personnalisez-le pour refléter votre identité.
        </p>
        <div className="glass-card rounded-xl border border-border p-4 bg-muted/30">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-caption font-medium text-foreground">
              Votre URL : aqarvision.dz/votre-agence
            </span>
          </div>
          <div className="space-y-2 text-caption text-muted-foreground">
            <p>• Couleurs et logo</p>
            <p>• Bannière personnalisée</p>
            <p>• Liens réseaux sociaux</p>
            <p>• Informations de contact</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "Vous êtes prêt !",
    description: "Commencez à recevoir des contacts",
    icon: Rocket,
    content: (
      <div className="space-y-4">
        <p className="text-body text-muted-foreground">
          Félicitations ! Vous avez configuré votre espace AqarVision.
        </p>
        <div className="glass-card rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
          <p className="font-medium text-foreground">Prochaines étapes :</p>
          <ul className="space-y-2 text-body-sm text-muted-foreground">
            <li>✓ Publiez plus d&apos;annonces</li>
            <li>✓ Partagez votre mini-site</li>
            <li>✓ Gérez vos leads</li>
            <li>✓ Consultez vos statistiques</li>
          </ul>
        </div>
        <div className="bg-muted/30 rounded-xl p-4 border border-border">
          <p className="text-caption text-muted-foreground mb-2">
            💡 <span className="font-medium text-foreground">Astuce :</span>
          </p>
          <p className="text-caption text-muted-foreground">
            Plus vous publiez d&apos;annonces régulièrement, plus vous apparaissez dans les recherches et attirez de clients !
          </p>
        </div>
      </div>
    ),
  },
];

export function OnboardingWizard({
  isOpen,
  onClose,
  profileComplete = false,
  hasListings = false,
  hasBranding = false,
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // Marquer l'onboarding comme complété
    try {
      await fetch("/api/onboarding/complete", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
    onClose();
  };

  const handleAction = (href: string) => {
    onClose();
    router.push(href);
  };

  const step = STEPS[currentStep];
  const Icon = step.icon;

  // Déterminer si l'étape est complétée
  const isStepCompleted = (stepId: number) => {
    if (stepId === 2) return profileComplete;
    if (stepId === 3) return hasListings;
    if (stepId === 4) return hasBranding;
    return stepId < currentStep + 1;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="relative">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-vitrine text-body font-semibold text-foreground">
                    {step.title}
                  </h2>
                  <p className="text-caption text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress indicator */}
            <div className="flex gap-2">
              {STEPS.map((s, index) => (
                <div
                  key={s.id}
                  className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted"
                >
                  <div
                    className={`h-full transition-all duration-300 ${
                      isStepCompleted(s.id) || index === currentStep
                        ? "bg-primary"
                        : "bg-transparent"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {step.content}
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-border flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>

            <div className="flex gap-2">
              {step.action ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                  >
                    Passer
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAction(step.action!.href)}
                  >
                    {step.action.label}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={handleNext}>
                  {currentStep === STEPS.length - 1 ? "Commencer" : "Suivant"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
