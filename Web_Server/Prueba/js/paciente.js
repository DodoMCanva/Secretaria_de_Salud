function consultaPaciente() {
  const jwt = localStorage.getItem('jwt');
  const curp = document.getElementById('curp').value;
  fetch('http://localhost:5000/paciente/consulta?curp=' + encodeURIComponent(curp), {
    headers: {'Authorization': 'Bearer ' + jwt}
  })
  .then(r => r.json())
  .then(data => {
    document.getElementById('resultado').textContent = JSON.stringify(data, null, 2);
  })
  .catch(e => alert('Error en la consulta'));
}
