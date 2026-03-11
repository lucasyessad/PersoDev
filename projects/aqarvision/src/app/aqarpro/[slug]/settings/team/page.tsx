import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getAgencyMembers } from '@/lib/queries/team';
import { getPlanConfig } from '@/config';
import { TeamMemberRow } from './member-row';
import { InviteMemberForm } from './invite-form';

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: agency } = await supabase
    .from('agencies')
    .select('id, name, active_plan, owner_id')
    .eq('owner_id', user.id)
    .single();

  if (!agency) {
    return <div className="p-8"><p className="text-red-600">Agence introuvable</p></div>;
  }

  const members = await getAgencyMembers(agency.id);
  const planConfig = getPlanConfig(agency.active_plan);
  const isOwner = agency.owner_id === user.id;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Équipe</h1>
          <p className="mt-1 text-sm text-gray-500">
            {members.length + 1} / {planConfig.limits.maxMembers} membres
          </p>
        </div>
      </div>

      {/* Invite form */}
      {isOwner && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Inviter un membre</h2>
          <InviteMemberForm
            maxMembers={planConfig.limits.maxMembers}
            currentCount={members.length + 1}
          />
        </div>
      )}

      {/* Owner */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="font-semibold text-gray-900">Membres de l&apos;équipe</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {/* Owner row */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-500">Propriétaire</p>
              </div>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              Owner
            </span>
          </div>

          {/* Members */}
          {members.map((member) => (
            <TeamMemberRow
              key={member.id}
              member={member}
              isOwner={isOwner}
            />
          ))}

          {members.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-gray-400">
              Aucun membre dans l&apos;équipe
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
