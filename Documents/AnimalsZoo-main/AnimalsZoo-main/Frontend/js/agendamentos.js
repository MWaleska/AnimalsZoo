let agendamentosSimulados = [];

document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.endsWith('dashboard.html')) {
        return;
    }

    const formAgendarServico = document.getElementById('formAgendarServico');
    const dataInput = document.getElementById('agendamentoData');

    configurarModalAgendamento();

    if (formAgendarServico) {
        formAgendarServico.addEventListener('submit', handleAgendamentoSubmit);
    }
    
    if(dataInput) {
        dataInput.addEventListener('change', popularHorariosDisponiveis);
    }

    listarAgendamentos();

    // **NOVO:** Chama a função que verifica a URL
    handleIncomingScheduleRequest();
});

// **NOVA FUNÇÃO:** Lê a URL e pré-seleciona o serviço
function handleIncomingScheduleRequest() {
    const params = new URLSearchParams(window.location.search);
    const serviceToSchedule = params.get('agendar');

    // Se encontrou o parâmetro "agendar" na URL
    if (serviceToSchedule) {
        const scheduleModal = document.getElementById('scheduleModal');
        const serviceSelect = document.getElementById('agendamentoServico');

        if (scheduleModal && serviceSelect) {
            // Define o valor do campo de seleção para ser o serviço que veio da URL
            serviceSelect.value = decodeURIComponent(serviceToSchedule);

            // Abre o modal de agendamento automaticamente
            scheduleModal.style.display = 'flex';

            // Limpa a URL para que o modal não abra novamente se a página for recarregada
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
}

// O resto do arquivo permanece o mesmo...

async function configurarModalAgendamento() {
    const petSelect = document.getElementById('agendamentoPet');
    const dataInput = document.getElementById('agendamentoData');
    if(!petSelect || !dataInput) return;

    const tutorId = getUserId();
    if (!tutorId) return;

    try {
        const response = await fetch(`${backendBaseUrl}/pets`);
        const todosOsPets = await response.json();
        const meusPets = todosOsPets.filter(pet => Number(pet.tutor_id) === Number(tutorId));

        const petSelecionadoAnteriormente = petSelect.value;
        petSelect.innerHTML = '<option value="">Selecione um pet</option>';
        
        meusPets.forEach(pet => {
            const option = document.createElement('option');
            option.value = pet.id;
            option.textContent = pet.nome;
            petSelect.appendChild(option);
        });
        
        if(petSelecionadoAnteriormente) {
            petSelect.value = petSelecionadoAnteriormente;
        }

    } catch (error) {
        console.error("Erro ao buscar pets para o modal de agendamento:", error);
    }
    
    const hoje = new Date().toISOString().split('T')[0];
    dataInput.setAttribute('min', hoje);
    dataInput.value = hoje;
    popularHorariosDisponiveis();
}

function popularHorariosDisponiveis() {
    const horaSelect = document.getElementById('agendamentoHora');
    const dataInput = document.getElementById('agendamentoData');
    if (!horaSelect || !dataInput) return;

    const horarios = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    horaSelect.innerHTML = ''; 

    const dataSelecionada = dataInput.value;
    const hoje = new Date();
    const hojeString = hoje.toISOString().split('T')[0];
    
    const horaAtual = hoje.toTimeString().slice(0, 5);
    
    horarios.forEach(horario => {
        if (dataSelecionada === hojeString && horario < horaAtual) {
            return; 
        }
        const option = document.createElement('option');
        option.value = horario;
        option.textContent = horario;
        horaSelect.appendChild(option);
    });

    if (horaSelect.options.length === 0) {
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "Nenhum horário disponível";
        option.disabled = true;
        horaSelect.appendChild(option);
    }
}

async function handleAgendamentoSubmit(event) {
    event.preventDefault();
    const mensagemDiv = document.getElementById('mensagemAgendamento');
    const horaSelect = document.getElementById('agendamentoHora');

    if (!horaSelect.value) {
         exibirMensagemAgendamento('Por favor, selecione um horário válido.', 'erro');
         return;
    }
    
    const novoAgendamento = {
        petId: document.getElementById('agendamentoPet').value,
        servico: document.getElementById('agendamentoServico').value,
        data: document.getElementById('agendamentoData').value,
        hora: horaSelect.value,
        tutorId: getUserId(),
    };

    if(!novoAgendamento.petId || !novoAgendamento.data || !novoAgendamento.hora) {
        exibirMensagemAgendamento('Por favor, preencha todos os campos.', 'erro');
        return;
    }

    agendamentosSimulados.push({
        id: Date.now(),
        ...novoAgendamento,
        petNome: document.getElementById('agendamentoPet').options[document.getElementById('agendamentoPet').selectedIndex].text
    });

    exibirMensagemAgendamento('Agendamento realizado com sucesso!', 'sucesso');
    listarAgendamentos();

    setTimeout(() => {
        document.getElementById('scheduleModal').style.display = 'none';
        mensagemDiv.className = 'mensagem';
        mensagemDiv.textContent = '';
        event.target.reset();
    }, 2000);
}

function listarAgendamentos() {
    const listaContainer = document.getElementById('appointmentsList');
    if(!listaContainer) return;

    listaContainer.innerHTML = '';
    
    const tutorId = getUserId();
    const meusAgendamentos = agendamentosSimulados
        .filter(ag => ag.tutorId === tutorId)
        .sort((a, b) => new Date(`${a.data}T${a.hora}`) - new Date(`${b.data}T${b.hora}`));

    if (meusAgendamentos.length === 0) {
        listaContainer.innerHTML = '<p class="empty-state-message">Nenhum agendamento futuro encontrado.</p>';
        return;
    }

    meusAgendamentos.forEach(ag => {
        const card = document.createElement('div');
        card.className = 'appointment-card';
        const dataFormatada = new Date(`${ag.data}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', 'year': 'numeric'});

        card.innerHTML = `
            <div class="appointment-header">
                <div class="appointment-icon-circle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C27C3D" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                </div>
                <div>
                    <h3 class="appointment-title">${ag.servico} - ${ag.petNome}</h3>
                    <p class="appointment-date-time">${dataFormatada}, ${ag.hora}</p>
                </div>
                <span class="status-badge status-confirmed">Confirmado</span>
            </div>
        `;
        listaContainer.appendChild(card);
    });
}

function exibirMensagemAgendamento(texto, tipo = 'info') {
    const mensagemDiv = document.getElementById('mensagemAgendamento');
    if (mensagemDiv) {
        mensagemDiv.textContent = texto;
        mensagemDiv.className = `mensagem ${tipo}`;
    }
}