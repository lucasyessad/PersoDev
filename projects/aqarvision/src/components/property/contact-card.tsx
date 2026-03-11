'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';

interface ContactCardProps {
  price: number;
  surface?: number;
  currency?: string;
  agency?: {
    name: string;
    logo?: string;
    phone?: string;
    agentName?: string;
  };
  propertyId: string;
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
  propertyId: string;
}

function formatPrice(price: number, currency: string): string {
  return `${price.toLocaleString('fr-FR')} ${currency}`;
}

export function ContactCard({
  price,
  surface,
  currency = 'MAD',
  agency,
  propertyId,
  onSubmit,
}: ContactCardProps) {
  const [form, setForm]     = useState({ name: '', phone: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const pricePerM2 = surface ? Math.round(price / surface) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;
    setLoading(true);
    try {
      await onSubmit({ ...form, propertyId });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-lg p-6 flex flex-col gap-5">
      {/* Price */}
      <div>
        <p className="font-mono text-price text-neutral-900">{formatPrice(price, currency)}</p>
        {pricePerM2 && (
          <p className="text-body-sm text-neutral-500 mt-0.5">
            ~{formatPrice(pricePerM2, currency)}/m²
          </p>
        )}
      </div>

      {sent ? (
        <div className="text-center py-4">
          <div className="text-success-600 text-heading-sm mb-2">✓ Message envoyé !</div>
          <p className="text-body-sm text-neutral-500">L'agence vous contactera très prochainement.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            placeholder="Nom complet"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            type="tel"
            placeholder="Téléphone"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          />
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
          />
          <Textarea
            placeholder="Votre message…"
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            className="min-h-[100px]"
          />

          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Envoyer un message
          </Button>

          {agency?.phone && (
            <a href={`tel:${agency.phone}`}>
              <Button type="button" variant="secondary" fullWidth>
                <Phone className="h-4 w-4" />
                Appeler l'agence
              </Button>
            </a>
          )}
        </form>
      )}

      {/* Agency info */}
      {agency && (
        <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
          {agency.logo && (
            <div className="w-10 h-10 rounded-lg relative overflow-hidden shrink-0 border border-neutral-200">
              <Image src={agency.logo} alt={agency.name} fill className="object-contain p-1" sizes="40px" />
            </div>
          )}
          <div>
            <p className="text-body-sm font-medium text-neutral-900">{agency.name}</p>
            {agency.agentName && (
              <p className="text-caption text-neutral-500">Agent : {agency.agentName}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Mobile sticky bottom bar ───────────────────── */

export function ContactBottomBar({
  price,
  currency = 'MAD',
  onContactClick,
}: {
  price: number;
  currency?: string;
  onContactClick: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-neutral-200 px-4 py-3 flex items-center justify-between sm:hidden">
      <div>
        <p className="font-mono text-price-sm text-neutral-900">
          {price.toLocaleString('fr-FR')} {currency}
        </p>
      </div>
      <Button variant="primary" onClick={onContactClick}>
        Contacter
      </Button>
    </div>
  );
}
