// ============================================
// DYNAMIC PROJECT LOADER
// ============================================
// Description: Loads projects from Supabase and renders them dynamically
// ============================================

/**
 * Load and render academic projects on projets.html
 */
async function loadAcademicProjects() {
    const container = document.querySelector('.grid.grid-3');
    if (!container) return;

    // Show loading state
    container.innerHTML = '<p style="text-align: center; color: var(--color-text-muted);">Chargement des projets...</p>';

    try {
        const projects = await window.portfolioAPI.getProjects('academic');
        
        if (projects.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--color-text-muted);">Aucun projet trouvé.</p>';
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
        container.innerHTML = '<p style="text-align: center; color: var(--color-error);">Erreur lors du chargement des projets.</p>';
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
            <a href="${project.slug}.html" class="button button--ghost" style="width: 100%;">Voir le projet</a>
        </div>
    `;

    return article;
}

/**
 * Load and render personal projects
 */
async function loadPersonalProjects() {
    const container = document.querySelector('.grid.grid-3');
    // Find the section containing personal projects
    const personalSection = Array.from(document.querySelectorAll('section')).find(section => 
        section.textContent.includes('Projets personnels')
    );
    
    if (!personalSection) return;
    
    const projectsContainer = personalSection.querySelector('.grid.grid-3');
    if (!projectsContainer) return;

    try {
        const projects = await window.portfolioAPI.getProjects('personal');
        
        if (projects.length === 0) return;

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
 * Load individual project details
 */
async function loadProjectDetails() {
    // Extract slug from URL (e.g., projet-1.html -> projet-1)
    const path = window.location.pathname;
    const match = path.match(/\/(projet-\d+)\.html$/);
    
    if (!match) return;
    
    const slug = match[1];

    try {
        const project = await window.portfolioAPI.getProjectBySlug(slug);
        
        if (!project) {
            console.warn('Project not found:', slug);
            return;
        }

        // Update page title and main heading if needed
        const mainTitle = document.querySelector('h1.section__title');
        if (mainTitle) {
            mainTitle.textContent = project.title;
        }

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', project.description);
        }

        // You can add more dynamic content updates here
        console.log('Loaded project:', project);
    } catch (error) {
        console.error('Error loading project details:', error);
    }
}

// ============================================
// AUTO-INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    // Load appropriate content based on current page
    if (path.includes('projets.html')) {
        loadAcademicProjects();
        loadPersonalProjects();
        loadCompetenceMatrix();
    } else if (path.match(/projet-\d+\.html/)) {
        loadProjectDetails();
    }
});
