ALTER TABLE public.premium_articles
ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_premium_articles_published ON public.premium_articles(published);