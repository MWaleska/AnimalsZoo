// A variável 'backendBaseUrl' agora é global, declarada em script.js
const mensagemPerfilDiv = document.getElementById('mensagemPerfil');

const userNomeSidebar = document.getElementById('userNameSidebar');
const userEmailSidebar = document.getElementById('userEmailSidebar');
const userPhoneSidebar = document.getElementById('userPhoneSidebar');
const userSince = document.getElementById('userSince');
const userAvatarSidebar = document.getElementById('userAvatarSidebar');

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
    if (!token) return;

    try {
        const response = await fetch(`${backendBaseUrl}/usuarios/me`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error('Falha ao buscar perfil');

        const usuario = await response.json();
        
        // Verifique se estas linhas estão corretas no seu código:
        document.getElementById('userNameSidebar').textContent = usuario.nome_completo;
        document.getElementById('userEmailSidebar').textContent = usuario.email;

        // ESTA É A LINHA MAIS IMPORTANTE PARA ESTE BUG
        // Garanta que ela está usando 'usuario.telefone'
        document.getElementById('userPhoneSidebar').textContent = usuario.telefone || 'Não informado';

        // O resto da função...
        if(document.getElementById('userSince')) document.getElementById('userSince').textContent = `Cliente desde ${new Date(usuario.created_at).toLocaleDateString('pt-BR')}`;
        if(document.getElementById('userAvatarSidebar')) {
             const iniciais = (usuario.nome_completo.split(' ')[0][0] + (usuario.nome_completo.split(' ').length > 1 ? usuario.nome_completo.split(' ').pop()[0] : '')).toUpperCase();
             document.getElementById('userAvatarSidebar').textContent = iniciais;
        }
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