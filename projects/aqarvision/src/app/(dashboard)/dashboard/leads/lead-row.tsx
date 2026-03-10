'use client';

import { useState, useTransition } from 'react';
import { updateLeadStatus, updateLeadPriority, deleteLead } from '@/lib/actions/lead-management';

interface LeadRowProps {
  lead: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    message: string | null;
    source: string;
    sourceLabel: string;
    status: string;
    priority: string;
    propertyTitle: string | null;
    createdAt: string;
  };
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nouveau', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Contacté', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'qualified', label: 'Qualifié', color: 'bg-green-100 text-green-700' },
  { value: 'negotiation', label: 'Négociation', color: 'bg-purple-100 text-purple-700' },
  { value: 'converted', label: 'Converti', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'lost', label: 'Perdu', color: 'bg-red-100 text-red-700' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Basse', color: 'text-gray-400' },
  { value: 'normal', label: 'Normale', color: 'text-gray-600' },
  { value: 'high', label: 'Haute', color: 'text-orange-500' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-600' },
];

export function LeadRow({ lead }: LeadRowProps) {
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const statusOption = STATUS_OPTIONS.find((s) => s.value === lead.status) || STATUS_OPTIONS[0];
  const priorityOption = PRIORITY_OPTIONS.find((p) => p.value === lead.priority) || PRIORITY_OPTIONS[1];

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(async () => {
      await updateLeadStatus(lead.id, e.target.value);
    });
  }

  function handlePriorityChange(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(async () => {
      await updateLeadPriority(lead.id, e.target.value);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteLead(lead.id);
    });
  }

  return (
    <>
      <tr className={`hover:bg-gray-50 ${isPending ? 'opacity-50' : ''}`}>
        <td className="px-6 py-4">
          <button onClick={() => setExpanded(!expanded)} className="text-left">
            <p className="font-medium text-gray-900">{lead.name}</p>
            <p className="text-xs text-gray-500">{lead.phone}</p>
            {lead.email && <p className="text-xs text-gray-400">{lead.email}</p>}
          </button>
        </td>
        <td className="px-6 py-4 text-gray-600">{lead.sourceLabel}</td>
        <td className="px-6 py-4">
          {lead.propertyTitle ? (
            <span className="text-sm text-gray-700">{lead.propertyTitle}</span>
          ) : (
            <span className="text-xs text-gray-400">-</span>
          )}
        </td>
        <td className="px-6 py-4">
          <select
            value={lead.status}
            onChange={handleStatusChange}
            disabled={isPending}
            className={`rounded-full border-0 px-2 py-0.5 text-xs font-medium ${statusOption.color}`}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </td>
        <td className="px-6 py-4">
          <select
            value={lead.priority}
            onChange={handlePriorityChange}
            disabled={isPending}
            className={`rounded border-0 bg-transparent text-xs font-medium ${priorityOption.color}`}
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </td>
        <td className="px-6 py-4 text-xs text-gray-500">
          {new Date(lead.createdAt).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </td>
        <td className="px-6 py-4">
          {showDelete ? (
            <div className="flex gap-1">
              <button onClick={handleDelete} disabled={isPending}
                className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50">
                Oui
              </button>
              <button onClick={() => setShowDelete(false)}
                className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                Non
              </button>
            </div>
          ) : (
            <button onClick={() => setShowDelete(true)}
              className="rounded bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100">
              Supprimer
            </button>
          )}
        </td>
      </tr>

      {/* Expanded message row */}
      {expanded && lead.message && (
        <tr className="bg-gray-50">
          <td colSpan={7} className="px-6 py-4">
            <p className="text-xs font-medium text-gray-500">Message :</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{lead.message}</p>
          </td>
        </tr>
      )}
    </>
  );
}
