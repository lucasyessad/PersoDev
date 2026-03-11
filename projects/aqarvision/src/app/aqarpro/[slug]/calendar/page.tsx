import { Calendar, Clock, Bell, RefreshCw } from 'lucide-react';

export const metadata = {
  title: 'Calendrier des visites — AqarVision',
};

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-heading-lg text-neutral-900">Calendrier des visites</h1>
        <p className="text-body-sm text-neutral-500 mt-0.5">Planifiez et gérez vos rendez-vous</p>
      </div>

      {/* Coming soon card */}
      <div className="bg-white rounded-xl border border-neutral-200 py-16 text-center">
        <div className="mx-auto w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
          <Calendar className="h-7 w-7 text-primary-600" />
        </div>
        <p className="text-heading-md text-neutral-900">Bientôt disponible</p>
        <p className="mt-2 text-body-sm text-neutral-500 max-w-md mx-auto">
          Cette fonctionnalité est en cours de développement. Vous pourrez bientôt planifier et gérer
          toutes vos visites directement depuis votre tableau de bord.
        </p>
      </div>

      {/* Feature preview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: Clock,
            label: 'Planification des visites',
            description: 'Organisez vos créneaux de visite et partagez-les avec vos prospects',
          },
          {
            icon: Bell,
            label: 'Rappels automatiques',
            description: 'Recevez des notifications avant chaque rendez-vous programmé',
          },
          {
            icon: RefreshCw,
            label: 'Sync agenda',
            description: 'Synchronisez avec Google Calendar ou tout autre agenda externe',
          },
        ].map((feature) => (
          <div
            key={feature.label}
            className="flex items-start gap-3 bg-white rounded-xl border border-neutral-200 p-5"
          >
            <div className="w-9 h-9 bg-neutral-100 rounded-lg flex items-center justify-center shrink-0">
              <feature.icon className="h-4.5 w-4.5 text-neutral-500" />
            </div>
            <div>
              <p className="text-body-sm font-medium text-neutral-900">{feature.label}</p>
              <p className="mt-0.5 text-caption text-neutral-400">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
