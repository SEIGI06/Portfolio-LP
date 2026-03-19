document.addEventListener("DOMContentLoaded", async () => {
    // 1. Setup Ticker (Live version)
    await setupLiveTicker();

    // 2. Fetch Veilles from DB
    const veilles = await window.portfolioAPI.getVeilles();
    
    // 3. Render Grid
    renderVeilles(veilles);

    // 4. Setup Filters
    setupFilters(veilles);
});

async function setupLiveTicker() {
    const tickerContent = document.getElementById('ticker-content');
    const videoGrid = document.getElementById('youtube-videos');
    if (!tickerContent) return;

    const channels = [
        { name: "Micode", id: "UCYnvxJ-PKiGXo_tYXpWAC-w" },
        { name: "Underscore_", id: "UCWedHS9qKebauVIK2J7383g" }
    ];

    try {
        const results = await Promise.all(channels.map(async (channel) => {
            try {
                // Using rss2json to convert YouTube RSS to JSON
                const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3D${channel.id}`);
                const data = await response.json();
                if (data.status === 'ok') {
                    return data.items.map(item => ({
                        title: item.title,
                        source: channel.name,
                        url: item.link,
                        thumbnail: item.thumbnail,
                        pubDate: item.pubDate
                    }));
                }
            } catch (err) {
                console.error(`Error fetching YouTube feed for ${channel.name}:`, err);
            }
            return [];
        }));

        const allVideos = results.flat().sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        
        // 1. Render Ticker
        const tickerItems = allVideos.slice(0, 10);
        if (tickerItems.length > 0) {
            const itemsToRender = [...tickerItems, ...tickerItems]; // Double for smooth marquee
            tickerContent.innerHTML = itemsToRender.map(item => `
                <a href="${item.url}" target="_blank" class="marquee-item">
                    <span>🔴 ${item.source} :</span>
                    <strong>${item.title}</strong>
                </a>
            `).join('');
        }

        // 2. Render Video Grid
        if (videoGrid) {
            const topVideos = allVideos.slice(0, 6);
            if (topVideos.length > 0) {
                videoGrid.innerHTML = topVideos.map(video => `
                    <article class="card fade-in-up is-visible" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
                        <a href="${video.url}" target="_blank" style="text-decoration: none; color: inherit; height: 100%; display: flex; flex-direction: column;">
                            <div style="position: relative; padding-top: 56.25%;">
                                <img src="${video.thumbnail}" alt="${video.title}" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover;">
                            </div>
                            <div style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column;">
                                <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                                    <span class="badge" style="background: rgba(255,0,0,0.1); color: #ff0000; border: 1px solid rgba(255,0,0,0.2);">YouTube</span>
                                    <span class="badge">${video.source}</span>
                                </div>
                                <h3 style="font-size: 1.1rem; margin: 0; line-height: 1.4;">${video.title}</h3>
                            </div>
                        </a>
                    </article>
                `).join('');
            } else {
                videoGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Aucune vidéo trouvée.</p>';
            }
        }

    } catch (error) {
        console.error('Ticker setup error:', error);
    }
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
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`; // Use transitionDelay instead of animationDelay for CSS transitions
        observer.observe(card);
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
