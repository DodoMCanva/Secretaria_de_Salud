if (!localStorage.getItem('jwt')) {
  alert('Debes iniciar sesión primero');
  window.location.href = 'login.html';
}

