-- CV Adapt - Atomic AI generation reservation

CREATE OR REPLACE FUNCTION public.reserve_ai_generation(
  p_cv_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_count INTEGER;
  v_request_id UUID;
BEGIN
  v_user_id := (SELECT auth.uid());

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Serialize reservations for the same user.
  PERFORM pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_user_id::text, 0)
  );

  -- Verify ownership of the original CV.
  IF NOT EXISTS (
    SELECT 1
    FROM public.cvs
    WHERE id = p_cv_id
      AND user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'CV not found or access denied';
  END IF;

  -- Count today's reservations (UTC).
  SELECT COUNT(*)
  INTO v_count
  FROM public.ai_generation_requests
  WHERE user_id = v_user_id
    AND created_at >= date_trunc('day', now() AT TIME ZONE 'UTC')
      AT TIME ZONE 'UTC';

  IF v_count >= 5 THEN
    RAISE EXCEPTION 'Daily AI generation limit reached';
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
$$;

REVOKE ALL ON FUNCTION public.reserve_ai_generation(UUID)
FROM PUBLIC;

REVOKE ALL ON FUNCTION public.reserve_ai_generation(UUID)
FROM anon;

GRANT EXECUTE ON FUNCTION public.reserve_ai_generation(UUID)
TO authenticated;