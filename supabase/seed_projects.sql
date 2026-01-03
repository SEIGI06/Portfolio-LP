-- ============================================
-- SEED DATA: ACADEMIC PROJECTS (CORRECTED)
-- ============================================
-- Execute this script in the Supabase SQL Editor
-- It will DELETE existing academic projects and INSERT them again properly
-- ============================================

BEGIN;

-- 1. Clean up existing academic projects to avoid duplicates
DELETE FROM projects WHERE project_type = 'academic';

-- 2. Insert Projects and capture IDs
-- utilizing a temporary table or CTEs to handle ID relations cleanly

-- ========================================================
-- PROJET 1: AP 1 Geltram
-- ========================================================
WITH new_project AS (
    INSERT INTO projects (title, slug, description, semester, image_url, project_type, order_index, is_published)
    VALUES (
        'AP 1 Geltram',
        'ap-1-geltram',
        'Mise en place d''un réseau web complet avec sécurité et segmentation (VLANs).',
        'Semestre 1',
        -- Utilisation des noms exacts des fichiers uploadés
        'https://luetejjufuemdqpkcbrk.supabase.co/storage/v1/object/public/projects/Schema%20ap%201.webp',
        'academic',
        1,
        true
    )
    RETURNING id
),
sections AS (
    INSERT INTO project_sections (project_id, section_type, title, content, order_index)
    SELECT id, 'objectives', 'Objectifs', 
    '<ul>
        <li>2 réseaux différents</li>
        <li>3 VLANs configurés</li>
        <li>Un réseau web complet : Serveur WEB, DNS, RDP</li>
        <li>Affichage du site sur un périphérique externe (télé) via un autre réseau</li>
    </ul>', 1 
    FROM new_project
    UNION ALL
    SELECT id, 'machines', 'Machines montées et utilisées', 
    '<ul>
        <li><strong>Virtuel (Debian 12)</strong> : Serveur WEB, RDP, DNS</li>
        <li><strong>Physique</strong> : Routeur Cisco, Axel, Switch Cisco</li>
    </ul>', 2 
    FROM new_project
),
technologies AS (
    INSERT INTO project_technologies (project_id, name, category)
    SELECT id, unnest(ARRAY['Debian 12', 'Apache2', 'DNS', 'RDP', 'Cisco Packet Tracer', 'VLAN']), 'software'
    FROM new_project
),
competences_link AS (
    INSERT INTO project_competences (project_id, competence_id)
    SELECT p.id, c.id 
    FROM new_project p, competences c
    WHERE c.name IN (
        'Gérer le patrimoine informatique',
        'Développer la présence en ligne',
        'Mettre à disposition des services',
        'Organiser son développement professionnel'
    )
)
SELECT id FROM new_project;


-- ========================================================
-- PROJET 2: AP 2 GSB
-- ========================================================
WITH new_project AS (
    INSERT INTO projects (title, slug, description, semester, image_url, project_type, order_index, is_published)
    VALUES (
        'AP 2 GSB',
        'ap-2-gsb',
        'Architecture réseau d''entreprise complète : LAN/WAN/DMZ avec services Microsoft et Linux.',
        'Semestre 2',
        'https://luetejjufuemdqpkcbrk.supabase.co/storage/v1/object/public/projects/schema%20ap2.webp',
        'academic',
        2,
        true
    )
    RETURNING id
),
sections AS (
    INSERT INTO project_sections (project_id, section_type, title, content, order_index)
    SELECT id, 'objectives', 'Objectifs', 
    '<ul>
        <li>3 réseaux différents : LAN, WAN, DMZ</li>
        <li>5 VLANs pour segmenter le trafic</li>
        <li>Réseau d''entreprise complet : AD, DHCP, DNS, FOG, GLPI, WSUS</li>
        <li>Étanchéité totale des réseaux et sécurisation des entités</li>
    </ul>', 1 
    FROM new_project
    UNION ALL
    SELECT id, 'machines', 'Machines montées et utilisées', 
    '<ul>
        <li><strong>Virtuel</strong> : Windows Servers, Debian 12, Windows 11</li>
        <li><strong>Physique</strong> : Routeur Cisco, Switch Cisco</li>
    </ul>', 2 
    FROM new_project
    UNION ALL
    SELECT id, 'services', 'Services montés et utilisés', 
    '<ul>
        <li>Apache2, MariaDB</li>
        <li>Active Directory (AD), DNS, DHCP</li>
        <li>GLPI, FOG, WSUS, IPAM</li>
        <li>Honey Pot (Pot de miel) pour la sécurité</li>
    </ul>', 3 
    FROM new_project
),
technologies AS (
    INSERT INTO project_technologies (project_id, name, category)
    SELECT id, unnest(ARRAY['Windows Server', 'Debian 12', 'Active Directory', 'GLPI', 'FOG', 'WSUS', 'Honey Pot', 'Cisco']), 'mixed'
    FROM new_project
),
competences_link AS (
    INSERT INTO project_competences (project_id, competence_id)
    SELECT p.id, c.id 
    FROM new_project p, competences c
    WHERE c.name IN (
        'Gérer le patrimoine informatique',
        'Répondre aux incidents et demandes',
        'Mettre à disposition des services',
        'Organiser son développement professionnel'
    )
)
SELECT id FROM new_project;


-- ========================================================
-- PROJET 3: AP 3 GSB
-- ========================================================
WITH new_project AS (
    INSERT INTO projects (title, slug, description, semester, image_url, project_type, order_index, is_published)
    VALUES (
        'AP 3 GSB - SODECAF',
        'ap-3-gsb',
        'Conception d''un SI Haute Disponibilité pour SODECAF avec redondance des services.',
        'Semestre 3',
        'https://luetejjufuemdqpkcbrk.supabase.co/storage/v1/object/public/projects/schema%20ap3.webp',
        'academic',
        3,
        true
    )
    RETURNING id
),
sections AS (
    INSERT INTO project_sections (project_id, section_type, title, content, order_index)
    SELECT id, 'objectives', 'Objectifs', 
    '<ul>
        <li>Élaborer un SI pour l''entreprise SODECAF</li>
        <li>Segmenter chaque zone de réseau</li>
        <li>Assurer une <strong>Haute Disponibilité</strong> des services critiques</li>
    </ul>', 1 
    FROM new_project
    UNION ALL
    SELECT id, 'services', 'Services à monter (Redondance)', 
    '<ul>
        <li>Active Directory (x2)</li>
        <li>DHCP (x2)</li>
        <li>DNS (x2)</li>
        <li>Serveurs WEB (x2)</li>
        <li>Bases de données (x2)</li>
        <li>Pare-feu (FW)</li>
        <li>Outils de gestion : GLPI, IPAM</li>
    </ul>', 2 
    FROM new_project
),
technologies AS (
    INSERT INTO project_technologies (project_id, name, category)
    SELECT id, unnest(ARRAY['Haute Disponibilité', 'Failover', 'Load Balancing', 'Firewall', 'SQL Cluster', 'Windows Server']), 'advanced'
    FROM new_project
),
competences_link AS (
    INSERT INTO project_competences (project_id, competence_id)
    SELECT p.id, c.id 
    FROM new_project p, competences c
    WHERE c.name IN (
        'Gérer le patrimoine informatique',
        'Travailler en mode projet',
        'Mettre à disposition des services',
        'Organiser son développement professionnel'
    )
)
SELECT id FROM new_project;

COMMIT;
