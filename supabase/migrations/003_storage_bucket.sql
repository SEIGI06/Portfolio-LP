-- Create the 'uploads' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access to all files in 'uploads'
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'uploads' );

-- Policy: Allow authenticated users to upload files to 'uploads'
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'uploads' );

-- Policy: Allow authenticated users to update their own files (or all files if admin)
-- Since your app logic currently relies on "checking session", any auth user is considered admin in the context of the client-side check,
-- but ideally you'd check roles. For simplicity with your current setup:
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'uploads' );

-- Policy: Allow authenticated users to delete files
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'uploads' );
