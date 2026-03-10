/**
 * Script pour créer une agence de test pour un utilisateur existant
 * Usage: npx tsx scripts/create-agency-for-user.ts
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
const SUPABASE_ANON_KEY = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const USER_EMAIL = 'lucas.yessad@gmail.com';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variables manquantes dans .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAgencyForUser() {
  console.log('🏢 Création d\'une agence de test pour ' + USER_EMAIL + '...\n');

  try {
    // 1. Récupérer l'utilisateur
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: USER_EMAIL,
      password: process.argv[2] || 'your_password_here'
    });

    if (authError || !authData.user) {
      console.error('❌ Erreur de connexion:', authError?.message);
      console.log('\n💡 Usage: npx tsx scripts/create-agency-for-user.ts [votre_mot_de_passe]');
      process.exit(1);
    }

    const userId = authData.user.id;
    console.log('✅ Utilisateur trouvé:', userId);

    // 2. Créer l'agence
    const agencyData = {
      name: 'AqarVision Demo Agency',
      slug: 'aqarvision-demo',
      description: 'Votre agence immobilière de confiance en Algérie. Spécialisée dans la vente, location et gestion de biens immobiliers.',
      email: USER_EMAIL,
      phone: '+213 555 123 456',
      address: '123 Rue Didouche Mourad, Alger',
      city: 'Alger',
      wilaya: '16',
      logo_url: 'https://placehold.co/400x400/1e40af/ffffff?text=AV',
      primary_color: '#1e40af',
      secondary_color: '#fbbf24',
      active_plan: 'premium',
      subscription_status: 'active',
      subscription_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // +1 an
      settings: {
        features: {
          virtualTours: true,
          analytics: true,
          leadManagement: true,
          multiLanguage: true
        },
        notifications: {
          email: true,
          sms: false
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
      process.exit(1);
    }

    console.log('✅ Agence créée:', agency.name);

    // 3. Associer l'utilisateur à l'agence
    const { error: memberError } = await supabase
      .from('agency_members')
      .insert({
        agency_id: agency.id,
        user_id: userId,
        role: 'owner',
        permissions: ['all']
      });

    if (memberError) {
      console.error('❌ Erreur association utilisateur:', memberError);
      process.exit(1);
    }

    console.log('✅ Utilisateur associé comme propriétaire');

    // 4. Créer quelques biens immobiliers
    const properties = [
      {
        agency_id: agency.id,
        title: 'Villa Moderne avec Piscine',
        type: 'villa',
        transaction_type: 'vente',
        price: 25000000,
        surface: 350,
        rooms: 5,
        bedrooms: 4,
        bathrooms: 3,
        city: 'Alger',
        wilaya: '16',
        address: 'Hydra, Alger',
        description: 'Magnifique villa moderne avec piscine, située dans le quartier prisé d\'Hydra.',
        features: ['piscine', 'garage', 'jardin', 'climatisation', 'cuisine_equipee'],
        images: [
          'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
          'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?w=800'
        ],
        status: 'disponible',
        featured: true
      },
      {
        agency_id: agency.id,
        title: 'Appartement F4 Vue Mer',
        type: 'appartement',
        transaction_type: 'vente',
        price: 12000000,
        surface: 120,
        rooms: 4,
        bedrooms: 3,
        bathrooms: 2,
        city: 'Oran',
        wilaya: '31',
        address: 'Front de mer, Oran',
        description: 'Superbe appartement F4 avec vue imprenable sur la mer Méditerranée.',
        features: ['ascenseur', 'balcon', 'climatisation', 'parking'],
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'
        ],
        status: 'disponible',
        featured: true
      },
      {
        agency_id: agency.id,
        title: 'Local Commercial Centre-Ville',
        type: 'commercial',
        transaction_type: 'location',
        price: 150000,
        surface: 200,
        rooms: 1,
        city: 'Constantine',
        wilaya: '25',
        address: 'Centre-ville, Constantine',
        description: 'Local commercial idéalement situé en plein centre-ville, parfait pour tout type de commerce.',
        features: ['climatisation', 'parking', 'acces_handicapes'],
        images: [
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'
        ],
        status: 'disponible'
      },
      {
        agency_id: agency.id,
        title: 'Terrain Constructible',
        type: 'terrain',
        transaction_type: 'vente',
        price: 8000000,
        surface: 500,
        city: 'Tlemcen',
        wilaya: '13',
        address: 'Mansourah, Tlemcen',
        description: 'Terrain constructible avec toutes les commodités, idéal pour projet résidentiel.',
        features: [],
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'
        ],
        status: 'disponible'
      },
      {
        agency_id: agency.id,
        title: 'Duplex F5 Moderne',
        type: 'appartement',
        transaction_type: 'location',
        price: 80000,
        surface: 150,
        rooms: 5,
        bedrooms: 4,
        bathrooms: 2,
        city: 'Blida',
        wilaya: '09',
        address: 'Ouled Yaich, Blida',
        description: 'Duplex moderne entièrement meublé dans résidence sécurisée.',
        features: ['meuble', 'terrasse', 'garage', 'securite', 'climatisation'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
          'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800'
        ],
        status: 'disponible'
      }
    ];

    const { data: createdProperties, error: propertiesError } = await supabase
      .from('properties')
      .insert(properties)
      .select();

    if (propertiesError) {
      console.error('⚠️ Erreur création biens:', propertiesError);
    } else {
      console.log(`✅ ${createdProperties.length} biens créés`);
    }

    console.log('\n🎉 Configuration terminée avec succès!');
    console.log('\n📝 Informations de connexion:');
    console.log('   Email:', USER_EMAIL);
    console.log('   Agence:', agency.name);
    console.log('   Slug:', agency.slug);
    console.log('\n🔗 Liens utiles:');
    console.log('   Dashboard: http://localhost:3000/dashboard');
    console.log('   Site vitrine: http://localhost:3000/agence/' + agency.slug);
    console.log('   Gestion des biens: http://localhost:3000/dashboard/biens');

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

createAgencyForUser();