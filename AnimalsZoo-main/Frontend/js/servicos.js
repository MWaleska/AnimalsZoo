document.addEventListener('DOMContentLoaded', function () {
    const agendarButtons = document.querySelectorAll('.service-schedule-btn');

    agendarButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();

            // Verifica se o usuário está logado
            const token = localStorage.getItem('tokenUsuario');
            if (!token) {
                // Se não estiver logado, redireciona para a página de login
                window.location.href = 'login.html';
                return;
            }

            // Se estiver logado, pega o nome do serviço do atributo data-
            const serviceName = this.getAttribute('data-service-name');
            if (serviceName) {
                // Codifica o nome do serviço para ser usado na URL
                const encodedServiceName = encodeURIComponent(serviceName);
                // Redireciona para o dashboard com o serviço como parâmetro na URL
                window.location.href = `dashboard.html?agendar=${encodedServiceName}`;
            }
        });
    });
});