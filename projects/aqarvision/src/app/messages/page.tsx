import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Building2, MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getConversations } from '@/lib/actions/messaging';
import { ConversationList } from '@/components/messaging/conversation-list';

export const metadata: Metadata = {
  title: 'Mes messages — AqarSearch',
};

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirectTo=/messages');

  const { conversations, error } = await getConversations();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-[1440px] mx-auto px-6 py-5 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-or rounded-lg flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-vitrine text-lg text-bleu-nuit">Aqar</span>
          </Link>
          <div className="border-l border-neutral-200 h-5" />
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <h1 className="font-vitrine text-heading-md text-foreground">Mes messages</h1>
          </div>
          {conversations.length > 0 && (
            <span className="text-body-sm text-muted-foreground">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-body-sm text-red-600">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
            <ConversationList conversations={conversations} basePath="/messages" />
          </div>
        )}
      </div>
    </div>
  );
}
