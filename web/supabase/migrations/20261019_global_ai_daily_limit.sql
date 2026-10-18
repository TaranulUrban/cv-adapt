CREATE OR REPLACE FUNCTION public.reserve_ai_generation(p_cv_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_user_id uuid;
  v_user_count integer;
  v_global_count integer;
  v_request_id uuid;
  v_today_start timestamptz;
BEGIN
  v_user_id := (SELECT auth.uid());

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Serialize all AI reservations across users.
  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      'cv_adapt_global_ai_reservations',
      0
    )
  );

  -- Preserve the per-user lock.
  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_user_id::text, 0)
  );

  IF NOT EXISTS (
    SELECT 1
    FROM public.cvs
    WHERE id = p_cv_id
      AND user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'CV not found or access denied';
  END IF;

  v_today_start :=
    date_trunc('day', now() AT TIME ZONE 'UTC')
    AT TIME ZONE 'UTC';

  -- Maximum 5 reservations per user per UTC day.
  SELECT COUNT(*)
  INTO v_user_count
  FROM public.ai_generation_requests
  WHERE user_id = v_user_id
    AND created_at >= v_today_start;

  IF v_user_count >= 5 THEN
    RAISE EXCEPTION 'Daily AI generation limit reached';
  END IF;

  -- Maximum 100 reservations globally per UTC day.
  SELECT COUNT(*)
  INTO v_global_count
  FROM public.ai_generation_requests
  WHERE created_at >= v_today_start;

  IF v_global_count >= 100 THEN
    RAISE EXCEPTION 'Global daily AI generation limit reached';
  END IF;

  INSERT INTO public.ai_generation_requests (
    user_id,
    original_cv_id,
    status
  )
  VALUES (
    v_user_id,
    p_cv_id,
    'reserved'
  )
  RETURNING id INTO v_request_id;

  RETURN v_request_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.reserve_ai_generation(uuid)
FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.reserve_ai_generation(uuid)
TO authenticated, service_role;
