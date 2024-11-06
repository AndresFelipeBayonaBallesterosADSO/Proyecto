import is_valid from "./isValid.js"; // Importa la función 'is_valid' desde el archivo 'isValid.js', que se encarga de validar si los campos requeridos están completos.
import SoloNumeros from "./SoloNumeros.js"; // Importa la función 'SoloNumeros' desde el archivo 'SoloNumeros.js', que se utiliza para restringir la entrada del usuario a solo números en un campo específico.
import remover from "./remover.js"; // Importa la función 'remover' desde el archivo 'remover.js', que se utiliza para limpiar los mensajes de error cuando el usuario empieza a escribir en un campo.
import { URL } from "./config.js"; // Importa la variable 'URL' desde el archivo 'config.js', que contiene la URL base para las peticiones API.

document.querySelector('form').addEventListener('submit', async function (e) { 
    e.preventDefault(); // Previene que el formulario se envíe de forma tradicional, evitando una recarga de la página al hacer clic en el botón de envío.

    // Obtiene el valor del campo de entrada 'usuario' y 'contrasena' mediante sus respectivos ID.
    const usuario = document.getElementById('usuario'); 
    const contrasena = document.getElementById('contrasena'); 

    // Llama a la función 'is_valid' para verificar que todos los campos requeridos en el formulario estén completos.
    const camposValidos = is_valid(e, "form[required]"); // Pasa el evento del formulario y la selección de los campos requeridos a la función 'is_valid'.
    
    if (!camposValidos) { 
        alert("Por favor completa todos los campos."); // Muestra una alerta si alguno de los campos requeridos está vacío o no válido.
        return; // Detiene la ejecución del código si los campos no son válidos.
    }

    try {
        // Realiza una petición HTTP de tipo GET a la API para obtener la lista de usuarios.
        const response = await fetch(`${URL}/users`); // Utiliza la URL importada para hacer la solicitud.
        const usuarios = await response.json(); // Convierte la respuesta de la API en formato JSON, que será un array de usuarios.

        // Busca en el array de usuarios el que coincida con el nombre de usuario y la contraseña proporcionados.
        const usuarioEncontrado = usuarios.find(user => user.usuario === usuario.value && user.contrasena === contrasena.value); // Realiza una búsqueda en el array de usuarios para encontrar un match de usuario y contraseña.

        if (usuarioEncontrado) { // Si se encuentra un usuario con las credenciales correctas.
            alert('Inicio de sesión exitoso.'); // Muestra una alerta indicando que el inicio de sesión fue exitoso.
            
            // Guarda el 'id' del usuario encontrado en el localStorage para acceder a él posteriormente en otras páginas.
            localStorage.setItem('usuarioId', usuarioEncontrado.id); // Almacena el ID del usuario encontrado bajo la clave 'usuarioId'.
            
            window.location.href = '../primeravista/index.html'; // Redirige al usuario a la página principal después de un inicio de sesión exitoso.
        } else {
            alert('Usuario o contraseña incorrectos.'); // Si el usuario o la contraseña no coinciden, muestra una alerta indicando el error.
        }
    } catch (error) { // Si ocurre algún error durante el proceso de autenticación.
        console.error('Error al iniciar sesión:', error); // Muestra el error en la consola para depuración.
    }
});

// Validación al cargar la página
document.addEventListener("DOMContentLoaded", () => { 
    // Obtiene los elementos de entrada de 'usuario' y 'contrasena' al cargar la página.
    const usuario = document.getElementById('usuario'); 
    const contrasena = document.getElementById('contrasena'); 

    // Agrega un evento de 'keypress' al campo de contraseña para restringir la entrada a solo números utilizando la función 'SoloNumeros'.
    contrasena.addEventListener("keypress", (event) => SoloNumeros(event, contrasena)); // Llama a la función 'SoloNumeros' cada vez que el usuario presione una tecla en el campo de contraseña.

    // Agrega un evento de 'keyup' al campo de usuario para limpiar los mensajes de error cuando el usuario empieza a escribir.
    usuario.addEventListener("keyup", (event) => remover(event, usuario)); // Llama a la función 'remover' cada vez que el usuario suelta una tecla en el campo de usuario, para limpiar los posibles mensajes de error.

    // Agrega un evento de 'keyup' al campo de contraseña para limpiar los mensajes de error cuando el usuario empieza a escribir.
    contrasena.addEventListener("keyup", (event) => remover(event, contrasena)); // Llama a la función 'remover' cada vez que el usuario suelta una tecla en el campo de contraseña, para limpiar los posibles mensajes de error.
});
