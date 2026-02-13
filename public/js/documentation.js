document.addEventListener('DOMContentLoaded', async () => {
    // State
    let allDocs = [];
    let currentCategory = null;

    // Elements
    const searchInput = document.getElementById('doc-search');
    const categoriesContainer = document.getElementById('doc-categories');
    const contentContainer = document.getElementById('doc-container');

    // Check URL params for deep linking (Rewrite Support)
    const urlParams = new URLSearchParams(window.location.search);
    const pathSlug = window.location.pathname.match(/\/doc\/([^/]+)/);
    const docSlug = (pathSlug && pathSlug[1]) || urlParams.get('doc');
    const catSlug = urlParams.get('category');

    try {
        // Load Data
        const [categories, docs] = await Promise.all([
            window.portfolioAPI.getDocCategories(),
            window.portfolioAPI.getDocumentations() // fetches published only
        ]);

        allDocs = docs;

        // Render Categories
        renderCategories(categories, currentCategory);

        // Initial Route
        if (docSlug) {
            const doc = docs.find(d => d.slug === docSlug);
            if (doc) {
                toggleLayout(true);
                renderDocDetail(doc);
            } else {
                contentContainer.innerHTML = '<div class="card"><p>Article non trouvé.</p><a href="/documentation.html" class="button button--ghost" onclick="event.preventDefault(); resetView()">Retour</a></div>';
            }
        } else {
            renderDocList(docs);
        }

        // Search Listener
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allDocs.filter(d => 
                d.title.toLowerCase().includes(term) || 
                (d.doc_categories && d.doc_categories.name.toLowerCase().includes(term))
            );
            renderDocList(filtered);
        });

    } catch (e) {
        console.error(e);
        contentContainer.innerHTML = '<p class="error">Erreur de chargement de la documentation.</p>';
    }

    // --- Render Functions ---

    function renderCategories(categories, activeCatId) {
        if (categories.length === 0) {
            categoriesContainer.innerHTML = '<p style="color:var(--color-text-muted)">Aucune catégorie.</p>';
            return;
        }

        categoriesContainer.innerHTML = `
            <button class="doc-cat-btn ${!activeCatId ? 'active' : ''}" onclick="filterByCategory(null)">
                Toutes les catégories
            </button>
            ${categories.map(cat => `
                <button class="doc-cat-btn ${activeCatId === cat.id ? 'active' : ''}" onclick="filterByCategory('${cat.id}')">
                    ${cat.name}
                </button>
            `).join('')}
        `;
    }

    window.filterByCategory = (catId) => {
        currentCategory = catId;
        
        // Update Side UI
        document.querySelectorAll('.doc-cat-btn').forEach(btn => btn.classList.remove('active'));
        // We re-render logic handled by class check above if re-rendered, but here we just update list
        
        const filtered = catId 
            ? allDocs.filter(d => d.category_id === catId)
            : allDocs;
            
        renderDocList(filtered);
        
        // Clear search
        searchInput.value = '';
        
        // Update URL
        const url = new URL(window.location);
        url.pathname = '/documentation.html'; // Reset path if deep linked
        url.searchParams.delete('doc');
        if(catId) url.searchParams.set('category', catId);
        else url.searchParams.delete('category');
        window.history.pushState({}, '', url);
    };

    window.resetView = () => {
        const url = new URL(window.location);
        url.pathname = '/documentation.html';
        url.searchParams.delete('doc');
        window.history.pushState({}, '', url);
        toggleLayout(false); // Show sidebar
        renderDocList(allDocs);
        document.title = "Documentation technique — Portfolio Lilian Peyr";
    }

    function toggleLayout(isDetail) {
        const grid = contentContainer.parentElement;
        const sidebar = categoriesContainer.closest('aside');
        const search = document.getElementById('doc-search').closest('.card');

        if (isDetail) {
            search.style.display = 'none';
            sidebar.style.display = 'none';
            grid.style.display = 'block'; // Full width
        } else {
            search.style.display = 'block';
            sidebar.style.display = 'block';
            grid.style.display = 'grid'; // Restore grid
        }
    }

    function renderDocList(docs) {
        // Ensure layout is correct if entering directly
        toggleLayout(false);
        
        if (docs.length === 0) {
            contentContainer.innerHTML = '<div class="card"><p>Aucun article disponible.</p></div>';
            return;
        }

        contentContainer.innerHTML = `
            <div class="grid grid-2">
                ${docs.map(doc => `
                    <a href="/doc/${doc.slug}" class="card" onclick="handleDocLink(event, '${doc.slug}')" style="display:block; text-decoration:none; color:inherit; transition: transform 0.2s;">
                        <div style="margin-bottom: 0.5rem;">
                            <span class="badge">${doc.doc_categories ? doc.doc_categories.name : 'Général'}</span>
                        </div>
                        <h3 class="card__title">${doc.title}</h3>
                        <p class="card__description" style="line-clamp: 3; -webkit-line-clamp: 3; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;">
                            ${(doc.excerpt || doc.content || '').substring(0, 150)}...
                        </p>
                        <span class="button button--ghost" style="margin-top: 1rem; font-size: 0.85rem;">Lire l'article →</span>
                    </a>
                `).join('')}
            </div>
        `;
    }

    window.handleDocLink = (e, slug) => {
        // Allow open in new tab
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        viewDoc(slug);
    };

    window.viewDoc = (slug) => {
        const doc = allDocs.find(d => d.slug === slug);
        if (!doc) return;
        
        // Update URL
        window.history.pushState({}, '', `/doc/${slug}`);
        
        toggleLayout(true); // Hide sidebar
        renderDocDetail(doc);
    };

    function renderDocDetail(doc) {
        // Parse Markdown
        const htmlContent = marked.parse(doc.content || '');

        // SEO Update
        updateSEO(doc);

        contentContainer.innerHTML = `
            <article class="card" style="max-width: 100%;">
                <button onclick="resetView()" class="button button--ghost" style="margin-bottom: 1rem;">← Retour</button>
                
                <header style="margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <span class="badge" style="margin-bottom: 0.5rem; display: inline-block;">${doc.doc_categories ? doc.doc_categories.name : 'Général'}</span>
                    <h1 style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--color-white);">${doc.title}</h1>
                    <time style="color: var(--color-text-muted); font-size: 0.9rem;">Publié le ${new Date(doc.created_at).toLocaleDateString()}</time>
                </header>

                <div class="prose">
                    ${htmlContent}
                </div>
            </article>
        `;

        // Highlight Code
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function updateSEO(doc) {
        // 1. Basic Meta (document.title is already handled, but good to ensure)
        document.title = `${doc.title} — Documentation`;

        // 2. Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
             metaDesc = document.createElement('meta');
             metaDesc.name = "description";
             document.head.appendChild(metaDesc);
        }
        metaDesc.content = (doc.excerpt || doc.content || '').substring(0, 160).replace(/\n/g, ' ');

        // 3. Open Graph (Social)
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if(ogTitle) ogTitle.content = doc.title;

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if(ogDesc) ogDesc.content = (doc.excerpt || doc.content || '').substring(0, 160).replace(/\n/g, ' ');

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if(ogUrl) ogUrl.content = `https://www.seigi-tech.fr/doc/${doc.slug}`;

        // 4. Canonical URL (Critical for SEO)
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = `https://www.seigi-tech.fr/doc/${doc.slug}`;

        // 5. JSON-LD (Google Rich Snippets)
        let script = document.getElementById('json-ld-article');
        if (!script) {
            script = document.createElement('script');
            script.id = 'json-ld-article';
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }

        const schema = {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": doc.title,
            "description": (doc.excerpt || doc.content || '').substring(0, 160).replace(/\n/g, ' '),
            "author": {
                "@type": "Person",
                "name": "Lilian Peyr",
                "url": "https://www.seigi-tech.fr"
            },
            "datePublished": doc.created_at,
            "dateModified": doc.updated_at || doc.created_at,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://www.seigi-tech.fr/doc/${doc.slug}`
            },
            "publisher": {
                "@type": "Person",
                "name": "Lilian Peyr",
                "url": "https://www.seigi-tech.fr"
            }
        };

        script.textContent = JSON.stringify(schema, null, 2);
    }
});
