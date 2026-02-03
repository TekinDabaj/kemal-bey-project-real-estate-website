-- Create availabilities table for admin-defined booking slots
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS availabilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  times TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on date for faster lookups
CREATE INDEX IF NOT EXISTS idx_availabilities_date ON availabilities(date);

-- Enable Row Level Security (RLS)
ALTER TABLE availabilities ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for booking page)
CREATE POLICY "Allow public read access on availabilities"
  ON availabilities
  FOR SELECT
  TO public
  USING (true);

-- Create policy to allow authenticated users (admins) full access
CREATE POLICY "Allow authenticated users full access on availabilities"
  ON availabilities
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_availabilities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER availabilities_updated_at
  BEFORE UPDATE ON availabilities
  FOR EACH ROW
  EXECUTE FUNCTION update_availabilities_updated_at();

-- Grant necessary permissions
GRANT SELECT ON availabilities TO anon;
GRANT ALL ON availabilities TO authenticated;
