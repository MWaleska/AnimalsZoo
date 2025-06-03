// No início do seu script.js, ou fora de qualquer função se for usada por onclicks inline:
function showTab(tabId, clickedButton) {
    const tabContents = document.querySelectorAll('.dashboard-main-content .tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    const tabTriggers = document.querySelectorAll('.dashboard-main-content .tab-trigger');
    tabTriggers.forEach(trigger => {
        trigger.classList.remove('active');
    });

    const selectedTabContent = document.getElementById(tabId);
    if (selectedTabContent) {
        selectedTabContent.classList.add('active');
    }
    if (clickedButton) { // Verifica se o botão foi passado
        clickedButton.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // ... (seu código existente: toggleMobileMenu, validateForm, modal, etc.) ...

    // --- LÓGICA DAS ABAS DO DASHBOARD ---
    const tabTriggers = document.querySelectorAll('.dashboard-main-content .tab-trigger');
    if (tabTriggers.length > 0) {
        // Configura a primeira aba como ativa por padrão, se nenhuma estiver
        constisActiveTab = document.querySelector('.dashboard-main-content .tab-trigger.active');
        if (!isActiveTab && tabTriggers[0]) {
            tabTriggers[0].classList.add('active');
            const firstTabId = tabTriggers[0].getAttribute('data-tab');
            if (firstTabId) {
                const firstTabContent = document.getElementById(firstTabId);
                if (firstTabContent) {
                    firstTabContent.classList.add('active');
                }
            }
        }

        tabTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                showTab(tabId, this);
            });
        });
    }

    // ... (resto do seu DOMContentLoaded) ...
});




function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    if (mobileNav) {
        mobileNav.classList.toggle('show');
        document.body.classList.toggle('no-scroll');
    }
}

function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Formulário com ID '${formId}' não encontrado.`);
        return false;
    }

    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        input.style.borderColor = '';

        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        }

        input.removeEventListener('input', clearErrorBorderOnInput);
        input.addEventListener('input', clearErrorBorderOnInput);
    });

    return isValid;
}

function clearErrorBorderOnInput(event) {
    event.target.style.borderColor = '';
}

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

function handleSearch(event) {
    if (event.key === 'Enter') {
        const searchTerm = event.target.value.trim();
        if (searchTerm) {
            console.log('Pesquisando por:', searchTerm);
            alert(`Você pesquisou por: ${searchTerm}`);
        } else {
            console.log('Termo de busca vazio.');
        }
        event.preventDefault();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgElement = this.querySelector('img');
            if (imgElement) {
                openImageModal(imgElement.src, imgElement.alt);
            }
        });
    });

    const mobileNav = document.getElementById('mobileNav');
    const menuToggle = document.querySelector('.menu-toggle'); 

    document.addEventListener('click', function(event) {
        if (mobileNav && mobileNav.classList.contains('show')) {
            const isClickInsideMenu = mobileNav.contains(event.target);
            const isClickOnMenuToggle = menuToggle ? menuToggle.contains(event.target) : false;

            if (!isClickInsideMenu && !isClickOnMenuToggle) {
                toggleMobileMenu(); 
            }
        }
    });

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

    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', handleSearch);
    }

    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    let currentImageIndex = 0;
    let galleryImages = [];

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

    const galleryGridItems = document.querySelectorAll('.gallery-item');
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
});

async function enviarMensagemContato(event) {
    event.preventDefault();

    const form = document.getElementById('formContato');
    const mensagemStatusDiv = document.createElement('div');
    form.parentNode.insertBefore(mensagemStatusDiv, form.nextSibling);

    const nomeCompleto = document.getElementById('nomeCompleto').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nomeCompleto || !email || !mensagem) {
        mensagemStatusDiv.textContent = 'Por favor, preencha os campos obrigatórios: Nome Completo, E-mail e Mensagem.';
        mensagemStatusDiv.style.color = 'red';
        setTimeout(() => { mensagemStatusDiv.textContent = ''; }, 5000);
        return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        mensagemStatusDiv.textContent = 'Por favor, insira um endereço de e-mail válido.';
        mensagemStatusDiv.style.color = 'red';
        setTimeout(() => { mensagemStatusDiv.textContent = ''; }, 5000);
        return;
    }

    const dadosFormulario = {
        nomeCompleto,
        email,
        telefone,
        mensagem
    };

    const backendUrl = 'http://localhost:3006/api/contato';

    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosFormulario)
        });

        const resultado = await response.json();

        if (response.ok) {
            mensagemStatusDiv.textContent = resultado.message || 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
            mensagemStatusDiv.style.color = 'green';
            form.reset();
        } else {
            mensagemStatusDiv.textContent = `Erro ao enviar mensagem: ${resultado.message || response.statusText}`;
            mensagemStatusDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Erro na requisição de contato:', error);
        mensagemStatusDiv.textContent = 'Erro de conexão ao tentar enviar a mensagem. Tente novamente.';
        mensagemStatusDiv.style.color = 'red';
    } finally {
        if (mensagemStatusDiv.style.color === 'red' || !form.checkValidity()) {
             setTimeout(() => { mensagemStatusDiv.textContent = ''; }, 7000);
        }
    }
}

function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    if (mobileNav) {
        mobileNav.classList.toggle('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
