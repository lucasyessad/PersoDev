/**
 * Script de seed — Insère des données de démo dans Supabase.
 *
 * Usage:
 *   npx tsx scripts/seed-demo.ts
 *
 * Prérequis:
 *   - .env.local avec NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY
 *   - Le schéma doit être déjà appliqué (supabase/schema.sql)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Charger .env.local
const envPath = resolve(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL'];
const SERVICE_ROLE_KEY = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Variables manquantes dans .env.local:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL=' + (SUPABASE_URL || '(manquant)'));
  console.error('   SUPABASE_SERVICE_ROLE_KEY=' + (SERVICE_ROLE_KEY ? '✓' : '(manquant)'));
  console.error('');
  console.error('Ajoutez SUPABASE_SERVICE_ROLE_KEY dans votre .env.local.');
  console.error('Vous la trouverez dans Supabase Dashboard > Settings > API > service_role key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Données de démo ────────────────────────────────────────────────

const DEMO_USER_EMAIL = 'demo@aqarvision.dz';
const DEMO_USER_PASSWORD = 'demo123456';

async function seed() {
  console.log('🌱 Seed AqarVision — Insertion des données de démo...\n');

  // 1. Créer un utilisateur démo via Auth
  console.log('1/4 — Création utilisateur démo...');
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: DEMO_USER_EMAIL,
    password: DEMO_USER_PASSWORD,
    email_confirm: true,
  });

  let userId: string;
  if (authError) {
    if (authError.message?.includes('already been registered')) {
      console.log('   → Utilisateur déjà existant, récupération...');
      const { data: users } = await supabase.auth.admin.listUsers();
      const existing = users?.users?.find((u) => u.email === DEMO_USER_EMAIL);
      if (!existing) {
        console.error('❌ Impossible de trouver l\'utilisateur existant');
        process.exit(1);
      }
      userId = existing.id;
    } else {
      console.error('❌ Erreur auth:', authError.message);
      process.exit(1);
    }
  } else {
    userId = authData.user.id;
  }
  console.log(`   ✓ User ID: ${userId}`);

  // 2. Créer l'agence démo
  console.log('\n2/4 — Création agence démo...');

  // Supprimer l'ancienne agence démo si elle existe
  await supabase.from('agencies').delete().eq('slug', 'demo');

  const { data: agency, error: agencyError } = await supabase
    .from('agencies')
    .insert({
      owner_id: userId,
      name: 'Immobilière El Djazaïr',
      slug: 'demo',
      description:
        'Agence immobilière de référence à Alger. Spécialisée dans la vente et la location de biens résidentiels et commerciaux de standing.',
      primary_color: '#1E40AF',
      secondary_color: '#F59E0B',
      phone: '+213 555 123 456',
      email: 'contact@eldjazair-immo.dz',
      website: 'https://eldjazair-immo.dz',
      address: '12 Rue Didouche Mourad, Alger Centre',
      wilaya: 'Alger',
      slogan: 'Votre partenaire immobilier de confiance',
      active_plan: 'enterprise',
      locale: 'fr',
      hero_style: 'cover',
      font_style: 'elegant',
      theme_mode: 'dark',
      tagline: 'L\'excellence immobilière depuis 2010',
      stats_years: 14,
      stats_properties_sold: 850,
      stats_clients: 2300,
      instagram_url: 'https://instagram.com/eldjazair_immo',
      facebook_url: 'https://facebook.com/eldjazairimmo',
    })
    .select()
    .single();

  if (agencyError) {
    console.error('❌ Erreur agence:', agencyError.message);
    process.exit(1);
  }
  console.log(`   ✓ Agence: ${agency.name} (slug: ${agency.slug})`);

  // 3. Créer des biens immobiliers
  console.log('\n3/4 — Création des biens immobiliers...');
  const properties = [
    {
      agency_id: agency.id,
      created_by: userId,
      title: 'Villa moderne avec piscine — Hydra',
      description:
        'Magnifique villa contemporaine de 450m² sur un terrain de 800m². Piscine chauffée, jardin paysager, garage double. Vue panoramique sur la baie d\'Alger.',
      price: 85000000,
      surface: 450,
      rooms: 6,
      bathrooms: 4,
      type: 'villa',
      transaction_type: 'sale',
      status: 'active',
      city: 'Alger',
      wilaya: 'Alger',
      commune: 'Hydra',
      address: 'Cité les Vergers, Hydra',
      features: ['Piscine', 'Jardin', 'Garage', 'Climatisation', 'Vue mer', 'Sécurité 24h'],
      is_featured: true,
    },
    {
      agency_id: agency.id,
      created_by: userId,
      title: 'Appartement F4 standing — Saïd Hamdine',
      description:
        'Bel appartement de 130m² au 5ème étage avec ascenseur. Finitions haut de gamme, cuisine équipée, 2 balcons. Proche commodités.',
      price: 28000000,
      surface: 130,
      rooms: 4,
      bathrooms: 2,
      type: 'apartment',
      transaction_type: 'sale',
      status: 'active',
      city: 'Alger',
      wilaya: 'Alger',
      commune: 'Saïd Hamdine',
      features: ['Ascenseur', 'Balcon', 'Cuisine équipée', 'Parking', 'Climatisation'],
      is_featured: true,
    },
    {
      agency_id: agency.id,
      created_by: userId,
      title: 'Local commercial — Rue Hassiba',
      description:
        'Local commercial de 85m² en rez-de-chaussée avec grande vitrine. Idéal pour boutique, showroom ou bureau. Quartier très passant.',
      price: 150000,
      surface: 85,
      rooms: 2,
      bathrooms: 1,
      type: 'commercial',
      transaction_type: 'rent',
      status: 'active',
      city: 'Alger',
      wilaya: 'Alger',
      commune: 'Alger Centre',
      address: 'Rue Hassiba Ben Bouali',
      currency: 'DZD',
      features: ['Vitrine', 'Climatisation', 'Accès PMR'],
      is_featured: false,
    },
    {
      agency_id: agency.id,
      created_by: userId,
      title: 'Duplex F5 neuf — Bab Ezzouar',
      description:
        'Superbe duplex de 200m² dans une résidence fermée avec gardien. 3 chambres, salon double, terrasse panoramique. Livré clé en main.',
      price: 42000000,
      surface: 200,
      rooms: 5,
      bathrooms: 3,
      type: 'apartment',
      transaction_type: 'sale',
      status: 'active',
      city: 'Alger',
      wilaya: 'Alger',
      commune: 'Bab Ezzouar',
      features: ['Terrasse', 'Résidence fermée', 'Gardien', 'Parking souterrain', 'Neuf'],
      is_featured: true,
    },
    {
      agency_id: agency.id,
      created_by: userId,
      title: 'Terrain constructible 500m² — Chéraga',
      description:
        'Terrain plat de 500m² dans un quartier résidentiel calme. Permis de construire disponible. Tous les réseaux (eau, gaz, électricité) en bordure.',
      price: 35000000,
      surface: 500,
      rooms: 0,
      bathrooms: 0,
      type: 'land',
      transaction_type: 'sale',
      status: 'active',
      city: 'Alger',
      wilaya: 'Alger',
      commune: 'Chéraga',
      features: ['Permis de construire', 'Viabilisé', 'Quartier calme'],
      is_featured: false,
    },
    {
      agency_id: agency.id,
      created_by: userId,
      title: 'Appartement F3 meublé — Location Oran',
      description:
        'Joli F3 entièrement meublé et équipé de 90m². Idéal pour expatriés ou professionnels. Proche tramway et centre commercial.',
      price: 80000,
      surface: 90,
      rooms: 3,
      bathrooms: 1,
      type: 'apartment',
      transaction_type: 'rent',
      status: 'active',
      city: 'Oran',
      wilaya: 'Oran',
      commune: 'Oran Centre',
      features: ['Meublé', 'Équipé', 'Proche tramway', 'Climatisation'],
      is_featured: false,
    },
  ];

  const { data: insertedProps, error: propsError } = await supabase
    .from('properties')
    .insert(properties)
    .select('id, title');

  if (propsError) {
    console.error('❌ Erreur propriétés:', propsError.message);
    process.exit(1);
  }
  console.log(`   ✓ ${insertedProps.length} biens créés`);
  insertedProps.forEach((p) => console.log(`     - ${p.title}`));

  // 4. Créer des leads
  console.log('\n4/4 — Création des leads de démo...');
  const leads = [
    {
      agency_id: agency.id,
      property_id: insertedProps[0].id,
      name: 'Karim Benali',
      phone: '+213 555 987 654',
      email: 'karim.benali@gmail.com',
      message: 'Bonjour, je suis intéressé par la villa à Hydra. Est-il possible de planifier une visite ce weekend ?',
      source: 'property_detail',
      status: 'new',
      priority: 'high',
      budget_min: 70000000,
      budget_max: 90000000,
    },
    {
      agency_id: agency.id,
      property_id: insertedProps[1].id,
      name: 'Amina Khelif',
      phone: '+213 555 456 789',
      email: 'amina.k@hotmail.com',
      message: 'Je cherche un F4 dans le secteur de Saïd Hamdine. Votre annonce m\'intéresse.',
      source: 'contact_form',
      status: 'contacted',
      priority: 'normal',
    },
    {
      agency_id: agency.id,
      name: 'Société Batimex SARL',
      phone: '+213 555 111 222',
      email: 'contact@batimex.dz',
      message: 'Nous recherchons des locaux commerciaux à Alger Centre pour notre expansion. Budget flexible.',
      source: 'phone',
      status: 'qualified',
      priority: 'urgent',
      budget_min: 100000,
      budget_max: 300000,
      desired_wilaya: 'Alger',
      desired_type: 'commercial',
    },
    {
      agency_id: agency.id,
      name: 'Youcef Madani',
      phone: '+213 555 333 444',
      message: 'Je cherche un terrain à Chéraga ou environs.',
      source: 'whatsapp',
      status: 'new',
      priority: 'normal',
      desired_wilaya: 'Alger',
      desired_type: 'land',
    },
  ];

  const { data: insertedLeads, error: leadsError } = await supabase
    .from('leads')
    .insert(leads)
    .select('id, name');

  if (leadsError) {
    console.error('❌ Erreur leads:', leadsError.message);
    process.exit(1);
  }
  console.log(`   ✓ ${insertedLeads.length} leads créés`);

  // Résumé
  console.log('\n' + '='.repeat(50));
  console.log('✅ Seed terminé avec succès !\n');
  console.log('📋 Données insérées:');
  console.log(`   - 1 utilisateur : ${DEMO_USER_EMAIL} / ${DEMO_USER_PASSWORD}`);
  console.log(`   - 1 agence      : ${agency.name} (/agence/demo)`);
  console.log(`   - ${insertedProps.length} biens immobiliers`);
  console.log(`   - ${insertedLeads.length} leads`);
  console.log('\n🔗 Accès:');
  console.log('   - Page agence : http://localhost:3000/agence/demo');
  console.log('   - Login       : http://localhost:3000/login');
  console.log(`     Email: ${DEMO_USER_EMAIL}`);
  console.log(`     Mot de passe: ${DEMO_USER_PASSWORD}`);
  console.log('   - Dashboard   : http://localhost:3000/dashboard');
}

seed().catch((err) => {
  console.error('❌ Erreur fatale:', err);
  process.exit(1);
});
