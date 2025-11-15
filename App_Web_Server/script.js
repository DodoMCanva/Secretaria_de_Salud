// Sistema Médico Integrado - JavaScript

// Estado de la aplicación
let appState = {
    authenticated: false,
    userType: 'medical_staff', // 'patient', 'guardian', 'medical_staff'
    userName: 'Dra. Ana Ruiz Fernández',
    currentView: 'clinical-record',
    authStatus: 'idle' // 'idle', 'authenticating', 'success', 'failed'
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initAuth();
    initNavigation();
    initTabs();
    initLogout();
});

// ===== AUTENTICACIÓN =====

function initAuth() {
    const authButton = document.getElementById('auth-button');
    const fingerprintCircle = document.getElementById('fingerprint-circle');
    const authStatus = document.getElementById('auth-status');
    
    if (authButton) {
        authButton.addEventListener('click', function() {
            if (appState.authStatus === 'idle') {
                simulateBiometricAuth();
            }
        });
    }
}

function simulateBiometricAuth() {
    const authButton = document.getElementById('auth-button');
    const fingerprintCircle = document.getElementById('fingerprint-circle');
    const authStatus = document.getElementById('auth-status');
    
    // Cambiar estado a autenticando
    appState.authStatus = 'authenticating';
    authButton.disabled = true;
    authButton.innerHTML = `
        <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Validando...
    `;
    fingerprintCircle.classList.add('authenticating');
    
    // Simular autenticación (2 segundos)
    setTimeout(function() {
        // Autenticación exitosa
        appState.authStatus = 'success';
        
        authStatus.style.display = 'flex';
        authStatus.className = 'auth-status success';
        authStatus.innerHTML = `
            <svg class="icon-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Acceso autorizado</span>
        `;
        
        // Después de 1 segundo, mostrar la aplicación principal
        setTimeout(function() {
            appState.authenticated = true;
            showMainApp();
        }, 1000);
    }, 2000);
}

function showMainApp() {
    const authScreen = document.getElementById('auth-screen');
    const mainApp = document.getElementById('main-app');
    
    if (authScreen && mainApp) {
        authScreen.style.display = 'none';
        mainApp.style.display = 'flex';
    }
}

// ===== NAVEGACIÓN =====

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            switchView(view);
        });
    });
}

function switchView(viewName) {
    // Actualizar estado
    appState.currentView = viewName;
    
    // Actualizar navegación activa
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function(item) {
        if (item.getAttribute('data-view') === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Actualizar vista activa
    const views = document.querySelectorAll('.view-content');
    views.forEach(function(view) {
        view.classList.remove('active');
    });
    
    const activeView = document.getElementById('view-' + viewName);
    if (activeView) {
        activeView.classList.add('active');
    }
}

// ===== TABS =====

function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Actualizar botones activos
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(function(button) {
        if (button.getAttribute('data-tab') === tabName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Actualizar contenido activo
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(function(content) {
        content.classList.remove('active');
    });
    
    const activeContent = document.getElementById('tab-' + tabName);
    if (activeContent) {
        activeContent.classList.add('active');
    }
}

// ===== CERRAR SESIÓN =====

function initLogout() {
    const logoutButton = document.getElementById('logout-button');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            logout();
        });
    }
}

function logout() {
    // Confirmar cierre de sesión
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        // Reiniciar estado
        appState.authenticated = false;
        appState.authStatus = 'idle';
        
        // Ocultar aplicación y mostrar pantalla de autenticación
        const authScreen = document.getElementById('auth-screen');
        const mainApp = document.getElementById('main-app');
        
        if (authScreen && mainApp) {
            mainApp.style.display = 'none';
            authScreen.style.display = 'flex';
            
            // Reiniciar interfaz de autenticación
            const authButton = document.getElementById('auth-button');
            const fingerprintCircle = document.getElementById('fingerprint-circle');
            const authStatus = document.getElementById('auth-status');
            
            if (authButton) {
                authButton.disabled = false;
                authButton.innerHTML = 'Validar Huella Digital';
            }
            
            if (fingerprintCircle) {
                fingerprintCircle.classList.remove('authenticating');
            }
            
            if (authStatus) {
                authStatus.style.display = 'none';
            }
        }
    }
}

// ===== UTILIDADES =====

// Animación de spin para iconos de carga
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Función para formatear fechas (opcional)
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
}

// Función para mostrar notificaciones (opcional)
function showNotification(message, type = 'info') {
    // Implementar sistema de notificaciones toast si es necesario
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Event listeners adicionales para funcionalidad futura
document.addEventListener('DOMContentLoaded', function() {
    // Switches
    const switches = document.querySelectorAll('.switch input[type="checkbox"]');
    switches.forEach(function(switchEl) {
        switchEl.addEventListener('change', function() {
            console.log('Switch toggled:', this.checked);
            // Aquí puedes agregar lógica adicional
        });
    });
    
    // Botones de acción
    const actionButtons = document.querySelectorAll('.btn:not(.nav-item):not(#auth-button):not(#logout-button):not(.tab-button)');
    actionButtons.forEach(function(button) {
        // Agregar efectos de clic si es necesario
        button.addEventListener('click', function(e) {
            // Prevenir comportamiento por defecto para demostración
            const buttonText = this.textContent.trim();
            console.log('Botón clickeado:', buttonText);
            
            // Ejemplo: mostrar alerta para botones de acción
            if (buttonText.includes('Agregar')) {
                showNotification('Función en desarrollo: ' + buttonText, 'info');
            }
        });
    });
});

// Debug: Exponer estado global para desarrollo
window.medicalAppState = appState;
