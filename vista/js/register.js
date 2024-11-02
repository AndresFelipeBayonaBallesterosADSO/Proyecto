import { URL } from "./config.js"; // Importa la URL desde el archivo de configuración, 'import' permite incluir módulos de otros archivos.

// Selección de elementos del formulario
const $formulario = document.querySelector("form"); // Selecciona el primer formulario en el documento.
const usuario = document.querySelector("#usuario"); // Selecciona el campo de entrada con id 'usuario'.
const nombre = document.querySelector("#nombre"); // Selecciona el campo de entrada con id 'nombre'.
const apellido = document.querySelector("#apellido"); // Selecciona el campo de entrada con id 'apellido'.
const contrasena = document.querySelector("#contrasena"); // Selecciona el campo de entrada con id 'contrasena'.
const confirmarContrasena = document.querySelector("#confirmar-contrasena"); // Selecciona el campo para confirmar la contraseña.
const email = document.querySelector("#email"); // Selecciona el campo de entrada con id 'email'.

// Función para validar campos requeridos
const is_valid = () => {
    let valid = true; // Inicializa la variable 'valid' como verdadera.
    // Verifica si los campos requeridos tienen valor
    [$formulario.usuario, $formulario.nombre, $formulario.apellido, $formulario.contrasena, $formulario.email].forEach((input) => {
        if (!input.value.trim()) { // Si el campo está vacío o solo tiene espacios
            input.classList.add("error"); // Agrega la clase 'error' para marcar el campo como inválido.
            valid = false; // Cambia 'valid' a falso.
        } else {
            input.classList.remove("error"); // Si tiene valor, quita la clase 'error'.
        }
    });
    return valid; // Retorna el estado de validación.
};

// Validación de correo electrónico
const ValidarCorreo = (email) => {
    // Expresión regular para validar el formato del correo electrónico.
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email); // Retorna verdadero si el correo es válido.
};

// Restricción a solo números
const SoloNumeros = (event) => {
    const key = event.key; // Obtiene la tecla que fue presionada.
    if (!/^\d$/.test(key)) { // Verifica si la tecla no es un dígito.
        event.preventDefault(); // Previene la acción de ingreso si no es un número.
    }
};

// Restricción a solo letras
const SoloLetras = (event) => {
    const key = event.key; // Obtiene la tecla que fue presionada.
    if (!/^[a-zA-ZñÑ\s]+$/.test(key)) { // Verifica si la tecla no es una letra o espacio.
        event.preventDefault(); // Previene la acción de ingreso si no es una letra.
    }
};

// Función para limpiar el formulario
const limpiarForm = () => {
    // Limpia todos los campos del formulario.
    usuario.value = "";
    nombre.value = "";
    apellido.value = "";
    contrasena.value = "";
    confirmarContrasena.value = "";
    email.value = "";
    // Remueve las clases de error y correcto de los campos.
    [usuario, nombre, apellido, contrasena, confirmarContrasena, email].forEach((input) => input.classList.remove("error", "correcto"));
};

// Función para manejar el envío del formulario
const save = (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario.

    if (!is_valid()) { // Verifica si todos los campos son válidos.
        alert("Todos los campos son obligatorios."); // Muestra una alerta si hay campos vacíos.
        return; // Termina la función si hay errores.
    }

    if (contrasena.value !== confirmarContrasena.value) { // Compara las contraseñas.
        alert("Las contraseñas no coinciden."); // Muestra alerta si no coinciden.
        return; // Termina la función.
    }

    if (!ValidarCorreo(email.value)) { // Valida el formato del correo electrónico.
        alert("Correo electrónico no válido."); // Muestra alerta si el correo es inválido.
        return; // Termina la función.
    }

    const data = { // Crea un objeto con los datos del formulario.
        usuario: usuario.value,
        nombre: nombre.value,
        apellidos: apellido.value,
        contrasena: contrasena.value,
        email: email.value,
    };

    guardar(data); // Llama a la función para guardar los datos.
};

// Función para guardar los datos en la API
const guardar = (data) => {
    // Hace una solicitud POST para guardar los datos en la API.
    fetch(`${URL}/users`, {
        method: "POST", // Especifica que es un método POST.
        body: JSON.stringify(data), // Convierte el objeto data a JSON.
        headers: {
            "content-type": "application/json; charset=UTF-8", // Establece el tipo de contenido.
        },
    })
        .then((response) => response.json()) // Convierte la respuesta a JSON.
        .then(() => {
            limpiarForm(); // Limpia el formulario.
            alert("Registro exitoso"); // Muestra alerta de éxito.
            window.location.href = "../index.html"; // Redirige a otra página.
        })
        .catch((error) => { // Maneja errores en la solicitud.
            console.error("Error:", error); // Muestra el error en la consola.
            alert("No se pudo completar el registro."); // Muestra alerta de error.
        });
};

// Evento de envío del formulario
$formulario.addEventListener("submit", save); // Agrega un evento para manejar el envío del formulario.

// Eventos de validación y restricciones en los campos
document.addEventListener("DOMContentLoaded", () => { // Se ejecuta cuando el contenido del documento se ha cargado.
    usuario.addEventListener("keyup", () => usuario.classList.remove("error")); // Elimina clase de error al escribir en el campo.
    nombre.addEventListener("keyup", () => nombre.classList.remove("error")); // Elimina clase de error al escribir en el campo.
    apellido.addEventListener("keyup", () => apellido.classList.remove("error")); // Elimina clase de error al escribir en el campo.
    email.addEventListener("keyup", () => email.classList.remove("error")); // Elimina clase de error al escribir en el campo.
    contrasena.addEventListener("keyup", () => contrasena.classList.remove("error")); // Elimina clase de error al escribir en el campo.

    // Validación específica de cada campo
    contrasena.addEventListener("keypress", SoloNumeros); // Restringe el campo de contraseña a solo números.
    confirmarContrasena.addEventListener("keypress", SoloNumeros); // Restringe el campo de confirmar contraseña a solo números.
    nombre.addEventListener("keypress", SoloLetras); // Restringe el campo de nombre a solo letras.
    apellido.addEventListener("keypress", SoloLetras); // Restringe el campo de apellido a solo letras.

    // Validación de correo electrónico
    email.addEventListener("blur", () => { // Se ejecuta cuando el campo de email pierde el foco.
        if (!ValidarCorreo(email.value)) { // Valida el correo electrónico.
            email.classList.add("error"); // Agrega clase de error si el correo es inválido.
            alert("Correo electrónico no válido."); // Muestra alerta de correo inválido.
        } else {
            email.classList.remove("error"); // Elimina clase de error si es válido.
        }
    });
});
