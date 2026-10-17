-- CV Adapt - Mark failed AI generations

CREATE OR REPLACE FUNCTION public.fail_ai_generation(
  p_user_id UUID,
  p_request_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_updated_id UUID;
BEGIN
  IF p_user_id IS NULL OR p_request_id IS NULL THEN
    RAISE EXCEPTION 'User ID and request ID are required';
  END IF;

  UPDATE public.ai_generation_requests
  SET status = 'failed',
      completed_at = now()
  WHERE id = p_request_id
    AND user_id = p_user_id
    AND status = 'reserved'
  RETURNING id INTO v_updated_id;

  RETURN v_updated_id IS NOT NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.fail_ai_generation(UUID, UUID)
FROM PUBLIC;

REVOKE ALL ON FUNCTION public.fail_ai_generation(UUID, UUID)
FROM anon;

REVOKE ALL ON FUNCTION public.fail_ai_generation(UUID, UUID)
FROM authenticated;

GRANT EXECUTE ON FUNCTION public.fail_ai_generation(UUID, UUID)
TO service_role;
