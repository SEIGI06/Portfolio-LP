-- ============================================
-- PORTFOLIO PROJECTS DATABASE SCHEMA
-- ============================================
-- Description: Schema for managing portfolio projects dynamically via Supabase
-- Author: Lilian Peyr
-- Created: 2026-01-02
-- ============================================

-- Table: projects
-- Description: Stores all academic and personal projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    semester VARCHAR(50), -- e.g., "Semestre 1", "Semestre 2", "Personnel"
    image_url TEXT,
    project_type VARCHAR(50) DEFAULT 'academic', -- 'academic' or 'personal'
    order_index INTEGER DEFAULT 0, -- For sorting projects
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: competences
-- Description: Stores the BTS SIO competences/skills
CREATE TABLE IF NOT EXISTS competences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: project_competences
-- Description: Many-to-many relationship between projects and competences
CREATE TABLE IF NOT EXISTS project_competences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    competence_id UUID REFERENCES competences(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, competence_id)
);

-- Table: project_sections
-- Description: Stores detailed sections for each project (objectives, machines, etc.)
CREATE TABLE IF NOT EXISTS project_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    section_type VARCHAR(50) NOT NULL, -- e.g., 'objectives', 'machines', 'technologies'
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: project_technologies
-- Description: Technologies/tools used in each project
CREATE TABLE IF NOT EXISTS project_technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50), -- e.g., 'virtual', 'physical', 'software'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: personal_projects
-- Description: Extended information for personal projects (links, etc.)
CREATE TABLE IF NOT EXISTS personal_project_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    link_type VARCHAR(50) NOT NULL, -- e.g., 'website', 'github', 'demo'
    url TEXT NOT NULL,
    label VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_type ON projects(project_type);
CREATE INDEX idx_projects_published ON projects(is_published);
CREATE INDEX idx_project_competences_project ON project_competences(project_id);
CREATE INDEX idx_project_competences_competence ON project_competences(competence_id);
CREATE INDEX idx_project_sections_project ON project_sections(project_id);
CREATE INDEX idx_project_technologies_project ON project_technologies(project_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE competences ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_competences ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_project_links ENABLE ROW LEVEL SECURITY;

-- Public read access for all published projects
CREATE POLICY "Public can view published projects"
    ON projects FOR SELECT
    USING (is_published = true);

CREATE POLICY "Public can view all competences"
    ON competences FOR SELECT
    USING (true);

CREATE POLICY "Public can view project competences"
    ON project_competences FOR SELECT
    USING (true);

CREATE POLICY "Public can view project sections"
    ON project_sections FOR SELECT
    USING (true);

CREATE POLICY "Public can view project technologies"
    ON project_technologies FOR SELECT
    USING (true);

CREATE POLICY "Public can view personal project links"
    ON personal_project_links FOR SELECT
    USING (true);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to projects table
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE projects IS 'Main table storing all portfolio projects';
COMMENT ON TABLE competences IS 'BTS SIO competences/skills';
COMMENT ON TABLE project_competences IS 'Links projects to their corresponding competences';
COMMENT ON TABLE project_sections IS 'Detailed sections for each project';
COMMENT ON TABLE project_technologies IS 'Technologies used in projects';
COMMENT ON TABLE personal_project_links IS 'External links for personal projects';
