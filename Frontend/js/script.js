// Funções Utilitárias Globais
// -----------------------------------------------------------

/**
 * Alterna a visibilidade do menu mobile.
 * Adiciona/remove a classe 'show' no elemento #mobileNav.
 */
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    if (mobileNav) {
        mobileNav.classList.toggle('show');
        // Opcional: Adicionar/remover 'overflow: hidden' no body para evitar scroll quando menu aberto
        // document.body.classList.toggle('no-scroll');
    }
}

/**
 * Valida um formulário verificando se os campos 'required' estão preenchidos.
 * Aplica um estilo de borda vermelha para campos vazios.
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
        // Usa `value.trim()` para considerar campos com apenas espaços em branco como vazios.
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444'; // Cor para erro
            isValid = false;
        } else {
            input.style.borderColor = '#d1d5db'; // Cor padrão (ou você pode remover esta linha e deixar o CSS gerenciar)
        }

        // Listener para remover a borda vermelha ao começar a digitar
        input.removeEventListener('input', clearErrorBorder); // Remove para evitar duplicidade
        input.addEventListener('input', clearErrorBorder);
    });

    return isValid;
}

/**
 * Função auxiliar para limpar a borda de erro de um input.
 * @param {Event} event - O evento de input.
 */
function clearErrorBorder(event) {
    event.target.style.borderColor = '#d1d5db'; // Cor padrão do input
    // Opcional: Remover o próprio listener após limpar a borda, se preferir
    // event.target.removeEventListener('input', clearErrorBorder);
}


/**
 * Realiza um scroll suave para um elemento alvo na página.
 * @param {string} target - O seletor CSS do elemento alvo (ex: '#minhaSecao').
 */
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth'
        });
    } else {
        console.warn(`Elemento alvo '${target}' para scroll suave não encontrado.`);
    }
}

/**
 * Abre um modal de imagem em tela cheia.
 * @param {string} src - A URL da imagem.
 * @param {string} alt - O texto alternativo da imagem.
 */
function openImageModal(src, alt) {
    // Cria o elemento modal
    const modal = document.createElement('div');
    modal.classList.add('image-modal-overlay'); // Adiciona uma classe para estilização via CSS

    // Adiciona estilos inline básicos (melhor seria via CSS com a classe)
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        cursor: pointer;
    `;

    // Cria o elemento img
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.classList.add('image-modal-content'); // Adiciona uma classe para estilização via CSS

    // Adiciona estilos inline básicos (melhor seria via CSS com a classe)
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    `;

    // Adiciona img ao modal e modal ao body
    modal.appendChild(img);
    document.body.appendChild(modal);

    // Fecha o modal ao clicar em qualquer lugar do overlay
    modal.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

/**
 * Lida com a funcionalidade de busca (pressionar Enter).
 * @param {Event} event - O evento de teclado.
 */
function handleSearch(event) {
    // Verifica se a tecla pressionada foi 'Enter' (código 13 é deprecated, mas ainda comum)
    if (event.key === 'Enter') {
        const searchTerm = event.target.value.trim();
        if (searchTerm) {
            console.log('Searching for:', searchTerm);
            // Aqui você pode adicionar a lógica de busca real,
            // por exemplo, redirecionar para uma página de resultados:
            // window.location.href = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
        } else {
            console.log('Search term is empty.');
        }
        event.preventDefault(); // Impede o envio do formulário se o input estiver dentro de um <form>
    }
}


// Event Listeners (Executados após o carregamento completo do DOM)
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {

    // --- Funcionalidade da Galeria de Imagens (Modal) ---
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryItems.forEach(img => {
        img.addEventListener('click', function() { // Usar function() para ter 'this'
            openImageModal(this.src, this.alt); // Usar 'this' para se referir à imagem clicada
        });
    });

    // --- Fechar Menu Mobile ao Clicar Fora ou em Link ---
    const mobileNav = document.getElementById('mobileNav');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link'); // Seleciona todos os links do menu mobile

    document.addEventListener('click', function(event) {
        if (mobileNav && mobileNav.classList.contains('show')) {
            // Verifica se o clique não foi no próprio menu e nem no botão de toggle
            if (!mobileNav.contains(event.target) && (!menuToggle || !menuToggle.contains(event.target))) {
                mobileNav.classList.remove('show');
                // Opcional: Remover 'overflow: hidden' do body
                // document.body.classList.remove('no-scroll');
            }
        }
    });

    // Fecha o menu mobile ao clicar em um link interno
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileNav) {
                mobileNav.classList.remove('show');
                // Opcional: Remover 'overflow: hidden' do body
                // document.body.classList.remove('no-scroll');
            }
        });
    });


    // --- Funcionalidade de Busca (Search Input) ---
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', handleSearch);
    }

    // --- Exemplo de como inicializar a validação de formulários se não for inline ---
    // Se você tiver um formulário de login que chama handleLogin,
    // E um formulário de cadastro que chama handleCadastro,
    // Mantenha o onsubmit no HTML e as funções específicas,
    // mas elas devem chamar validateForm() internamente.
    // Ex: Em login.html: <form onsubmit="handleLogin(event)">
    // function handleLogin(event) {
    //     event.preventDefault();
    //     if (validateForm('loginForm')) { // Chama a validação centralizada
    //         alert('Login realizado com sucesso!');
    //         window.location.href = 'dashboard.html';
    //     }
    // }
});