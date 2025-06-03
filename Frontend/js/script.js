// Funções Utilitárias Globais
// -----------------------------------------------------------

/**
 * Alterna a visibilidade do menu mobile.
 * Adiciona/remove a classe 'show' no elemento #mobileNav e 'no-scroll' no body.
 */
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    if (mobileNav) {
        mobileNav.classList.toggle('show');
        document.body.classList.toggle('no-scroll');
    }
}

/**
 * Valida um formulário verificando se os campos 'required' estão preenchidos.
 * @param {string} formId - O ID do formulário a ser validado.
 * @returns {boolean} - True se todos os campos obrigatórios estiverem preenchidos, False caso contrário.
 */
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Formulário com ID '${formId}' não encontrado.`);
        return false;
    }

    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        input.style.borderColor = ''; // Reseta para o padrão do CSS (ou '#d1d5db')

        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444'; // Vermelho para erro
            isValid = false;
        }

        input.removeEventListener('input', clearErrorBorderOnInput);
        input.addEventListener('input', clearErrorBorderOnInput);
    });

    return isValid;
}

/**
 * Função auxiliar para limpar a borda de erro de um input ao digitar.
 * @param {Event} event - O evento de input.
 */
function clearErrorBorderOnInput(event) {
    event.target.style.borderColor = ''; // Reseta para o padrão do CSS (ou '#d1d5db')
}

/**
 * Realiza um scroll suave para um elemento alvo na página.
 * @param {string} targetSelector - O seletor CSS do elemento alvo (ex: '#minhaSecao').
 */
function smoothScroll(targetSelector) {
    const element = document.querySelector(targetSelector);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth'
        });
    } else {
        console.warn(`Elemento alvo '${targetSelector}' para scroll suave não encontrado.`);
    }
}

/**
 * Abre um modal de imagem.
 * @param {string} src - A URL da imagem.
 * @param {string} alt - O texto alternativo da imagem.
 */
function openImageModal(src, alt) {
    const existingModal = document.querySelector('.image-modal-overlay');
    if (existingModal) {
        return; 
    }

    const modal = document.createElement('div');
    modal.classList.add('image-modal-overlay');

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.classList.add('image-modal-content');

    modal.appendChild(img);
    document.body.appendChild(modal);
    document.body.classList.add('no-scroll');

    requestAnimationFrame(() => {
        modal.classList.add('show');
    });

    function closeModal() {
        modal.classList.remove('show');
        modal.addEventListener('transitionend', function handleTransitionEnd() {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
            if (!document.querySelector('.mobile-nav.show') && !document.querySelector('.image-modal-overlay.show')) {
                document.body.classList.remove('no-scroll');
            }
            modal.removeEventListener('transitionend', handleTransitionEnd);
        }, { once: true });
    }

    modal.addEventListener('click', closeModal);

    function handleEscKey(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
            document.removeEventListener('keydown', handleEscKey);
        }
    }
    document.addEventListener('keydown', handleEscKey);
}

/**
 * Lida com a funcionalidade de busca ao pressionar Enter.
 * @param {Event} event - O evento de teclado.
 */
function handleSearch(event) {
    if (event.key === 'Enter') {
        const searchTerm = event.target.value.trim();
        if (searchTerm) {
            console.log('Pesquisando por:', searchTerm);
            alert(`Você pesquisou por: ${searchTerm}`);
            // Exemplo: window.location.href = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
        } else {
            console.log('Termo de busca vazio.');
        }
        event.preventDefault();
    }
}


// Event Listeners (Executados após o carregamento completo do DOM)
// ------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {

    // --- Funcionalidade da Galeria de Imagens (Modal) ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgElement = this.querySelector('img');
            if (imgElement) {
                openImageModal(imgElement.src, imgElement.alt);
            }
        });
    });

    // --- Lógica do Menu Mobile ---
    const mobileNav = document.getElementById('mobileNav');
    const menuToggle = document.querySelector('.menu-toggle'); 

    // Fecha o menu mobile ao clicar fora dele
    document.addEventListener('click', function(event) {
        if (mobileNav && mobileNav.classList.contains('show')) {
            const isClickInsideMenu = mobileNav.contains(event.target);
            const isClickOnMenuToggle = menuToggle ? menuToggle.contains(event.target) : false;

            if (!isClickInsideMenu && !isClickOnMenuToggle) {
                toggleMobileMenu(); 
            }
        }
    });

    // Fecha o menu mobile ao clicar em um link interno dele
    if (mobileNav) {
        const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (mobileNav.classList.contains('show')) {
                    toggleMobileMenu(); 
                }
            });
        });
    }

    // --- Funcionalidade de Busca (Search Input) ---
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', handleSearch);
    }

    // --- Atualizar Ano Dinamicamente no Footer ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
// No seu script.js

// Certifique-se que estas variáveis estejam acessíveis globalmente no script ou dentro do DOMContentLoaded
let currentImageIndex = 0;
let galleryImages = []; // Array para guardar as informações das imagens da galeria

/**
 * Abre um modal de imagem com navegação.
 * @param {number} index - O índice da imagem a ser exibida.
 */
function openImageModalWithNavigation(index) {
    const existingModal = document.querySelector('.image-modal-overlay');
    if (existingModal) {
        existingModal.remove(); // Remove qualquer modal existente para evitar duplicação
    }

    if (index < 0 || index >= galleryImages.length) {
        console.error("Índice da imagem da galeria fora do limite.");
        return;
    }

    currentImageIndex = index;
    const imageInfo = galleryImages[currentImageIndex];

    const modal = document.createElement('div');
    modal.classList.add('image-modal-overlay');
    // Adiciona um ID para facilitar a remoção se necessário
    modal.id = 'galleryImageModal'; 

    const img = document.createElement('img');
    img.src = imageInfo.src;
    img.alt = imageInfo.alt;
    img.classList.add('image-modal-content');

    // Botões de Navegação
    const prevButton = document.createElement('button');
    prevButton.classList.add('modal-nav-button', 'prev');
    prevButton.innerHTML = '&#10094;'; // Seta para esquerda
    prevButton.setAttribute('aria-label', 'Imagem anterior');
    prevButton.onclick = (e) => {
        e.stopPropagation(); // Impede que o clique feche o modal
        navigateGallery(-1);
    };

    const nextButton = document.createElement('button');
    nextButton.classList.add('modal-nav-button', 'next');
    nextButton.innerHTML = '&#10095;'; // Seta para direita
    nextButton.setAttribute('aria-label', 'Próxima imagem');
    nextButton.onclick = (e) => {
        e.stopPropagation(); // Impede que o clique feche o modal
        navigateGallery(1);
    };

    // Botão de fechar (opcional, mas bom para usabilidade)
    const closeButton = document.createElement('button');
    closeButton.classList.add('modal-close-button');
    closeButton.innerHTML = '&times;'; // 'X' para fechar
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

    // Atualiza a visibilidade dos botões de navegação
    updateNavButtons();

    // Função para fechar o modal (pode ser a sua 'closeModal' adaptada)
    function closeModal() {
        modal.classList.remove('show');
        modal.addEventListener('transitionend', function handleTransitionEnd() {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
            if (!document.querySelector('.mobile-nav.show')) { // Verifica se outro modal (menu) está aberto
                 document.body.classList.remove('no-scroll');
            }
            modal.removeEventListener('transitionend', handleTransitionEnd);
            document.removeEventListener('keydown', handleEscKeyModal); // Remove listener do Esc
        }, { once: true });
    }

    // Fecha com clique no overlay (fora da imagem e botões)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { // Só fecha se clicar DIRETAMENTE no overlay
            closeModal();
        }
    });
    
    // Fecha com a tecla Escape
    function handleEscKeyModal(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    }
    document.addEventListener('keydown', handleEscKeyModal);
}

function updateNavButtons() {
    const modal = document.getElementById('galleryImageModal');
    if (!modal) return;

    const prevButton = modal.querySelector('.modal-nav-button.prev');
    const nextButton = modal.querySelector('.modal-nav-button.next');

    if (prevButton) prevButton.style.display = (currentImageIndex === 0) ? 'none' : 'block';
    if (nextButton) nextButton.style.display = (currentImageIndex === galleryImages.length - 1) ? 'none' : 'block';
}


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


    // ... (seu código existente para menu, ano, etc.)

    // --- FUNCIONALIDADE DA GALERIA DE IMAGENS (Modal com Navegação) ---
    const galleryGridItems = document.querySelectorAll('.gallery-item');
    // Limpa o array e preenche com as imagens da galeria atual
    galleryImages = []; 
    galleryGridItems.forEach(item => {
        const imgElement = item.querySelector('img');
        if (imgElement) {
            galleryImages.push({ src: imgElement.src, alt: imgElement.alt });
            item.addEventListener('click', function() {
                // Encontra o índice da imagem clicada
                const clickedSrc = imgElement.src;
                const imageIndex = galleryImages.findIndex(imgInfo => imgInfo.src === clickedSrc);
                if (imageIndex !== -1) {
                    openImageModalWithNavigation(imageIndex);
                }
            });
        }
    });

    // ... (resto do seu código DOMContentLoaded, como busca, etc.)
});
    // --- Validação para Formulários (Exemplo) ---
    // Seus formulários (login, cadastro, contato) já devem ter o `onsubmit` chamando
    // uma função que, por sua vez, chama `validateForm('IDdoForm')`.
    // Exemplo de como seria se não fosse inline:
    /*
    const contactForm = document.getElementById('formContato'); 
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            if (validateForm('formContato')) { 
                alert('Formulário de contato enviado com sucesso (simulação)!');
                contactForm.reset(); 
            } else {
                alert('Por favor, corrija os erros indicados no formulário.');
            }
        });
    }
    */
