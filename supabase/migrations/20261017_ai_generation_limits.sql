-- CV Adapt - AI generation request tracking

CREATE TABLE public.ai_generation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES auth.users(id) ON DELETE CASCADE,

  original_cv_id UUID NOT NULL
    REFERENCES public.cvs(id) ON DELETE CASCADE,

  status TEXT NOT NULL DEFAULT 'reserved'
    CHECK (status IN ('reserved', 'completed', 'failed')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  completed_at TIMESTAMPTZ
);

ALTER TABLE public.ai_generation_requests
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own AI requests"
ON public.ai_generation_requests
FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE INDEX ai_generation_requests_user_created_idx
ON public.ai_generation_requests (user_id, created_at DESC);
