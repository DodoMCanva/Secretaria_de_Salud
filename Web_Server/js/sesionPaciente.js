let graficoInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('jwt')) {
    alert('Debes iniciar sesión primero');
    window.location.href = 'login.html';
    return;
  }

  graficoInstance = new grafico();
  graficoInstance.initNavigation();

  
  consultarPaciente();
  
  const cerrarSesion = document.getElementById('logout-button');
  if (cerrarSesion) {
    cerrarSesion.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = 'login.html';
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

// Agrega esta función al final o dentro del scope global accesible
function consultarSolicitudes() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if(!usuario || !usuario.nss) return;

  fetch('http://localhost:5000/solicitudes/consulta-mqtt', { // Nuevo endpoint
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    },
    body: JSON.stringify({ nss: usuario.nss })
  })
  .then(r => r.json())
  .then(data => {
    console.log("Solicitudes recibidas:", data);
    if (data.status === 'OK') {
        // Llamar al metodo grafico
        if(graficoInstance) {
            graficoInstance.cargarSolicitudesEnTabla(data.solicitudes);
        }
    } else {
        console.error("Error trayendo solicitudes:", data.error);
    }
  })
  .catch(err => console.error(err));
}

// Modificar el initNavigation en graficoPaciente.js O hacerlo aquí en el DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // ... código existente ...

    // Agregar listener para cuando hagan click en el botón de solicitudes
    const btnSolicitudes = document.querySelector('button[data-view="solicitudesvista"]');
    if(btnSolicitudes){
        btnSolicitudes.addEventListener('click', () => {
            consultarSolicitudes();
        });
    }
    
    // Opcional: llamar al inicio también si quieres
    consultarSolicitudes();
});

