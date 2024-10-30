import is_valid from "./isValid.js"; // Importa función para validar campos requeridos
import ValidarCorreo from "./ValidarCorreo.js"; // Importa función para validar correos electrónicos
import SoloNumeros from "./SoloNumeros.js"; // Importa función para restringir entradas a solo números
import SoloLetras from "./SoloLetras.js"; // Importa función para restringir entradas a solo letras
import remover from "./remover.js"; // Importa función para limpiar mensajes de error
import { URL } from "./config.js"; // Importa la URL desde el archivo de configuración

const $formulario = document.querySelector('form'); // Selecciona el formulario
const usuario = document.querySelector("#usuario"); // Selecciona el campo de usuario
const nombre = document.querySelector("#nombre"); // Selecciona el campo de nombre
const apellido = document.querySelector("#apellido"); // Selecciona el campo de apellido
const contrasena = document.querySelector("#contrasena"); // Selecciona el campo de contraseña
const confirmarContrasena = document.querySelector("#confirmar-contrasena"); // Selecciona el campo de confirmación de contraseña
const email = document.querySelector("#email"); // Selecciona el campo de correo electrónico
const button = document.querySelector("button"); // Selecciona el botón de envío

// Función para guardar el usuario en la API
const guardar = (data) => {
    fetch(`${URL}/users`, {
        method: 'POST', // Método para enviar datos
        body: JSON.stringify(data), // Convierte los datos a formato JSON
        headers: {
            'content-type': 'application/json; charset=UTF-8', // Tipo de contenido
        },
    })
    .then((response) => response.json()) // Convierte la respuesta a formato JSON
    .then(() => {
        limpiarForm(); // Limpia el formulario después de agregar el usuario
        alert("Registro exitoso"); // Muestra una alerta de éxito
    })
    .catch((error) => {
        console.error("Error:", error); // Muestra el error en la consola
        alert("No se pudo completar el registro."); // Muestra una alerta de error
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
    // Elimina las clases de estado correcto o error de cada campo
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
    event.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Verifica si las contraseñas coinciden
    if (contrasena.value !== confirmarContrasena.value) {
        alert("Las contraseñas no coinciden."); // Alerta si las contraseñas no coinciden
        return;
    }

    let response = is_valid(event, "form[required]"); // Validación de campos requeridos
    
    if (response) {
        // Si la validación es exitosa, se prepara el objeto de datos
        const data = {
            usuario: usuario.value,
            nombre: nombre.value,
            apellidos: apellido.value,
            contrasena: contrasena.value,
            email: email.value
        };
        guardar(data); // Llama a la función para guardar el usuario
    }
};

// Agrega el evento al formulario para manejar el envío
$formulario.addEventListener("submit", save);

// Carga los eventos y validaciones al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
    // Añadir validaciones de teclas
    usuario.addEventListener("keyup", (event) => remover(event, usuario)); // Limpia el mensaje de error en usuario
    nombre.addEventListener("keyup", (event) => remover(event, nombre)); // Limpia el mensaje de error en nombre
    apellido.addEventListener("keyup", (event) => remover(event, apellido)); // Limpia el mensaje de error en apellido
    email.addEventListener("keyup", (event) => remover(event, email)); // Limpia el mensaje de error en email

    // Restricciones de entrada de teclado
    usuario.addEventListener("keypress", (event) => {
        const key = event.key;
        const regex = /^[a-zA-Z0-9]+$/; // Solo letras y números para el usuario
        if (!regex.test(key)) {
            event.preventDefault(); // Previene la entrada si no coincide con el regex
        }
    });

    // Validaciones para que solo permitan números en contraseñas
    contrasena.addEventListener("keypress", (event) => SoloNumeros(event, contrasena)); // Solo números en contraseña
    confirmarContrasena.addEventListener("keypress", (event) => SoloNumeros(event, confirmarContrasena)); // Solo números en confirmar contraseña

    // Restringir la entrada a solo letras
    nombre.addEventListener("keypress", (event) => SoloLetras(event, nombre)); // Solo letras en nombre
    apellido.addEventListener("keypress", (event) => SoloLetras(event, apellido)); // Solo letras en apellido
    email.addEventListener("blur", (event) => ValidarCorreo(event, email)); // Validación del correo electrónico al perder el foco
});
