'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { Save, User, Building2, Bell, Shield, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [agency, setAgency] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [agencyForm, setAgencyForm] = useState({ name: '', email: '', phone: '', website: '', address: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);
      const { data } = await supabase.from('agencies').select('*').eq('owner_id', user.id).single();
      if (data) {
        setAgency(data);
        setAgencyForm({ name: data.name ?? '', email: data.email ?? '', phone: data.phone ?? '', website: data.website ?? '', address: data.address ?? '' });
      }
      setLoading(false);
    })();
  }, []);

  async function saveAgency(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.from('agencies').update(agencyForm).eq('id', agency.id);
    setSaving(false);
    setMessage(error ? { type: 'error', text: error.message } : { type: 'success', text: 'Informations sauvegardées.' });
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwordForm.next !== passwordForm.confirm) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: passwordForm.next });
    setSaving(false);
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Mot de passe mis à jour.' });
      setPasswordForm({ current: '', next: '', confirm: '' });
    }
  }

  if (loading) {
    return <div className="p-8 text-neutral-500 text-body-sm">Chargement…</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">
      <h1 className="font-display text-display-md text-neutral-900">Paramètres</h1>

      {message && (
        <div className={`rounded-lg px-4 py-3 text-body-sm border ${
          message.type === 'success'
            ? 'bg-success-50 border-success-200 text-success-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Agence */}
      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
            <Building2 className="h-4 w-4 text-primary-600" />
          </div>
          <h2 className="text-heading-md text-neutral-900">Informations de l'agence</h2>
        </div>

        <form onSubmit={saveAgency} className="space-y-4">
          {[
            { label: 'Nom de l\'agence', key: 'name', type: 'text', required: true },
            { label: 'Email de contact', key: 'email', type: 'email', required: false },
            { label: 'Téléphone', key: 'phone', type: 'tel', required: false },
            { label: 'Site web', key: 'website', type: 'url', required: false },
            { label: 'Adresse', key: 'address', type: 'text', required: false },
          ].map(({ label, key, type, required }) => (
            <div key={key}>
              <label className="block text-body-sm font-medium text-neutral-700 mb-1">{label}</label>
              <input
                type={type}
                required={required}
                value={agencyForm[key as keyof typeof agencyForm]}
                onChange={e => setAgencyForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full h-10 px-3 text-body-sm border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          ))}

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 h-10 px-5 bg-primary-600 text-white text-body-sm font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Sauvegarde…' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </section>

      {/* Compte */}
      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
            <User className="h-4 w-4 text-primary-600" />
          </div>
          <h2 className="text-heading-md text-neutral-900">Compte</h2>
        </div>

        <div className="mb-4 px-3 py-2.5 bg-neutral-50 rounded-lg border border-neutral-200 text-body-sm text-neutral-600">
          {user?.email}
        </div>

        <form onSubmit={savePassword} className="space-y-4">
          <p className="text-body-sm text-neutral-500">Changer le mot de passe</p>
          {[
            { label: 'Nouveau mot de passe', key: 'next' },
            { label: 'Confirmer le mot de passe', key: 'confirm' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-body-sm font-medium text-neutral-700 mb-1">{label}</label>
              <input
                type="password"
                minLength={6}
                required
                value={passwordForm[key as keyof typeof passwordForm]}
                onChange={e => setPasswordForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full h-10 px-3 text-body-sm border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Minimum 6 caractères"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 h-10 px-5 bg-primary-600 text-white text-body-sm font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            <Shield className="h-4 w-4" />
            Mettre à jour le mot de passe
          </button>
        </form>
      </section>

      {/* Plan actuel */}
      {agency && (
        <section className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
              <Bell className="h-4 w-4 text-primary-600" />
            </div>
            <h2 className="text-heading-md text-neutral-900">Plan actuel</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-body-sm font-semibold bg-primary-100 text-primary-700 capitalize">
              {agency.active_plan}
            </span>
            <a href="/dashboard/billing" className="text-body-sm text-primary-600 hover:text-primary-700 font-medium">
              Gérer l'abonnement →
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
