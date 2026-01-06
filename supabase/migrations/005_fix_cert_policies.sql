-- Enable RLS on certifications table (if not already enabled)
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Public read certifications"
ON certifications FOR SELECT
USING (true);

-- Policy: Allow authenticated insert
CREATE POLICY "Authenticated insert certifications"
ON certifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated update
CREATE POLICY "Authenticated update certifications"
ON certifications FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated delete
CREATE POLICY "Authenticated delete certifications"
ON certifications FOR DELETE
TO authenticated
USING (true);
