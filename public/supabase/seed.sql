-- ============================================
-- SEED DATA FOR PORTFOLIO PROJECTS
-- ============================================
-- Description: Initial data migration from existing HTML to Supabase
-- ============================================

-- Insert Competences
INSERT INTO competences (name, description, order_index) VALUES
('Gérer le patrimoine informatique', 'Configuration et gestion du parc informatique', 1),
('Répondre aux incidents et demandes', 'Support et résolution de problèmes', 2),
('Développer la présence en ligne', 'Création de sites web et présence digitale', 3),
('Travailler en mode projet', 'Gestion de projets informatiques', 4),
('Mettre à disposition des services', 'Déploiement et administration de services', 5),
('Organiser son développement professionnel', 'Veille technologique et auto-formation', 6);

-- Insert Academic Projects
-- Project 1
INSERT INTO projects (title, slug, description, semester, image_url, project_type, order_index, is_published)
VALUES (
    'Projet 1 - Réseau Hybride avec VLANs',
    'projet-1',
    'Mise en place d''un réseau hybride (Physique/Virtuel) avec VLANs et déploiement de services Web, DNS et RDP.',
    'Semestre 1',
    'assets/images/projets/dashboard.png',
    'academic',
    1,
    true
);

-- Project 2
INSERT INTO projects (title, slug, description, semester, image_url, project_type, order_index, is_published)
VALUES (
    'Projet 2 - Architecture LAN/WAN/DMZ',
    'projet-2',
    'Architecture complète LAN/WAN/DMZ avec Active Directory, GLPI, FOG et sécurisation des réseaux.',
    'Semestre 2',
    'assets/images/projets/code-editor.png',
    'academic',
    2,
    true
);

-- Project 3
INSERT INTO projects (title, slug, description, semester, image_url, project_type, order_index, is_published)
VALUES (
    'Projet 3 - SI SODECAF',
    'projet-3',
    'Conception du SI SODECAF : Haute Disponibilité, segmentation stricte et redondance des services critiques.',
    'Semestre 3',
    'assets/images/projets/image_projet_3.png',
    'academic',
    3,
    true
);

-- Link Projects to Competences
-- Project 1 competences
INSERT INTO project_competences (project_id, competence_id)
SELECT p.id, c.id FROM projects p, competences c
WHERE p.slug = 'projet-1' AND c.name IN (
    'Gérer le patrimoine informatique',
    'Développer la présence en ligne',
    'Mettre à disposition des services',
    'Organiser son développement professionnel'
);

-- Project 2 competences
INSERT INTO project_competences (project_id, competence_id)
SELECT p.id, c.id FROM projects p, competences c
WHERE p.slug = 'projet-2' AND c.name IN (
    'Gérer le patrimoine informatique',
    'Répondre aux incidents et demandes',
    'Mettre à disposition des services',
    'Organiser son développement professionnel'
);

-- Project 3 competences
INSERT INTO project_competences (project_id, competence_id)
SELECT p.id, c.id FROM projects p, competences c
WHERE p.slug = 'projet-3' AND c.name IN (
    'Gérer le patrimoine informatique',
    'Travailler en mode projet',
    'Mettre à disposition des services',
    'Organiser son développement professionnel'
);

-- Insert Project Sections for Project 1
INSERT INTO project_sections (project_id, section_type, title, content, order_index)
SELECT p.id, 'objectives', 'Objectifs du Semestre 1', 
'- Mise en place de 2 réseaux différents
- Configuration de 3 VLANs
- Déploiement d''un réseau web complet : Serveur WEB, DNS, RDP
- Affichage du bon fonctionnement du site sur une télé', 1
FROM projects p WHERE p.slug = 'projet-1';

-- Insert Technologies for Project 1
INSERT INTO project_technologies (project_id, name, category)
SELECT p.id, 'Serveur WEB', 'virtual' FROM projects p WHERE p.slug = 'projet-1'
UNION ALL
SELECT p.id, 'RDP', 'virtual' FROM projects p WHERE p.slug = 'projet-1'
UNION ALL
SELECT p.id, 'DNS', 'virtual' FROM projects p WHERE p.slug = 'projet-1'
UNION ALL
SELECT p.id, 'Routeur Cisco', 'physical' FROM projects p WHERE p.slug = 'projet-1'
UNION ALL
SELECT p.id, 'Client Léger Axel', 'physical' FROM projects p WHERE p.slug = 'projet-1'
UNION ALL
SELECT p.id, 'Switch Cisco', 'physical' FROM projects p WHERE p.slug = 'projet-1';

-- Insert Personal Project: Lilabs
INSERT INTO projects (title, slug, description, semester, image_url, project_type, order_index, is_published)
VALUES (
    'Lilabs – Blog IA & Investissement',
    'lilabs-blog',
    'Blog explorant l''avenir de l''intelligence artificielle, de la tech et de l''investissement.',
    null,
    null,
    'personal',
    100,
    true
);

-- Insert Links for Lilabs project
INSERT INTO personal_project_links (project_id, link_type, url, label)
SELECT p.id, 'website', 'https://lilabs-blog.vercel.app/', 'Voir le site'
FROM projects p WHERE p.slug = 'lilabs-blog';

INSERT INTO personal_project_links (project_id, link_type, url, label)
SELECT p.id, 'github', 'https://github.com/SEIGI06/lilabs-blog', 'Voir sur GitHub'
FROM projects p WHERE p.slug = 'lilabs-blog';
