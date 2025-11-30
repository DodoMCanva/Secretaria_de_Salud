document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('jwt')) {
    alert('Debes iniciar sesión primero');
    window.location.href = 'login.html';
    return;
  }

  //Usuario
  const raw = localStorage.getItem('usuario');
  let usuario = null;
  try {
    usuario = raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Error parseando usuario:', e, raw);
    localStorage.clear();
    window.location.href = 'login.html';
    return;
  }

  //Cargar graficos
  //const graficoInstance = new grafico();
  //graficoInstance.initNavigation();
  //graficoInstance.cargarDatosEnInterfaz(usuario);
  consultarPaciente();

  //Cerrar sesion
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
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  fetch('http://localhost:5000/paciente/consulta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    },
    body: JSON.stringify({
      _id: usuario._id  
    })
  })
    .then(r => r.json())
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.error(err);
      alert('Error en el servidor');
    });
}
