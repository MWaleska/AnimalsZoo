const backendBaseUrl = 'http://localhost:3006/api';
const mensagemDiv = document.getElementById('mensagemPets');

function getToken() {
    return localStorage.getItem('tokenUsuario');
}

function exibirMensagem(texto, tipo = 'info') {
    if (mensagemDiv) {
        mensagemDiv.textContent = texto;
        mensagemDiv.className = `mensagem ${tipo}`;
        setTimeout(() => {
            mensagemDiv.textContent = '';
            mensagemDiv.className = 'mensagem';
        }, 5000);
    } else {
        console.log(`MENSAGEM (${tipo}): ${texto}`);
    }
}

const formCadastrarPet = document.getElementById('formCadastrarPet');

if (formCadastrarPet) {
    formCadastrarPet.addEventListener('submit', async function(event) {
        event.preventDefault();

        const token = getToken();
        if (!token) {
            exibirMensagem('Você precisa estar logado para cadastrar um pet.', 'erro');
            // Idealmente, redirecionar para a página de login ou mostrar um modal de login
            return;
        }

        const dadosPet = {
            nome: document.getElementById('petNomeCadastro').value,
            especie: document.getElementById('petEspecieCadastro').value,
            raca: document.getElementById('petRacaCadastro').value,
            sexo: document.getElementById('petSexoCadastro').value,
            idade: parseInt(document.getElementById('petIdadeCadastro').value),
            peso_kg: parseFloat(document.getElementById('petPesoCadastro').value) || null,
            observacoes: document.getElementById('petObservacoesCadastro').value,
            tutor_id: parseInt(document.getElementById('petTutorIdCadastro').value) // Certifique-se que este ID de tutor é válido
        };

        // Validação simples no front-end (faça validações mais robustas conforme necessário)
        if (!dadosPet.nome || !dadosPet.sexo || isNaN(dadosPet.idade)) {
            exibirMensagem('Nome, sexo e idade são obrigatórios.', 'erro');
            return;
        }
        if (isNaN(dadosPet.tutor_id)) {
             exibirMensagem('ID do Tutor é obrigatório e deve ser um número.', 'erro');
             return;
        }


        try {
            const response = await fetch(`${backendBaseUrl}/pets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Envia o token para autenticação
                },
                body: JSON.stringify(dadosPet)
            });

            const resultado = await response.json();

            if (response.ok) {
                exibirMensagem(`Pet "${resultado.pet.nome}" cadastrado com sucesso! ID: ${resultado.pet.id}`, 'sucesso');
                formCadastrarPet.reset(); // Limpa o formulário
                listarTodosPets(); // Atualiza a lista de pets na tela
            } else {
                exibirMensagem(`Erro ao cadastrar pet: ${resultado.message || response.statusText}`, 'erro');
            }
        } catch (error) {
            console.error('Erro na requisição de cadastro de pet:', error);
            exibirMensagem('Erro de conexão ao tentar cadastrar o pet.', 'erro');
        }
    });
}

const listaPetsContainer = document.getElementById('listaPetsContainer');

async function listarTodosPets() {
    if (!listaPetsContainer) return;

    // Para listar pets publicamente, não precisa do token.
    // Se a rota /api/pets (GET) for protegida no backend, você precisará adicionar o header Authorization aqui também.
    // const token = getToken();
    // const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    try {
        const response = await fetch(`${backendBaseUrl}/pets` /*, { headers: headers } */); // Descomente headers se a rota for protegida
        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.message || `Erro HTTP: ${response.status}`);
        }
        const pets = await response.json();

        listaPetsContainer.innerHTML = ''; // Limpa a lista atual

        if (pets.length === 0) {
            listaPetsContainer.innerHTML = '<p>Nenhum pet cadastrado ainda.</p>';
            return;
        }

        const ul = document.createElement('ul');
        pets.forEach(pet => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${pet.nome}</strong> (${pet.especie || 'Não especificada'}) - Idade: ${pet.idade} <br>
                Tutor: ${pet.nome_tutor || (pet.tutor_id ? `ID ${pet.tutor_id}` : 'Não associado')}
                <button onclick="preencherFormularioEdicao(${pet.id})">Editar</button>
                <button onclick="removerPet(${pet.id}, '${pet.nome}')">Remover</button>
            `;
            // Você pode adicionar mais detalhes se quiser
            ul.appendChild(li);
        });
        listaPetsContainer.appendChild(ul);

    } catch (error) {
        console.error('Erro ao listar pets:', error);
        exibirMensagem(`Não foi possível carregar os pets: ${error.message}`, 'erro');
        if (listaPetsContainer) listaPetsContainer.innerHTML = '<p>Erro ao carregar pets.</p>';
    }
}

// Chamar para carregar os pets quando a página carregar (ou quando apropriado)
window.addEventListener('DOMContentLoaded', listarTodosPets);

async function obterPetPorId(petId) {
    try {
        // Se esta rota for protegida, adicione o header Authorization
        const response = await fetch(`${backendBaseUrl}/pets/${petId}`);
        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.message || `Erro HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erro ao obter pet ${petId}:`, error);
        exibirMensagem(`Não foi possível carregar os dados do pet: ${error.message}`, 'erro');
        return null;
    }
}

