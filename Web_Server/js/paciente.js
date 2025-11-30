function verificarSesion() {
  if (!localStorage.getItem('jwt')) {
    alert('Debes iniciar sesión primero');
    window.location.href = 'login.html';
    return;
  }
}
verificarSesion();

function consultaExpediente() {
  verificarSesion();
  //Cambiar eso de curp por nss
  const curp = document.getElementById('curp').value;
  console.log("JWT:", jwt);
  fetch('http://localhost:5000/paciente/consulta-rest?curp=' + encodeURIComponent(curp), {
    headers: { 'Authorization': 'Bearer ' + jwt }
  }).then(r => r.json())
    .then(data => {
      document.getElementById('resultado').textContent = JSON.stringify(data, null, 2);
    })
    .catch(e => alert('Error en la consulta'));
}
