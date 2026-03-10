'use client';

import { useState, useTransition } from 'react';
import { updateMemberRole, removeMember } from '@/lib/actions/team';
import type { AgencyMember } from '@/types/database';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  agent: 'Agent',
  viewer: 'Viewer',
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  agent: 'bg-green-100 text-green-700',
  viewer: 'bg-gray-100 text-gray-600',
};

interface TeamMemberRowProps {
  member: AgencyMember;
  isOwner: boolean;
}

export function TeamMemberRow({ member, isOwner }: TeamMemberRowProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleRoleChange(newRole: string) {
    startTransition(async () => {
      await updateMemberRole(member.id, newRole);
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeMember(member.id);
      setShowConfirm(false);
    });
  }

  const initials = (member.full_name || member.email || '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {member.full_name || 'Sans nom'}
          </p>
          <p className="text-xs text-gray-500">{member.email}</p>
          {!member.joined_at && (
            <p className="text-xs text-amber-500">Invitation en attente</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isOwner ? (
          <>
            <select
              value={member.role}
              onChange={(e) => handleRoleChange(e.target.value)}
              disabled={isPending}
              className="rounded-lg border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
            >
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>

            {showConfirm ? (
              <div className="flex gap-1">
                <button
                  onClick={handleRemove}
                  disabled={isPending}
                  className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Confirmer
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50"
              >
                Retirer
              </button>
            )}
          </>
        ) : (
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${ROLE_COLORS[member.role] || 'bg-gray-100 text-gray-600'}`}>
            {ROLE_LABELS[member.role] || member.role}
          </span>
        )}
      </div>
    </div>
  );
}
