import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/onboarding/status
 * Récupère l'état de l'onboarding pour l'utilisateur connecté
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Récupérer l'état d'onboarding
    const { data: onboardingState, error: stateError } = await supabase
      .from("onboarding_state")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (stateError) {
      // Si pas d'état, créer un nouveau
      if (stateError.code === "PGRST116") {
        const { data: newState, error: insertError } = await supabase
          .from("onboarding_state")
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) {
          console.error("Error creating onboarding state:", insertError);
          return NextResponse.json(
            { error: "Failed to create onboarding state" },
            { status: 500 }
          );
        }

        return NextResponse.json(newState);
      }

      console.error("Error fetching onboarding state:", stateError);
      return NextResponse.json(
        { error: "Failed to fetch onboarding state" },
        { status: 500 }
      );
    }

    // Vérifier les états de completion des étapes
    // (Ces vérifications pourraient être faites côté serveur pour plus de précision)

    // Vérifier si le profil est complet
    const { data: profile } = await supabase
      .from("profiles")
      .select("nom_agence, slug_url, description, logo_url")
      .eq("id", user.id)
      .single();

    const profileComplete = !!(
      profile?.nom_agence &&
      profile?.slug_url &&
      profile?.description
    );

    // Vérifier si au moins une annonce existe
    const { count: listingsCount } = await supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("agent_id", user.id);

    const hasListings = (listingsCount ?? 0) > 0;

    // Vérifier si le branding est personnalisé
    const { data: branding } = await supabase
      .from("site_customization")
      .select("*")
      .eq("agent_id", user.id)
      .single();

    const hasBranding = !!(
      branding?.couleur_principale ||
      branding?.banniere_url
    );

    // Mettre à jour l'état avec les valeurs actuelles
    const { data: updatedState, error: updateError } = await supabase
      .from("onboarding_state")
      .update({
        profile_completed: profileComplete,
        first_listing_created: hasListings,
        branding_customized: hasBranding,
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating onboarding state:", updateError);
      // Continue avec l'état existant même si la mise à jour échoue
      return NextResponse.json({
        ...onboardingState,
        profile_completed: profileComplete,
        first_listing_created: hasListings,
        branding_customized: hasBranding,
      });
    }

    return NextResponse.json(updatedState);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
