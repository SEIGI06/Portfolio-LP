document.addEventListener("DOMContentLoaded", async () => {
    // 1. Setup Ticker
    setupTicker();

    // 2. Fetch Veilles
    const veilles = await window.portfolioAPI.getVeilles();
    
    // 3. Render Grid
    renderVeilles(veilles);

    // 4. Setup Filters
    setupFilters(veilles);
});

function setupTicker() {
    const tickerContent = document.getElementById('ticker-content');
    
    // Simulated "Recent Videos" from favorite channels
    // In a real app, this could come from a YouTube API fetch via Edge Function
    const tickerItems = [
        { title: "Micode - J'ai infiltré un réseau d'arnaqueurs", source: "Micode", url: "https://www.youtube.com/@Micode", icon: "assets/images/youtube-icon.png" },
        { title: "Underscore_ - Le futur de l'IA est terrifiant", source: "Underscore_", url: "https://www.youtube.com/@Underscore_Talk", icon: "assets/images/youtube-icon.png" },
        { title: "NetworkChuck - You need to learn Linux RIGHT NOW", source: "NetworkChuck", url: "https://www.youtube.com/c/NetworkChuck", icon: "assets/images/youtube-icon.png" },
        { title: "Defend Intelligence - Analyse d'une cyberattaque", source: "Defend Intelligence", url: "https://www.youtube.com/@DefendIntelligence", icon: "assets/images/youtube-icon.png" },
        { title: "LeMondeInformatique - Les failles Zero-Day explosent", source: "LMI", url: "https://www.lemondeinformatique.fr/", icon: "assets/images/news-icon.png" }
    ];

    // Double the items to make the marquee smoother
    const itemsToRender = [...tickerItems, ...tickerItems];

    tickerContent.innerHTML = itemsToRender.map(item => `
        <a href="${item.url}" target="_blank" class="marquee-item">
            <span>🔴 ${item.source} :</span>
            <strong>${item.title}</strong>
        </a>
    `).join('');
}

function renderVeilles(veilles) {
    const grid = document.getElementById('veille-grid');
    
    if (!veilles || veilles.length === 0) {
        grid.innerHTML = `
            <div class="card" style="text-align: center; grid-column: 1/-1; padding: 4rem;">
                <h3>Aucune actualité pour le moment</h3>
                <p>Repassez plus tard !</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = veilles.map(veille => {
        const date = new Date(veille.published_date).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
        
        // Fallback image if none provided
        const image = veille.image_url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop';

        return `
            <article class="card veille-card fade-in-up">
                <img src="${image}" alt="${veille.title}" class="veille-image" loading="lazy">
                
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                    <span class="badge">${veille.category}</span>
                </div>

                <h3 class="card__title">${veille.title}</h3>
                <p class="card__description">${veille.description || ''}</p>
                
                <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                    <small style="color: var(--color-text-muted);">${date}</small>
                    <a href="${veille.url}" target="_blank" class="button button--primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                        Lire la suite
                    </a>
                </div>
            </article>
        `;
    }).join('');

    // Re-trigger animations if needed (simple hack)
    const cards = document.querySelectorAll('.veille-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

function setupFilters(allVeilles) {
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active state
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter logic
            const filter = btn.dataset.filter;
            
            if (filter === 'all') {
                renderVeilles(allVeilles);
            } else {
                const filtered = allVeilles.filter(v => v.category === filter);
                renderVeilles(filtered);
            }
        });
    });
}
