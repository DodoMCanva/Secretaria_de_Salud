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
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')  // bearer token en header[web:146][web:153]
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

