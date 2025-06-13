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
    handleIncomingScheduleRequest();
});

function handleIncomingScheduleRequest() {
    const params = new URLSearchParams(window.location.search);
    const serviceToSchedule = params.get('agendar');

    if (serviceToSchedule) {
        const scheduleModal = document.getElementById('scheduleModal');
        const serviceSelect = document.getElementById('agendamentoServico');

        if (scheduleModal && serviceSelect) {
            serviceSelect.value = decodeURIComponent(serviceToSchedule);
            scheduleModal.style.display = 'flex';
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
}

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

        petSelect.innerHTML = '<option value="">Selecione um pet</option>';
        meusPets.forEach(pet => {
            const option = document.createElement('option');
            option.value = pet.id;
            option.textContent = pet.nome;
            petSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao buscar pets para o modal:", error);
    }
    
    const hoje = new Date().toISOString().split('T')[0];
    dataInput.setAttribute('min', hoje);
    popularHorariosDisponiveis();
}

function popularHorariosDisponiveis() {
    const horaSelect = document.getElementById('agendamentoHora');
    if (!horaSelect) return;
    const horarios = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    horaSelect.innerHTML = '';
    horarios.forEach(horario => {
        const option = document.createElement('option');
        option.value = horario;
        option.textContent = horario;
        horaSelect.appendChild(option);
    });
}

async function handleAgendamentoSubmit(event) {
    event.preventDefault();
    const token = getToken();
    if (!token) {
        exibirMensagemAgendamento('Sessão expirada. Faça login novamente.', 'erro');
        return;
    }

    const dadosAgendamento = {
        pet_id: document.getElementById('agendamentoPet').value,
        servico: document.getElementById('agendamentoServico').value,
        data_agendamento: document.getElementById('agendamentoData').value,
        hora_agendamento: document.getElementById('agendamentoHora').value,
    };

    if (!dadosAgendamento.pet_id || !dadosAgendamento.servico || !dadosAgendamento.data_agendamento || !dadosAgendamento.hora_agendamento) {
        exibirMensagemAgendamento('Por favor, preencha todos os campos.', 'erro');
        return;
    }

    try {
        const response = await fetch(`${backendBaseUrl}/agendamentos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dadosAgendamento)
        });

        const resultado = await response.json();

        if (response.ok) {
            exibirMensagemAgendamento('Agendamento realizado com sucesso!', 'sucesso');
            await listarAgendamentos();
            setTimeout(() => {
                document.getElementById('scheduleModal').style.display = 'none';
                document.getElementById('mensagemAgendamento').className = 'mensagem';
                document.getElementById('mensagemAgendamento').textContent = '';
                event.target.reset();
            }, 2000);
        } else {
            exibirMensagemAgendamento(resultado.message, 'erro');
        }
    } catch (error) {
        console.error("Erro ao criar agendamento:", error);
        exibirMensagemAgendamento('Erro de conexão ao criar agendamento.', 'erro');
    }
}

async function listarAgendamentos() {
    const listaContainer = document.getElementById('appointmentsList');
    if(!listaContainer) return;
    
    const token = getToken();
    if (!token) return;

    listaContainer.innerHTML = '<p class="empty-state-message">Buscando seus agendamentos...</p>';

    try {
        const response = await fetch(`${backendBaseUrl}/agendamentos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Falha ao buscar agendamentos.');
        }

        const agendamentos = await response.json();

        listaContainer.innerHTML = '';
        if (agendamentos.length === 0) {
            listaContainer.innerHTML = '<p class="empty-state-message">Nenhum agendamento futuro encontrado.</p>';
            return;
        }

        agendamentos.forEach(ag => {
            const card = document.createElement('div');
            card.className = 'appointment-card';
            // Formata a data para exibir corretamente, ignorando o fuso horário
            const dataFormatada = new Date(ag.data_agendamento).toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: 'long', year: 'numeric' });

            card.innerHTML = `
                <div class="appointment-header">
                    <div class="appointment-icon-circle">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C27C3D" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                    </div>
                    <div>
                        <h3 class="appointment-title">${ag.servico} - ${ag.pet_nome}</h3>
                        <p class="appointment-date-time">${dataFormatada}, ${ag.hora_agendamento.substring(0, 5)}</p>
                    </div>
                    <span class="status-badge status-confirmed">${ag.status}</span>
                </div>
                 <div class="button-group appointment-actions">
                    <button class="btn btn-small btn-danger" onclick="cancelarAgendamento(${ag.id})">Cancelar</button>
                </div>
            `;
            listaContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao listar agendamentos:", error);
        listaContainer.innerHTML = '<p class="empty-state-message">Erro ao carregar agendamentos.</p>';
    }
}

async function cancelarAgendamento(id) {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
        return;
    }

    const token = getToken();
    if (!token) {
        alert('Sua sessão expirou. Faça login novamente.');
        return;
    }

    try {
        const response = await fetch(`${backendBaseUrl}/agendamentos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const resultado = await response.json();

        if (response.ok) {
            alert(resultado.message);
            await listarAgendamentos();
        } else {
            alert(`Erro: ${resultado.message}`);
        }
    } catch (error) {
        console.error("Erro ao cancelar agendamento:", error);
        alert('Erro de conexão ao tentar cancelar o agendamento.');
    }
}


function exibirMensagemAgendamento(texto, tipo = 'info') {
    const mensagemDiv = document.getElementById('mensagemAgendamento');
    if (mensagemDiv) {
        mensagemDiv.textContent = texto;
        mensagemDiv.className = `mensagem ${tipo}`;
    }
}

function getUserId() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    return usuario ? usuario.id : null;
}

function getToken() {
    return localStorage.getItem('tokenUsuario');
}