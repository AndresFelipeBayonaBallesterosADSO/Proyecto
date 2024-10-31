import is_valid from "./isValid.js"; // Importa la función de validación de campos
import SoloNumeros from "./SoloNumeros.js"; // Importa la función para restringir la entrada a solo números
import remover from "./remover.js"; // Importa la función para limpiar mensajes de error
import { URL } from "./config.js"; // Importa la URL desde el archivo de configuración

// Agrega un evento al formulario para manejar el envío
document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Obtiene el elemento de entrada del usuario y de la contraseña
    const usuario = document.getElementById('usuario'); 
    const contrasena = document.getElementById('contrasena'); 

    // Validar que los campos estén completos
    const camposValidos = is_valid(e, "form[required]"); // Llama a la función de validación que verifica si los campos requeridos están completos
    
    if (!camposValidos) {
        alert("Por favor completa todos los campos."); // Alerta si hay campos vacíos
        return; // Sale de la función si hay campos inválidos
    }

    try {
        // Realizar la petición a la API usando la URL desde config.js
        const response = await fetch(`${URL}/users`); // Realiza una petición GET a la API para obtener los usuarios
        const usuarios = await response.json(); // Convierte la respuesta a formato JSON

        // Buscar el usuario y la contraseña en la respuesta
        const usuarioEncontrado = usuarios.find(user => user.usuario === usuario.value && user.contrasena === contrasena.value); // Busca el usuario y contraseña en la lista de usuarios

        if (usuarioEncontrado) {
            alert('Inicio de sesión exitoso.'); // Alerta de éxito si se encuentra el usuario
            
            // Guarda el ID del usuario en localStorage
            localStorage.setItem('usuarioId', usuarioEncontrado.id); // Asegúrate de que "id" es el campo correcto
            
            window.location.href = '../primeravista/index.html'; // Redirige al aplicativo
        } else {
            alert('Usuario o contraseña incorrectos.'); // Alerta de error si el usuario no se encuentra
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error); // Muestra el error en la consola
    }
});

// Validación al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // Obtiene el elemento de entrada del usuario y de la contraseña
    const usuario = document.getElementById('usuario'); 
    const contrasena = document.getElementById('contrasena'); 

    // Restringir entrada a solo números en la contraseña
    contrasena.addEventListener("keypress", (event) => SoloNumeros(event, contrasena)); // Llama a la función SoloNumeros al presionar una tecla

    // Limpiar mensajes de error al escribir
    usuario.addEventListener("keyup", (event) => remover(event, usuario)); // Llama a la función remover al soltar una tecla en el campo de usuario
    contrasena.addEventListener("keyup", (event) => remover(event, contrasena)); // Llama a la función remover al soltar una tecla en el campo de contraseña
});
