document.getElementById('form-login').addEventListener('submit', function (e) {
  e.preventDefault();
  fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuario: document.getElementById('usuario').value,
      password: document.getElementById('password').value
    })
  })
    .then(r => r.json())
    .then(data => {
      console.log(data);
      if (data.token) {
        localStorage.setItem('jwt', data.token); 
        window.location.href = 'paciente.html'; 
      }
      else {
        alert('Credenciales inválidas');
      }
    })
    .catch(e => alert('Error en el servidor'));
});
