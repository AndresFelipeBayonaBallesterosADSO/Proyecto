import is_valid from "./isValid.js";
import ValidarCorreo from "./ValidarCorreo.js";
import SoloNumeros from "./SoloNumeros.js";  
import SoloLetras from "./SoloLetras.js"; 
import remover from "./remover.js";
import { URL } from "./config.js";

const $formulario = document.querySelector('form');
const usuario = document.querySelector("#usuario");
const nombre = document.querySelector("#nombre");
const apellido = document.querySelector("#apellido");
const contrasena = document.querySelector("#contrasena");
const confirmarContrasena = document.querySelector("#confirmar-contrasena");
const email = document.querySelector("#email");
const button = document.querySelector("button");

const guardar = (data) => {
    fetch(`${URL}/users`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((response) => response.json())
    .then(() => {
        limpiarForm();
        alert("Registro exitoso");
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("No se pudo completar el registro.");
    });
};

const limpiarForm = () => {
    usuario.value = "";
    nombre.value = "";
    apellido.value = "";
    contrasena.value = "";
    confirmarContrasena.value = "";
    email.value = "";
    ["correcto", "error"].forEach(cls => {
        usuario.classList.remove(cls);
        nombre.classList.remove(cls);
        apellido.classList.remove(cls);
        contrasena.classList.remove(cls);
        confirmarContrasena.classList.remove(cls);
        email.classList.remove(cls);
    });
};

const save = (event) => {
    event.preventDefault();

    if (contrasena.value !== confirmarContrasena.value) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    let response = is_valid(event, "form[required]");
    
    if (response) {
        const data = {
            usuario: usuario.value,
            nombre: nombre.value,
            apellidos: apellido.value,
            contrasena: contrasena.value,
            email: email.value
        };
        guardar(data);
    }
};

$formulario.addEventListener("submit", save);

document.addEventListener("DOMContentLoaded", () => {
    // Añadir validaciones de teclas
    usuario.addEventListener("keyup", (event) => remover(event, usuario));
    nombre.addEventListener("keyup", (event) => remover(event, nombre));
    apellido.addEventListener("keyup", (event) => remover(event, apellido));
    email.addEventListener("keyup", (event) => remover(event, email));

    // Restricciones de entrada de teclado
    usuario.addEventListener("keypress", (event) => {
        const key = event.key;
        const regex = /^[a-zA-Z0-9]+$/;  // Solo letras y números para usuario
        if (!regex.test(key)) {
            event.preventDefault();
        }
    });

    // Validaciones para que solo permitan números
    contrasena.addEventListener("keypress", (event) => SoloNumeros(event, contrasena));  // Solo números en contraseña
    confirmarContrasena.addEventListener("keypress", (event) => SoloNumeros(event, confirmarContrasena));  // Solo números en confirmar contraseña

    nombre.addEventListener("keypress", (event) => SoloLetras(event, nombre));
    apellido.addEventListener("keypress", (event) => SoloLetras(event, apellido));
    email.addEventListener("blur", (event) => ValidarCorreo(event, email));
});
