-- ============================================================================
-- Thèmes de branding, personnalisation avancée et multi-wilayas
-- ============================================================================

-- Nouveaux champs branding sur agencies
ALTER TABLE public.agencies
  ADD COLUMN IF NOT EXISTS theme text NOT NULL DEFAULT 'classic',
  ADD COLUMN IF NOT EXISTS accent_color text,
  ADD COLUMN IF NOT EXISTS border_style text NOT NULL DEFAULT 'rounded';

-- Table multi-wilayas
CREATE TABLE IF NOT EXISTS public.agency_wilayas (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id        uuid NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  wilaya           text NOT NULL,
  address          text,
  is_headquarters  boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agency_wilayas_agency_id ON public.agency_wilayas(agency_id);
CREATE INDEX IF NOT EXISTS idx_agency_wilayas_wilaya ON public.agency_wilayas(wilaya);

-- RLS
ALTER TABLE public.agency_wilayas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agency_wilayas_select_public"
  ON public.agency_wilayas FOR SELECT USING (true);

CREATE POLICY "agency_wilayas_all_owner"
  ON public.agency_wilayas FOR ALL
  USING (
    agency_id IN (
      SELECT a.id FROM public.agencies a
      WHERE a.owner_id = auth.uid()
    )
  );

-- Migration des données existantes
INSERT INTO public.agency_wilayas (agency_id, wilaya, is_headquarters)
SELECT id, wilaya, true
FROM public.agencies
WHERE wilaya IS NOT NULL AND wilaya != ''
ON CONFLICT DO NOTHING;
