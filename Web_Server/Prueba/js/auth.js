document.getElementById('form-login').addEventListener('submit', function(e) {
  e.preventDefault();
  fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      usuario: document.getElementById('usuario').value,
      password: document.getElementById('password').value
    })
  })
  .then(r => r.json())
  .then(data => {
    if(data.token) {
      localStorage.setItem('jwt', data.token);
      window.location = 'paciente.html';
    } else {
      alert('Credenciales inválidas');
    }
  });
});
