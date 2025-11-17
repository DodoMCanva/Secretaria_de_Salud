if (!localStorage.getItem('jwt')) {
  alert('Debes iniciar sesión primero');
  window.location.href = 'login.html';
}

function consultaPaciente() {
  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    alert('Debes iniciar sesión primero');
    window.location.href = 'login.html';
    return;
  }
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
