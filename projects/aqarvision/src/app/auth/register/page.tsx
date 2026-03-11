"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WILAYAS } from "@/lib/wilayas";
import { slugify } from "@/lib/utils";

/** Page d'inscription moderne */
export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nom_agence: "",
    email: "",
    password: "",
    telephone: "",
    wilaya_id: "",
  });

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur(null);

    // Validation côté client
    if (!formData.nom_agence.trim()) {
      setErreur("Le nom de l'agence est requis.");
      setLoading(false);
      return;
    }

    if (!formData.email.includes("@")) {
      setErreur("Veuillez saisir une adresse email valide.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setErreur("Le mot de passe doit contenir au moins 6 caractères.");
      setLoading(false);
      return;
    }

    if (!formData.wilaya_id) {
      setErreur("Veuillez sélectionner une wilaya.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nom_agence: formData.nom_agence,
            telephone: formData.telephone,
            slug: slugify(formData.nom_agence),
            wilaya_id: parseInt(formData.wilaya_id),
          },
        },
      });

      if (error) {
        console.error("Erreur inscription:", error);

        if (error.message.includes("already registered") || error.message.includes("already exists")) {
          setErreur("Cette adresse email est déjà utilisée. Essayez de vous connecter ou utilisez une autre adresse.");
        } else if (error.message.includes("Database error")) {
          setErreur("Erreur de base de données. Veuillez réessayer ou contacter le support.");
        } else if (error.message.includes("Password")) {
          setErreur("Le mot de passe doit contenir au moins 6 caractères avec des lettres et chiffres.");
        } else if (error.message.includes("Invalid")) {
          setErreur("Les informations saisies ne sont pas valides. Vérifiez votre email et mot de passe.");
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          setErreur("Impossible de se connecter au serveur. Vérifiez votre connexion internet.");
        } else {
          setErreur(`Erreur lors de l'inscription: ${error.message}`);
        }
        setLoading(false);
        return;
      }

      // Vérifier si une session a été créée (pas de confirmation email requise)
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        // Email de confirmation envoyé
        setSuccess(true);
        setLoading(false);
      }
    } catch (err) {
      console.error("Erreur inattendue:", err);
      setErreur("Impossible de se connecter au serveur. Vérifiez votre connexion internet.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blanc-casse px-4 py-8 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-or/[0.04] to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-bleu-nuit/[0.02] rounded-full blur-[120px]" />
        </div>
        <div className="w-full max-w-md animate-fade-in-up relative z-10">
          <div className="glass-card rounded-2xl border border-border shadow-card p-8">
            <div className="flex justify-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <div className="w-8 h-8 bg-bleu-nuit rounded-lg flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-foreground">AqarVision</span>
              </Link>
            </div>
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-lg font-semibold text-foreground">
                Inscription réussie !
              </h2>
              <p className="text-body-sm text-muted-foreground">
                Un email de confirmation a été envoyé à{" "}
                <span className="font-medium text-foreground">{formData.email}</span>.
                <br />
                Cliquez sur le lien dans l&apos;email pour activer votre compte.
              </p>
              <p className="text-xs text-muted-foreground">
                Vous ne trouvez pas l&apos;email ? Vérifiez vos spams.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blanc-casse px-4 py-8 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-or/[0.04] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-bleu-nuit/[0.02] rounded-full blur-[120px]" />
      </div>
      <div className="w-full max-w-md animate-fade-in-up relative z-10">
        <div className="glass-card rounded-2xl border border-border shadow-card p-8">
          <div className="flex justify-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 bg-bleu-nuit rounded-lg flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">AqarVision</span>
            </Link>
          </div>

          <h1 className="font-vitrine text-heading-3 font-bold text-foreground text-center">
            Créer votre agence
          </h1>
          <p className="text-body-sm text-muted-foreground text-center mt-1.5 mb-6">
            Inscrivez-vous et commencez à publier vos annonces
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            {erreur && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {erreur}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="nom_agence" className="text-body-sm font-medium text-foreground">
                Nom de l&apos;agence
              </Label>
              <Input
                id="nom_agence"
                placeholder="Ex: Immobilière El Djazair"
                value={formData.nom_agence}
                onChange={(e) =>
                  setFormData({ ...formData, nom_agence: e.target.value })
                }
                required
                className="rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-body-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@votre-agence.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-body-sm font-medium text-foreground">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 6 caractères"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                minLength={6}
                required
                className="rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="telephone" className="text-body-sm font-medium text-foreground">
                Téléphone / WhatsApp
              </Label>
              <Input
                id="telephone"
                type="tel"
                placeholder="+213 XX XX XX XX"
                value={formData.telephone}
                onChange={(e) =>
                  setFormData({ ...formData, telephone: e.target.value })
                }
                required
                className="rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-body-sm font-medium text-foreground">Wilaya</Label>
              <Select
                value={formData.wilaya_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, wilaya_id: value })
                }
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Sélectionnez votre wilaya" />
                </SelectTrigger>
                <SelectContent>
                  {WILAYAS.map((wilaya) => (
                    <SelectItem key={wilaya.id} value={String(wilaya.id)}>
                      {wilaya.code} - {wilaya.nom_fr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  Créer mon agence
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-body-sm text-center text-muted-foreground pt-2">
              Déjà inscrit ?{" "}
              <Link
                href="/auth/login"
                className="text-or font-semibold hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
