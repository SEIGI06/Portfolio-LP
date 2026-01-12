// Global state for modal
let currentCertification = null;
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('certifications-container');
    const loadingEl = document.getElementById('loading-state');
    const errorEl = document.getElementById('error-state');

    try {
        // Fetch certifications with images and docs
        const { data: certifications, error } = await supabaseClient
            .from('certifications')
            .select(`
                *,
                certification_images (
                    id,
                    image_url,
                    caption,
                    order_index
                ),
                certification_docs (
                    id,
                    doc_url,
                    name,
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

    // Use image_url as a single-image gallery if certification_images is empty
    if ((!cert.certification_images || cert.certification_images.length === 0) && cert.image_url) {
        cert.certification_images = [{
            image_url: cert.image_url,
            caption: cert.title,
            order_index: 0
        }];
    }
    
    // Sort images & docs
    if (cert.certification_images) cert.certification_images.sort((a,b) => (a.order_index||0) - (b.order_index||0));
    if (cert.certification_docs) cert.certification_docs.sort((a,b) => (a.order_index||0) - (b.order_index||0));

    const hasImages = cert.certification_images && cert.certification_images.length > 0;
    const hasDocs = cert.certification_docs && cert.certification_docs.length > 0;
    const hasMainPdf = !!cert.pdf_url;

    if (!hasImages && !hasDocs && !hasMainPdf) {
        alert('Aucun contenu (image ou PDF) disponible pour cette certification.');
        return;
    }

    // Populate Modal Content
    
    // 1. Setup Image Viewer
    if (hasImages) {
        document.getElementById('modal-image-container').style.display = 'block';
        showModalImage();
    } else {
        document.getElementById('modal-image-container').style.display = 'none';
    }

    // 2. Setup Docs List
    const docsContainer = document.getElementById('modal-docs-container');
    docsContainer.innerHTML = '';
    
    let docsHTML = '';
    
    // Main PDF if exists
    if (hasMainPdf) {
         docsHTML += `
            <a href="${cert.pdf_url}" target="_blank" class="cert-modal-doc-btn">
                📄 Voir le certificat principal (PDF)
            </a>
         `;
    }

    // Additional Docs
    if (hasDocs) {
        cert.certification_docs.forEach(doc => {
            docsHTML += `
                <a href="${doc.doc_url}" target="_blank" class="cert-modal-doc-btn">
                    📄 ${doc.name || 'Document PDF'}
                </a>
            `;
        });
    }

    if (docsHTML) {
        docsContainer.innerHTML = `
            <div style="margin-top: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: center;">
                <h3 style="color: white; font-size: 1.2rem; margin-bottom: 0.5rem;">Documents associés</h3>
                ${docsHTML}
            </div>
        `;
        docsContainer.style.display = 'block';
    } else {
        docsContainer.style.display = 'none';
    }

    document.getElementById('cert-modal').classList.add('active');
    document.body.style.overflow = 'hidden'; 
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
    const modalImg = document.getElementById('modal-image');
    modalImg.src = currentImage.image_url;
    modalImg.alt = currentImage.caption || currentCertification.title; // SEO/Accessibilité
    
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
