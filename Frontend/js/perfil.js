const backendBaseUrl = 'http://localhost:3006/api';
const mensagemPerfilDiv = document.getElementById('mensagemPerfil');

// Elementos para exibir dados do perfil
const displayNomeCompleto = document.getElementById('displayNomeCompleto');
const displayEmail = document.getElementById('displayEmail');
const displayTelefone = document.getElementById('displayTelefone');
const displayDataCadastro = document.getElementById('displayDataCadastro');
const displayDataAtualizacao = document.getElementById('displayDataAtualizacao');

// Campos do formulário de edição
const nomeCompletoEditarInput = document.getElementById('nomeCompletoEditar');
const emailEditarInput = document.getElementById('emailEditar');
const telefoneEditarInput = document.getElementById('telefoneEditar');
const formEditarPerfil = document.getElementById('formEditarPerfil');

function getToken() {
    return localStorage.getItem('tokenUsuario');
}

function exibirMensagemPerfil(texto, tipo = 'info') {
    if (mensagemPerfilDiv) {
        mensagemPerfilDiv.textContent = texto;
        mensagemPerfilDiv.className = `mensagem ${tipo}`;
        setTimeout(() => {
            mensagemPerfilDiv.textContent = '';
            mensagemPerfilDiv.className = 'mensagem';
        }, 5000);
    } else {
        console.log(`MENSAGEM PERFIL (${tipo}): ${texto}`);
    }
}

// Função para buscar e exibir os dados do perfil do usuário
async function carregarDadosPerfil() {
    const token = getToken();
    if (!token) {
        exibirMensagemPerfil('Você precisa estar logado para ver seu perfil.', 'erro');
        // Redirecionar para login ou desabilitar edição
        // window.location.href = 'login.html';
        if (formEditarPerfil) formEditarPerfil.style.display = 'none'; // Esconde o form de edição
        return;
    }

    try {
        const response = await fetch(`${backendBaseUrl}/usuarios/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const usuario = await response.json();
            // Exibir dados
            if (displayNomeCompleto) displayNomeCompleto.textContent = usuario.nome_completo || 'Não informado';
            if (displayEmail) displayEmail.textContent = usuario.email || 'Não informado';
            if (displayTelefone) displayTelefone.textContent = usuario.telefone || 'Não informado';
            // Formatar datas (opcional, mas recomendado)
            if (displayDataCadastro) displayDataCadastro.textContent = usuario.created_at ? new Date(usuario.created_at).toLocaleDateString('pt-BR') : 'Não informado';
            if (displayDataAtualizacao) displayDataAtualizacao.textContent = usuario.updated_at ? new Date(usuario.updated_at).toLocaleDateString('pt-BR') : 'Não informado';

            // Preencher formulário de edição
            if (nomeCompletoEditarInput) nomeCompletoEditarInput.value = usuario.nome_completo || '';
            if (emailEditarInput) emailEditarInput.value = usuario.email || '';
            if (telefoneEditarInput) telefoneEditarInput.value = usuario.telefone || '';
        } else {
            const erro = await response.json();
            exibirMensagemPerfil(`Erro ao carregar perfil: ${erro.message || response.statusText}`, 'erro');
            if (formEditarPerfil) formEditarPerfil.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro na requisição de carregar perfil:', error);
        exibirMensagemPerfil('Erro de conexão ao carregar dados do perfil.', 'erro');
        if (formEditarPerfil) formEditarPerfil.style.display = 'none';
    }
}

// Event listener para o formulário de edição
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

        // Enviar apenas os campos que foram preenchidos/alterados
        const dadosNaoVazios = {};
        let algumDadoAlterado = false;
        if (dadosParaAtualizar.nome_completo) {
             dadosNaoVazios.nome_completo = dadosParaAtualizar.nome_completo;
             algumDadoAlterado = true;
        }
        if (dadosParaAtualizar.email) {
            dadosNaoVazios.email = dadosParaAtualizar.email;
            algumDadoAlterado = true;
        }
        if (dadosParaAtualizar.telefone) {
            dadosNaoVazios.telefone = dadosParaAtualizar.telefone;
            algumDadoAlterado = true;
        }


        if (!algumDadoAlterado) {
            exibirMensagemPerfil('Nenhum dado para atualizar.', 'info');
            return;
        }
         // Validação de email simples
        if (dadosNaoVazios.email && !/^\S+@\S+\.\S+$/.test(dadosNaoVazios.email)) {
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
                body: JSON.stringify(dadosNaoVazios)
            });

            const resultado = await response.json();

            if (response.ok) {
                exibirMensagemPerfil('Perfil atualizado com sucesso!', 'sucesso');
                // Atualizar os dados exibidos na tela e no localStorage (se necessário)
                if (resultado.usuario) {
                    if (displayNomeCompleto) displayNomeCompleto.textContent = resultado.usuario.nome_completo || 'Não informado';
                    if (displayEmail) displayEmail.textContent = resultado.usuario.email || 'Não informado';
                    if (displayTelefone) displayTelefone.textContent = resultado.usuario.telefone || 'Não informado';
                    if (displayDataAtualizacao) displayDataAtualizacao.textContent = resultado.usuario.updated_at ? new Date(resultado.usuario.updated_at).toLocaleDateString('pt-BR') : 'Não informado';

                    // Se você armazena dados do usuário no localStorage além do token, atualize-os também.
                    // Ex: localStorage.setItem('usuarioLogado', JSON.stringify(resultado.usuario));
                }
            } else {
                exibirMensagemPerfil(`Erro ao atualizar perfil: ${resultado.message || response.statusText}`, 'erro');
            }
        } catch (error) {
            console.error('Erro na requisição de atualização de perfil:', error);
            exibirMensagemPerfil('Erro de conexão ao tentar atualizar o perfil.', 'erro');
        }
    });
}

// Carregar os dados do perfil quando a página carregar
window.addEventListener('DOMContentLoaded', carregarDadosPerfil);