-- =============================================================================
-- Migration 001: Support international des biens immobiliers
-- =============================================================================
-- Ajoute les champs country, city et currency aux biens pour permettre
-- la publication de biens en Espagne, France, Dubai et ailleurs.
-- =============================================================================

-- 1. Ajouter les colonnes à properties
ALTER TABLE properties
  ADD COLUMN country  TEXT NOT NULL DEFAULT 'DZ',
  ADD COLUMN city     TEXT,
  ADD COLUMN currency TEXT NOT NULL DEFAULT 'DZD';

-- 2. Contraintes de validation
ALTER TABLE properties
  ADD CONSTRAINT chk_country_code
    CHECK (char_length(country) = 2 AND country = upper(country)),
  ADD CONSTRAINT chk_currency_code
    CHECK (char_length(currency) = 3 AND currency = upper(currency));

-- 3. Index pour filtrer par pays
CREATE INDEX idx_properties_country ON properties(country);
CREATE INDEX idx_properties_city    ON properties(city) WHERE city IS NOT NULL;

-- 4. Migrer les données existantes : copier wilaya vers city pour les biens DZ
UPDATE properties SET city = wilaya WHERE wilaya IS NOT NULL AND city IS NULL;

-- 5. Ajouter country sur leads (desired_country)
ALTER TABLE leads
  ADD COLUMN desired_country TEXT;
