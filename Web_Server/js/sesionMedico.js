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
                // aquí podrías guardar data.id si tu backend lo devuelve
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


    btnSearch.addEventListener('click', function (e) {
        console.log("los pollos hermanos");
        solicitarAccesoExpediente(inputSearch.value);
    });
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

function abrirExpedienteSiAutorizado(pacienteId) {
    const token = localStorage.getItem('jwt');
    if (!token) {
        alert('Sesión expirada, inicia sesión de nuevo.');
        window.location.href = 'login.html';
        return;
    }

    const body = {
        // Por ahora usamos pacienteId como nssPaciente de prueba.
        // Cuando tengas el NSS real, aquí lo mandas.
        nssPaciente: pacienteId
    };

    fetch(`${API_URL}/medico/expediente/abrir`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body)
    })
        .then(r => r.json())
        .then(data => {
            console.log('Respuesta /medico/expediente/abrir:', data);

            if (data.status === 'NO_AUTORIZADO') {
                alert(data.mensaje || 'Aún no tienes autorización del paciente.');
                return;
            }

            if (data.status === 'OK' && data.expediente) {
                // Si quieres usar lo que manda el backend:
                //cargarExpedienteDetalleDesdeBackend(pacienteId, data.expediente);
                // Si prefieres seguir usando tu mock local:
                //FALTA QUE CARGUE LOS DATOS REALES DEL PACIENTE (ESTA MOCKEADO)
                cargarExpedienteDetalle(pacienteId);

            } else {
                alert(data.error || 'Error al abrir expediente.');
            }
        })
        .catch(err => {
            console.error('Error /medico/expediente/abrir:', err);
            alert('Error al conectar con el servidor.');
        });
}

function cargarExpedienteDetalle(pacienteId) {
    const token = localStorage.getItem('jwt');
    fetch(`http://localhost:5000/expediente/consulta?nss=${encodeURIComponent(pacienteId)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(r => r.json())
        .then(data => {
            console.log(data);
            if (data && !data.error) {

                // PDFs
                const listaPdfs = document.getElementById('lista-pdfs');
                listaPdfs.innerHTML = '';
                if (Array.isArray(data.pdfs)) {
                    data.pdfs.forEach((pdf, index) => {
                        const mime = pdf.tipo || 'application/pdf';
                        const blob = base64ToBlob(pdf.contenidoBase64, mime);
                        const url = URL.createObjectURL(blob);

                        const li = document.createElement('li');
                        const a = document.createElement('a');
                        a.href = url;
                        a.target = '_blank';
                        a.textContent = pdf.nombre || `PDF ${index + 1}`;
                        // a.download = pdf.nombre || `pdf_${index + 1}.pdf`;

                        li.appendChild(a);
                        listaPdfs.appendChild(li);
                    });
                }

                // Imágenes
                const listaImagenes = document.getElementById('lista-imagenes');
                listaImagenes.innerHTML = '';
                if (Array.isArray(data.imagenes)) {
                    data.imagenes.forEach((imgDoc, index) => {
                        const mime = imgDoc.tipo || 'image/png';
                        const blob = base64ToBlob(imgDoc.contenidoBase64, mime);
                        const url = URL.createObjectURL(blob);

                        const li = document.createElement('li');
                        const a = document.createElement('a');
                        a.href = url;
                        a.target = '_blank';

                        const img = document.createElement('img');
                        img.src = url;
                        img.alt = imgDoc.nombre || `Imagen ${index + 1}`;
                        img.style.maxWidth = '120px';

                        a.appendChild(img);
                        li.appendChild(a);
                        listaImagenes.appendChild(li);
                    });
                }

                // Recetas (texto)
                const listaRecetas = document.getElementById('lista-recetas');
                listaRecetas.innerHTML = '';
                if (Array.isArray(data.recetas)) {
                    data.recetas.forEach((receta, index) => {
                        const li = document.createElement('li');
                        li.textContent = receta || `Receta ${index + 1}`;
                        listaRecetas.appendChild(li);
                    });
                }

            } else {
                alert(data.error || 'Credenciales inválidas');
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
