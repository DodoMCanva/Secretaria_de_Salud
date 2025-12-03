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

}


/**
 * Carga y muestra el detalle completo del expediente, reemplazando la vista de búsqueda.
 * @param {string} pacienteId - ID del paciente
 */

function solicitarAccesoExpediente(pacienteId) {
    const token = localStorage.getItem('jwt');
    if (!token) {
        alert('Sesión expirada, inicia sesión de nuevo.');
        window.location.href = 'login.html';
        return;
    }
    fetch('http://localhost:5000/solicitudes/crear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nssPaciente: pacienteId,
            motivo: 'Revisión de expediente clínico',
            usuario: localStorage.getItem('usuario')
        })
    })
        .then(r => r.json())
        .then(data => {
            console.log('Respuesta /solicitudes/crear:', data);
            if (data.error) {
                alert('Error creando solicitud: ' + data.error);
            } else {
                alert('Solicitud enviada. Espera a que el paciente autorice.');
                abrirExpedienteSiAutorizado(pacienteId)
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error al conectar con el servidor.');
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

    const btnSearch = document.getElementById('btn-solicitar-pacientes');
    const inputSearch = document.getElementById('input-paciente-solicitar');

  // --- REFERENCIAS PARA EL OVERLAY DE HUELLA ---
    const overlay = document.getElementById('fingerprint-overlay');
    const circleReq = document.getElementById('fingerprint-circle');
    const textReq = document.getElementById('biometric-text-request');
    let isRequestScanning = false;
    
    if (btnSearch) {
      btnSearch.addEventListener('click', function (e) {
       e.preventDefault();
        const pacienteId = inputSearch ? inputSearch.value.trim() : '';

        if (!pacienteId) {
            alert('Ingresa un NSS o identificador de paciente.');
            return;
        }

        if (isRequestScanning) return;
        isRequestScanning = true;

        // Mostrar overlay y animación de huella
        if (overlay) {
            overlay.style.display = 'flex';
        }
        if (circleReq) {
            circleReq.classList.add('fingerprint-scanning');
        }
        if (textReq) {
            textReq.textContent = 'Escaneando huella para solicitar acceso...';
        }

        // Simular 2 segundos de escaneo biométrico
        setTimeout(() => {
            if (textReq) {
            textReq.textContent = 'Verificando solicitud...';
            }

            // Ahora sí, llamar a la función real
            solicitarAccesoExpediente(pacienteId);

            // Ocultar overlay y detener animación
            if (circleReq) {
            circleReq.classList.remove('fingerprint-scanning');
            }
            if (overlay) {
            overlay.style.display = 'none';
            }
            isRequestScanning = false;
        },5000);
      });
    }
});

// Subir Archivo

function subirArchivoExpediente() {

    let nssPaciente = document.getElementById('detalle-nss')?.innerText;
    console.log(nssPaciente)
    // INTENTO 2: Si no, usar el input de búsqueda como fallback (o una variable global)
    if (!nssPaciente || nssPaciente === '...') {
        // Aquí deberías guardar el NSS en una variable global cuando cargas el expediente con éxito
        // Por ahora intentamos leerlo del input de búsqueda si no se ha limpiado
        nssPaciente = document.getElementById('input-paciente-solicitar')?.value;
    }

    if (!nssPaciente) {
        alert("Error: No se ha detectado un expediente activo.");
        return;
    }

    // Obtener archivo y tipo
    const inputArchivo = document.getElementById('input-archivo-medico');
    const selectTipo = document.getElementById('select-tipo-archivo');

    if (!inputArchivo || inputArchivo.files.length === 0) {
        alert("Por favor selecciona un archivo.");
        return;
    }

    const archivo = inputArchivo.files[0];
    const tipo = selectTipo ? selectTipo.value : 'imagen';

    const formData = new FormData();
    formData.append('nss', nssPaciente);
    formData.append('tipo', tipo);
    formData.append('archivo', archivo);

    const token = localStorage.getItem('jwt');
    const btn = document.getElementById('btn-subir-archivo');
    const textoOriginal = btn.innerText;
    btn.innerText = "Subiendo...";
    btn.disabled = true;

    fetch('http://localhost:5000/expediente/subir', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body: formData
    })
        .then(r => r.json())
        .then(data => {
            inputArchivo.value = "";
            consultarExpediente(nssPaciente);

        })

        .catch(err => {
            console.error("Error subida:", err);
            alert("Error de conexión.");
        })
        .finally(() => {
            btn.innerText = textoOriginal;
            btn.disabled = false;
        });
}



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

function abrirExpedienteSiAutorizado(pacienteId) {
    const token = localStorage.getItem('jwt');
    if (!token) {
        alert('Sesión expirada, inicia sesión de nuevo.');
        window.location.href = 'login.html';
        return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    const body = {
        nssPaciente: pacienteId,
        idMedico: usuario.nss
    };

    fetch('http://localhost:5000/solicitud/autorizada', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body)
    })
        .then(r => r.json())
        .then(data => {
            console.log('Respuesta /solicitud/autorizada:', data);
            if (!data.autorizado) {
                alert('Aún no tienes autorización del paciente.');
                return;
            }
            consultarExpediente(pacienteId);
            consultarPacienteExp(pacienteId);
        })
        .catch(err => {
            console.error('Error /solicitud/autorizada:', err);
            alert('Error al conectar con el servidor.');
        });
}


function consultarExpediente(pacienteId) {
    console.log("se consulto")
    fetch(`http://localhost:5000/expediente/consultar?nss=${pacienteId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        }
    })
        .then(r => r.json())
        .then(data => {
            console.log("Expediente:", data);
            let instance = new GraficoMedico();
            if (instance) {
                instance.cargarExpediente(data);
            } else {
                console.log("instance no inicializado")
            }
        })
        .catch(err => console.error("Error cargando expediente:", err));
}

function consultarPacienteExp(pacienteId) {

    console.log('usuario en consultarPaciente:', pacienteId);

    fetch('http://localhost:5000/paciente/consulta', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        body: JSON.stringify({
            nss: pacienteId
        })
    })
        .then(r => r.json())
        .then(data => {
            console.log(data);
            if (data.status === 'OK' && data.paciente) {
                let inst = new GraficoMedico
                if (inst) {
                    inst.cargarDatosPaciente(data.paciente);
                } else {
                    console.warn('graficoInstance no está inicializado');
                }
            } else {
                alert(data.error || 'Error consultando paciente');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error en el servidor');
        });
}

// Base64 -> Blob (sirve para PDF e imágenes)
function base64ToBlob(base64, contentType = '', sliceSize = 512) {
    const cleaned = base64.replace(/^data:.*;base64,/, '');
    const byteCharacters = atob(cleaned);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType || 'application/octet-stream' });
}
