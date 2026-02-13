-- ============================================
-- MIGRATION: Enhanced Certifications System
-- ============================================
-- Description: Add logo support and multiple images per certification
-- Date: 2026-01-06
-- ============================================

-- 1. Add logo_url column to certifications table
ALTER TABLE certifications 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- 2. Create certification_images table for multiple images per certification
CREATE TABLE IF NOT EXISTS certification_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS on certification_images
ALTER TABLE certification_images ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for certification_images
-- Public read access
CREATE POLICY "Public read certification images" 
ON certification_images FOR SELECT 
USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated insert certification images"
ON certification_images FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Authenticated update certification images"
ON certification_images FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated users can delete
CREATE POLICY "Authenticated delete certification images"
ON certification_images FOR DELETE
TO authenticated
USING (true);

-- 5. Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_certification_images_cert_id 
ON certification_images(certification_id);

CREATE INDEX IF NOT EXISTS idx_certification_images_order 
ON certification_images(certification_id, order_index);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the migration worked:

-- Check if logo_url column exists
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'certifications' AND column_name = 'logo_url';

-- Check if certification_images table exists
-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_name = 'certification_images';

-- Check policies
-- SELECT * FROM pg_policies WHERE tablename = 'certification_images';
