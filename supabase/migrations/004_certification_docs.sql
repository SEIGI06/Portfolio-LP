-- Create certification_docs table for multiple PDF/documents per certification
CREATE TABLE IF NOT EXISTS certification_docs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  doc_url TEXT NOT NULL,
  name TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE certification_docs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read certification docs" 
ON certification_docs FOR SELECT 
USING (true);

CREATE POLICY "Authenticated insert certification docs"
ON certification_docs FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated update certification docs"
ON certification_docs FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated delete certification docs"
ON certification_docs FOR DELETE
TO authenticated
USING (true);

-- Index
CREATE INDEX IF NOT EXISTS idx_certification_docs_cert_id 
ON certification_docs(certification_id);
