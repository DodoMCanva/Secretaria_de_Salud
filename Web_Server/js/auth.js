document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('auth-button');

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario: document.getElementById('login-user').value,
        password: document.getElementById('login-pass').value
      })
    })
      .then(r => r.json())
      .then(data => {
        console.log(data);
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          if (data.usuario) {
            localStorage.setItem('usuario', JSON.stringify({ nss: data.usuario }));
          }
          localStorage.setItem('rol',data.rol);
          
          window.location.href = 'index.html';
        } else {
          alert(data.error || 'Credenciales inválidas');
        }
      })

      .catch(err => {
        console.error(err);
        alert('Error en el servidor');
      });
  });
});
