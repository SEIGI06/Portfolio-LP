// ============================================
// DYNAMIC PROJECT LOADER - ENHANCED
// ============================================
// Description: Enhanced version to fully replace static HTML with Supabase data
// ============================================

/**
 * Load and render academic projects on projets.html
 */
async function loadAcademicProjects() {
    const container = document.querySelector('.grid.grid-3');
    if (!container) return;

    // Show loading state
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted);">Chargement des projets...</p>';

    try {
        const projects = await window.portfolioAPI.getProjects('academic');
        
        if (projects.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted);">Aucun projet trouvé.</p>';
            return;
        }

        // Clear container
        container.innerHTML = '';

        // Render each project
        projects.forEach((project, index) => {
            const projectCard = createProjectCard(project, index);
            container.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Erreur lors du chargement des projets.</p>';
    }
}

/**
 * Create a project card element
 */
function createProjectCard(project, index) {
    const article = document.createElement('article');
    article.className = 'card fade-in-up';
    article.style.transitionDelay = `${0.1 * (index + 1)}s`;

    article.innerHTML = `
        <figure class="card__media" style="margin: -2rem -2rem 1.5rem -2rem; height: 200px; overflow: hidden;">
            <img src="${project.image_url || 'assets/images/placeholder.png'}" 
                 alt="${project.title}" 
                 loading="lazy" 
                 decoding="async"
                 style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
        </figure>
        <span class="badge">${project.semester || 'Projet'}</span>
        <h2 class="card__title">${project.title}</h2>
        <p class="card__description">${project.description}</p>
        <div style="margin-top: 1.5rem;">
            <a href="projet.html?slug=${project.slug}" class="button button--ghost" style="width: 100%;">Voir le projet</a>
        </div>
    `;

    // Trigger animation after a short delay
    setTimeout(() => {
        article.classList.add('is-visible');
    }, 100);

    return article;
}

/**
 * Load and render personal projects
 */
