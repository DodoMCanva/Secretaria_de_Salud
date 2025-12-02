const appState = {
    currentView: 'expedientevista'
}

class GraficoMedico {

    constructor() {
        console.log("Inicializando Dashboard del Médico...");
    }

    /**
     * CARGA DE DATOS REALES
     * Obtiene el token, lo envía al servidor y rellena el perfil.
     */
    async cargarDatosPerfil() {
        console.log("Cargando datos personales...");

        // 1. Obtener el Token guardado en el Login
        const token = localStorage.getItem('jwt');

        if (!token) {
            console.warn("No hay sesión activa. Redirigiendo al login...");
            window.location.href = 'login.html'; // Saca al usuario si no tiene llave
            return;
        }

        try {
            // 2. Petición al servidor CON EL TOKEN
            const respuesta = await fetch('http://127.0.0.1:5000/api/medico/actual', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token, // Aquí enviamos la llave
                    'Content-Type': 'application/json'
                }
            });
            
            if (respuesta.status === 401) {
                alert("Su sesión ha expirado.");
                window.location.href = 'login.html';
                return;
            }

            if (!respuesta.ok) {
                throw new Error("Error del servidor: " + respuesta.status);
            }

            const medico = await respuesta.json();
            console.log("Datos reales del médico:", medico);

            // 3. Rellenar la Interfaz
            this.setText('user-name', medico.nombre);
            this.setText('header-medico-nombre', medico.nombre);
            this.setText('header-medico-rol', medico.rol || "Personal Médico");

            this.setValue('perfil-nombre', medico.nombre);
            this.setValue('perfil-email', medico.correo);
            this.setValue('perfil-telefono', medico.telefono);
            this.setValue('perfil-cedula', medico.cedula || medico.nss); 

        } catch (error) {
            console.error("Error al cargar datos:", error);
            this.setText('user-name', "Error de conexión");
        }
    }

    // --- FUNCIONES DE AYUDA ---
    setText(id, texto) {
        const elemento = document.getElementById(id);
        if (elemento) elemento.innerText = texto || "";
    }

    setValue(id, valor) {
        const input = document.getElementById(id);
        if (input) input.value = valor || "";
    }

    // --- NAVEGACIÓN ---
    initNavigation() {
        const self = this;
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function () {
                const view = this.getAttribute('data-view');
                self.switchView(view);
            });
        });
    }

    switchView(viewName) {
        appState.currentView = viewName;
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.getAttribute('data-view') === viewName) item.classList.add('active');
            else item.classList.remove('active');
        });
        document.querySelectorAll('.view-content').forEach(view => {
            view.classList.remove('active');
        });
        const activeView = document.getElementById('view-' + viewName);
        if (activeView) activeView.classList.add('active');
    }

    // --- TABS ---
    initTabs() {
        const self = this;
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', function () {
                const tabName = this.getAttribute('data-tab');
                self.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-button').forEach(btn => {
            if (btn.getAttribute('data-tab') === tabName) btn.classList.add('active');
            else btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById('tab-' + tabName);
        if (activeContent) activeContent.classList.add('active');
    }
}

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    const appMedico = new GraficoMedico();
    appMedico.initNavigation();
    appMedico.initTabs();
    
    // Al cargar, busca los datos reales
    appMedico.cargarDatosPerfil();
    
    // Configurar botón cerrar sesión
    const btnLogout = document.getElementById('logout-button');
    if(btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('jwt'); // Borrar token
            window.location.href = 'login.html';
        });
    }
});