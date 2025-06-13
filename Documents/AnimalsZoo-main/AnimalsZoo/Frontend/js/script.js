// Declaração única da URL base da API para ser usada por outros scripts
const backendBaseUrl = 'http://localhost:3006/api';

function showTab(tabId, clickedButton) {
    const tabContents = document.querySelectorAll('.dashboard-main-content .tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });

    const tabTriggers = document.querySelectorAll('.dashboard-main-content .tab-trigger');
    tabTriggers.forEach(trigger => {
        trigger.classList.remove('active');
    });

    const selectedTabContent = document.getElementById(tabId);
    if (selectedTabContent) {
        selectedTabContent.classList.add('active');
        selectedTabContent.style.display = 'block';
    }
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
}

    function toggleMobileMenu() {
        const mobileNav = document.getElementById('mobileNav');
        if (mobileNav) {
            mobileNav.classList.toggle('active');
        }
    }

document.addEventListener('DOMContentLoaded', function() {
    // Lógica de autenticação movida para auth.js para melhor organização

    function setupModal(modalId, openBtnIds, closeBtnClass) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        const closeBtn = modal.querySelector(closeBtnClass);

        openBtnIds.forEach(btnId => {
            const openBtn = document.getElementById(btnId);
            if(openBtn) {
                openBtn.addEventListener('click', () => {
                    modal.style.display = 'flex';
                });
            }
        });
        
        if(closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    }

    if (window.location.pathname.endsWith('dashboard.html')) {
        setupModal('editProfileModal', ['editProfileBtn'], '.close-button');
        setupModal('addPetModal', ['addPetBtnSidebar', 'addPetBtnMain'], '.close-button');
        setupModal('scheduleModal', ['scheduleServiceBtnSidebar', 'newAppointmentBtn'], '.close-button');
        
        const tabTriggers = document.querySelectorAll('.dashboard-main-content .tab-trigger');
        if (tabTriggers.length > 0) {
            // **A CORREÇÃO ESTÁ AQUI**
            // Havia um erro de digitação ("constisActiveTab") que foi corrigido para "const isActiveTab"
            const isActiveTab = document.querySelector('.dashboard-main-content .tab-trigger.active');
            if (!isActiveTab && tabTriggers[0]) {
                 showTab(tabTriggers[0].getAttribute('data-tab'), tabTriggers[0]);
            }
        }
    }

    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    

    document.addEventListener('DOMContentLoaded', () => {
    // A função carregarAgendamentos() já deve existir neste arquivo, vamos adicionar a nova
    if (document.getElementById('historico-lista')) {
        carregarHistoricoAgendamentos();
    }
});

async function carregarHistoricoAgendamentos() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Usuário não autenticado.');
        return;
    }

    try {
        const response = await fetch('/api/agendamentos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar histórico de agendamentos.');
        }

        const agendamentos = await response.json();
        const historicoLista = document.getElementById('historico-lista');
        
        // Limpa conteúdo anterior
        historicoLista.innerHTML = '';

        const agendamentosHistorico = agendamentos.filter(agendamento => {
            return agendamento.status === 'concluido' || agendamento.status === 'cancelado';
        });

        // Ordena por data, os mais recentes primeiro
        agendamentosHistorico.sort((a, b) => new Date(b.data_agendamento) - new Date(a.data_agendamento));

        if (agendamentosHistorico.length === 0) {
            historicoLista.innerHTML = '<p>Nenhum agendamento no histórico.</p>';
            return;
        }

        agendamentosHistorico.forEach(agendamento => {
            const item = document.createElement('div');
            item.classList.add('historico-item');
            // Adiciona uma classe específica para estilização baseada no status
            item.classList.add(agendamento.status); // será 'concluido' ou 'cancelado'

            const dataFormatada = new Date(agendamento.data_agendamento).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            item.innerHTML = `
                <p><strong>Pet:</strong> ${agendamento.pet_nome}</p>
                <p><strong>Serviço:</strong> ${agendamento.servico}</p>
                <p><strong>Data:</strong> ${dataFormatada}</p>
                <p><strong>Status:</strong> <span class="status">${agendamento.status}</span></p>
            `;
            historicoLista.appendChild(item);
        });

    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        const historicoLista = document.getElementById('historico-lista');
        if (historicoLista) {
            historicoLista.innerHTML = '<p class="erro">Não foi possível carregar o histórico de agendamentos.</p>';
        }
    }
}
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});