document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('auth-button');
  const fingerprintCircle = document.getElementById('fingerprint-circle');
  const biometricText = document.getElementById('biometric-text');
  let isLoading = false;

  btn.addEventListener('click', function (e) {
    e.preventDefault();
      if (isLoading) return;
    isLoading = true;
    btn.disabled = true;

    const usuario = document.getElementById('login-user').value;
    const password = document.getElementById('login-pass').value;

    // si quieres forzar usuario/contraseña llenos
    if (!usuario || !password) {
      alert('Por favor, complete usuario y contraseña');
      isLoading = false;
      btn.disabled = false;
      return;
    }

    // --- INICIO SIMULACIÓN HUELLA ---
    fingerprintCircle.classList.add('fingerprint-scanning');
    biometricText.textContent = 'Escaneando huella digital...';

    // simular 2 segundos de escaneo antes de llamar al backend
    setTimeout(() => {
      biometricText.textContent = 'Verificando credenciales...';

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
          fingerprintCircle.classList.remove('fingerprint-scanning');

          if (data.token) {
            biometricText.textContent = 'Huella y credenciales válidas';
            localStorage.setItem('jwt', data.token);
            if (data.usuario) {
            localStorage.setItem('usuario', JSON.stringify({ nss: data.usuario }));
            }
            localStorage.setItem('rol',data.rol);
            if(data.rol === 'paciente'){
              window.location.href = 'paciente.html';
            } else {
              window.location.href = 'medico.html';
            }
          
          } else {
          alert(data.error || 'Credenciales inválidas');
          }
       })

       .catch(err => {
         fingerprintCircle.classList.remove('fingerprint-scanning');
         biometricText.textContent = 'Error en el sistema de autenticación';
         console.error(err);
        alert('Error en el servidor');
        })
        .finally(() => {
          isLoading = false;
          btn.disabled = false;
        });
    }, 2000); // 2 segundos de "escaneo"
    // --- FIN SIMULACIÓN HUELLA ---
  });
});