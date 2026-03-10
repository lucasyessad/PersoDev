/**
 * Script de configuration rapide pour créer une agence pour l'utilisateur existant
 * Usage: npx tsx scripts/quick-setup.ts
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
  console.error('❌ Variables manquantes dans .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function quickSetup() {
  console.log('🚀 Configuration rapide AqarVision\n');

  try {
    // Vérifier si les tables existent
    const { data: tables, error: tablesError } = await supabase
      .from('agencies')
      .select('id')
      .limit(1);

    if (tablesError?.message?.includes('not find the table')) {
      console.log('❌ Les tables n\'existent pas encore dans Supabase.\n');
      console.log('📝 Instructions pour créer les tables:\n');
      console.log('1. Allez sur: https://supabase.com/dashboard/project/nctldmovlutbwxjzbuoh/editor');
      console.log('2. Cliquez sur "New query"');
      console.log('3. Copiez le contenu du fichier: supabase/schema.sql');
      console.log('4. Collez-le dans l\'éditeur SQL');
      console.log('5. Cliquez sur "Run" pour exécuter le script\n');
      console.log('Une fois fait, relancez ce script: npx tsx scripts/quick-setup.ts');
      return;
    }

    // Récupérer l'utilisateur lucas.yessad@gmail.com
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('❌ Erreur récupération utilisateurs:', usersError);
      return;
    }

    const user = users.find(u => u.email === 'lucas.yessad@gmail.com');

    if (!user) {
      console.error('❌ Utilisateur lucas.yessad@gmail.com non trouvé');
      return;
    }

    console.log('✅ Utilisateur trouvé:', user.email, '(' + user.id + ')');

    // Vérifier si l'utilisateur a déjà une agence
    const { data: existingMembership } = await supabase
      .from('agency_members')
      .select('agency_id, agencies(name, slug)')
      .eq('user_id', user.id)
      .single();

    if (existingMembership?.agency_id) {
      console.log('\n✅ Vous avez déjà une agence:', (existingMembership as any).agencies?.name);
      console.log('\n🔗 Liens:');
      console.log('   Dashboard: http://localhost:3000/dashboard');
      console.log('   Site vitrine: http://localhost:3000/agence/' + (existingMembership as any).agencies?.slug);
      return;
    }

    // Créer une nouvelle agence
    console.log('\n📦 Création de votre agence...');

    const agencyData = {
      name: 'AqarVision Premium',
      slug: 'aqarvision-premium',
      description: 'Votre partenaire immobilier de confiance en Algérie. Nous offrons une expertise inégalée dans la vente, la location et la gestion de biens immobiliers de prestige.',
      email: 'contact@aqarvision-premium.dz',
      phone: '+213 555 012 345',
      address: '15 Boulevard Mohamed V',
      city: 'Alger',
      wilaya: '16',
      logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop',
      primary_color: '#1e40af',
      secondary_color: '#f59e0b',
      active_plan: 'premium',
      subscription_status: 'active',
      subscription_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      settings: {
        features: {
          virtualTours: true,
          analytics: true,
          leadManagement: true,
          multiLanguage: true
        },
        notifications: {
          email: true,
          sms: true
        },
        branding: {
          showWatermark: false,
          customDomain: true
        }
      }
    };

    const { data: agency, error: agencyError } = await supabase
      .from('agencies')
      .insert(agencyData)
      .select()
      .single();

    if (agencyError) {
      console.error('❌ Erreur création agence:', agencyError);
      return;
    }

    console.log('✅ Agence créée:', agency.name);

    // Associer l'utilisateur comme propriétaire
    const { error: memberError } = await supabase
      .from('agency_members')
      .insert({
        agency_id: agency.id,
        user_id: user.id,
        role: 'owner',
        permissions: ['all']
      });

    if (memberError) {
      console.error('❌ Erreur association:', memberError);
      return;
    }

    console.log('✅ Vous êtes maintenant propriétaire de l\'agence');

    // Créer des biens immobiliers de démonstration
    console.log('\n📦 Création de biens immobiliers de démonstration...');

    const properties = [
      {
        agency_id: agency.id,
        title: 'Villa de Luxe avec Vue Panoramique',
        type: 'villa',
        transaction_type: 'vente',
        price: 35000000,
        surface: 450,
        rooms: 7,
        bedrooms: 5,
        bathrooms: 4,
        city: 'Alger',
        wilaya: '16',
        commune: 'Hydra',
        address: 'Quartier résidentiel Hydra',
        description: 'Somptueuse villa moderne offrant une vue imprenable sur la baie d\'Alger. Architecture contemporaine, finitions haut de gamme, piscine à débordement et jardin paysager.',
        features: ['piscine', 'garage', 'jardin', 'climatisation', 'cuisine_equipee', 'terrasse', 'securite', 'ascenseur'],
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
          'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=1200',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200'
        ],
        virtual_tour_url: 'https://my.matterport.com/show/?m=SxQL3iGyvQk',
        status: 'disponible',
        featured: true,
        views_count: 245,
        latitude: 36.7538,
        longitude: 3.0588
      },
      {
        agency_id: agency.id,
        title: 'Penthouse F5 Front de Mer',
        type: 'appartement',
        transaction_type: 'vente',
        price: 18000000,
        surface: 180,
        rooms: 5,
        bedrooms: 4,
        bathrooms: 2,
        floor: 12,
        city: 'Oran',
        wilaya: '31',
        commune: 'Oran',
        address: 'Boulevard Front de Mer',
        description: 'Penthouse d\'exception avec terrasse panoramique de 60m² offrant une vue à 180° sur la Méditerranée. Prestations luxueuses et emplacement unique.',
        features: ['ascenseur', 'terrasse', 'climatisation', 'parking', 'securite', 'meuble'],
        images: [
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
          'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200'
        ],
        status: 'disponible',
        featured: true,
        views_count: 189,
        latitude: 35.6969,
        longitude: -0.6331
      },
      {
        agency_id: agency.id,
        title: 'Local Commercial Hypercentre',
        type: 'commercial',
        transaction_type: 'location',
        price: 250000,
        surface: 300,
        rooms: 1,
        city: 'Constantine',
        wilaya: '25',
        commune: 'Constantine',
        address: 'Rue Larbi Ben M\'Hidi',
        description: 'Local commercial premium en plein cœur du centre-ville. Grande vitrine, excellent passage, idéal pour commerce de détail ou showroom.',
        features: ['climatisation', 'parking', 'acces_handicapes', 'securite'],
        images: [
          'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1200',
          'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=1200'
        ],
        status: 'disponible',
        views_count: 76,
        latitude: 36.3650,
        longitude: 6.6147
      },
      {
        agency_id: agency.id,
        title: 'Terrain Agricole 5 Hectares',
        type: 'terrain',
        transaction_type: 'vente',
        price: 15000000,
        surface: 50000,
        city: 'Blida',
        wilaya: '09',
        commune: 'Boufarik',
        address: 'Route de Boufarik',
        description: 'Terrain agricole fertile avec accès direct à l\'eau et l\'électricité. Idéal pour projet agricole ou investissement.',
        features: [],
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200',
          'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200'
        ],
        status: 'disponible',
        views_count: 34,
        latitude: 36.4819,
        longitude: 2.8277
      },
      {
        agency_id: agency.id,
        title: 'Appartement F3 Rénové Centre-Ville',
        type: 'appartement',
        transaction_type: 'location',
        price: 65000,
        surface: 90,
        rooms: 3,
        bedrooms: 2,
        bathrooms: 1,
        floor: 3,
        city: 'Tizi Ouzou',
        wilaya: '15',
        commune: 'Tizi Ouzou',
        address: 'Boulevard Colonel Amirouche',
        description: 'Bel appartement entièrement rénové, lumineux et bien agencé. Proche de toutes commodités, idéal pour famille.',
        features: ['climatisation', 'balcon', 'meuble'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
          'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200'
        ],
        status: 'disponible',
        views_count: 92,
        latitude: 36.7119,
        longitude: 4.0456
      },
      {
        agency_id: agency.id,
        title: 'Villa Traditionnelle avec Cachet',
        type: 'villa',
        transaction_type: 'vente',
        price: 22000000,
        surface: 350,
        rooms: 6,
        bedrooms: 4,
        bathrooms: 3,
        city: 'Bejaia',
        wilaya: '06',
        commune: 'Bejaia',
        address: 'Quartier Sidi Ali Lebhar',
        description: 'Magnifique villa de style mauresque avec patio central, fontaine et jardins. Architecture authentique et charme incomparable.',
        features: ['jardin', 'garage', 'terrasse', 'cheminee'],
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200',
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200'
        ],
        status: 'disponible',
        featured: true,
        views_count: 156,
        latitude: 36.7509,
        longitude: 5.0560
      }
    ];

    const { data: createdProperties, error: propertiesError } = await supabase
      .from('properties')
      .insert(properties)
      .select();

    if (propertiesError) {
      console.error('⚠️  Avertissement - Erreur création biens:', propertiesError.message);
    } else {
      console.log(`✅ ${createdProperties.length} biens immobiliers créés`);
    }

    // Créer quelques leads de démonstration
    console.log('\n📦 Création de leads de démonstration...');

    const leads = [
      {
        agency_id: agency.id,
        name: 'Ahmed Benali',
        email: 'ahmed.benali@email.dz',
        phone: '+213 555 111 222',
        source: 'site_web',
        status: 'nouveau',
        notes: 'Intéressé par les villas à Hydra, budget 30-40M DA'
      },
      {
        agency_id: agency.id,
        name: 'Fatima Mansouri',
        email: 'f.mansouri@email.dz',
        phone: '+213 555 333 444',
        source: 'site_web',
        property_id: createdProperties?.[1]?.id,
        status: 'contacte',
        notes: 'Recherche appartement F4/F5 vue mer à Oran'
      },
      {
        agency_id: agency.id,
        name: 'Karim Hadj',
        email: 'karim.h@email.dz',
        phone: '+213 555 555 666',
        source: 'site_web',
        status: 'qualifie',
        notes: 'Investisseur, recherche terrain ou local commercial'
      }
    ];

    const { data: createdLeads, error: leadsError } = await supabase
      .from('leads')
      .insert(leads)
      .select();

    if (leadsError) {
      console.error('⚠️  Avertissement - Erreur création leads:', leadsError.message);
    } else {
      console.log(`✅ ${createdLeads?.length || 0} leads créés`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Configuration terminée avec succès!');
    console.log('='.repeat(60));

    console.log('\n📊 Résumé:');
    console.log('   ✅ Agence:', agency.name);
    console.log('   ✅ Plan: Premium (1 an)');
    console.log('   ✅ Biens: ' + (createdProperties?.length || 0) + ' propriétés');
    console.log('   ✅ Leads: ' + (createdLeads?.length || 0) + ' prospects');

    console.log('\n🔗 Accès rapides:');
    console.log('   🏠 Dashboard: http://localhost:3000/dashboard');
    console.log('   🌐 Site vitrine: http://localhost:3000/agence/' + agency.slug);
    console.log('   🏘️ Gestion des biens: http://localhost:3000/dashboard/biens');
    console.log('   👥 Gestion des leads: http://localhost:3000/dashboard/leads');
    console.log('   📊 Analytics: http://localhost:3000/dashboard/analytics');

    console.log('\n💡 Prochaines étapes:');
    console.log('   1. Rechargez la page du dashboard');
    console.log('   2. Explorez les différentes sections');
    console.log('   3. Personnalisez le branding de votre agence');
    console.log('   4. Ajoutez de nouveaux biens');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

quickSetup();