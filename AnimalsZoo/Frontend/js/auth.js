document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('tokenUsuario');
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const mobileLoggedOutView = document.getElementById('mobile-logged-out-view');
    const mobileLoggedInView = document.getElementById('mobile-logged-in-view');

    const headerWelcomeMsg = document.getElementById('header-welcome-message');
    const userAvatarHeader = document.getElementById('userAvatarHeader');

    if (token && usuarioLogado) {
        if (loggedOutView) loggedOutView.style.display = 'none';
        if (loggedInView) loggedInView.style.display = 'flex';
        if (mobileLoggedOutView) mobileLoggedOutView.style.display = 'none';
        if (mobileLoggedInView) mobileLoggedInView.style.display = 'block';

        if (headerWelcomeMsg) {
            headerWelcomeMsg.textContent = `Olá, ${usuarioLogado.nomeCompleto.split(' ')[0]}!`;
        }

        if (userAvatarHeader && usuarioLogado.nomeCompleto) {
            const nomes = usuarioLogado.nomeCompleto.split(' ');
            const primeiraInicial = nomes[0] ? nomes[0][0] : '';
            const segundaInicial = nomes[1] ? nomes[1][0] : '';
            userAvatarHeader.textContent = `${primeiraInicial}${segundaInicial}`.toUpperCase();
        }

    } else {
        if (loggedInView) loggedInView.style.display = 'none';
        if (loggedOutView) loggedOutView.style.display = 'flex';
        if (mobileLoggedInView) mobileLoggedInView.style.display = 'none';
        if (mobileLoggedOutView) mobileLoggedOutView.style.display = 'block';
    }

    const logoutLinks = document.querySelectorAll('.logout-button, .logout-link');
    logoutLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('tokenUsuario');
            localStorage.removeItem('usuarioLogado');
            window.location.href = 'index.html'; 
        });
    });
});