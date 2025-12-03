const appState = {
    currentView: 'expedientevista'
}

class grafico {

    cargarDatosEnInterfaz(usuario) {
        console.log("Procesando datos visuales:", usuario);

        // A. Barra Lateral
        const sideName = document.getElementById('user-name');
        if (sideName) sideName.innerText = usuario.nombre || "Paciente";

        // B. Datos Personales (Vista Configuración - Inputs)
        this.setValue('perfil-nombre', usuario.nombre);
        this.setValue('perfil-nss', usuario.nss);
        this.setValue('perfil-curp', usuario.curp);
        this.setValue('perfil-sangre', usuario.tipoSangre);
        this.setValue('perfil-email', usuario.correo);
        this.setValue('perfil-telefono', usuario.telefono);
        
        // Contacto de emergencia en inputs
        const contactoInfo = (usuario.nombreContEm || "") + " (" + (usuario.telefonoContEm || "") + ")";
        this.setValue('perfil-contacto', contactoInfo);
        
        // C. Vista Expediente (Tarjetas de solo lectura)
        this.setText('dato-nombre', usuario.nombre);
        this.setText('dato-id', usuario.nss);
        this.setText('dato-curp', usuario.curp);
        this.setText('dato-nss', usuario.nss);
        this.setText('dato-sangre', usuario.tipoSangre);
        this.setText('dato-contacto', contactoInfo);

        // Edad
        if (usuario.fehcaNac) {
            const edad = this.calcularEdadCorregida(usuario.fehcaNac);
            this.setText('dato-edad', edad);
            
        }    

        // Alergias
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
                divAlergias.innerHTML = '<span class="badge badge-success">Ninguna</span>';
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

    setValue(id, valor) {      
        const el = document.getElementById(id);
        if (el) {
            el.value = valor || "";
        } else {
            console.warn("Falta en el HTML el ID: " + id);
        }
    }

    cargarExpediente(expediente) {

        // ========== RECETAS ==========
        const listaRecetas = document.getElementById('lista-recetas');
        listaRecetas.innerHTML = '';

        if (expediente.recetas && expediente.recetas.length > 0) {
            expediente.recetas.forEach((receta, index) => {
                const li = document.createElement('li');

                const btn = document.createElement('button');
                btn.textContent = `Descargar Receta ${index + 1}`;
                btn.className = "btn btn-warning btn-sm";
                btn.onclick = () => {
                    const blob = new Blob([receta], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `receta_${index + 1}.txt`;
                    a.click();

                    URL.revokeObjectURL(url);
                };

                li.appendChild(btn);
                listaRecetas.appendChild(li);
            });
        } else {
            listaRecetas.innerHTML = '<li>No hay recetas registradas.</li>';
        }

        // ========== PDFS ==========
        const listaPdfs = document.getElementById('lista-pdfs');
        listaPdfs.innerHTML = '';

        if (expediente.pdfs && expediente.pdfs.length > 0) {
            expediente.pdfs.forEach((pdf, index) => {
                const li = document.createElement('li');

                const btn = document.createElement('button');
                btn.textContent = `Descargar Documento ${index + 1}`;
                btn.className = "btn btn-primary btn-sm";

                btn.onclick = () => {
                    this.descargarBase64(
                        pdf.contenidoBase64,
                        `documento_${index + 1}.pdf`,
                        "application/pdf"
                    );
                };

                li.appendChild(btn);
                listaPdfs.appendChild(li);
            });
        } else {
            listaPdfs.innerHTML = '<li>No hay PDFs registrados.</li>';
        }

        // ========== IMÁGENES ==========
        const listaImagenes = document.getElementById('lista-imagenes');
        listaImagenes.innerHTML = '';

        if (expediente.imagenes && expediente.imagenes.length > 0) {
            expediente.imagenes.forEach((img, index) => {
                const li = document.createElement('li');

                // Vista previa
                const imgEl = document.createElement('img');
                imgEl.src = `data:image/jpeg;base64,${img.contenidoBase64}`;
                imgEl.style.width = "120px";
                imgEl.style.display = "block";
                imgEl.style.marginBottom = "6px";

                const btn = document.createElement('button');
                btn.textContent = `Descargar Imagen ${index + 1}`;
                btn.className = "btn btn-success btn-sm";

                btn.onclick = () => {
                    this.descargarBase64(
                        img.contenidoBase64,
                        `imagen_${index + 1}.jpg`,
                        "image/jpeg"
                    );
                };

                li.appendChild(imgEl);
                li.appendChild(btn);
                listaImagenes.appendChild(li);
            });
        } else {
            listaImagenes.innerHTML = '<li>No hay imágenes registradas.</li>';
        }
    }

    descargarBase64(base64Data, nombreArchivo, tipoMime) {
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: tipoMime });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = nombreArchivo;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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

        // Iniciar tabs también
        this.initTabs();
    }

