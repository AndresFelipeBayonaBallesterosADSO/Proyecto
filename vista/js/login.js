document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value; 
    const contrasena = document.getElementById('contrasena').value; 

    try {
        const response = await fetch('http://localhost:3000/users');
        const usuarios = await response.json();

        const usuarioEncontrado = usuarios.find(user => user.usuario === usuario && user.contrasena === contrasena);

        if (usuarioEncontrado) {
            alert('Inicio de sesión exitoso.');
            window.location.href = '../primeravista/index.html';  // Redirigir al aplicativo
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
    }
});
