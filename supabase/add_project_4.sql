-- ============================================
-- SEED DATA: ADDING PROJECT 4 (AP 4)
-- ============================================

BEGIN;

-- ========================================================
-- PROJET 4: AP 4 - VPN & Stormshield
-- ========================================================
WITH new_project AS (
    INSERT INTO projects (title, slug, description, semester, image_url, project_type, order_index, is_published)
    VALUES (
        'AP 4 - VPN & Stormshield',
        'ap-4-vpn',
        'Suite du projet AP 3 : Interconnexion de deux sites physiques distants via un tunnel VPN IPsec avec firewall Stormshield.',
        'Semestre 4',
        'assets/images/projets/schema-ap4.png',
        'academic',
        4,
        true
    )
    RETURNING id
),
sections AS (
    INSERT INTO project_sections (project_id, section_type, title, content, order_index)
    SELECT id, 'objectives', 'Objectifs', 
    '<ul>
        <li>Relier deux sites physiques différents par VPN.</li>
        <li>Mettre en place et configurer un firewall matériel (Stormshield).</li>
        <li>Assurer la sécurité et l''étanchéité des échanges inter-sites.</li>
        <li>Continuité du projet SODECAF (Haute Disponibilité).</li>
    </ul>', 1 
    FROM new_project
    UNION ALL
    SELECT id, 'machines', 'Machines montées et utilisées', 
    '<ul>
        <li><strong>Physique</strong> : Pare-feu Stormshield, Switch physique.</li>
        <li><strong>Virtuel</strong> : Machines Virtuelles (VM) pour les services et tests clients.</li>
    </ul>', 2 
    FROM new_project
),
technologies AS (
    INSERT INTO project_technologies (project_id, name, category)
    SELECT id, unnest(ARRAY['VPN IPsec', 'Stormshield', 'Firewall', 'Switching', 'Routage', 'Virtualisation']), 'advanced'
    FROM new_project
),
competences_link AS (
    INSERT INTO project_competences (project_id, competence_id)
    SELECT p.id, c.id 
    FROM new_project p, competences c
    WHERE c.name IN (
        'Gérer le patrimoine informatique',
        'Répondre aux incidents et demandes',
        'Travailler en mode projet',
        'Mettre à disposition des services',
        'Organiser son développement professionnel'
    )
)
SELECT id FROM new_project;

COMMIT;
