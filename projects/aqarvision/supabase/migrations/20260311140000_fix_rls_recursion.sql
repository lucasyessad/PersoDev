-- =============================================================================
-- Fix: Infinite recursion in agency_members RLS policy
-- =============================================================================
-- La policy "Members can view own agency members" se référençait elle-même
-- (SELECT agency_id FROM agency_members WHERE user_id = auth.uid())
-- ce qui provoque une récursion infinie dans PostgreSQL.
--
-- Solution : utiliser une fonction SECURITY DEFINER qui bypasse le RLS
-- pour récupérer les agency_ids d'un utilisateur sans déclencher les policies.
-- =============================================================================


-- ─── Fonction helper SECURITY DEFINER (bypasse RLS) ──────────────────────────

CREATE OR REPLACE FUNCTION get_user_agency_ids(uid UUID)
RETURNS TABLE(agency_id UUID, role TEXT) AS $$
  SELECT am.agency_id, am.role
  FROM agency_members am
  WHERE am.user_id = uid AND am.is_active = true;
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ─── Recréer les policies agency_members sans auto-référence ─────────────────

DROP POLICY IF EXISTS "Members can view own agency members" ON agency_members;
DROP POLICY IF EXISTS "Agency owners and admins can manage members" ON agency_members;

-- SELECT : l'utilisateur voit sa propre ligne OU est propriétaire de l'agence
CREATE POLICY "Members can view own agency members"
  ON agency_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
  );

-- ALL : seul le propriétaire gère les membres
-- (les admins passent par le backend avec service_role)
CREATE POLICY "Agency owners can manage members"
  ON agency_members FOR ALL
  USING (
    agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
  );


-- ─── Recréer les policies des autres tables avec la fonction helper ───────────

-- Properties
DROP POLICY IF EXISTS "Agency members can manage properties" ON properties;
CREATE POLICY "Agency members can manage properties"
  ON properties FOR ALL
  USING (
    agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
    OR agency_id IN (SELECT am.agency_id FROM get_user_agency_ids(auth.uid()) am WHERE am.role IN ('admin', 'agent'))
  );

-- Leads
DROP POLICY IF EXISTS "Agency members can view own leads" ON leads;
DROP POLICY IF EXISTS "Agency members can manage leads" ON leads;

CREATE POLICY "Agency members can view own leads"
  ON leads FOR SELECT
  USING (
    agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
    OR agency_id IN (SELECT am.agency_id FROM get_user_agency_ids(auth.uid()) am)
  );

CREATE POLICY "Agency members can manage leads"
  ON leads FOR ALL
  USING (
    agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
    OR agency_id IN (SELECT am.agency_id FROM get_user_agency_ids(auth.uid()) am WHERE am.role IN ('admin', 'agent'))
  );

-- Lead notes
DROP POLICY IF EXISTS "Agency members can manage lead notes" ON lead_notes;
CREATE POLICY "Agency members can manage lead notes"
  ON lead_notes FOR ALL
  USING (
    lead_id IN (
      SELECT l.id FROM leads l
      WHERE l.agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
         OR l.agency_id IN (SELECT am.agency_id FROM get_user_agency_ids(auth.uid()) am)
    )
  );

-- Property views
DROP POLICY IF EXISTS "Agency members can view own property views" ON property_views;
CREATE POLICY "Agency members can view own property views"
  ON property_views FOR SELECT
  USING (
    agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
    OR agency_id IN (SELECT am.agency_id FROM get_user_agency_ids(auth.uid()) am)
  );

-- Analytics events
DROP POLICY IF EXISTS "Agency members can view own analytics" ON analytics_events;
CREATE POLICY "Agency members can view own analytics"
  ON analytics_events FOR SELECT
  USING (
    agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
    OR agency_id IN (SELECT am.agency_id FROM get_user_agency_ids(auth.uid()) am)
  );

-- Media
DROP POLICY IF EXISTS "Agency members can manage media" ON media;
CREATE POLICY "Agency members can manage media"
  ON media FOR ALL
  USING (
    agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid())
    OR agency_id IN (SELECT am.agency_id FROM get_user_agency_ids(auth.uid()) am WHERE am.role IN ('admin', 'agent'))
  );
