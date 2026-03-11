-- Supprime les triggers et fonctions résiduels de l'ancien schéma
-- qui tentent d'insérer dans public.profiles (table supprimée)

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_profile_for_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user_signup() CASCADE;

-- Nettoyer toute autre fonction liée à l'ancien schéma
DROP FUNCTION IF EXISTS public.visitor_profiles_updated_at() CASCADE;
