import is_valid from "./isValid.js";
import SoloNumeros from "./SoloNumeros.js";
import remover from "./remover.js";
import { URL } from "./config.js";  // Importar la URL desde el archivo de configuración

document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const usuario = document.getElementById('usuario');
    const contrasena = document.getElementById('contrasena');

    // Validar que los campos estén completos
    const camposValidos = is_valid(e, "form[required]");
    
    if (!camposValidos) {
        alert("Por favor completa todos los campos.");
        return;
    }

    try {
        // Realizar la petición a la API usando la URL desde config.js
        const response = await fetch(`${URL}/users`);
        const usuarios = await response.json();

        // Buscar el usuario y la contraseña en la respuesta
        const usuarioEncontrado = usuarios.find(user => user.usuario === usuario.value && user.contrasena === contrasena.value);

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

// Validación al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const usuario = document.getElementById('usuario');
    const contrasena = document.getElementById('contrasena');

    // Restringir entrada a solo números en la contraseña
    contrasena.addEventListener("keypress", (event) => SoloNumeros(event, contrasena));

    // Limpiar mensajes de error al escribir
    usuario.addEventListener("keyup", (event) => remover(event, usuario));
    contrasena.addEventListener("keyup", (event) => remover(event, contrasena));
});