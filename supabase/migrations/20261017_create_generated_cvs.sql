-- CV Adapt - AI-generated CV storage

CREATE TABLE public.generated_cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES auth.users(id) ON DELETE CASCADE,

  original_cv_id UUID NOT NULL
    REFERENCES public.cvs(id) ON DELETE CASCADE,

  generated_content JSONB NOT NULL,

  job_description TEXT NOT NULL,
  cv_language TEXT NOT NULL
    CHECK (cv_language IN ('ro', 'en')),

  ai_model TEXT NOT NULL,

  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  reasoning_tokens INTEGER NOT NULL DEFAULT 0,

  estimated_cost_usd NUMERIC(12, 8)
    NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT generated_cvs_usage_nonnegative CHECK (
    input_tokens >= 0
    AND output_tokens >= 0
    AND reasoning_tokens >= 0
    AND estimated_cost_usd >= 0
  )
);

ALTER TABLE public.generated_cvs
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own generated CVs"
ON public.generated_cvs
FOR SELECT TO authenticated
USING (
  (SELECT auth.uid()) = user_id
  AND EXISTS (
    SELECT 1 FROM public.cvs
    WHERE cvs.id = generated_cvs.original_cv_id
      AND cvs.user_id = (SELECT auth.uid())
  )
);

CREATE INDEX generated_cvs_user_id_created_idx
ON public.generated_cvs (user_id, created_at DESC);

CREATE INDEX generated_cvs_original_cv_id_idx
ON public.generated_cvs (original_cv_id);