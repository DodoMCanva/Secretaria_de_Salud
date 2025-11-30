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