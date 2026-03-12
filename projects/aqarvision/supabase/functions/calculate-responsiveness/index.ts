import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

/**
 * Calculate agency responsiveness stats.
 * For each agency, computes average first-response time from conversations.
 * Thresholds: fast (<2h), moderate (<12h), slow (>12h), unrated (<3 conversations).
 * Designed to run as a daily cron job.
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get all agencies
  const { data: agencies, error: agenciesError } = await supabase
    .from('agencies')
    .select('id');

  if (agenciesError || !agencies) {
    return new Response(JSON.stringify({ error: 'Failed to fetch agencies' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let updated = 0;

  for (const agency of agencies) {
    // Get conversations for this agency
    const { data: conversations } = await supabase
      .from('conversations')
      .select('id, user_id, created_at')
      .eq('agency_id', agency.id)
      .eq('status', 'active');

    if (!conversations || conversations.length === 0) {
      await supabase.from('agency_responsiveness_stats').upsert({
        agency_id: agency.id,
        avg_response_time_minutes: null,
        response_rate: 0,
        total_conversations: 0,
        responsiveness_level: 'unrated',
        updated_at: new Date().toISOString(),
      });
      updated++;
      continue;
    }

    let totalResponseTime = 0;
    let respondedCount = 0;

    for (const conv of conversations) {
      // Get first message from user (initiator)
      const { data: firstUserMsg } = await supabase
        .from('messages')
        .select('created_at')
        .eq('conversation_id', conv.id)
        .eq('sender_id', conv.user_id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (!firstUserMsg) continue;

      // Get first response from agency (any sender that is not the user)
      const { data: firstAgencyMsg } = await supabase
        .from('messages')
        .select('created_at')
        .eq('conversation_id', conv.id)
        .neq('sender_id', conv.user_id)
        .gt('created_at', firstUserMsg.created_at)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (firstAgencyMsg) {
        const userTime = new Date(firstUserMsg.created_at).getTime();
        const agencyTime = new Date(firstAgencyMsg.created_at).getTime();
        const diffMinutes = (agencyTime - userTime) / (1000 * 60);
        totalResponseTime += diffMinutes;
        respondedCount++;
      }
    }

    const totalConversations = conversations.length;
    const avgResponseTimeMinutes = respondedCount > 0
      ? Math.round(totalResponseTime / respondedCount)
      : null;
    const responseRate = totalConversations > 0
      ? Math.round((respondedCount / totalConversations) * 100 * 100) / 100
      : 0;

    let responsivenessLevel: string;
    if (totalConversations < 3) {
      responsivenessLevel = 'unrated';
    } else if (avgResponseTimeMinutes !== null && avgResponseTimeMinutes <= 120) {
      responsivenessLevel = 'fast';
    } else if (avgResponseTimeMinutes !== null && avgResponseTimeMinutes <= 720) {
      responsivenessLevel = 'moderate';
    } else {
      responsivenessLevel = 'slow';
    }

    await supabase.from('agency_responsiveness_stats').upsert({
      agency_id: agency.id,
      avg_response_time_minutes: avgResponseTimeMinutes,
      response_rate: responseRate,
      total_conversations: totalConversations,
      responsiveness_level: responsivenessLevel,
      updated_at: new Date().toISOString(),
    });

    updated++;
  }

  return new Response(JSON.stringify({ updated }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
