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

    cargarDatosPaciente(usuario) {
        console.log("Procesando datos visuales:", usuario);

        // B. Datos Personales (Vista Configuración - Inputs)
        this.setValue('detalle-nombre', usuario.nombre);
        this.setValue('detalle-nss', usuario.nss);
        this.setValue('detalle-curp', usuario.curp);
        this.setValue('detalle-tiposangre', usuario.tipoSangre);
       
        
        // Contacto de emergencia en inputs
        const contactoInfo = (usuario.nombreContEm || "") + " (" + (usuario.telefonoContEm || "") + ")";
        this.setValue('detalle-contacto', contactoInfo);
        
        // C. Vista Expediente (Tarjetas de solo lectura)
        this.setText('detalle-nombre', usuario.nombre);
        this.setText('detalle-nss', usuario.nss);
        this.setText('detalle-curp', usuario.curp);
        this.setText('dato-nss', usuario.nss);
        this.setText('detalle-tiposangre', usuario.tipoSangre);
        this.setText('detalle-contacto', contactoInfo);

        // Edad
        if (usuario.fehcaNac) {
            const edad = this.calcularEdadCorregida(usuario.fehcaNac);
            this.setText('detalle-edad', edad);
            
        }    

        // Alergias
        const divAlergias = document.getElementById('detalle-alergias');
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
    
    cargarExpediente(expediente) {
        console.log("entro en el grafico de medico");
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
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('jwt'); // Borrar token
            window.location.href = 'login.html';
        });
    }
});