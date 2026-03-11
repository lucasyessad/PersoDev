import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, getRateLimitIdentifier, analyticsRateLimiter } from "@/lib/ratelimit";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Route API : Enregistrer une vue d'annonce pour les analytics */
export async function POST(request: NextRequest) {
  try {
    const identifier = getRateLimitIdentifier(request);
    const { success: allowed } = await checkRateLimit(identifier, analyticsRateLimiter);
    if (!allowed) {
      return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
    }

    const { listing_id, agent_id } = await request.json();

    if (!listing_id || !agent_id) {
      return NextResponse.json(
        { error: "listing_id et agent_id sont requis" },
        { status: 400 }
      );
    }

    // Valider les UUIDs pour éviter les injections
    if (!UUID_REGEX.test(listing_id) || !UUID_REGEX.test(agent_id)) {
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Enregistrer la vue
    const { error } = await supabase.from("analytics_vues").insert({
      listing_id,
      agent_id,
      source: request.headers.get("referer") || "direct",
      user_agent: request.headers.get("user-agent") || "",
    });

    if (error) {
      console.error("Erreur enregistrement vue:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur analytics vue:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement" },
      { status: 500 }
    );
  }
}
