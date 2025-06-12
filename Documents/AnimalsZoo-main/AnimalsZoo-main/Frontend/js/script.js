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
    
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});