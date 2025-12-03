let graficoInstance = null;

// 1. INICIALIZACIÓN 
document.addEventListener('DOMContentLoaded', () => {
  //  Verificar sesión primero
  if (!localStorage.getItem('jwt')) {
    alert('Debes iniciar sesión primero');
    window.location.href = 'login.html';
    return;
  }

  //  Inicializar la clase gráfica
  graficoInstance = new grafico();
  graficoInstance.initNavigation();

  //  Cargar datos iniciales del paciente
  consultarPaciente();

  // consultaExpediente
  consultarExpediente();


  //  Configurar botón de Cerrar Sesión
  const cerrarSesion = document.getElementById('logout-button');
  if (cerrarSesion) {
    cerrarSesion.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = 'login.html';
    });
  }

  // Listener para el botón "Solicitudes" 
  const btnSolicitudes = document.querySelector('button[data-view="solicitudesvista"]');
  if (btnSolicitudes) {
    btnSolicitudes.addEventListener('click', () => {
      console.log("Pestaña Solicitudes seleccionada: Forzando vista y actualizando tabla...");

      // 1. FORZAR CAMBIO DE VISTA (Por si el initNavigation falló)
      if (graficoInstance) {
        graficoInstance.switchView('solicitudesvista');
      }

      // 2. CONSULTAR DATOS
      consultarSolicitudes();
    });
  }
});

function consultarPaciente() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  console.log('usuario en consultarPaciente:', usuario);

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
      console.log(data);
      if (data.status === 'OK' && data.paciente) {
        if (graficoInstance) {
          graficoInstance.cargarDatosEnInterfaz(data.paciente);
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


function consultarExpediente() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || !usuario.nss) return;

  fetch(`http://localhost:5000/expediente/consultar?nss=${usuario.nss}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    }
  })
    .then(r => r.json())
    .then(data => {
      console.log("Expediente:", data);
      if (graficoInstance) {
        graficoInstance.cargarExpediente(data);
      }
    })
    .catch(err => console.error("Error cargando expediente:", err));
}

// Consulta las solicitudes vía MQTT a través de Flask
function consultarSolicitudes() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  // Validamos que exista el usuario antes de intentar nada
  if (!usuario || !usuario.nss) return;

  fetch('http://localhost:5000/solicitudes/consulta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    },
    body: JSON.stringify({ nss: usuario.nss })
  })
    .then(r => r.json())
    .then(data => {
      console.log("Respuesta servidor (Solicitudes):", data);
      if (data.status === 'OK') {
        if (graficoInstance) {
          // Llamamos al método que arreglamos en graficoPaciente.js
          graficoInstance.cargarSolicitudesEnTabla(data.solicitudes);
        }
      } else {
        console.error("Error o lista vacía:", data.error);
      }
    })
    .catch(err => console.error("Error en conexión de solicitudes:", err));
}

// Función global para que los botones HTML (onclick="") la encuentren
function responderSolicitud(idSolicitud, nuevoEstado) {
  if (!confirm(`¿Estás seguro de que deseas ${nuevoEstado} esta solicitud?`)) return;
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  console.log(`Intentando responder ${nuevoEstado} a la solicitud ${idSolicitud}`);
  const token = localStorage.getItem('jwt');
  if (!token) {
    alert('Sesión expirada. Inicia sesión de nuevo.');
    window.location.href = 'login.html';
    return;
  }

  fetch('http://localhost:5000/solicitudes/responder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      nssP: usuario.nss,
      nssM: idSolicitud,
      estado: nuevoEstado 
    })
  })
    .then(r => r.json().then(body => ({ ok: r.ok, status: r.status, body })))
    .then(res => {
      console.log('Respuesta responder_solicitud:', res);
      if (res.ok) {
        // Volver a cargar las solicitudes para refrescar la tabla
        consultarSolicitudes();
        alert(`Solicitud ${nuevoEstado} correctamente.`);
      } else {
        alert(`Error al responder solicitud (${res.status}): ` + (res.body.error || JSON.stringify(res.body)));
      }
    })
    .catch(err => {
      console.error('Error al llamar /solicitudes/responder:', err);
      alert('Error de conexión con el servidor.');
    });
}
