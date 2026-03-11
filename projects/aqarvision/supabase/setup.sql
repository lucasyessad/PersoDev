-- =============================================================================
-- AqarVision — Setup complet (idempotent)
-- =============================================================================
-- Crée tous les objets de base de données en une seule exécution.
-- Peut être relancé sans erreur grâce aux IF NOT EXISTS / OR REPLACE.
--
-- Usage :
--   1. Via Supabase Dashboard → SQL Editor → coller et exécuter
--   2. Via CLI : psql $DATABASE_URL -f supabase/setup.sql
--
-- Tables (11) :
--   1. agencies            — Agences immobilières
--   2. agency_members      — Membres/agents d'une agence
--   3. properties          — Biens immobiliers (avec support international)
--   4. leads               — Contacts/demandes reçues
--   5. lead_notes          — Notes internes sur les leads
--   6. favorites           — Biens favoris des visiteurs
--   7. property_views      — Statistiques de vues par bien
--   8. analytics_events    — Événements analytics
--   9. subscriptions       — Abonnements et facturation
--  10. notifications       — Notifications internes
--  11. media               — Gestion centralisée des fichiers/images
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. AGENCIES
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS agencies (
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
  custom_domain    TEXT UNIQUE,

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

CREATE UNIQUE INDEX IF NOT EXISTS idx_agencies_slug          ON agencies(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_agencies_custom_domain ON agencies(custom_domain) WHERE custom_domain IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_agencies_owner_id             ON agencies(owner_id);
CREATE INDEX IF NOT EXISTS idx_agencies_active_plan          ON agencies(active_plan);
CREATE INDEX IF NOT EXISTS idx_agencies_wilaya               ON agencies(wilaya);

ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agencies' AND policyname = 'Public can view agencies') THEN
    CREATE POLICY "Public can view agencies" ON agencies FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agencies' AND policyname = 'Owners can update own agency') THEN
    CREATE POLICY "Owners can update own agency" ON agencies FOR UPDATE USING (owner_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agencies' AND policyname = 'Authenticated users can create agency') THEN
    CREATE POLICY "Authenticated users can create agency" ON agencies FOR INSERT WITH CHECK (owner_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agencies' AND policyname = 'Owners can delete own agency') THEN
    CREATE POLICY "Owners can delete own agency" ON agencies FOR DELETE USING (owner_id = auth.uid());
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. AGENCY MEMBERS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS agency_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id  UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'agent',
  full_name  TEXT,
  phone      TEXT,
  email      TEXT,
  avatar_url TEXT,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  invited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  joined_at  TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_member_role CHECK (role IN ('admin', 'agent', 'viewer')),
  CONSTRAINT uq_agency_member UNIQUE (agency_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_agency_members_agency_id ON agency_members(agency_id);
CREATE INDEX IF NOT EXISTS idx_agency_members_user_id   ON agency_members(user_id);

ALTER TABLE agency_members ENABLE ROW LEVEL SECURITY;

-- Fonction SECURITY DEFINER pour éviter la récursion infinie dans les policies
CREATE OR REPLACE FUNCTION get_user_agency_ids(uid UUID)
RETURNS TABLE(agency_id UUID, role TEXT) AS $$
  SELECT am.agency_id, am.role
  FROM agency_members am
  WHERE am.user_id = uid AND am.is_active = true;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agency_members' AND policyname = 'Members can view own agency members') THEN
    CREATE POLICY "Members can view own agency members" ON agency_members FOR SELECT
      USING (
        user_id = auth.uid()
        OR agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agency_members' AND policyname = 'Agency owners can manage members') THEN
    CREATE POLICY "Agency owners can manage members" ON agency_members FOR ALL
      USING (
        agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
      );
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. PROPERTIES
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS properties (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id        UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  created_by       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title            TEXT NOT NULL,
  description      TEXT,
  price            NUMERIC NOT NULL,
  surface          NUMERIC,
  rooms            INTEGER,
  bathrooms        INTEGER,
  type             TEXT,
  transaction_type TEXT NOT NULL DEFAULT 'sale',
  status           TEXT NOT NULL DEFAULT 'active',
  country          TEXT NOT NULL DEFAULT 'DZ',
  city             TEXT,
  wilaya           TEXT,
  commune          TEXT,
  address          TEXT,
  currency         TEXT NOT NULL DEFAULT 'DZD',
  images           TEXT[] NOT NULL DEFAULT '{}',
  features         TEXT[] NOT NULL DEFAULT '{}',
  latitude         NUMERIC,
  longitude        NUMERIC,
  is_featured      BOOLEAN NOT NULL DEFAULT false,
  views_count      INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at     TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT chk_transaction_type  CHECK (transaction_type IN ('sale', 'rent')),
  CONSTRAINT chk_property_status   CHECK (status IN ('draft', 'active', 'sold', 'rented', 'archived')),
  CONSTRAINT chk_price_positive    CHECK (price >= 0),
  CONSTRAINT chk_surface_positive  CHECK (surface IS NULL OR surface >= 0),
  CONSTRAINT chk_rooms_positive    CHECK (rooms IS NULL OR rooms >= 0),
  CONSTRAINT chk_bathrooms_positive CHECK (bathrooms IS NULL OR bathrooms >= 0),
  CONSTRAINT chk_country_code      CHECK (char_length(country) = 2 AND country = upper(country)),
  CONSTRAINT chk_currency_code     CHECK (char_length(currency) = 3 AND currency = upper(currency))
);

CREATE INDEX IF NOT EXISTS idx_properties_agency_id        ON properties(agency_id);
CREATE INDEX IF NOT EXISTS idx_properties_transaction_type  ON properties(transaction_type);
CREATE INDEX IF NOT EXISTS idx_properties_status            ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_country           ON properties(country);
CREATE INDEX IF NOT EXISTS idx_properties_city              ON properties(city) WHERE city IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_properties_wilaya            ON properties(wilaya);
CREATE INDEX IF NOT EXISTS idx_properties_type              ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_price             ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_is_featured       ON properties(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_properties_created_at        ON properties(created_at DESC);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'properties' AND policyname = 'Public can view active properties') THEN
    CREATE POLICY "Public can view active properties" ON properties FOR SELECT
      USING (status = 'active' OR agency_id IN (
        SELECT id FROM agencies WHERE owner_id = auth.uid()
      ));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'properties' AND policyname = 'Agency members can manage properties') THEN
    CREATE POLICY "Agency members can manage properties" ON properties FOR ALL
      USING (
        agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
        OR agency_id IN (SELECT am.agency_id FROM get_user_agency_ids(auth.uid()) am WHERE am.role IN ('admin', 'agent'))
      );
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. LEADS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id       UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  property_id     UUID REFERENCES properties(id) ON DELETE SET NULL,
  assigned_to     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  phone           TEXT NOT NULL,
  email           TEXT,
  message         TEXT,
  source          TEXT NOT NULL DEFAULT 'contact_form',
  status          TEXT NOT NULL DEFAULT 'new',
  priority        TEXT NOT NULL DEFAULT 'normal',
  budget_min      NUMERIC,
  budget_max      NUMERIC,
  desired_country TEXT,
  desired_wilaya  TEXT,
  desired_type    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  contacted_at    TIMESTAMPTZ,

  CONSTRAINT chk_lead_source       CHECK (source IN ('contact_form', 'property_detail', 'whatsapp', 'phone', 'walk_in', 'referral')),
  CONSTRAINT chk_lead_status       CHECK (status IN ('new', 'contacted', 'qualified', 'negotiation', 'converted', 'lost')),
  CONSTRAINT chk_lead_priority     CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  CONSTRAINT chk_lead_name_length  CHECK (char_length(name) >= 2),
  CONSTRAINT chk_lead_phone_length CHECK (char_length(phone) >= 9)
);

CREATE INDEX IF NOT EXISTS idx_leads_agency_id   ON leads(agency_id);
CREATE INDEX IF NOT EXISTS idx_leads_status      ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_created_at  ON leads(created_at DESC);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Agency members can view own leads') THEN
    CREATE POLICY "Agency members can view own leads" ON leads FOR SELECT
      USING (
        agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
        OR agency_id IN (SELECT am.agency_id FROM get_user_agency_ids(auth.uid()) am)
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Agency members can manage leads') THEN
    CREATE POLICY "Agency members can manage leads" ON leads FOR ALL
      USING (
        agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
        OR agency_id IN (SELECT am.agency_id FROM get_user_agency_ids(auth.uid()) am WHERE am.role IN ('admin', 'agent'))
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Public can insert leads') THEN
    CREATE POLICY "Public can insert leads" ON leads FOR INSERT WITH CHECK (true);
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. LEAD NOTES
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS lead_notes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id    UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON lead_notes(lead_id);

ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lead_notes' AND policyname = 'Agency members can manage lead notes') THEN
    CREATE POLICY "Agency members can manage lead notes" ON lead_notes FOR ALL
      USING (
        lead_id IN (
          SELECT l.id FROM leads l
          WHERE l.agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
             OR l.agency_id IN (SELECT am.agency_id FROM get_user_agency_ids(auth.uid()) am)
        )
      );
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. FAVORITES
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT uq_favorite UNIQUE (user_id, property_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id     ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property_id ON favorites(property_id);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'favorites' AND policyname = 'Users can manage own favorites') THEN
    CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (user_id = auth.uid());
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 7. PROPERTY VIEWS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS property_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  agency_id   UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  viewer_id   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_hash     TEXT,
  user_agent  TEXT,
  referrer    TEXT,
  viewed_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_agency_id   ON property_views(agency_id);
CREATE INDEX IF NOT EXISTS idx_property_views_viewed_at   ON property_views(viewed_at DESC);

ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'property_views' AND policyname = 'Agency members can view own property views') THEN
    CREATE POLICY "Agency members can view own property views" ON property_views FOR SELECT
      USING (
        agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
        OR agency_id IN (SELECT am.agency_id FROM get_user_agency_ids(auth.uid()) am)
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'property_views' AND policyname = 'Public can insert property views') THEN
    CREATE POLICY "Public can insert property views" ON property_views FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'property_views' AND policyname = 'Agency owners can delete property views') THEN
    CREATE POLICY "Agency owners can delete property views" ON property_views FOR DELETE
      USING (agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid()));
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 8. ANALYTICS EVENTS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS analytics_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id  UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}',
  page_url   TEXT,
  ip_hash    TEXT,
  user_agent TEXT,
  referrer   TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_event_type CHECK (event_type IN (
    'page_view', 'property_click', 'contact_click', 'phone_click',
    'whatsapp_click', 'share_click', 'map_click', 'gallery_view',
    'search', 'filter_change', 'lead_submit'
  )),
  CONSTRAINT chk_event_data_size CHECK (pg_column_size(event_data) <= 4096)
);

CREATE INDEX IF NOT EXISTS idx_analytics_agency_id   ON analytics_events(agency_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type  ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at  ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id  ON analytics_events(session_id);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'analytics_events' AND policyname = 'Agency members can view own analytics') THEN
    CREATE POLICY "Agency members can view own analytics" ON analytics_events FOR SELECT
      USING (
        agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
        OR agency_id IN (SELECT am.agency_id FROM get_user_agency_ids(auth.uid()) am)
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'analytics_events' AND policyname = 'Public can insert analytics events') THEN
    CREATE POLICY "Public can insert analytics events" ON analytics_events FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'analytics_events' AND policyname = 'Agency owners can delete analytics events') THEN
    CREATE POLICY "Agency owners can delete analytics events" ON analytics_events FOR DELETE
      USING (agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid()));
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 9. SUBSCRIPTIONS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS subscriptions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id         UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  plan              TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'active',
  price_dzd         NUMERIC NOT NULL,
  billing_cycle     TEXT NOT NULL DEFAULT 'monthly',
  payment_method    TEXT,
  payment_reference TEXT,
  starts_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at           TIMESTAMPTZ,
  trial_ends_at     TIMESTAMPTZ,
  cancelled_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_sub_plan    CHECK (plan IN ('starter', 'pro', 'enterprise')),
  CONSTRAINT chk_sub_status  CHECK (status IN ('trial', 'active', 'past_due', 'cancelled', 'expired')),
  CONSTRAINT chk_sub_cycle   CHECK (billing_cycle IN ('monthly', 'quarterly', 'yearly')),
  CONSTRAINT chk_sub_payment CHECK (payment_method IS NULL OR payment_method IN ('ccp', 'baridi_mob', 'virement', 'cash', 'dahabia'))
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_agency_id ON subscriptions(agency_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status    ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_ends_at   ON subscriptions(ends_at);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Agency owners can view own subscriptions') THEN
    CREATE POLICY "Agency owners can view own subscriptions" ON subscriptions FOR SELECT
      USING (agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid()));
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 10. NOTIFICATIONS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_id  UUID REFERENCES agencies(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT,
  data       JSONB DEFAULT '{}',
  is_read    BOOLEAN NOT NULL DEFAULT false,
  read_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_notif_type CHECK (type IN (
    'new_lead', 'lead_assigned', 'lead_status_change',
    'subscription_expiring', 'subscription_expired', 'subscription_renewed',
    'property_published', 'property_view_milestone',
    'member_invited', 'member_joined',
    'system'
  ))
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id    ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_agency_id  ON notifications(agency_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read    ON notifications(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can view own notifications') THEN
    CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can update own notifications') THEN
    CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 11. MEDIA
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS media (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id   UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  file_name   TEXT NOT NULL,
  file_path   TEXT NOT NULL,
  file_size   INTEGER NOT NULL,
  mime_type   TEXT NOT NULL,
  width       INTEGER,
  height      INTEGER,
  alt_text    TEXT,
  category    TEXT NOT NULL DEFAULT 'property',
  public_url  TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_media_category CHECK (category IN ('property', 'branding', 'avatar', 'document')),
  CONSTRAINT chk_file_size      CHECK (file_size > 0)
);

CREATE INDEX IF NOT EXISTS idx_media_agency_id  ON media(agency_id);
CREATE INDEX IF NOT EXISTS idx_media_category   ON media(category);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media' AND policyname = 'Public can view media') THEN
    CREATE POLICY "Public can view media" ON media FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media' AND policyname = 'Agency members can manage media') THEN
    CREATE POLICY "Agency members can manage media" ON media FOR ALL
      USING (
        agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
        OR agency_id IN (SELECT am.agency_id FROM get_user_agency_ids(auth.uid()) am WHERE am.role IN ('admin', 'agent'))
      );
  END IF;
END $$;


-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_agencies_updated_at') THEN
    CREATE TRIGGER trg_agencies_updated_at BEFORE UPDATE ON agencies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_properties_updated_at') THEN
    CREATE TRIGGER trg_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_leads_updated_at') THEN
    CREATE TRIGGER trg_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_subscriptions_updated_at') THEN
    CREATE TRIGGER trg_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_agency_members_updated_at') THEN
    CREATE TRIGGER trg_agency_members_updated_at BEFORE UPDATE ON agency_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;


-- =============================================================================
-- STORAGE BUCKET (à exécuter manuellement si absent)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('public', 'public', true)
ON CONFLICT (id) DO NOTHING;
