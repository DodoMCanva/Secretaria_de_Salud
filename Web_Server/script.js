
const dbSistema = {
    // Datos del Médico (Usuario que inicia sesión)
    medico: {
        usuario: "dra.ana",
        password: "123", // Contraseña simulada
        nombre: "Dra. Ana Ruiz Fernández",
        email: "ana.ruiz@hospital.com",
        telefono: "+52 55 1234 5678",
        cedula: "CED-87654321",
        rol: "Personal Médico",
        especialidad: "Medicina Interna"
    },

    // Datos del Paciente (Solo uno, como pediste)
    paciente: {
        id: "pat_001",
        nombre: "Valeria",
        edad: 34,
        historial: [
            {
                fecha: "15/01/2024",
                medico: "Dr. Carlos Mendoza",
                diagnostico: "Hipertensión arterial",
                tratamiento: "Losartán 50mg diario",
                notas: "Control en 3 meses. Dieta baja en sodio."
            },
            {
                fecha: "20/02/2024",
                medico: "Dra. Ana Ruiz",
                diagnostico: "Control rutinario",
                tratamiento: "Continuar medicación",
                notas: "Presión arterial controlada. Excelente adherencia."
            },
            {
                fecha: "22/11/2025",
                medico: "Dra. Ana Ruiz",
                diagnostico: "Migraña Leve",
                tratamiento: "Paracetamol 500mg",
                notas: "Paciente reporta estrés laboral."
            },
            {
            fecha: "15/01/2024",
                medico: "Dr. Carlos Mendoza",
                diagnostico: "lele pancha",
                tratamiento: "treta",
                notas: "Cesar no sigue nada."
        }
        ]
    },
     

    // Datos para la tabla de Accesos (Mezcla de datos fijos y dinámicos)
    accesos: [
        {
            nombre: "Dr. Carlos Mendoza",
            rol: "Médico",
            cedula: "CED-12345678",
            estado: "Activo",
            ultimoAcceso: "28/02/2024"
        }
        // El usuario logueado se agregará dinámicamente aquí
    ]
};


document.addEventListener('DOMContentLoaded', () => {
    iniciarEventListeners();
});

function iniciarEventListeners() {
    // Botón de Login
    const btnLogin = document.getElementById('auth-button');
    if(btnLogin) btnLogin.addEventListener('click', realizarLogin);

    // Navegación del Sidebar (Cambio de vistas)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Remover clase active de todos
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Agregar a el clickeado (buscando el elemento padre button si se clickea el icono)
            const target = e.currentTarget;
            target.classList.add('active');
            
            // Manejar cambio de vista
            const viewId = target.getAttribute('data-view');
            cambiarVista(viewId);
        });
    });

    // Botón Cerrar Sesión
    const btnLogout = document.getElementById('logout-button');
    if(btnLogout) btnLogout.addEventListener('click', cerrarSesion);

    // Tabs del Perfil
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Activar botón
            tabButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Mostrar contenido
            const tabId = e.target.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            const tabContent = document.getElementById(`tab-${tabId}`);
            if(tabContent) tabContent.classList.add('active');
        });
    });
}

// --- Funciones de Autenticación ---

function realizarLogin() {
    const userInput = document.getElementById('login-user');
    const passInput = document.getElementById('login-pass');
    const statusDiv = document.getElementById('auth-status');
    const statusMsg = document.getElementById('auth-message');
    const btnLogin = document.getElementById('auth-button');

    if(!userInput || !passInput) return;

    // Simulación de carga visual (spinner)
    btnLogin.disabled = true;
    const textoOriginal = btnLogin.innerText;
    btnLogin.innerText = "Validando...";

    // Pequeño delay para simular conexión a servidor
    setTimeout(() => {
        if (userInput.value === dbSistema.medico.usuario && passInput.value === dbSistema.medico.password) {
            // Login Exitoso
            statusDiv.style.display = "none";
            document.getElementById('auth-screen').style.display = "none";
            document.getElementById('main-app').style.display = "flex";
            
            // Cargar datos simulados
            cargarDatosEnInterfaz();
        } else {
            // Login Fallido
            statusDiv.style.display = "flex";
            statusDiv.style.color = "red"; 
            statusMsg.innerText = " Credenciales incorrectas    ";
        }
        
        // Restaurar botón
        btnLogin.disabled = false;
        btnLogin.innerText = textoOriginal;
    }, 800); // 800ms de espera simulada
}

