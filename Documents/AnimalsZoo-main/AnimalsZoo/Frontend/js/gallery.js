// MKI Zoo/Frontend/js/gallery.js

// --- LÓGICA ESPECÍFICA PARA A GALERIA COM MODAL E NAVEGAÇÃO ---

// Variáveis para controlar a galeria do modal
let currentImageIndex = 0;
let galleryImages = []; // Array para guardar as informações das imagens

/**
 * Abre um modal de imagem com navegação.
 * @param {number} index - O índice da imagem a ser exibida.
 */
function openImageModalWithNavigation(index) {
    const existingModal = document.querySelector('.image-modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    if (index < 0 || index >= galleryImages.length) {
        console.error("Índice da imagem da galeria fora do limite.");
        return;
    }

    currentImageIndex = index;
    const imageInfo = galleryImages[currentImageIndex];

    const modal = document.createElement('div');
    modal.classList.add('image-modal-overlay');
    modal.id = 'galleryImageModal'; 

    const img = document.createElement('img');
    img.src = imageInfo.src;
    img.alt = imageInfo.alt;
    img.classList.add('image-modal-content');

    const prevButton = document.createElement('button');
    prevButton.classList.add('modal-nav-button', 'prev');
    prevButton.innerHTML = '&#10094;';
    prevButton.setAttribute('aria-label', 'Imagem anterior');
    prevButton.onclick = (e) => {
        e.stopPropagation();
        navigateGallery(-1);
    };

    const nextButton = document.createElement('button');
    nextButton.classList.add('modal-nav-button', 'next');
    nextButton.innerHTML = '&#10095;';
    nextButton.setAttribute('aria-label', 'Próxima imagem');
    nextButton.onclick = (e) => {
        e.stopPropagation();
        navigateGallery(1);
    };

    const closeButton = document.createElement('button');
    closeButton.classList.add('modal-close-button');
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Fechar modal');
    closeButton.onclick = (e) => {
        e.stopPropagation();
        closeModal();
    };

    modal.appendChild(closeButton);
    modal.appendChild(prevButton);
    modal.appendChild(img);
    modal.appendChild(nextButton);
    document.body.appendChild(modal);
    document.body.classList.add('no-scroll');

    requestAnimationFrame(() => {
        modal.classList.add('show');
    });

    updateNavButtons();

    function closeModal() {
        modal.classList.remove('show');
        modal.addEventListener('transitionend', function handleTransitionEnd() {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
            if (!document.querySelector('.mobile-nav.show')) { 
                 document.body.classList.remove('no-scroll');
            }
            modal.removeEventListener('transitionend', handleTransitionEnd);
            document.removeEventListener('keydown', handleEscKeyModal); 
        }, { once: true });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) { 
            closeModal();
        }
    });
    
    function handleEscKeyModal(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    }
    document.addEventListener('keydown', handleEscKeyModal);
}

/**
 * Esconde ou mostra os botões de navegação do modal se estiver no início ou fim da galeria.
 */
function updateNavButtons() {
    const modal = document.getElementById('galleryImageModal');
    if (!modal) return;

    const prevButton = modal.querySelector('.modal-nav-button.prev');
    const nextButton = modal.querySelector('.modal-nav-button.next');

    if (prevButton) prevButton.style.display = (currentImageIndex === 0) ? 'none' : 'block';
    if (nextButton) nextButton.style.display = (currentImageIndex === galleryImages.length - 1) ? 'none' : 'block';
}

/**
 * Navega para a imagem anterior ou próxima no modal.
 * @param {number} direction - -1 para anterior, 1 para próxima.
 */
function navigateGallery(direction) {
    const newIndex = currentImageIndex + direction;
    if (newIndex >= 0 && newIndex < galleryImages.length) {
        currentImageIndex = newIndex;
        const modalImg = document.querySelector('#galleryImageModal .image-modal-content');
        if (modalImg) {
            modalImg.src = galleryImages[currentImageIndex].src;
            modalImg.alt = galleryImages[currentImageIndex].alt;
        }
        updateNavButtons();
    }
}

// Listener de evento que ativa a galeria
document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        const galleryGridItems = galleryGrid.querySelectorAll('.gallery-item');
        
        galleryImages = []; 
        galleryGridItems.forEach(item => {
            const imgElement = item.querySelector('img');
            if (imgElement) {
                galleryImages.push({ src: imgElement.src, alt: imgElement.alt });
                item.addEventListener('click', function() {
                    const clickedSrc = imgElement.src;
                    const imageIndex = galleryImages.findIndex(imgInfo => imgInfo.src === clickedSrc);
                    if (imageIndex !== -1) {
                        openImageModalWithNavigation(imageIndex);
                    }
                });
            }
        });
    }
});