async function loadPersonalProjects() {
    // Find the section containing personal projects
    const personalSection = Array.from(document.querySelectorAll('section')).find(section => 
        section.textContent.includes('Projets personnels') || section.textContent.includes('Projets Personnels')
    );
    
    if (!personalSection) return;
    
    const projectsContainer = personalSection.querySelector('.grid.grid-3');
    if (!projectsContainer) return;

    try {
        const projects = await window.portfolioAPI.getProjects('personal');
        
        if (projects.length === 0) {
            projectsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted);">Aucun projet personnel pour le moment.</p>';
            return;
        }

        // Clear container
        projectsContainer.innerHTML = '';

        // Render each personal project
        projects.forEach((project, index) => {
            const projectCard = createPersonalProjectCard(project, index);
            projectsContainer.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error loading personal projects:', error);
    }
}

/**
 * Create a personal project card with links
 */
function createPersonalProjectCard(project, index) {
    const article = document.createElement('article');
    article.className = 'card fade-in-up';
    article.style.transitionDelay = `${0.1 * (index + 1)}s`;

    // Build links HTML
    let linksHTML = '';
    if (project.personal_project_links && project.personal_project_links.length > 0) {
        const links = project.personal_project_links.map(link => {
            const buttonClass = link.link_type === 'website' ? 'button--primary' : 'button--ghost';
            return `<a href="${link.url}" target="_blank" class="button ${buttonClass}" style="flex: 1; font-size: 0.9rem; text-align: center;">${link.label || 'Lien'}</a>`;
        }).join('');
        
        linksHTML = `<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">${links}</div>`;
    }

    article.innerHTML = `
        <div class="card__content">
            <h3 class="card__title" style="margin-bottom: 0.5rem;">${project.title}</h3>
            <p class="card__description" style="margin-bottom: 1.5rem;">${project.description}</p>
            ${linksHTML}
        </div>
    `;

    // Trigger animation after a short delay
    setTimeout(() => {
        article.classList.add('is-visible');
    }, 100);

    return article;
}

/**
 * Load and render competence matrix
 */
async function loadCompetenceMatrix() {
    const tableBody = document.querySelector('table tbody');
    if (!tableBody) return;

    try {
        const { projects, competences } = await window.portfolioAPI.getCompetenceMatrix();
        
        if (competences.length === 0) return;

        // Update table header
        const tableHeadRow = document.querySelector('table thead tr');
        if (tableHeadRow) {
            let headerHTML = '<th style="text-align: left; padding: 1.5rem; color: var(--color-text-muted); width: 250px;">Compétences du référentiel</th>';
            projects.forEach(project => {
                headerHTML += `<th style="text-align: center; padding: 1.5rem; color: var(--color-white);">${project.title}</th>`;
            });
            tableHeadRow.innerHTML = headerHTML;
        }

        // Clear existing rows
        tableBody.innerHTML = '';

        // Render each competence row
        competences.forEach((competence, index) => {
            const row = document.createElement('tr');
            if (index < competences.length - 1) {
                row.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
            }

            let cellsHTML = `<td style="padding: 1.5rem; color: var(--color-text-muted);">${competence.name}</td>`;

            // For each project, check if it has this competence
            projects.forEach(project => {
                const hasCompetence = project.project_competences.some(pc => 
                    pc.competence.id === competence.id
                );
                const dotHTML = hasCompetence ? '<span class="glowing-dot"></span>' : '';
                cellsHTML += `<td style="text-align: center; padding: 1.5rem;">${dotHTML}</td>`;
            });

            row.innerHTML = cellsHTML;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading competence matrix:', error);
    }
}

/**
 * Load individual project details on projet.html
 */
async function loadProjectDetails() {
    // Get slug from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
        console.warn('No slug provided in URL');
        document.querySelector('main').innerHTML = `
            <div class="container" style="padding: var(--space-xl); text-align: center;">
                <h1>Projet introuvable</h1>
                <p style="color: var(--color-text-muted); margin: 1rem 0;">Aucun identifiant de projet n'a été fourni.</p>
                <p><a href="projets.html" class="button button--primary">← Retour aux projets</a></p>
            </div>
        `;
        return;
    }

    try {
        const project = await window.portfolioAPI.getProjectBySlug(slug);
        
        if (!project) {
            document.querySelector('main').innerHTML = '<div class="container" style="padding: var(--space-xl); text-align: center;"><h1>Projet non trouvé</h1><p><a href="projets.html" class="button button--primary">← Retour aux projets</a></p></div>';
            return;
        }

        // Update page title
        document.title = `${project.title} - Portfolio Lilian Peyr`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', project.description);
        }

        // Render project content
        renderProjectContent(project);
    } catch (error) {
        console.error('Error loading project details:', error);
        document.querySelector('main').innerHTML = `
            <div class="container" style="padding: var(--space-xl); text-align: center;">
                <h1>Erreur</h1>
                <p style="color: red; margin: 1rem 0;">Impossible de charger les détails du projet.</p>
                <p><a href="projets.html" class="button button--primary">← Retour aux projets</a></p>
            </div>
        `;
    }
}

/**
 * Render full project content
 */
function renderProjectContent(project) {
    const main = document.querySelector('main');
    if (!main) return;

    // Build competences HTML
    let competencesHTML = '';
    if (project.project_competences && project.project_competences.length > 0) {
        const compCards = project.project_competences.map((pc, index) => {
            const colors = [
                { bg: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA' },
                { bg: 'rgba(16, 185, 129, 0.2)', color: '#34D399' },
                { bg: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24' },
                { bg: 'rgba(168, 85, 247, 0.2)', color: '#A78BFA' }
            ];
            const colorScheme = colors[index % colors.length];
            
            return `
                <div class="card-glass" style="padding: 1.5rem; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03);">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="background: ${colorScheme.bg}; padding: 0.5rem; border-radius: 8px; color: ${colorScheme.color};">
                            ✓
                        </div>
                        <h3 style="font-size: 1.1rem; margin: 0;">${pc.competence.name}</h3>
                    </div>
                </div>
            `;
        }).join('');
        
        competencesHTML = `
            <div style="margin-top: var(--space-xl);">
                <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem;">Compétences Validées</h2>
                <div class="grid grid-2" style="gap: 1.5rem;">
                    ${compCards}
                </div>
            </div>
        `;
    }

    // Build technologies HTML
    let techHTML = '';
    if (project.project_technologies && project.project_technologies.length > 0) {
        const techBadges = project.project_technologies.map(tech => 
            `<span class="badge">${tech.name}</span>`
        ).join('');
        
        techHTML = `
            <div style="margin-top: var(--space-lg);">
                <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">Technologies utilisées</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${techBadges}
                </div>
            </div>
        `;
    }

    main.innerHTML = `
        <section class="section">
            <div class="container">
                <div class="fade-in-up">
                    <a href="projets.html" class="button button--ghost" style="margin-bottom: var(--space-md); display: inline-flex; align-items: center; gap: 0.5rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        Retour aux projets
                    </a>
                    <h1 class="section__title">${project.title}</h1>
                </div>

                ${project.image_url ? `
                <figure class="fade-in-up" style="margin: var(--space-lg) 0; border-radius: var(--radius-lg); overflow: hidden; transition-delay: 0.1s;">
                    <img src="${project.image_url}" alt="${project.title}" style="width: 100%; height: auto; display: block;">
                </figure>
                ` : ''}

                <div class="fade-in-up" style="transition-delay: 0.2s;">
                    <p style="font-size: 1.1rem; color: var(--color-text-muted); line-height: 1.8;">
                        ${project.description}
                    </p>
                    
                    ${/* Sections rendering logic */ ''}
                    ${project.project_sections && project.project_sections.length > 0 
                        ? project.project_sections.sort((a, b) => a.order_index - b.order_index).map(section => `
                            <div style="margin-top: 2rem;">
                                <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: var(--color-text);">${section.title}</h3>
                                <div style="color: var(--color-text-muted); line-height: 1.6;">
                                    ${section.content}
                                </div>
                            </div>
                        `).join('') 
                        : ''
                    }

                    ${techHTML}
                </div>

                ${competencesHTML}
            </div>
        </section>
    `;

    // Trigger animations
    setTimeout(() => {
        main.querySelectorAll('.fade-in-up').forEach(el => {
            el.classList.add('is-visible');
        });
    }, 100);
}

// ============================================
// AUTO-INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.toLowerCase();

    // Support both with and without .html, and handle direct file opening
    const isProjectListPage = path.endsWith('projets.html') || path.endsWith('projets') || path.endsWith('projets/');
    const isProjectDetailPage = path.endsWith('projet.html') || path.endsWith('projet') || path.endsWith('projet/');

    // Load appropriate content based on current page
    if (isProjectListPage) {
        loadAcademicProjects();
        loadPersonalProjects();
        loadCompetenceMatrix();
    } else if (isProjectDetailPage) {
        loadProjectDetails();
    }
});
