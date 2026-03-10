-- =============================================================================
-- AqarVision - Complete Database Schema
-- =============================================================================
-- Usage: Execute this script on a fresh Supabase database to create all tables.
-- Order matters: agencies → properties → leads (foreign key dependencies).
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. AGENCIES
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE agencies (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  logo_url         TEXT,
  cover_image_url  TEXT,
  primary_color    TEXT NOT NULL DEFAULT '#2563EB',
  phone            TEXT,
  email            TEXT,
  website          TEXT,
  address          TEXT,
  wilaya           TEXT,
  slogan           TEXT,
  registre_commerce TEXT,
  active_plan      TEXT NOT NULL DEFAULT 'starter',
  locale           TEXT NOT NULL DEFAULT 'fr',

  -- Geolocation
  latitude         NUMERIC,
  longitude        NUMERIC,

  -- Social Media
  instagram_url    TEXT,
  facebook_url     TEXT,
  tiktok_url       TEXT,

  -- Luxury Branding (Enterprise)
  secondary_color       TEXT,
  hero_video_url        TEXT,
  hero_style            TEXT NOT NULL DEFAULT 'cover',
  font_style            TEXT NOT NULL DEFAULT 'elegant',
  theme_mode            TEXT NOT NULL DEFAULT 'dark',
  tagline               TEXT,
  stats_years           INTEGER,
  stats_properties_sold INTEGER,
  stats_clients         INTEGER,

  -- Timestamps
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT chk_active_plan CHECK (active_plan IN ('starter', 'pro', 'enterprise')),
  CONSTRAINT chk_locale      CHECK (locale IN ('fr', 'ar')),
  CONSTRAINT chk_hero_style  CHECK (hero_style IN ('color', 'cover', 'video')),
  CONSTRAINT chk_font_style  CHECK (font_style IN ('modern', 'classic', 'elegant')),
  CONSTRAINT chk_theme_mode  CHECK (theme_mode IN ('light', 'dark')),
  CONSTRAINT chk_stats_years           CHECK (stats_years IS NULL OR stats_years >= 0),
  CONSTRAINT chk_stats_properties_sold CHECK (stats_properties_sold IS NULL OR stats_properties_sold >= 0),
  CONSTRAINT chk_stats_clients         CHECK (stats_clients IS NULL OR stats_clients >= 0)
);

-- Indexes
CREATE UNIQUE INDEX idx_agencies_slug     ON agencies(slug);
CREATE INDEX idx_agencies_owner_id        ON agencies(owner_id);
CREATE INDEX idx_agencies_active_plan     ON agencies(active_plan);

-- RLS
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view agencies"
  ON agencies FOR SELECT
  USING (true);

CREATE POLICY "Owners can update own agency"
  ON agencies FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create agency"
  ON agencies FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. PROPERTIES
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE properties (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id        UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  price            NUMERIC NOT NULL,
  surface          NUMERIC,
  rooms            INTEGER,
  bathrooms        INTEGER,
  type             TEXT,
  transaction_type TEXT NOT NULL DEFAULT 'sale',
  wilaya           TEXT,
  address          TEXT,
  images           TEXT[] NOT NULL DEFAULT '{}',
  latitude         NUMERIC,
  longitude        NUMERIC,

  -- Timestamps
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT chk_transaction_type CHECK (transaction_type IN ('sale', 'rent')),
  CONSTRAINT chk_price_positive   CHECK (price >= 0),
  CONSTRAINT chk_surface_positive CHECK (surface IS NULL OR surface >= 0),
  CONSTRAINT chk_rooms_positive   CHECK (rooms IS NULL OR rooms >= 0),
  CONSTRAINT chk_bathrooms_positive CHECK (bathrooms IS NULL OR bathrooms >= 0)
);

-- Indexes
CREATE INDEX idx_properties_agency_id        ON properties(agency_id);
CREATE INDEX idx_properties_transaction_type  ON properties(transaction_type);
CREATE INDEX idx_properties_created_at        ON properties(created_at DESC);

-- RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view properties"
  ON properties FOR SELECT
  USING (true);

CREATE POLICY "Agency owners can manage properties"
  ON properties FOR ALL
  USING (agency_id IN (
    SELECT id FROM agencies WHERE owner_id = auth.uid()
  ));

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. LEADS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id   UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT,
  message     TEXT,
  source      TEXT NOT NULL DEFAULT 'contact_form',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT chk_lead_source       CHECK (source IN ('contact_form', 'property_detail', 'whatsapp')),
  CONSTRAINT chk_lead_name_length  CHECK (char_length(name) >= 2),
  CONSTRAINT chk_lead_phone_length CHECK (char_length(phone) >= 9)
);

-- Indexes
CREATE INDEX idx_leads_agency_id  ON leads(agency_id);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agencies can view own leads"
  ON leads FOR SELECT
  USING (agency_id IN (
    SELECT id FROM agencies WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Public can insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. STORAGE BUCKET
-- ─────────────────────────────────────────────────────────────────────────────
-- Note: Execute in Supabase Dashboard or via supabase CLI:
--   INSERT INTO storage.buckets (id, name, public) VALUES ('public', 'public', true);
-- Cover images are stored at: agencies/{agency_id}/branding/cover.{ext}
