'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';

export default function SignupPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const agencyName = formData.get('agencyName') as string;

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    startTransition(async () => {
      const supabase = createClient();

      // 1. Créer le compte
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { agency_name: agencyName },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      // Si confirmation email requise
      if (authData.user && !authData.session) {
        setSuccess(true);
        return;
      }

      // 2. Créer l'agence
      if (authData.user) {
        const slug = agencyName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        const { error: agencyError } = await supabase.from('agencies').insert({
          owner_id: authData.user.id,
          name: agencyName,
          slug: `${slug}-${Date.now().toString(36).slice(-4)}`,
          active_plan: 'starter',
          locale: 'fr',
          primary_color: '#2563eb',
        });

        if (agencyError) {
          setError("Compte créé mais erreur lors de la création de l'agence. Contactez le support.");
          return;
        }

        router.push('/dashboard');
        router.refresh();
      }
    });
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Vérifiez votre email</h2>
          <p className="mt-2 text-sm text-gray-600">
            Un lien de confirmation a été envoyé à votre adresse email.
            Cliquez dessus pour activer votre compte.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">AqarVision</h1>
          <p className="mt-2 text-sm text-gray-600">
            Créez votre vitrine immobilière en quelques clics
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-8 shadow-sm">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="agencyName" className="mb-1 block text-sm font-medium text-gray-700">
              Nom de votre agence
            </label>
            <input
              id="agencyName"
              name="agencyName"
              type="text"
              required
              minLength={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Mon Agence Immobilière"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email professionnel
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="vous@agence.dz"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              minLength={6}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Minimum 6 caractères"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              minLength={6}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Création en cours...' : 'Créer mon agence'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Déjà un compte ?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
