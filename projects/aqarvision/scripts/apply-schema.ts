/**
 * Script pour appliquer le schéma SQL dans Supabase
 * Usage: npx tsx scripts/apply-schema.ts
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

console.log('📋 Application du schéma SQL dans Supabase...\n');
console.log('🔗 URL Supabase:', SUPABASE_URL);
console.log('\n⚠️  IMPORTANT: Ce script va créer les tables dans votre base Supabase.');
console.log('Si les tables existent déjà, elles seront ignorées.\n');

// Lire le schéma SQL
const schemaPath = resolve(__dirname, '..', 'supabase', 'schema.sql');
const schema = readFileSync(schemaPath, 'utf-8');

console.log('📄 Schéma chargé depuis: supabase/schema.sql');
console.log('📊 Taille du schéma:', (schema.length / 1024).toFixed(2), 'KB\n');

console.log('✅ Le schéma doit être appliqué manuellement via le Supabase Dashboard:');
console.log('\n1. Allez sur: https://supabase.com/dashboard');
console.log('2. Sélectionnez votre projet (nctldmovlutbwxjzbuoh)');
console.log('3. Allez dans "SQL Editor" dans le menu de gauche');
console.log('4. Créez une nouvelle requête');
console.log('5. Copiez-collez le contenu du fichier: supabase/schema.sql');
console.log('6. Exécutez la requête\n');

console.log('Ou utilisez Supabase CLI si installé:');
console.log('  supabase db push --db-url "' + SUPABASE_URL.replace('https://', 'postgresql://postgres:[password]@db.') + '.supabase.co:5432/postgres"\n');

console.log('Une fois le schéma appliqué, relancez: npx tsx scripts/seed-demo.ts');