    switchView(viewName) {
        // 1. Ocultar todas
        const views = document.querySelectorAll('.view-content');
        views.forEach(view => {
            view.classList.remove('active');

        });

        // 2. Desactivar botones
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-view') === viewName) {
                item.classList.add('active');
            }
        });

        // 3. Mostrar la seleccionada
        const activeView = document.getElementById('view-' + viewName);
        if (activeView) {
            activeView.classList.add('active');
        }
    }

    // ===== TABS =====

    initTabs() {
        const self = this; // Guardar referencia
        const tabButtons = document.querySelectorAll('.tab-button');

        tabButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const tabName = this.getAttribute('data-tab');
                self.switchTab(tabName);
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
        console.log(">>> INICIANDO RENDERIZADO DE TABLA. Datos:", solicitudes);

        const tbody = document.getElementById('tabla-accesos');
        if (!tbody) {
            console.error("!!! ERROR CRÍTICO: No existe el tbody con id 'tabla-accesos' en el HTML");
            return;
        }

        // 1. Limpiar tabla
        tbody.innerHTML = '';

        if (!solicitudes || solicitudes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay solicitudes pendientes</td></tr>';
            return;
        }

        // 2. Recorrer datos correctamente
        solicitudes.forEach((sol, index) => {
            try {
                console.log(`Procesando fila ${index}:`, sol);

                // --- B. OTROS DATOS ---
                const medico = sol.nombreMedico || sol.idMedico || "Médico";
                const estado = sol.estado || "PENDIENTE";

                // Fecha
                let fechaFmt = "--";
                if (sol.fechaSolicitud) {
                    try {
                        let fechaObj = new Date(sol.fechaSolicitud);
                        fechaFmt = fechaObj.toLocaleDateString() + " " + fechaObj.toLocaleTimeString();
                    } catch (e) {
                        fechaFmt = "Fecha inválida";
                    }
                }

                // Estilos
                let badgeClass = 'badge-purple';
                if (estado === 'ACEPTADA') badgeClass = 'badge-success';
                if (estado === 'RECHAZADA') badgeClass = 'badge-danger';

                // --- C. CREAR HTML ---
                const tr = document.createElement('tr');
                tr.innerHTML = `
                <td>${medico}</td> 
                <td>Médico General</td> 
                <td>${sol.idMedico || '--'}</td> 
                <td><span class="badge ${badgeClass}">${estado}</span></td>
                <td>${fechaFmt}</td>
                <td class="text-right">
                    ${estado === 'PENDIENTE' ?
                        `<button class="btn btn-primary btn-sm" onclick="responderSolicitud('${medico}', 'ACEPTADA')">Aceptar</button>
                     <button class="btn btn-ghost btn-danger btn-sm" onclick="responderSolicitud('${medico}', 'RECHAZADA')">Rechazar</button>`
                        : '--'}
                </td>
            `;

                tbody.appendChild(tr);
                console.log(`Fila ${index} agregada correctamente.`);

            } catch (errorFila) {
                console.error(`!!! ERROR al procesar la fila ${index}:`, errorFila);
                console.error("Datos que causaron el error:", sol);
            }
        });
    }

}