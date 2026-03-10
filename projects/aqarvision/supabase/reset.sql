-- =============================================================================
-- AqarVision - Database Reset
-- =============================================================================
-- WARNING: This script DROPS all application tables and their data.
-- Execute this BEFORE schema.sql to start fresh.
-- =============================================================================

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS agencies CASCADE;
