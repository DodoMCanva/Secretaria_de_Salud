let graficoInstance = null;
const API_URL = 'http://localhost:5000';
let initialSearchHtml = ''; // Almacena el HTML de la vista de búsqueda inicial
const MAIN_VIEW_ID = 'view-expedientevista';

// --- Funciones para la Gestión de Expedientes (Intercambio de contenido) ---

/**
 * Reemplaza el contenido del DIV principal del expediente (view-expedientevista).
 * @param {string} htmlContent - El contenido HTML a inyectar.
 */
function renderExpedienteContent(htmlContent) {
    const container = document.getElementById(MAIN_VIEW_ID);
    if (container) {
        container.innerHTML = htmlContent;
    } else {
        console.error(`Error: Contenedor principal "${MAIN_VIEW_ID}" no encontrado.`);
    }
}

/**
 * Función para restaurar la interfaz de búsqueda inicial.
 */
function renderSearchUI() {
    renderExpedienteContent(initialSearchHtml);
    setupSearchListeners(); // Re-adjunta los listeners de la búsqueda y la tabla
}

/**
 * Realiza la búsqueda de pacientes en la API y rellena la tabla de resultados.
 * @param {string} searchTerm - Término de búsqueda (nombre, NSS, CURP)
 */
function buscarPacientes(searchTerm) {
    const token = localStorage.getItem('jwt');
    const tablaBody = document.getElementById('tabla-pacientes-resultados'); 
    if (!tablaBody) return;
    
    tablaBody.innerHTML = '<tr><td colspan="5">Buscando...</td></tr>';

    // --- MOCK / SIMULACIÓN DE DATOS (PARA DEMO) ---
    const mockPatients = [
        { id: 'pat_001', nombreCompleto: 'María Elena González López', curp: 'GOLM890515MDFNLR08', ultModf: '2025-11-20' },
        { id: 'pat_002', nombreCompleto: 'Juan Carlos Ramírez Pérez', curp: 'RAPJ950101HDSDFA01', ultModf: '2025-10-05' },
    ];
    
    const filteredPatients = mockPatients.filter(p => 
        p.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.curp.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setTimeout(() => { // Simular retraso de API
        if (filteredPatients.length > 0) {
            tablaBody.innerHTML = filteredPatients.map(p => `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.nombreCompleto}</td>
                    <td class="font-mono">${p.curp}</td>
                    <td>${p.ultModf}</td>
                    <td><button class="btn btn-sm btn-info btn-solicitar" data-id="${p.id}">Solicitar Expediente</button></td>
                </tr>
            `).join('');
        } else {
            tablaBody.innerHTML = '<tr><td colspan="5">No se encontraron pacientes.</td></tr>';
        }
    }, 500);

    /* --- LÓGICA REAL DE API (DEBE DESCOMENTARSE Y USARSE) ---
    fetch(`${API_URL}/pacientes/buscar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ termino: searchTerm })
    })
    .then(r => r.json())
    .then(data => {
        // ... (Tu lógica para rellenar la tabla)
    })
    .catch(err => {
        // ... (Manejo de errores)
    });
    */
}


/**
 * Carga y muestra el detalle completo del expediente, reemplazando la vista de búsqueda.
 * @param {string} pacienteId - ID del paciente
 */
function cargarExpedienteDetalle(pacienteId) {
    const token = localStorage.getItem('jwt');
    
    // Mapeo de íconos SVG
    const ICONO_PDF = `<svg class="icon-small inline text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`;
    const ICONO_IMAGEN = `<svg class="icon-small inline text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`;
    const ICONO_RECETA = `<svg class="icon-small inline text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>`;

    renderExpedienteContent('<div class="content-wrapper"><div class="card card-content">Cargando expediente...</div></div>');

    // --- MOCK DE RESPUESTA DE EXPEDIENTE (PARA DEMO) ---
    const mockExpediente = {
        nombre: 'María Elena González López',
        ultModf: '2025-11-20 14:30',
        estado: 'Activo',
        edad: 36,
        curp: 'GOLM890515MDFNLR08',
        nss: '1234567890-1',
        tipoSangre: 'O+',
        alergias: ['Penicilina', 'Polen', 'Mariscos'],
        contactoEmergencia: 'Roberto González (T: 55-1234-5678)',
        pdfs: ['Informe Médico 2024.pdf', 'Estudios de Laboratorio.pdf'],
        imagenes: ['Radiografía de Tórax.jpg'],
        recetas: ['Receta Paracetamol.pdf', 'Receta Antibiótico.pdf']
    };
    const data = { status: 'OK', expediente: mockExpediente };

    setTimeout(() => { // Simular retraso de API (eliminar en prod)
    // fetch(`${API_URL}/expediente/detalle`, { ... }).then(r => r.json()).then(data => { // Descomentar para API real
        if (data.status === 'OK' && data.expediente) {
            const exp = data.expediente;
            const patientName = exp.nombre || 'Paciente Desconocido';

            const renderFiles = (files, icon) => {
                if (files && files.length > 0) {
                    return files.map(file => `
                        <li><a href="#" class="file-link">${icon} ${file}</a></li>
                    `).join('');
                }
                return '<li><span class="text-muted">Sin archivos disponibles.</span></li>';
            };

            const alergiasHtml = (exp.alergias && exp.alergias.length > 0)
                ? `<div class="badge-group">${exp.alergias.map(alergia => `<span class="badge badge-danger">${alergia}</span>`).join(' ')}</div>`
                : '<p>Ninguna conocida</p>';
                
            // --- GENERACIÓN DEL HTML DE DETALLE COMPLETO (USA LA ESTRUCTURA HTML DE LA PREGUNTA ANTERIOR) ---
            const detalleHtml = `
                <div id="expediente-detalle" class="content-wrapper active">
                    <div class="card patient-detail-card">
                        <div class="card-header">
                            <div class="patient-header">
                                <div class="patient-avatar">
                                    <svg class="icon-large" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </div>
                                <div>
                                    <h2 id="detalle-nombre">Expediente de ${patientName}</h2>
                                    <p class="text-muted">ID: <span id="detalle-id">${pacienteId}</span> | Última Modificación: <span id="detalle-ultmodf">${exp.ultModf || '--'}</span></p>
                                </div>
                            </div>
                            <button class="btn btn-danger" id="btn-cerrar-expediente">Cerrar Expediente</button>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h2>Información Biográfica y Médica</h2>
                            <span class="badge badge-success" id="detalle-estado">${exp.estado || 'Activo'}</span>
                        </div>
                        <div class="card-content">
                            <div class="info-grid">
                                <div class="info-item">
                                    <label>Edad</label><p id="detalle-edad">${exp.edad || '--'}</p>
                                </div>
                                <div class="info-item">
                                    <label>CURP</label><p id="detalle-curp" class="font-mono">${exp.curp || '--'}</p>
                                </div>
                                <div class="info-item">
                                    <label>NSS</label><p id="detalle-nss" class="font-mono">${exp.nss || '--'}</p>
                                </div>
                                <div class="info-item">
                                    <label>Tipo de Sangre</label><p id="detalle-tiposangre">${exp.tipoSangre || '--'}</p>
                                </div>
                                <div class="info-item">
                                    <label>Alergias</label>
                                    <div class="badge-group" id="detalle-alergias">
                                        ${alergiasHtml}
                                    </div>
                                </div>
                                <div class="info-item">
                                    <label>Contacto de Emergencia</label><p id="detalle-contacto">${exp.contactoEmergencia || '--'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h2>Documentos del Expediente</h2>
                            <button class="btn btn-primary" id="btn-subir-archivo">
                                <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" /></svg>
                                Subir Archivo
                            </button>
                        </div>
                        <div class="card-content">
                            <div class="document-list-grid">
                                <div class="document-section">
                                    <h4><span class="badge badge-primary">PDFs</span></h4>
                                    <ul id="lista-pdfs" class="file-list">${renderFiles(exp.pdfs, ICONO_PDF)}</ul>
                                </div>
                                <div class="document-section">
                                    <h4><span class="badge badge-info">Imágenes</span></h4> 
                                    <ul id="lista-imagenes" class="file-list">${renderFiles(exp.imagenes, ICONO_IMAGEN)}</ul>
                                </div>
                                <div class="document-section">
                                    <h4><span class="badge badge-success">Recetas</span></h4>
                                    <ul id="lista-recetas" class="file-list">${renderFiles(exp.recetas, ICONO_RECETA)}</ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            renderExpedienteContent(detalleHtml);

            // Re-adjuntar eventos a los botones de la vista de detalle recién inyectada
            document.getElementById('btn-cerrar-expediente')?.addEventListener('click', renderSearchUI);
            document.getElementById('btn-subir-archivo')?.addEventListener('click', () => {
                alert(`Abriendo interfaz para subir un nuevo documento al expediente del paciente ID: ${pacienteId}`);
            });

        } else {
            alert(data.error || 'Error al obtener el detalle del expediente.');
            renderSearchUI(); // Si falla, regresa a la búsqueda
        }
    }, 500);
}

function solicitarAccesoExpediente(pacienteId) {
  const token = localStorage.getItem('jwt');
  if (!token) {
    alert('Sesión expirada, inicia sesión de nuevo.');
    window.location.href = 'login.html';
    return;
  }

  // Por ahora usamos pacienteId como identificador a enviar.
  // Cuando tengas NSS real en la tabla, aquí mandarás ese NSS.
  const body = {
    nssPaciente: pacienteId,
    motivo: 'Revisión de expediente clínico'
  };

  fetch('http://localhost:5000/solicitudes/crear', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
        nssPaciente: pacienteId,
        motivo: 'Revisión de expediente clínico'
    })
  })
    .then(r => r.json())
    .then(data => {
      console.log('Respuesta /solicitudes/crear:', data);
      if (data.error) {
        alert('Error creando solicitud: ' + data.error);
      } else {
        alert('Solicitud enviada. Espera a que el paciente autorice.');
        // aquí podrías guardar data.id si tu backend lo devuelve
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error al conectar con el servidor.');
    });
}


/**
 * Re-adjunta los listeners para la búsqueda cuando se carga/restaura la vista.
 */
function setupSearchListeners() {
    // 1. Re-adjuntar listeners de la búsqueda (btnSearch y inputSearch)
    const btnSearch = document.getElementById('btn-search-pacientes');
    const inputSearch = document.getElementById('input-paciente-search');
    
    if (btnSearch && inputSearch) {
        // Clonar y reemplazar para asegurar que los listeners antiguos se limpien 
        const newBtnSearch = btnSearch.cloneNode(true);
        btnSearch.parentNode.replaceChild(newBtnSearch, btnSearch);

        const handleSearch = () => {
            const searchTerm = inputSearch.value.trim();
            if (searchTerm.length > 2) {
                buscarPacientes(searchTerm);
            } else {
                alert("Por favor, introduce al menos 3 caracteres para buscar.");
            }
        };

        newBtnSearch.addEventListener('click', handleSearch);
        inputSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
    }

    // 2. Re-adjuntar listener de delegación para "Solicitar Expediente"
    // Usamos el contenedor de la tabla para escuchar el click en los botones dinámicos.
    const tablaResultados = document.getElementById('tabla-pacientes-resultados');
    if (tablaResultados) {
        tablaResultados.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-solicitar')) {
                const pacienteId = e.target.getAttribute('data-id');
                 solicitarAccesoExpediente(pacienteId);

                cargarExpedienteDetalle(pacienteId);
            }
        });
    }
}


// --- Función consultarPaciente (EXISTENTE) ---
function consultarPaciente() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    fetch('http://localhost:5000/paciente/consulta', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        body: JSON.stringify({
            nss: usuario.nss
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'OK' && data.paciente) {
            if (graficoInstance) {
                graficoInstance.cargarDatosEnInterfaz(data.paciente);
            }
        } else {
            console.error(data.error || 'Error consultando paciente');
        }
    })
    .catch(err => {
        console.error(err);
    });
}


// --- Lógica Principal y de Inicialización (DOMContentLoaded) ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificación de sesión
    if (!localStorage.getItem('jwt')) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Inicialización de clases
    if (typeof grafico === 'function') {
        graficoInstance = new grafico();
        graficoInstance.initNavigation();
        consultarPaciente();
    }

    // 3. Captura del HTML inicial
    const expedienteContainer = document.getElementById(MAIN_VIEW_ID);
    if (expedienteContainer) {
        // Capturamos el HTML de la primera vista (Búsqueda)
        initialSearchHtml = expedienteContainer.innerHTML;
        setupSearchListeners(); 
    }

    // 4. Configuración de cierre de sesión
    const cerrarSesion = document.getElementById('logout-button');
    if (cerrarSesion) {
        cerrarSesion.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
});

function consultarMedico() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  console.log('usuario en consultarMedico:', usuario);

  fetch('http://localhost:5000/medico/consulta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    },
    body: JSON.stringify({
      nss: usuario.nss   // mismo campo NSS que usas para login de médico
    })
  })
    .then(r => r.json())
    .then(data => {
      console.log(data);
      if (data.status === 'OK' && data.medico) {
        if (graficoInstance) {
          // si tu clase grafico usa los mismos campos para paciente y medico,
          // puedes reusar el mismo método
          graficoInstance.cargarDatosEnInterfaz(data.medico);
        } else {
          console.warn('graficoInstance no está inicializado');
        }
      } else {
        alert(data.error || 'Error consultando medico');
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error en el servidor');
    });
}