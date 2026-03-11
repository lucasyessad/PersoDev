"use client";

import { useEffect, useState } from "react";
import { OnboardingWizard } from "./OnboardingWizard";

interface OnboardingState {
  is_completed: boolean;
  profile_completed: boolean;
  first_listing_created: boolean;
  branding_customized: boolean;
  current_step: number;
}

/**
 * OnboardingProvider - Gère l'affichage automatique de l'onboarding
 *
 * Ce composant vérifie si l'utilisateur doit voir l'onboarding
 * et l'affiche automatiquement si nécessaire.
 */
export function OnboardingProvider() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingState, setOnboardingState] = useState<OnboardingState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const response = await fetch("/api/onboarding/status");
        if (response.ok) {
          const state: OnboardingState = await response.json();
          setOnboardingState(state);

          // Afficher l'onboarding si pas complété
          // ET si l'utilisateur n'a pas déjà vu l'onboarding aujourd'hui
          const hasSeenToday = localStorage.getItem("onboarding_seen_today");
          const today = new Date().toDateString();

          if (!state.is_completed && hasSeenToday !== today) {
            setShowOnboarding(true);
            localStorage.setItem("onboarding_seen_today", today);
          }
        }
      } catch (error) {
        console.error("Failed to fetch onboarding status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleClose = () => {
    setShowOnboarding(false);
  };

  if (loading || !onboardingState) {
    return null;
  }

  return (
    <OnboardingWizard
      isOpen={showOnboarding}
      onClose={handleClose}
      profileComplete={onboardingState.profile_completed}
      hasListings={onboardingState.first_listing_created}
      hasBranding={onboardingState.branding_customized}
    />
  );
}
