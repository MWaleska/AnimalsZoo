document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('tokenUsuario');
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const mobileLoggedOutView = document.getElementById('mobile-logged-out-view');
    const mobileLoggedInView = document.getElementById('mobile-logged-in-view');

    if (token && usuarioLogado) {
        // Estado Logado
        if (loggedOutView) loggedOutView.style.display = 'none';
        if (loggedInView) {
            loggedInView.style.display = 'flex';
            const welcomeMsg = document.getElementById('header-welcome-message');
            if (welcomeMsg) {
                welcomeMsg.textContent = `Olá, ${usuarioLogado.nomeCompleto.split(' ')[0]}!`;
            }
        }
        if (mobileLoggedOutView) mobileLoggedOutView.style.display = 'none';
        if (mobileLoggedInView) mobileLoggedInView.style.display = 'block';
    } else {
        // Estado Deslogado
        if (loggedInView) loggedInView.style.display = 'none';
        if (loggedOutView) loggedOutView.style.display = 'flex';
        if (mobileLoggedInView) mobileLoggedInView.style.display = 'none';
        if (mobileLoggedOutView) mobileLoggedOutView.style.display = 'block';
    }

    // --- LÓGICA DE LOGOUT CORRIGIDA ---
    // Encontra todos os elementos com a classe '.logout-button' ou '.logout-link'
    const logoutLinks = document.querySelectorAll('.logout-button, .logout-link');
    
    logoutLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Impede a ação padrão do link

            // 1. Limpa os dados de login do armazenamento do navegador
            localStorage.removeItem('tokenUsuario');
            localStorage.removeItem('usuarioLogado');

            // 2. Redireciona para a tela de início
            window.location.href = 'index.html'; 
        });
    });
});