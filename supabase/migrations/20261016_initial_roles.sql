
-- CV Adapt - Initial roles and security
-- Migration: 20261016_initial_roles.sql
-- For a fresh Supabase database.
-- DO NOT run again on the existing database.

-- 1. User roles
CREATE TYPE public.app_role AS ENUM (
  'admin',
  'tester',
  'client'
);

-- 2. User profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY
    REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Check whether the current user is an admin
CREATE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role = 'admin'::public.app_role
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 4. Row Level Security policies
CREATE POLICY "Users can read own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Admins can read all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING ((SELECT public.is_admin()));

-- 5. Create a profile when a user registers
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'client');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 6. Create profiles for existing users
INSERT INTO public.profiles (id, role)
SELECT id, 'client'::public.app_role
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 7. Secure role management
CREATE FUNCTION public.change_user_role(
  target_user_id UUID,
  new_role public.app_role
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_role public.app_role;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot change own role';
  END IF;

  IF new_role NOT IN ('client', 'tester') THEN
    RAISE EXCEPTION 'Invalid target role';
  END IF;

  SELECT role INTO current_role
  FROM public.profiles
  WHERE id = target_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  IF current_role = 'admin' THEN
    RAISE EXCEPTION 'Cannot modify an admin';
  END IF;

  UPDATE public.profiles
  SET role = new_role
  WHERE id = target_user_id;
END;
$$;

-- 8. Restrict permissions
REVOKE ALL ON FUNCTION public.change_user_role(UUID, public.app_role)
FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.change_user_role(UUID, public.app_role)
FROM anon;

GRANT EXECUTE ON FUNCTION public.change_user_role(UUID, public.app_role)
TO authenticated;

REVOKE UPDATE ON TABLE public.profiles FROM authenticated;
REVOKE UPDATE ON TABLE public.profiles FROM anon;
