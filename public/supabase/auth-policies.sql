-- ============================================
-- AUTHENTICATION & WRITE POLICIES
-- ============================================
-- Description: Add write permissions for authenticated users
-- Execute this AFTER schema.sql and seed.sql
-- ============================================

-- ============================================
-- STEP 1: Enable RLS Write Policies for Projects
-- ============================================

-- Allow authenticated users to INSERT projects
CREATE POLICY "Authenticated users can insert projects"
    ON projects FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to UPDATE projects
CREATE POLICY "Authenticated users can update projects"
    ON projects FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to DELETE projects
CREATE POLICY "Authenticated users can delete projects"
    ON projects FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- STEP 2: Enable RLS Write Policies for Competences
-- ============================================

CREATE POLICY "Authenticated users can insert competences"
    ON competences FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update competences"
    ON competences FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete competences"
    ON competences FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- STEP 3: Enable RLS Write Policies for Project Competences
-- ============================================

CREATE POLICY "Authenticated users can insert project competences"
    ON project_competences FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete project competences"
    ON project_competences FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- STEP 4: Enable RLS Write Policies for Project Sections
-- ============================================

CREATE POLICY "Authenticated users can insert project sections"
    ON project_sections FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update project sections"
    ON project_sections FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete project sections"
    ON project_sections FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- STEP 5: Enable RLS Write Policies for Project Technologies
-- ============================================

CREATE POLICY "Authenticated users can insert project technologies"
    ON project_technologies FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update project technologies"
    ON project_technologies FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete project technologies"
    ON project_technologies FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- STEP 6: Enable RLS Write Policies for Personal Project Links
-- ============================================

CREATE POLICY "Authenticated users can insert personal project links"
    ON personal_project_links FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update personal project links"
    ON personal_project_links FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete personal project links"
    ON personal_project_links FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- VERIFICATION
-- ============================================

-- Run this to verify all policies are created:
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- ============================================
-- NOTES
-- ============================================
-- After running this script:
-- 1. Create an admin user in Supabase Dashboard:
--    Authentication → Users → Add User
--    Email: votre-email@exemple.com
--    Password: VotreMotDePasseSecurise
--
-- 2. Test authentication in your admin page
--
-- 3. Security: Only authenticated users can write
--    Public (anon) can only read published projects
