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
  const graficoInstance = new grafico();
  graficoInstance.initNavigation();
  graficoInstance.cargarDatosEnInterfaz(usuario);

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
