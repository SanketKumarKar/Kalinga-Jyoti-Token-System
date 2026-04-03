-- ============================================================
-- Kalinga Jyoti Token System — Full Database Schema & RLS
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Create the sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  description   TEXT,
  banner_url    TEXT,
  sheetbest_url TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create the tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uuid          UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT,
  reg_no        TEXT,
  isGenerated   BOOLEAN NOT NULL DEFAULT FALSE,
  count         INTEGER NOT NULL DEFAULT 0,
  session_id    UUID REFERENCES sessions(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Enable RLS on tables
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for sessions (Allow all for anon and authenticated since app relies on client-side requests)
CREATE POLICY "Allow public read sessions" ON sessions FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public insert sessions" ON sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public update sessions" ON sessions FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow public delete sessions" ON sessions FOR DELETE TO anon USING (true);

-- 5. Create RLS Policies for tickets
CREATE POLICY "Allow public read tickets" ON tickets FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public insert tickets" ON tickets FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public update tickets" ON tickets FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow public delete tickets" ON tickets FOR DELETE TO anon USING (true);

-- 6. Create the Supabase Storage bucket for banner images (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Storage policy — allow public read of banners
CREATE POLICY "Public read banners"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

-- 8. Storage policy — allow authenticated/anon insert (admin uploads via anon key)
CREATE POLICY "Anon upload banners"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'banners');

-- 9. Storage policy — allow upsert/update for banners
CREATE POLICY "Anon update banners"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'banners');
