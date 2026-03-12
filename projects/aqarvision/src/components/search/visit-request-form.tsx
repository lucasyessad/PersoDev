'use client';

import { useState, useTransition } from 'react';
import { CalendarCheck, LogIn } from 'lucide-react';
import { createVisitRequest } from '@/lib/actions/visit-requests';
import Link from 'next/link';

interface VisitRequestFormProps {
  propertyId: string;
  agencyId: string;
  isAuthenticated: boolean;
  /** Pre-fill from visitor profile if authenticated */
  defaultValues?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

export function VisitRequestForm({
  propertyId,
  agencyId,
  isAuthenticated,
  defaultValues,
}: VisitRequestFormProps) {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
        <Link
          href={`/auth/visiteur/login?redirectTo=${encodeURIComponent(`/bien/${propertyId}`)}`}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <LogIn className="h-4 w-4" />
          Connectez-vous pour demander une visite
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
        <CalendarCheck className="mx-auto mb-2 h-8 w-8 text-green-600" />
        <p className="text-sm font-medium text-green-800">Demande envoyée</p>
        <p className="mt-1 text-xs text-green-600">
          L&apos;agence vous contactera prochainement.
        </p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createVisitRequest({
        property_id: propertyId,
        agency_id: agencyId,
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        email: (formData.get('email') as string) || undefined,
        message: (formData.get('message') as string) || undefined,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error ?? 'Une erreur est survenue.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <CalendarCheck className="h-4 w-4" />
        Demander une visite
      </div>

      <input
        name="name"
        type="text"
        required
        placeholder="Votre nom"
        defaultValue={defaultValues?.name}
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      <input
        name="phone"
        type="tel"
        required
        placeholder="Numéro de téléphone"
        defaultValue={defaultValues?.phone}
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      <input
        name="email"
        type="email"
        placeholder="Email (optionnel)"
        defaultValue={defaultValues?.email}
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      <textarea
        name="message"
        placeholder="Message ou disponibilités (optionnel)"
        rows={2}
        maxLength={500}
        className="w-full resize-none rounded-md border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Envoi...' : 'Envoyer la demande'}
      </button>
    </form>
  );
}
