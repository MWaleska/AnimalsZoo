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
});