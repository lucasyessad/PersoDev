-- =============================================================================
-- AqarSearch — New User-Facing Tables
-- =============================================================================
-- Creates 6 tables for AqarSearch V2 features:
--   1. viewed_properties           — user-linked property view tracking
--   2. property_notes              — personal notes on properties
--   3. favorite_collections        — named groups of favorites
--   4. favorite_collection_items   — many-to-many: collections <-> favorites
--   5. visit_requests              — structured visit request from users
--   6. agency_responsiveness_stats — pre-calculated agency response metrics
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. VIEWED PROPERTIES (user-linked, distinct from property_views analytics)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS viewed_properties (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID        NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  viewed_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(user_id, property_id)
);

CREATE INDEX IF NOT EXISTS idx_viewed_properties_user_id ON viewed_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_viewed_properties_viewed_at ON viewed_properties(viewed_at DESC);

ALTER TABLE viewed_properties ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'viewed_properties' AND policyname = 'Users can view own viewed_properties') THEN
    CREATE POLICY "Users can view own viewed_properties" ON viewed_properties
      FOR SELECT USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'viewed_properties' AND policyname = 'Users can insert own viewed_properties') THEN
    CREATE POLICY "Users can insert own viewed_properties" ON viewed_properties
      FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'viewed_properties' AND policyname = 'Users can update own viewed_properties') THEN
    CREATE POLICY "Users can update own viewed_properties" ON viewed_properties
      FOR UPDATE USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'viewed_properties' AND policyname = 'Users can delete own viewed_properties') THEN
    CREATE POLICY "Users can delete own viewed_properties" ON viewed_properties
      FOR DELETE USING (user_id = auth.uid());
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. PROPERTY NOTES
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS property_notes (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID        NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  content     TEXT        NOT NULL CHECK (char_length(content) <= 1000),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(user_id, property_id)
);

CREATE INDEX IF NOT EXISTS idx_property_notes_user_id ON property_notes(user_id);

