// Global state for modal
let currentCertification = null;
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('certifications-container');
    const loadingEl = document.getElementById('loading-state');
    const errorEl = document.getElementById('error-state');

    try {
        // Fetch certifications with their images
        const { data: certifications, error } = await supabaseClient
            .from('certifications')
            .select(`
                *,
                certification_images (
                    id,
                    image_url,
                    caption,
                    order_index
                )
            `)
            .order('issued_date', { ascending: false });

        if (error) throw error;

        // Hide loading
        loadingEl.style.display = 'none';

        if (!certifications || certifications.length === 0) {
            container.innerHTML = `
                <div class="card" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <p style="color: var(--color-text-muted);">Aucune certification disponible pour le moment.</p>
                </div>
            `;
            return;
        }

        // Render cards
        certifications.forEach((cert, index) => {
            const card = createCertificationCard(cert);
            container.appendChild(card);
            
            // Trigger animation with stagger
            setTimeout(() => {
                card.classList.add('is-visible');
            }, 100 * index);
        });

    } catch (err) {
        console.error('Error loading certifications:', err);
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
    }
});

function createCertificationCard(cert) {
    const card = document.createElement('div');
    card.className = 'cert-card fade-in-up';
    
    const provider = cert.provider || 'Certification';
    
    // Logo or placeholder
    let logoHTML;
    if (cert.logo_url) {
        logoHTML = `<img src="${cert.logo_url}" alt="${provider} logo">`;
    } else {
        logoHTML = `<div class="cert-logo-placeholder">🎓</div>`;
    }

    card.innerHTML = `
        <div class="cert-logo">
            ${logoHTML}
        </div>
        <h3 class="cert-title">${cert.title}</h3>
        <p class="cert-provider">${provider}</p>
    `;

    // Add click handler to open modal
    card.addEventListener('click', () => {
        openCertModal(cert);
    });

    return card;
}

function openCertModal(cert) {
    currentCertification = cert;
    currentImageIndex = 0;

    // Sort images by order_index
    if (cert.certification_images && cert.certification_images.length > 0) {
        cert.certification_images.sort((a, b) => a.order_index - b.order_index);
        showModalImage();
        document.getElementById('cert-modal').classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
        // No images, show alert
        alert('Aucune image disponible pour cette certification.');
    }
}

function closeCertModal() {
    document.getElementById('cert-modal').classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    currentCertification = null;
    currentImageIndex = 0;
}

function showModalImage() {
    if (!currentCertification || !currentCertification.certification_images) return;

    const images = currentCertification.certification_images;
    const currentImage = images[currentImageIndex];

    // Update image
    document.getElementById('modal-image').src = currentImage.image_url;
    
    // Update caption
    const caption = currentImage.caption || currentCertification.title;
    document.getElementById('modal-caption').textContent = caption;

    // Update counter
    document.getElementById('modal-counter').textContent = 
        `${currentImageIndex + 1} / ${images.length}`;

    // Update navigation buttons
    document.getElementById('modal-prev').disabled = currentImageIndex === 0;
    document.getElementById('modal-next').disabled = currentImageIndex === images.length - 1;
}

function navigateImage(direction) {
    if (!currentCertification) return;

    const images = currentCertification.certification_images;
    const newIndex = currentImageIndex + direction;

    if (newIndex >= 0 && newIndex < images.length) {
        currentImageIndex = newIndex;
        showModalImage();
    }
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCertModal();
    }
});

// Close modal on background click
document.getElementById('cert-modal').addEventListener('click', (e) => {
    if (e.target.id === 'cert-modal') {
        closeCertModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!document.getElementById('cert-modal').classList.contains('active')) return;
    
    if (e.key === 'ArrowLeft') {
        navigateImage(-1);
    } else if (e.key === 'ArrowRight') {
        navigateImage(1);
    }
});
