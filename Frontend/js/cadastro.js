const backendUrl = 'http://localhost:3006/api/auth';

document.getElementById('cadastroForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nomeCompletoValue = document.getElementById('NomeCompleto').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const senha = document.getElementById('password').value;
    const mensagemDiv = document.getElementById('mensagem');

    const dadosUsuario = {
        nomeCompleto: nomeCompletoValue,
        email,
        telefone,
        senha
    };

    try {
        const response = await fetch(`${backendUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosUsuario)
        });

        const resultado = await response.json();

        if (response.ok) {
            mensagemDiv.textContent = `Cadastro bem-sucedido! ID do usuário: ${resultado.userId}.`;
            mensagemDiv.style.color = 'green';
            document.getElementById('cadastroForm').reset();

            let segundosParaRedirecionar = 10;
            const redirecionamentoMsgSpan = document.createElement('span');
            redirecionamentoMsgSpan.id = 'contadorRedirecionamento';
            redirecionamentoMsgSpan.textContent = ` Redirecionando para login em ${segundosParaRedirecionar}...`;
            mensagemDiv.appendChild(redirecionamentoMsgSpan);

            const contadorInterval = setInterval(() => {
                segundosParaRedirecionar--;
                redirecionamentoMsgSpan.textContent = ` Redirecionando para login em ${segundosParaRedirecionar}...`;

                if (segundosParaRedirecionar <= 0) {
                    clearInterval(contadorInterval);
                    window.location.href = 'login.html';
                }
            }, 1000);
        } else {
            mensagemDiv.textContent = `Erro: ${resultado.message || response.statusText}`;
            mensagemDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Erro ao tentar cadastrar:', error);
        mensagemDiv.textContent = 'Erro de conexão ao tentar cadastrar. Tente novamente.';
        mensagemDiv.style.color = 'red';
    }
});
