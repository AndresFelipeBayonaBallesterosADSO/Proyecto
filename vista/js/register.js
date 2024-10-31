import is_valid from "./isValid.js"; // Importa función para validar campos requeridos
import ValidarCorreo from "./ValidarCorreo.js"; // Importa función para validar correos electrónicos
import SoloNumeros from "./SoloNumeros.js"; // Importa función para restringir entradas a solo números
import SoloLetras from "./SoloLetras.js"; // Importa función para restringir entradas a solo letras
import remover from "./remover.js"; // Importa función para limpiar mensajes de error
import { URL } from "./config.js"; // Importa la URL desde el archivo de configuración

const $formulario = document.querySelector('form'); // Selecciona el formulario en el DOM
const usuario = document.querySelector("#usuario"); // Selecciona el campo de usuario en el formulario
const nombre = document.querySelector("#nombre"); // Selecciona el campo de nombre en el formulario
const apellido = document.querySelector("#apellido"); // Selecciona el campo de apellido en el formulario
const contrasena = document.querySelector("#contrasena"); // Selecciona el campo de contraseña en el formulario
const confirmarContrasena = document.querySelector("#confirmar-contrasena"); // Selecciona el campo para confirmar contraseña
const email = document.querySelector("#email"); // Selecciona el campo de correo electrónico en el formulario
const button = document.querySelector("button"); // Selecciona el botón de envío del formulario

// Función para guardar el usuario en la API
const guardar = (data) => {
    fetch(`${URL}/users`, {
        method: 'POST', // Método HTTP utilizado para enviar datos al servidor
        body: JSON.stringify(data), // Convierte el objeto data a formato JSON para enviar
        headers: {
            'content-type': 'application/json; charset=UTF-8', // Especifica el tipo de contenido como JSON
        },
    })
    .then((response) => response.json()) // Convierte la respuesta a formato JSON
    .then(() => {
        limpiarForm(); // Limpia el formulario después de agregar el usuario
        alert("Registro exitoso"); // Muestra una alerta indicando que el registro fue exitoso
        window.location.href = "../index.html"; // Redirige al usuario a la página de inicio de sesión
    })
    .catch((error) => {
        console.error("Error:", error); // Muestra el error en la consola
        alert("No se pudo completar el registro."); // Muestra una alerta indicando que hubo un problema en el registro
    });
};

// Función para limpiar el formulario
const limpiarForm = () => {
    usuario.value = ""; // Limpia el campo de usuario
    nombre.value = ""; // Limpia el campo de nombre
    apellido.value = ""; // Limpia el campo de apellido
    contrasena.value = ""; // Limpia el campo de contraseña
    confirmarContrasena.value = ""; // Limpia el campo de confirmación de contraseña
    email.value = ""; // Limpia el campo de correo electrónico
    // Elimina las clases de estado correcto o error de cada campo para resetear la interfaz
    ["correcto", "error"].forEach(cls => {
        usuario.classList.remove(cls);
        nombre.classList.remove(cls);
        apellido.classList.remove(cls);
        contrasena.classList.remove(cls);
        confirmarContrasena.classList.remove(cls);
        email.classList.remove(cls);
    });
};

// Función para manejar el envío del formulario
const save = (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario (no recargar la página)

    // Verifica si las contraseñas coinciden
    if (contrasena.value !== confirmarContrasena.value) {
        alert("Las contraseñas no coinciden."); // Alerta al usuario si las contraseñas no coinciden
        return; // Sale de la función si las contraseñas no coinciden
    }

    let response = is_valid(event, "form[required]"); // Llama a la función para validar campos requeridos

    if (response) {
        // Si la validación es exitosa, se prepara el objeto de datos
        const data = {
            usuario: usuario.value, // Almacena el valor del campo de usuario
            nombre: nombre.value, // Almacena el valor del campo de nombre
            apellidos: apellido.value, // Almacena el valor del campo de apellido
            contrasena: contrasena.value, // Almacena el valor del campo de contraseña
            email: email.value // Almacena el valor del campo de correo electrónico
        };
        guardar(data); // Llama a la función para guardar el usuario en la API
    }
};

// Agrega el evento al formulario para manejar el envío
$formulario.addEventListener("submit", save); // Escucha el evento de envío del formulario y llama a la función save

// Carga los eventos y validaciones al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
    // Añadir validaciones de teclas para limpiar mensajes de error al escribir
    usuario.addEventListener("keyup", (event) => remover(event, usuario)); // Limpia el mensaje de error en usuario
    nombre.addEventListener("keyup", (event) => remover(event, nombre)); // Limpia el mensaje de error en nombre
    apellido.addEventListener("keyup", (event) => remover(event, apellido)); // Limpia el mensaje de error en apellido
    email.addEventListener("keyup", (event) => remover(event, email)); // Limpia el mensaje de error en email

    // Restricciones de entrada de teclado para el campo de usuario
    usuario.addEventListener("keypress", (event) => {
        const key = event.key; // Captura la tecla presionada
        const regex = /^[a-zA-Z0-9]+$/; // Define una expresión regular que permite solo letras y números
        if (!regex.test(key)) {
            event.preventDefault(); // Previene la entrada si la tecla no coincide con el regex
        }
    });

    // Validaciones para que solo permitan números en contraseñas
    contrasena.addEventListener("keypress", (event) => SoloNumeros(event, contrasena)); // Solo permite números en contraseña
    confirmarContrasena.addEventListener("keypress", (event) => SoloNumeros(event, confirmarContrasena)); // Solo permite números en confirmar contraseña

    // Restringir la entrada a solo letras en los campos de nombre y apellido
    nombre.addEventListener("keypress", (event) => SoloLetras(event, nombre)); // Solo permite letras en nombre
    apellido.addEventListener("keypress", (event) => SoloLetras(event, apellido)); // Solo permite letras en apellido
    email.addEventListener("blur", (event) => ValidarCorreo(event, email)); // Valida el correo electrónico cuando el campo pierde el foco
});
