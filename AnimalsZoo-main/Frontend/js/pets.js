// A variável 'backendBaseUrl' agora é global, declarada em script.js

function getToken() {
    return localStorage.getItem('tokenUsuario');
}

function getUserId() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    return usuario ? usuario.id : null;
}

function exibirMensagemPets(texto, tipo = 'info') {
    const mensagemDiv = document.getElementById('mensagemPets');
    if (mensagemDiv) {
        mensagemDiv.textContent = texto;
        mensagemDiv.className = `mensagem ${tipo}`;
    } else {
        console.log(`MENSAGEM PETS (${tipo}): ${texto}`);
    }
}

const formCadastrarPet = document.getElementById('formCadastrarPet');
const addPetModal = document.getElementById('addPetModal');

if (formCadastrarPet) {
    formCadastrarPet.addEventListener('submit', async function(event) {
        event.preventDefault();

        const token = getToken();
        if (!token) {
            exibirMensagemPets('Você precisa estar logado para cadastrar um pet.', 'erro');
            return;
        }
        
        const tutorId = getUserId();
        if(!tutorId) {
             exibirMensagemPets('ID do tutor não encontrado. Faça login novamente.', 'erro');
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
            tutor_id: tutorId
        };

        if (!dadosPet.nome || !dadosPet.sexo || isNaN(dadosPet.idade)) {
            exibirMensagemPets('Nome, sexo e idade são obrigatórios.', 'erro');
            return;
        }

        try {
            const response = await fetch(`${backendBaseUrl}/pets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosPet)
            });

            const resultado = await response.json();

            if (response.ok) {
                exibirMensagemPets(`Pet "${resultado.pet.nome}" cadastrado com sucesso!`, 'sucesso');
                formCadastrarPet.reset(); 
                await listarPetsDoUsuario();
                
                // ESTA É A PARTE QUE ATUALIZA A LISTA NO MODAL DE AGENDAMENTO
                if (typeof configurarModalAgendamento === 'function') {
                    await configurarModalAgendamento();
                }
                
                setTimeout(() => {
                    if(addPetModal) addPetModal.style.display = 'none';
                    const mensagemDiv = document.getElementById('mensagemPets');
                    if(mensagemDiv) {
                        mensagemDiv.className = 'mensagem';
                        mensagemDiv.textContent = '';
                    }
                }, 2000);

            } else {
                exibirMensagemPets(`Erro ao cadastrar pet: ${resultado.message || response.statusText}`, 'erro');
            }
        } catch (error) {
            console.error('Erro na requisição de cadastro de pet:', error);
            exibirMensagemPets('Erro de conexão ao tentar cadastrar o pet.', 'erro');
        }
    });
}

async function listarPetsDoUsuario() {
    const petsGrid = document.getElementById('petsGrid');
    if (!petsGrid) return;
    
    const tutorId = getUserId();
    if(!tutorId) return;

    petsGrid.innerHTML = '<p class="empty-state-message">Buscando seus pets...</p>';

    try {
        const response = await fetch(`${backendBaseUrl}/pets`); 
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const todosOsPets = await response.json();
        
        const meusPets = todosOsPets.filter(pet => Number(pet.tutor_id) === Number(tutorId));

        petsGrid.innerHTML = ''; 

        if (meusPets.length === 0) {
            petsGrid.innerHTML = '<p class="empty-state-message">Você ainda não cadastrou nenhum pet.</p>';
            return;
        }

        meusPets.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.className = 'pet-card';
            
            petCard.innerHTML = `
                <div class="pet-info">
                    <div class="pet-avatar">${pet.nome ? pet.nome[0].toUpperCase() : '?'}</div>
                    <div>
                        <h3 class="pet-name">${pet.nome}</h3>
                        <p class="pet-breed-age">${pet.raca || pet.especie} • ${pet.idade} anos</p>
                    </div>
                </div>
                <div class="info-grid">
                    <div class="info-item"><span class="info-label">Espécie:</span><span>${pet.especie || 'Não informada'}</span></div>
                    <div class="info-item"><span class="info-label">Sexo:</span><span>${pet.sexo}</span></div>
                    <div class="info-item"><span class="info-label">Peso:</span><span>${pet.peso_kg ? pet.peso_kg + 'kg' : 'Não informado'}</span></div>
                </div>
                <div class="button-group">
                    <button class="btn btn-small btn-primary schedule-pet-btn" data-pet-id="${pet.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        Agendar
                    </button>
                </div>
            `;
            petsGrid.appendChild(petCard);
        });

        document.querySelectorAll('.schedule-pet-btn').forEach(button => {
            button.addEventListener('click', function() {
                const petId = this.getAttribute('data-pet-id');
                const scheduleModal = document.getElementById('scheduleModal');
                const petSelect = document.getElementById('agendamentoPet');

                if (petSelect && scheduleModal) {
                    if (typeof configurarModalAgendamento === 'function') {
                        configurarModalAgendamento().then(() => {
                             petSelect.value = petId;
                             scheduleModal.style.display = 'flex';
                        });
                    }
                }
            });
        });

    } catch (error) {
        console.error('Erro ao listar pets:', error);
        petsGrid.innerHTML = '<p class="empty-state-message">Erro ao carregar seus pets. Tente recarregar a página.</p>';
    }
}


if (window.location.pathname.endsWith('dashboard.html')) {
    window.addEventListener('DOMContentLoaded', listarPetsDoUsuario);
}