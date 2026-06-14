-- Run this in your Supabase dashboard > SQL Editor
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT DEFAULT '',
  whatsapp_sent BOOLEAN DEFAULT false,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can manage visitors"
  ON visitors FOR ALL
  USING (true)
  WITH CHECK (true);
