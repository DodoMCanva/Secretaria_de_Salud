
const appState = {
    currentView: 'perfilvista'
}

class grafico {

    cargarDatosEnInterfaz(usuario) {
        const userNameDisplay = document.getElementById('user-name');
        if (userNameDisplay && usuario?.nombre) userNameDisplay.innerText = usuario.nombre;

        const perfilNombre = document.getElementById('perfil-nombre');
        if (perfilNombre && usuario) {
            perfilNombre.value = usuario.nombre || "";
            const email = document.getElementById('perfil-email');
            const tel = document.getElementById('perfil-telefono');
            const cedula = document.getElementById('perfil-cedula');
            if (email) email.value = usuario.correo || "";
            if (tel) tel.value = usuario.telefono || "";
            if (cedula) cedula.value = usuario.nss || "";
        }

        //this.renderizarTablaHistorial();
        //this.renderizarTablaAccesos(usuario);
    }

    cargarExpediente() {

    }
    // ===== NAVEGACIÓN =====

    initNavigation() {
        const self = this;
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(function (item) {
            item.addEventListener('click', function () {
                const view = this.getAttribute('data-view');
                self.switchView(view);
            });
        });
    }

    switchView(viewName) {
        // Actualizar estado
        appState.currentView = viewName;

        // Actualizar navegación activa
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(function (item) {
            if (item.getAttribute('data-view') === viewName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Actualizar vista activa
        const views = document.querySelectorAll('.view-content');
        views.forEach(function (view) {
            view.classList.remove('active');
        });

        const activeView = document.getElementById('view-' + viewName);
        if (activeView) {
            activeView.classList.add('active');
        }
    }

    // ===== TABS =====

    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');

        tabButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const tabName = this.getAttribute('data-tab');
                switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Actualizar botones activos
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(function (button) {
            if (button.getAttribute('data-tab') === tabName) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Actualizar contenido activo
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(function (content) {
            content.classList.remove('active');
        });

        const activeContent = document.getElementById('tab-' + tabName);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }
    /*
    renderizarTablaHistorial() {
        const tbody = document.getElementById('tabla-historial');
        if (!tbody) return;

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

    //Deberia ser una tabla de solicitudes 
    renderizarTablaAccesos(usuario) {
        const tbody = document.getElementById('tabla-accesos');
        if (!tbody) return;

        tbody.innerHTML = "";

        //const listaCompleta = [...dbSistema.accesos];

        listaCompleta.push({
            nombre: usuario.nombre,
            rol: usuario.rol || 'Paciente',
            cedula: usuario.nss,
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


    cambiarVista(viewId) {
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
        */
}