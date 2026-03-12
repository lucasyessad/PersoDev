import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

/**
 * Detect price changes on properties and notify users who have them as favorites.
 * Triggered via database webhook on properties table UPDATE.
 * Expects payload: { old_record: { id, price }, record: { id, price, title } }
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid payload' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const oldRecord = payload.old_record;
  const newRecord = payload.record;

  if (!oldRecord || !newRecord) {
    return new Response(JSON.stringify({ error: 'Missing records' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Only process if price actually changed
  if (oldRecord.price === newRecord.price) {
    return new Response(JSON.stringify({ notified: 0, reason: 'no_price_change' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const priceDropped = newRecord.price < oldRecord.price;

  // Find users who have this property in their favorites
  const { data: favorites } = await supabase
    .from('favorites')
    .select('user_id')
    .eq('property_id', newRecord.id);

  if (!favorites || favorites.length === 0) {
    return new Response(JSON.stringify({ notified: 0, reason: 'no_favorites' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Create notifications for each user
  const notifications = favorites.map((fav) => ({
    user_id: fav.user_id,
    type: 'property_view_milestone' as const, // Reuse existing type
    title: priceDropped
      ? `Baisse de prix : ${newRecord.title}`
      : `Changement de prix : ${newRecord.title}`,
    body: priceDropped
      ? `Le prix est passé de ${oldRecord.price} à ${newRecord.price}`
      : `Le prix a changé de ${oldRecord.price} à ${newRecord.price}`,
    data: {
      property_id: newRecord.id,
      old_price: oldRecord.price,
      new_price: newRecord.price,
      price_dropped: priceDropped,
    },
    is_read: false,
  }));

  const { error } = await supabase.from('notifications').insert(notifications);

  if (error) {
    return new Response(JSON.stringify({ error: 'Failed to create notifications' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ notified: notifications.length }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
