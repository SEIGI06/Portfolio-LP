document.addEventListener('DOMContentLoaded', async () => {
    // State
    let allDocs = [];
    let currentCategory = null;

    // Elements
    const searchInput = document.getElementById('doc-search');
    const categoriesContainer = document.getElementById('doc-categories');
    const contentContainer = document.getElementById('doc-container');

    // Check URL params for deep linking
    const urlParams = new URLSearchParams(window.location.search);
    const docSlug = urlParams.get('doc');
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
                renderDocDetail(doc);
            } else {
                contentContainer.innerHTML = '<div class="card"><p>Article non trouvé.</p><button class="button button--ghost" onclick="resetView()">Retour</button></div>';
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
        // Re-render categories to set active class properly or just toggle class
        // Simpler: Just filter list
        
        const filtered = catId 
            ? allDocs.filter(d => d.category_id === catId)
            : allDocs;
            
        renderDocList(filtered);
        
        // Clear search
        searchInput.value = '';
        
        // Update URL (optional)
        const url = new URL(window.location);
        url.searchParams.delete('doc');
        if(catId) url.searchParams.set('category', catId);
        else url.searchParams.delete('category');
        window.history.pushState({}, '', url);
    };

    window.resetView = () => {
        const url = new URL(window.location);
        url.searchParams.delete('doc');
        window.history.pushState({}, '', url);
        renderDocList(allDocs);
    }

    function renderDocList(docs) {
        if (docs.length === 0) {
            contentContainer.innerHTML = '<div class="card"><p>Aucun article disponible.</p></div>';
            return;
        }

        contentContainer.innerHTML = `
            <div class="grid grid-2">
                ${docs.map(doc => `
                    <article class="card fade-in-up" onclick="viewDoc('${doc.slug}')" style="cursor: pointer; transition: transform 0.2s;">
                        <div style="margin-bottom: 0.5rem;">
                            <span class="badge">${doc.doc_categories ? doc.doc_categories.name : 'Général'}</span>
                        </div>
                        <h3 class="card__title">${doc.title}</h3>
                        <p class="card__description" style="line-clamp: 3; -webkit-line-clamp: 3; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;">
                            ${(doc.excerpt || doc.content || '').substring(0, 150)}...
                        </p>
                        <span class="button button--ghost" style="margin-top: 1rem; font-size: 0.85rem;">Lire l'article →</span>
                    </article>
                `).join('')}
            </div>
        `;
    }

    window.viewDoc = (slug) => {
        const doc = allDocs.find(d => d.slug === slug);
        if (!doc) return;
        
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('doc', slug);
        window.history.pushState({}, '', url);

        renderDocDetail(doc);
    };

    function renderDocDetail(doc) {
        // Parse Markdown
        const htmlContent = marked.parse(doc.content || '');

        contentContainer.innerHTML = `
            <article class="card fade-in-up" style="max-width: 100%;">
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
});
