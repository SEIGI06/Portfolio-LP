-- ============================================
-- SECURITY HARDENING: SELECT POLICIES
-- ============================================
-- Description: Restrict read access based on publication status.
-- Authenticated users (Admin) can see everything.
-- Anonymous users (Public) can ONLY see published projects.

BEGIN;

-- 1. Enable RLS on main tables (just to be sure)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE competences ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_competences ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_project_links ENABLE ROW LEVEL SECURITY;

-- 2. Clean up any potential existing conflicting policies (optional safe guard)
DROP POLICY IF EXISTS "Public can view published projects" ON projects;
DROP POLICY IF EXISTS "Admin can view all projects" ON projects;

-- 3. Projects Policy
-- Public: Only published
CREATE POLICY "Public can view published projects"
ON projects FOR SELECT
TO anon
USING (is_published = true);

-- Admin: Everything
CREATE POLICY "Admin can view all projects"
ON projects FOR SELECT
TO authenticated
USING (true);


-- 4. Related Tables (Competences, Links, etc.)
-- Generally, we want these to be visible if the parent project is visible.
-- But for simplicity and performance, we often allow public read on reference tables (like competences)
-- and rely on the project visibility for the links.

-- Competences: Public Read (Reference data)
DROP POLICY IF EXISTS "Public can view competences" ON competences;
CREATE POLICY "Public can view competences"
ON competences FOR SELECT
TO anon, authenticated
USING (true);

-- Project Competences: Join check or simply Open Read (low risk meta-data)
-- To be strict: visible if project is visible.
DROP POLICY IF EXISTS "Public can view linked competences" ON project_competences;
CREATE POLICY "Public can view linked competences"
ON project_competences FOR SELECT
TO anon
USING (
    EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = project_competences.project_id
        AND projects.is_published = true
    )
);

CREATE POLICY "Admin can view all linked competences"
ON project_competences FOR SELECT
TO authenticated
USING (true);


-- Project Technologies
DROP POLICY IF EXISTS "Public view technologies" ON project_technologies;
CREATE POLICY "Public view technologies"
ON project_technologies FOR SELECT
TO anon
USING (
     EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = project_technologies.project_id
        AND projects.is_published = true
    )
);

CREATE POLICY "Admin view all technologies"
ON project_technologies FOR SELECT
TO authenticated
USING (true);


-- Personal Project Links
DROP POLICY IF EXISTS "Public view links" ON personal_project_links;
CREATE POLICY "Public view links"
ON personal_project_links FOR SELECT
TO anon
USING (
    EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = personal_project_links.project_id
        AND projects.is_published = true
    )
);

CREATE POLICY "Admin view all links"
ON personal_project_links FOR SELECT
TO authenticated
USING (true);

COMMIT;
