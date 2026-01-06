
document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('certifications-container');
    const loadingEl = document.getElementById('loading-state');
    const errorEl = document.getElementById('error-state');

    try {
        // Fetch certifications from Supabase
        const certifications = await window.portfolioAPI.getCertifications();

        // Hide loading
        loadingEl.style.display = 'none';

        if (!certifications || certifications.length === 0) {
            container.innerHTML = `
                <div class="card" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <p class="text-muted">Aucune certification disponible pour le moment.</p>
                </div>
            `;
            return;
        }

        // Render cards
        certifications.forEach(cert => {
            const card = createCertificationCard(cert);
            container.appendChild(card);
        });

    } catch (err) {
        console.error('Error loading certifications:', err);
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
    }
});

function createCertificationCard(cert) {
    // Format date
    const date = new Date(cert.issued_date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long'
    });

    const card = document.createElement('div');
    card.className = 'card fade-in-up';
    
    // Provider as a badge or subtitle
    const provider = cert.provider || 'Certification';

    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
            <span class="badge">${provider}</span>
            <span style="font-size: 0.85rem; color: var(--color-text-muted);">${date}</span>
        </div>
        
        <h3 class="card__title">${cert.title}</h3>
        
        <div class="card__description" style="margin-bottom: 1.5rem;">
            ${cert.description ? `<p>${cert.description}</p>` : ''}
        </div>

        <div style="margin-top: auto;">
            <a href="${cert.pdf_url}" target="_blank" class="button button--ghost" style="width: 100%; padding: 0.8rem;">
                Voir le certificat
            </a>
        </div>
    `;

    return card;
}
