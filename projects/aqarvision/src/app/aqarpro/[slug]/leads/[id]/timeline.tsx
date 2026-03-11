'use client';

const STATUS_ORDER = ['new', 'contacted', 'qualified', 'negotiation', 'converted'];

interface LeadTimelineProps {
  createdAt: string;
  contactedAt: string | null;
  status: string;
  updatedAt: string;
}

export function LeadTimeline({ createdAt, contactedAt, status, updatedAt }: LeadTimelineProps) {
  const currentIndex = STATUS_ORDER.indexOf(status);
  const isLost = status === 'lost';

  const events = [
    { label: 'Créé', date: createdAt, active: true },
    { label: 'Contacté', date: contactedAt, active: currentIndex >= 1 || isLost },
    { label: 'Qualifié', date: currentIndex >= 2 ? updatedAt : null, active: currentIndex >= 2 },
    { label: 'Négociation', date: currentIndex >= 3 ? updatedAt : null, active: currentIndex >= 3 },
    { label: 'Converti', date: currentIndex >= 4 ? updatedAt : null, active: currentIndex >= 4 },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Timeline</h2>

      {isLost && (
        <div className="mb-4 rounded-lg bg-red-50 p-3">
          <p className="text-sm font-medium text-red-700">Lead perdu</p>
          <p className="text-xs text-red-500">
            {new Date(updatedAt).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </p>
        </div>
      )}

      <div className="space-y-0">
        {events.map((event, i) => (
          <div key={event.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`h-3 w-3 rounded-full border-2 ${
                event.active
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 bg-white'
              }`} />
              {i < events.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-[32px] ${
                  events[i + 1]?.active ? 'bg-blue-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
            <div className="pb-6">
              <p className={`text-sm ${event.active ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
                {event.label}
              </p>
              {event.date && event.active && (
                <p className="text-xs text-gray-500">
                  {new Date(event.date).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
