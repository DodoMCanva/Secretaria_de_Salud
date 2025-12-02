
const appState = {
    currentView: 'expedientevista'
}

class grafico {

    cargarDatosEnInterfaz(usuario) {
        console.log("Procesando datos para la vista:", usuario);

        // nombre del paciente en la barra
        const sideName = document.getElementById('user-name');
        if (sideName) sideName.innerText = usuario.nombre || "Usuario";

        const perfilNombre = document.getElementById('perfil-nombre');
        if (perfilNombre) {
            perfilNombre.value = usuario.nombre || "";
            document.getElementById('perfil-email').value = usuario.correo || "";
            document.getElementById('perfil-telefono').value = usuario.telefono || "";
            document.getElementById('perfil-cedula').value = usuario.nss || "";
        }

        // datos de paciente
        this.setText('dato-nombre', usuario.nombre);
        this.setText('dato-id', usuario.nss);
        this.setText('dato-curp', usuario.curp);
        this.setText('dato-nss', usuario.nss);
        this.setText('dato-sangre', usuario.tipoSangre);

        // nombre y telefono del contacto
        const contacto = (usuario.nombreContEm || "") + " - " + (usuario.telefonoContEm || "");
        this.setText('dato-contacto', contacto);

        //edad
        if (usuario.fehcaNac) {
            const edadTexto = this.calcularEdadCorregida(usuario.fehcaNac);
            this.setText('dato-edad', edadTexto);
        } else {
            this.setText('dato-edad', "--");
        }

        // alergias
        const divAlergias = document.getElementById('dato-alergias');
        if (divAlergias) {
            divAlergias.innerHTML = '';
            if (usuario.alergias && usuario.alergias.length > 0) {
                usuario.alergias.forEach(al => {
                    const span = document.createElement('span');
                    span.className = 'badge badge-danger';
                    span.innerText = al;
                    span.style.marginRight = '5px';
                    divAlergias.appendChild(span);
                });
            } else {
                divAlergias.innerText = "Ninguna";
            }
        }
    }

    //metodo para calcular la edad
    calcularEdadCorregida(fechaInput) {
        if (!fechaInput) return "--";
        let fechaNac = new Date(fechaInput);
        const anioActual = new Date().getFullYear();
        if (fechaNac.getFullYear() > anioActual) {
            console.warn("Fecha futura detectada (" + fechaNac.getFullYear() + "). Corrigiendo error de Java...");
            fechaNac.setFullYear(fechaNac.getFullYear() - 1900);
        }
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }

        return edad + " años";
    }

    // Pequeña ayuda para no romper si falta un ID
    setText(id, texto) {
        const el = document.getElementById(id);
        if (el) {
            el.innerText = texto || "--";
        } else {
            console.warn("Falta en el HTML el ID: " + id);
        }
    }

    cargarExpediente() {

    }
    //navigacion

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


    cargarSolicitudesEnTabla(solicitudes) {
        const tbody = document.getElementById('tabla-accesos');
        if (!tbody) return;

        tbody.innerHTML = ''; // Limpiar tabla

        if (!solicitudes || solicitudes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay solicitudes pendientes</td></tr>';
            return;
        }

        solicitudes.forEach(sol => {
            const tr = document.createElement('tr');

            // Asumiendo que el objeto solicitud tiene estos campos
            // Ajusta según tu clase Java Solicitud
            const fechaFmt = sol.fecha || "Sin fecha";
            const medicoNombre = sol.nombreMedico || sol.idMedico || "Médico";

            // Renderizar estado con estilo
            let badgeClass = 'badge-purple';
            if (sol.estado === 'ACEPTADA') badgeClass = 'badge-success';
            if (sol.estado === 'RECHAZADA') badgeClass = 'badge-danger';

            tr.innerHTML = `
                <td>${medicoNombre}</td> <td>Médico General</td> <td>${sol.idMedico}</td> <td><span class="badge ${badgeClass}">${sol.estado}</span></td>
                <td>${fechaFmt}</td>
                <td class="text-right">
                    ${sol.estado === 'PENDIENTE' ?
                    `<button class="btn btn-primary btn-sm" onclick="responderSolicitud('${sol.id}', 'ACEPTADA')">Aceptar</button>
                         <button class="btn btn-ghost btn-danger btn-sm" onclick="responderSolicitud('${sol.id}', 'RECHAZADA')">Rechazar</button>`
                    : '--'}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }



}