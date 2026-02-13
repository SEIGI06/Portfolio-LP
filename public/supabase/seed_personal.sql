-- ============================================
-- LINK PERSONAL PROJECT TO COMPETENCES
-- ============================================
-- Execute this script to link 'lilabs-blog' to competences
-- ============================================

BEGIN;

-- Insert links for "Lilabs"
-- We assume the project 'lilabs-blog' already exists (from previous seeds)
-- If it doesn't, this will just do nothing (due to the join)

INSERT INTO project_competences (project_id, competence_id)
SELECT p.id, c.id 
FROM projects p, competences c
WHERE p.slug = 'lilabs-blog' 
AND c.name IN (
    'Développer la présence en ligne',           -- Web dev
    'Organiser son développement professionnel', -- Veille / Blog
    'Mettre à disposition des services'          -- Déploiement
)
ON CONFLICT (project_id, competence_id) DO NOTHING; -- Avoid duplicates if re-run

COMMIT;
