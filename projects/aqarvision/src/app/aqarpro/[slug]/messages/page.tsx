import { redirect } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getConversations } from '@/lib/actions/messaging';
import { ConversationList } from '@/components/messaging/conversation-list';

export default async function DashboardMessagesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: agency } = await supabase
    .from('agencies')
    .select('id, name')
    .eq('owner_id', user.id)
    .single();

  if (!agency) {
    return <p className="text-error-600">Agence introuvable.</p>;
  }

  const { conversations, error } = await getConversations();

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-heading-lg text-neutral-900">Messages</h1>
          <p className="text-body-sm text-neutral-500 mt-0.5">
            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            {totalUnread > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-primary-100 text-primary-600 text-caption font-medium">
                {totalUnread} non lu{totalUnread !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-center">
          <p className="text-body-sm text-error-600">{error}</p>
        </div>
      ) : conversations.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-white py-16 text-center">
          <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-6 w-6 text-neutral-400" />
          </div>
          <p className="text-body-md text-neutral-500">Aucun message pour le moment</p>
          <p className="mt-2 text-body-sm text-neutral-400">
            Les messages de vos prospects apparaîtront ici
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <ConversationList
            conversations={conversations}
            basePath={`/aqarpro/${slug}/messages`}
          />
        </div>
      )}
    </div>
  );
}