ALTER TABLE property_notes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'property_notes' AND policyname = 'Users can view own property_notes') THEN
    CREATE POLICY "Users can view own property_notes" ON property_notes
      FOR SELECT USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'property_notes' AND policyname = 'Users can insert own property_notes') THEN
    CREATE POLICY "Users can insert own property_notes" ON property_notes
      FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'property_notes' AND policyname = 'Users can update own property_notes') THEN
    CREATE POLICY "Users can update own property_notes" ON property_notes
      FOR UPDATE USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'property_notes' AND policyname = 'Users can delete own property_notes') THEN
    CREATE POLICY "Users can delete own property_notes" ON property_notes
      FOR DELETE USING (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_property_notes_updated_at') THEN
    CREATE TRIGGER trg_property_notes_updated_at
      BEFORE UPDATE ON property_notes
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. FAVORITE COLLECTIONS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS favorite_collections (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_favorite_collections_user_id ON favorite_collections(user_id);

ALTER TABLE favorite_collections ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'favorite_collections' AND policyname = 'Users can view own favorite_collections') THEN
    CREATE POLICY "Users can view own favorite_collections" ON favorite_collections
      FOR SELECT USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'favorite_collections' AND policyname = 'Users can insert own favorite_collections') THEN
    CREATE POLICY "Users can insert own favorite_collections" ON favorite_collections
      FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'favorite_collections' AND policyname = 'Users can update own favorite_collections') THEN
    CREATE POLICY "Users can update own favorite_collections" ON favorite_collections
      FOR UPDATE USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'favorite_collections' AND policyname = 'Users can delete own favorite_collections') THEN
    CREATE POLICY "Users can delete own favorite_collections" ON favorite_collections
      FOR DELETE USING (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_favorite_collections_updated_at') THEN
    CREATE TRIGGER trg_favorite_collections_updated_at
      BEFORE UPDATE ON favorite_collections
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. FAVORITE COLLECTION ITEMS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS favorite_collection_items (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID        NOT NULL REFERENCES favorite_collections(id) ON DELETE CASCADE,
  favorite_id   UUID        NOT NULL REFERENCES favorites(id) ON DELETE CASCADE,
  added_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(collection_id, favorite_id)
);

CREATE INDEX IF NOT EXISTS idx_fci_collection_id ON favorite_collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_fci_favorite_id ON favorite_collection_items(favorite_id);

ALTER TABLE favorite_collection_items ENABLE ROW LEVEL SECURITY;

-- RLS via collection ownership: user must own the parent collection
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'favorite_collection_items' AND policyname = 'Users can view own collection items') THEN
    CREATE POLICY "Users can view own collection items" ON favorite_collection_items
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM favorite_collections fc
          WHERE fc.id = collection_id AND fc.user_id = auth.uid()
        )
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'favorite_collection_items' AND policyname = 'Users can insert own collection items') THEN
    CREATE POLICY "Users can insert own collection items" ON favorite_collection_items
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM favorite_collections fc
          WHERE fc.id = collection_id AND fc.user_id = auth.uid()
        )
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'favorite_collection_items' AND policyname = 'Users can delete own collection items') THEN
    CREATE POLICY "Users can delete own collection items" ON favorite_collection_items
      FOR DELETE USING (
        EXISTS (
          SELECT 1 FROM favorite_collections fc
          WHERE fc.id = collection_id AND fc.user_id = auth.uid()
        )
      );
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. VISIT REQUESTS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS visit_requests (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID        NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  agency_id   UUID        NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  name        TEXT        NOT NULL,
  phone       TEXT        NOT NULL,
  email       TEXT,
  message     TEXT,
  status      TEXT        NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'confirmed', 'declined', 'completed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_visit_requests_agency_id ON visit_requests(agency_id);
CREATE INDEX IF NOT EXISTS idx_visit_requests_property_id ON visit_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_visit_requests_user_id ON visit_requests(user_id);

ALTER TABLE visit_requests ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  -- Anyone can create a visit request (public insert)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'visit_requests' AND policyname = 'Anyone can create visit requests') THEN
    CREATE POLICY "Anyone can create visit requests" ON visit_requests
      FOR INSERT WITH CHECK (true);
  END IF;
  -- Users can view their own requests
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'visit_requests' AND policyname = 'Users can view own visit_requests') THEN
    CREATE POLICY "Users can view own visit_requests" ON visit_requests
      FOR SELECT USING (user_id = auth.uid());
  END IF;
  -- Agency members can view their agency's requests
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'visit_requests' AND policyname = 'Agency members can view agency visit_requests') THEN
    CREATE POLICY "Agency members can view agency visit_requests" ON visit_requests
      FOR SELECT USING (
        agency_id IN (SELECT get_user_agency_ids())
      );
  END IF;
  -- Agency members can update their agency's requests (status changes)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'visit_requests' AND policyname = 'Agency members can update agency visit_requests') THEN
    CREATE POLICY "Agency members can update agency visit_requests" ON visit_requests
      FOR UPDATE USING (
        agency_id IN (SELECT get_user_agency_ids())
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_visit_requests_updated_at') THEN
    CREATE TRIGGER trg_visit_requests_updated_at
      BEFORE UPDATE ON visit_requests
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. AGENCY RESPONSIVENESS STATS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS agency_responsiveness_stats (
  agency_id               UUID        PRIMARY KEY REFERENCES agencies(id) ON DELETE CASCADE,
  avg_response_time_minutes INTEGER,
  response_rate           NUMERIC(5,2),
  total_conversations     INTEGER     NOT NULL DEFAULT 0,
  responsiveness_level    TEXT        CHECK (responsiveness_level IN ('fast', 'moderate', 'slow', 'unrated'))
                                     DEFAULT 'unrated',
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE agency_responsiveness_stats ENABLE ROW LEVEL SECURITY;

-- Public read access (used in search results)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agency_responsiveness_stats' AND policyname = 'Public can read responsiveness stats') THEN
    CREATE POLICY "Public can read responsiveness stats" ON agency_responsiveness_stats
      FOR SELECT USING (true);
  END IF;
END $$;