// Função para preencher o formulário de edição (exemplo)
// Suponha um formulário com id="formEditarPet" e campos como petNomeEdicao, petEspecieEdicao, etc.
// E um campo oculto <input type="hidden" id="petIdEdicao">
async function preencherFormularioEdicao(petId) {
    const pet = await obterPetPorId(petId);
    if (pet) {
        document.getElementById('petIdEdicao').value = pet.id;
        document.getElementById('petNomeEdicao').value = pet.nome;
        document.getElementById('petEspecieEdicao').value = pet.especie || '';
        document.getElementById('petRacaEdicao').value = pet.raca || '';
        document.getElementById('petSexoEdicao').value = pet.sexo;
        document.getElementById('petIdadeEdicao').value = pet.idade;
        document.getElementById('petPesoEdicao').value = pet.peso_kg || '';
        document.getElementById('petObservacoesEdicao').value = pet.observacoes || '';
        document.getElementById('petTutorIdEdicao').value = pet.tutor_id || '';

        // Lógica para mostrar o formulário de edição, talvez um modal
        console.log("Formulário de edição preenchido para o pet:", pet);
        // Exemplo: document.getElementById('modalEditarPet').style.display = 'block';
    }
}

const formEditarPet = document.getElementById('formEditarPet'); // Defina o ID do seu formulário de edição

if (formEditarPet) {
    formEditarPet.addEventListener('submit', async function(event) {
        event.preventDefault();

        const token = getToken();
        if (!token) {
            exibirMensagem('Você precisa estar logado para editar um pet.', 'erro');
            return;
        }

        const petId = document.getElementById('petIdEdicao').value;
        const dadosPetAtualizados = {
            nome: document.getElementById('petNomeEdicao').value,
            especie: document.getElementById('petEspecieEdicao').value,
            raca: document.getElementById('petRacaEdicao').value,
            sexo: document.getElementById('petSexoEdicao').value,
            idade: parseInt(document.getElementById('petIdadeEdicao').value),
            peso_kg: parseFloat(document.getElementById('petPesoEdicao').value) || null,
            observacoes: document.getElementById('petObservacoesEdicao').value,
            tutor_id: parseInt(document.getElementById('petTutorIdEdicao').value) || null
        };

        if (!dadosPetAtualizados.nome || !dadosPetAtualizados.sexo || isNaN(dadosPetAtualizados.idade)) {
            exibirMensagem('Nome, sexo e idade são obrigatórios para edição.', 'erro');
            return;
        }
        // Se tutor_id for fornecido, deve ser um número. Se for string vazia, será null pela lógica acima.
        if (document.getElementById('petTutorIdEdicao').value && isNaN(dadosPetAtualizados.tutor_id) && dadosPetAtualizados.tutor_id !== null) {
             exibirMensagem('ID do Tutor deve ser um número ou vazio para remover.', 'erro');
             return;
        }

        try {
            const response = await fetch(`${backendBaseUrl}/pets/${petId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosPetAtualizados)
            });

            const resultado = await response.json();

            if (response.ok) {
                exibirMensagem(`Pet "${resultado.pet.nome}" atualizado com sucesso!`, 'sucesso');
                // Lógica para fechar o modal de edição, se houver
                // Exemplo: document.getElementById('modalEditarPet').style.display = 'none';
                listarTodosPets(); // Atualiza a lista
            } else {
                exibirMensagem(`Erro ao atualizar pet: ${resultado.message || response.statusText}`, 'erro');
            }
        } catch (error) {
            console.error(`Erro na requisição de atualização do pet ${petId}:`, error);
            exibirMensagem('Erro de conexão ao tentar atualizar o pet.', 'erro');
        }
    });
}

async function removerPet(petId, petNome) {
    const token = getToken();
    if (!token) {
        exibirMensagem('Você precisa estar logado para remover um pet.', 'erro');
        return;
    }

    // Confirmação do usuário
    if (!confirm(`Tem certeza que deseja remover o pet "${petNome}" (ID: ${petId})?`)) {
        return;
    }

    try {
        const response = await fetch(`${backendBaseUrl}/pets/${petId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // DELETE bem-sucedido geralmente retorna status 200 ou 204 (No Content)
        // Se retornar 204, response.json() vai dar erro, então verificamos response.ok e o status.
        if (response.ok) {
            let mensagemSucesso = `Pet "${petNome}" removido com sucesso!`;
            if (response.status !== 204) { // Se não for 204, tenta pegar a mensagem do JSON
                const resultado = await response.json();
                mensagemSucesso = resultado.message || mensagemSucesso;
            }
            exibirMensagem(mensagemSucesso, 'sucesso');
            listarTodosPets(); // Atualiza a lista
        } else {
            const resultado = await response.json(); // Tenta pegar a mensagem de erro
            exibirMensagem(`Erro ao remover pet: ${resultado.message || response.statusText}`, 'erro');
        }
    } catch (error) {
        console.error(`Erro na requisição de remoção do pet ${petId}:`, error);
        exibirMensagem('Erro de conexão ao tentar remover o pet.', 'erro');
    }
}

// Não se esqueça de chamar listarTodosPets() quando a página carregar,
// por exemplo, adicionando no final do seu script ou com um event listener:
window.addEventListener('DOMContentLoaded', () => {
    console.log("Página carregada, tentando listar pets...");
    listarTodosPets();
});