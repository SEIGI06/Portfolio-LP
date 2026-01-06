
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
            container.innerHTML = '<p class="empty-state">Aucune certification disponible pour le moment.</p>';
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
    card.className = 'cert-card';
    
    // Default image if none provided
    const imageUrl = cert.image_url || 'assets/cert-placeholder.png'; 
    const provider = cert.provider || 'Formation';

    card.innerHTML = `
        <div class="cert-card__glass"></div>
        <div class="cert-card__content">
            <div class="cert-icon">
                <i class="fas fa-award"></i>
            </div>
            <div class="cert-details">
                <span class="cert-provider">${provider}</span>
                <h3 class="cert-title">${cert.title}</h3>
                <p class="cert-description">${cert.description || ''}</p>
                <div class="cert-meta">
                    <span class="cert-date"><i class="far fa-calendar-alt"></i> ${date}</span>
                </div>
                <a href="${cert.pdf_url}" target="_blank" class="cert-link">
                    <span>Voir le certificat</span>
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `;

    return card;
}
