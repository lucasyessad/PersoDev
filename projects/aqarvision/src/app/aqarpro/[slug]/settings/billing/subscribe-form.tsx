'use client';

import { useState, useTransition } from 'react';
import { PLAN_CONFIGS, getPlanPrice } from '@/config';
import { createSubscription } from '@/lib/actions/subscription';
import { useRouter } from 'next/navigation';

const PLANS = Object.values(PLAN_CONFIGS);

const CYCLES = [
  { value: 'monthly',   label: 'Mensuel',      discount: '' },
  { value: 'quarterly', label: 'Trimestriel',  discount: '-10%' },
  { value: 'yearly',    label: 'Annuel',        discount: '-20%' },
] as const;

const PAYMENTS = [
  { value: 'ccp',        label: 'CCP' },
  { value: 'baridi_mob', label: 'BaridiMob' },
  { value: 'virement',   label: 'Virement bancaire' },
  { value: 'dahabia',    label: 'Carte Dahabia' },
  { value: 'cash',       label: 'Espèces' },
] as const;

function formatDZD(n: number) {
  return new Intl.NumberFormat('fr-DZ').format(n) + ' DA';
}

export function SubscribeForm({ currentPlanId }: { currentPlanId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [plan,    setPlan]    = useState(currentPlanId);
  const [cycle,   setCycle]   = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [payment, setPayment] = useState('ccp');
  const [ref,     setRef]     = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [open,    setOpen]    = useState(false);

  const price = getPlanPrice(plan, cycle);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const fd = new FormData();
    fd.set('plan', plan);
    fd.set('cycle', cycle);
    fd.set('payment', payment);
    fd.set('reference', ref);

    startTransition(async () => {
      const result = await createSubscription(fd);
      if (result.success) {
        setMessage({ type: 'success', text: 'Abonnement activé avec succès !' });
        setOpen(false);
        router.refresh();
      } else {
        setMessage({ type: 'error', text: result.error ?? 'Une erreur est survenue.' });
      }
    });
  }

  return (
    <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-neutral-900">Souscrire / Changer de plan</h2>
        <button
          onClick={() => setOpen(o => !o)}
          className="text-body-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {open ? 'Fermer ▲' : 'Ouvrir ▼'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 rounded-lg px-4 py-3 text-body-sm border ${
          message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Plan selector */}
          <div>
            <label className="block text-body-sm font-medium text-neutral-700 mb-2">Plan</label>
            <div className="grid grid-cols-3 gap-3">
              {PLANS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlan(p.id)}
                  className={`rounded-lg border-2 p-3 text-left transition-all ${
                    plan === p.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="text-body-sm font-semibold text-neutral-900">{p.name}</div>
                  {p.badge && (
                    <div className="text-caption text-primary-600">{p.badge}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Cycle selector */}
          <div>
            <label className="block text-body-sm font-medium text-neutral-700 mb-2">Cycle de facturation</label>
            <div className="flex gap-2">
              {CYCLES.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCycle(c.value)}
                  className={`flex-1 rounded-lg border-2 py-2 px-3 text-center text-body-sm transition-all ${
                    cycle === c.value
                      ? 'border-primary-600 bg-primary-50 font-semibold text-primary-700'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                  }`}
                >
                  {c.label}
                  {c.discount && (
                    <span className="ml-1 text-caption font-semibold text-green-600">{c.discount}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price display */}
          <div className="rounded-lg bg-neutral-50 border border-neutral-200 px-4 py-3 flex items-center justify-between">
            <span className="text-body-sm text-neutral-600">Montant à payer</span>
            <span className="text-heading-md text-neutral-900 font-mono">{formatDZD(price)}</span>
          </div>

          {/* Payment method */}
          <div>
            <label className="block text-body-sm font-medium text-neutral-700 mb-2">Méthode de paiement</label>
            <select
              value={payment}
              onChange={e => setPayment(e.target.value)}
              className="w-full h-10 px-3 text-body-sm border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none"
            >
              {PAYMENTS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Reference */}
          <div>
            <label className="block text-body-sm font-medium text-neutral-700 mb-1">
              Référence de paiement <span className="text-neutral-400 font-normal">(optionnel)</span>
            </label>
            <input
              type="text"
              value={ref}
              onChange={e => setRef(e.target.value)}
              placeholder="Numéro de reçu, référence virement…"
              className="w-full h-10 px-3 text-body-sm border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-11 bg-primary-600 text-white text-body-md font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Activation en cours…' : `Activer — ${formatDZD(price)}`}
          </button>
        </form>
      )}
    </div>
  );
}
