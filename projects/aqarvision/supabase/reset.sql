-- =============================================================================
-- AqarVision — Reset complet (DESTRUCTIF)
-- =============================================================================
-- Supprime TOUS les objets de base de données AqarVision.
-- ⚠️  TOUTES LES DONNÉES SERONT PERDUES DÉFINITIVEMENT.
--
-- Usage :
--   1. Via Supabase Dashboard → SQL Editor → coller et exécuter
--   2. Via CLI : psql $DATABASE_URL -f supabase/reset.sql
--
-- Après reset, relancer setup.sql pour recréer le schéma.
-- =============================================================================

-- Désactiver temporairement les triggers pour éviter les erreurs de cascade
SET session_replication_role = replica;

-- ─── Tables (en ordre inverse des dépendances) ───────────────────────────────

DROP TABLE IF EXISTS media               CASCADE;
DROP TABLE IF EXISTS notifications       CASCADE;
DROP TABLE IF EXISTS subscriptions       CASCADE;
DROP TABLE IF EXISTS analytics_events    CASCADE;
DROP TABLE IF EXISTS property_views      CASCADE;
DROP TABLE IF EXISTS favorites           CASCADE;
DROP TABLE IF EXISTS lead_notes          CASCADE;
DROP TABLE IF EXISTS leads               CASCADE;
DROP TABLE IF EXISTS properties          CASCADE;
DROP TABLE IF EXISTS agency_members      CASCADE;
DROP TABLE IF EXISTS agencies            CASCADE;

-- ─── Functions & Triggers ─────────────────────────────────────────────────────

DROP FUNCTION IF EXISTS update_updated_at() CASCADE;

-- ─── Réactiver les triggers ───────────────────────────────────────────────────

SET session_replication_role = DEFAULT;

-- ─── Confirmation ─────────────────────────────────────────────────────────────

DO $$ BEGIN
  RAISE NOTICE 'Reset terminé. Relancez setup.sql pour recréer le schéma.';
END $$;