function cerrarSesion() {
    if(confirm("¿Desea cerrar la sesión?")) {
        document.getElementById('main-app').style.display = "none";
        document.getElementById('auth-screen').style.display = "flex";
        // Limpiar inputs
        document.getElementById('login-user').value = "";
        document.getElementById('login-pass').value = "";
        document.getElementById('auth-status').style.display = "none";
    }
}

// --- Funciones de Carga de Datos (Renderizado) ---

function cargarDatosEnInterfaz() {
    console.log("Cargando datos del sistema...");
    
    // 1. Cargar Datos del Médico en Sidebar y Perfil
    const userNameDisplay = document.getElementById('user-name');
    if(userNameDisplay) userNameDisplay.innerText = dbSistema.medico.nombre;
    
    // Llenar inputs del perfil
    const perfilNombre = document.getElementById('perfil-nombre');
    if(perfilNombre) { 
        perfilNombre.value = dbSistema.medico.nombre;
        document.getElementById('perfil-email').value = dbSistema.medico.email;
        document.getElementById('perfil-telefono').value = dbSistema.medico.telefono;
        document.getElementById('perfil-cedula').value = dbSistema.medico.cedula;
    }

    // 2. Cargar Tabla Historial Clínico
    renderizarTablaHistorial();

    // 3. Cargar Tabla Accesos
    renderizarTablaAccesos();
}

function renderizarTablaHistorial() {
    const tbody = document.getElementById('tabla-historial');
    if(!tbody) return;
    
    tbody.innerHTML = ""; // Limpiar tabla

    // Iteramos sobre el array de historial del paciente
    dbSistema.paciente.historial.forEach(consulta => {
        const fila = `
            <tr>
                <td>${consulta.fecha}</td>
                <td>${consulta.medico}</td>
                <td>${consulta.diagnostico}</td>
                <td>${consulta.tratamiento}</td>
                <td class="truncate">${consulta.notas}</td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

function renderizarTablaAccesos() {
    const tbody = document.getElementById('tabla-accesos');
    if(!tbody) return;

    tbody.innerHTML = ""; // Limpiar tabla

    // Creamos una lista temporal que incluye al médico logueado
    const listaCompleta = [...dbSistema.accesos];
    
    // Agregamos al médico logueado a la tabla visualmente
    listaCompleta.push({
        nombre: dbSistema.medico.nombre,
        rol: dbSistema.medico.rol,
        cedula: dbSistema.medico.cedula,
        estado: "Activo (Tú)",
        ultimoAcceso: "Ahora mismo"
    });

    listaCompleta.forEach(acceso => {
        const fila = `
            <tr>
                <td>
                    <div class="user-cell">
                        <div class="user-avatar-small">
                             <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="user-cell-name">${acceso.nombre}</p>
                        </div>
                    </div>
                </td>
                <td><span class="badge badge-info">${acceso.rol}</span></td>
                <td class="font-mono">${acceso.cedula}</td>
                <td><span class="badge badge-success">${acceso.estado}</span></td>
                <td>${acceso.ultimoAcceso}</td>
                <td class="text-right">
                    <button class="btn btn-sm btn-danger-outline">Revocar</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

function cambiarVista(viewId) {
    // Ocultar todas las vistas
    document.querySelectorAll('.view-content').forEach(div => {
        div.classList.remove('active');
    });
    // Mostrar la deseada
    const view = document.getElementById(`view-${viewId}`);
    if (view) {
        view.classList.add('active');
    }
}