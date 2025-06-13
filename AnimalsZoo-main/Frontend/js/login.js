const backendUrl = 'http://localhost:3006/api/auth';

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    const mensagemDiv = document.getElementById('mensagem');

    const credenciais = {
        email,
        senha
    };

    try {
        const response = await fetch(`${backendUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credenciais)
        });

        const resultado = await response.json();

        if (response.ok) {
            mensagemDiv.textContent = 'Login bem-sucedido!';
            mensagemDiv.style.color = 'green';

            if (resultado.token) {
                localStorage.setItem('tokenUsuario', resultado.token);
                localStorage.setItem('usuarioLogado', JSON.stringify(resultado.user));
                console.log('Token armazenado:', resultado.token);
                window.location.href = 'dashboard.html';
            } else {
                mensagemDiv.textContent = 'Erro: Token não recebido do servidor.';
                mensagemDiv.style.color = 'red';
            }
        } else {
            mensagemDiv.textContent = `Erro: ${resultado.message || response.statusText}`;
            mensagemDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        mensagemDiv.textContent = 'Erro de conexão ao tentar fazer login. Tente novamente.';
        mensagemDiv.style.color = 'red';
    }
});