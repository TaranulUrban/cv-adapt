-- CV Adapt - Secure AI generation completion

CREATE OR REPLACE FUNCTION public.complete_ai_generation(
  p_user_id UUID,
  p_request_id UUID,
  p_generated_content JSONB,
  p_job_description TEXT,
  p_cv_language TEXT,
  p_ai_model TEXT,
  p_input_tokens INTEGER,
  p_output_tokens INTEGER,
  p_reasoning_tokens INTEGER,
  p_estimated_cost_usd NUMERIC
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_cv_id UUID;
  v_generated_id UUID;
BEGIN
  IF p_user_id IS NULL THEN
  RAISE EXCEPTION 'User ID is required';
END IF;
    v_user_id := p_user_id;

  -- Lock the reservation to prevent duplicate completion.
  SELECT original_cv_id
  INTO v_cv_id
  FROM public.ai_generation_requests
  WHERE id = p_request_id
    AND user_id = v_user_id
    AND status = 'reserved'
  FOR UPDATE;

  IF v_cv_id IS NULL THEN
    RAISE EXCEPTION 'Reservation not found or already finalized';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.cvs
    WHERE id = v_cv_id
      AND user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'Original CV not found';
  END IF;

  IF p_cv_language NOT IN ('ro', 'en')
     OR p_generated_content IS NULL
     OR jsonb_typeof(p_generated_content) <> 'object'
     OR p_job_description IS NULL
     OR length(trim(p_job_description)) = 0
     OR p_ai_model IS NULL
     OR length(trim(p_ai_model)) = 0
     OR p_input_tokens IS NULL OR p_input_tokens < 0
     OR p_output_tokens IS NULL OR p_output_tokens < 0
     OR p_reasoning_tokens IS NULL OR p_reasoning_tokens < 0
     OR p_estimated_cost_usd IS NULL
     OR p_estimated_cost_usd < 0
  THEN
    RAISE EXCEPTION 'Invalid generation data';
  END IF;

  INSERT INTO public.generated_cvs (
    user_id,
    original_cv_id,
    generated_content,
    job_description,
    cv_language,
    ai_model,
    input_tokens,
    output_tokens,
    reasoning_tokens,
    estimated_cost_usd
  )
  VALUES (
    v_user_id,
    v_cv_id,
    p_generated_content,
    p_job_description,
    p_cv_language,
    p_ai_model,
    p_input_tokens,
    p_output_tokens,
    p_reasoning_tokens,
    p_estimated_cost_usd
  )
  RETURNING id INTO v_generated_id;

  UPDATE public.ai_generation_requests
  SET status = 'completed',
      completed_at = now()
  WHERE id = p_request_id;

  RETURN v_generated_id;
END;
$$;

REVOKE ALL ON FUNCTION public.complete_ai_generation(
  UUID, UUID, JSONB, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, NUMERIC
) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.complete_ai_generation(
  UUID, UUID, JSONB, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, NUMERIC
) FROM anon;

REVOKE ALL ON FUNCTION public.complete_ai_generation(
  UUID, UUID, JSONB, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, NUMERIC
) FROM authenticated;

GRANT EXECUTE ON FUNCTION public.complete_ai_generation(
  UUID, UUID, JSONB, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, NUMERIC
) TO service_role;