const mensagemPerfilDiv = document.getElementById('mensagemPerfil');
const nomeCompletoEditarInput = document.getElementById('nomeCompletoEditar');
const emailEditarInput = document.getElementById('emailEditar');
const telefoneEditarInput = document.getElementById('telefoneEditar');
const formEditarPerfil = document.getElementById('formEditarPerfil');
const editProfileModal = document.getElementById('editProfileModal');

function getToken() {
    return localStorage.getItem('tokenUsuario');
}

function exibirMensagemPerfil(texto, tipo = 'info') {
    if (mensagemPerfilDiv) {
        mensagemPerfilDiv.textContent = texto;
        mensagemPerfilDiv.className = `mensagem ${tipo}`;
    } else {
        console.log(`MENSAGEM PERFIL (${tipo}): ${texto}`);
    }
}

async function carregarDadosPerfil() {
    const token = getToken();
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const userNameHeader = document.getElementById('userNameDisplayHeader');
    const userAvatarHeader = document.getElementById('userAvatarHeader');
    const userNameSidebar = document.getElementById('userNameSidebar');
    const userAvatarSidebar = document.getElementById('userAvatarSidebar');
    const userEmailSidebar = document.getElementById('userEmailSidebar');
    const userPhoneSidebar = document.getElementById('userPhoneSidebar');
    const userSince = document.getElementById('userSince');

    try {
        const response = await fetch(`${backendBaseUrl}/usuarios/me`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) {
            localStorage.removeItem('tokenUsuario');
            localStorage.removeItem('usuarioLogado');
            window.location.href = 'login.html';
            throw new Error('Falha ao buscar perfil');
        }

        const usuario = await response.json();
        const nomes = usuario.nome_completo.split(' ');
        const primeiraInicial = nomes[0] ? nomes[0][0] : '';
        const segundaInicial = nomes[1] ? nomes[1][0] : '';
        const iniciais = `${primeiraInicial}${segundaInicial}`.toUpperCase();

        if(userNameHeader) userNameHeader.textContent = `Olá, ${nomes[0]}!`;
        if(userAvatarHeader) userAvatarHeader.textContent = iniciais;
        if(userNameSidebar) userNameSidebar.textContent = usuario.nome_completo;
        if(userEmailSidebar) userEmailSidebar.textContent = usuario.email;
        if(userPhoneSidebar) userPhoneSidebar.textContent = usuario.telefone || 'Não informado';
        if(userSince) userSince.textContent = `Cliente desde ${new Date(usuario.created_at).toLocaleDateString('pt-BR')}`;
        if(userAvatarSidebar) userAvatarSidebar.textContent = iniciais;
        if(nomeCompletoEditarInput) nomeCompletoEditarInput.value = usuario.nome_completo;
        if(emailEditarInput) emailEditarInput.value = usuario.email;
        if(telefoneEditarInput) telefoneEditarInput.value = usuario.telefone || '';
    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
    }
}

if (formEditarPerfil) {
    formEditarPerfil.addEventListener('submit', async function(event) {
        event.preventDefault();
        const token = getToken();

        if (!token) {
            exibirMensagemPerfil('Sessão expirada ou inválida. Faça login novamente.', 'erro');
            return;
        }

        const dadosParaAtualizar = {
            nome_completo: nomeCompletoEditarInput.value.trim(),
            email: emailEditarInput.value.trim(),
            telefone: telefoneEditarInput.value.trim()
        };

        if (dadosParaAtualizar.email && !/^\S+@\S+\.\S+$/.test(dadosParaAtualizar.email)) {
            exibirMensagemPerfil('Formato de email inválido.', 'erro');
            return;
        }

        try {
            const response = await fetch(`${backendBaseUrl}/usuarios/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosParaAtualizar)
            });

            const resultado = await response.json();

            if (response.ok) {
                exibirMensagemPerfil('Perfil atualizado com sucesso!', 'sucesso');
                localStorage.setItem('usuarioLogado', JSON.stringify(resultado.usuario));
                await carregarDadosPerfil();
                setTimeout(() => {
                    if(editProfileModal) editProfileModal.style.display = 'none';
                    mensagemPerfilDiv.className = 'mensagem';
                    mensagemPerfilDiv.textContent = '';
                }, 2000);
            } else {
                exibirMensagemPerfil(`Erro ao atualizar perfil: ${resultado.message || response.statusText}`, 'erro');
            }
        } catch (error) {
            console.error('Erro na requisição de atualização de perfil:', error);
            exibirMensagemPerfil('Erro de conexão ao tentar atualizar o perfil.', 'erro');
        }
    });
}

if (window.location.pathname.endsWith('dashboard.html')) {
    window.addEventListener('DOMContentLoaded', carregarDadosPerfil);
}
