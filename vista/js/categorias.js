import is_valid from "./isValid.js"; 
import remover from "./remover.js";
import { URL } from "./config.js";

const $formulario = document.querySelector('#form-categoria');
const categoria = document.querySelector("#categoria");
const button = document.querySelector(".formulario__boton");

// Función para guardar la categoría
const guardar = (data) => {
    fetch(`${URL}/categorias`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        return response.json();
    })
    .then(() => {
        limpiarForm();
        alert("Categoría guardada exitosamente");
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("No se pudo completar el registro de la categoría.");
    });
};

// Función para limpiar el formulario
const limpiarForm = () => {
    categoria.value = "";
    categoria.classList.remove("correcto", "error");
};

// Función para manejar el evento de guardar la categoría
const save = (event) => {
    event.preventDefault();

    // Validar si el campo categoría no está vacío
    let response = is_valid(event, "form[required]");

    if (response) {
        const data = {
            nombre_categoria: categoria.value.trim(), // Asegúrate de eliminar espacios en blanco
        };
        guardar(data);
    } else {
        alert("Por favor, completa todos los campos requeridos.");
    }
};

// Añadir el evento al formulario
$formulario.addEventListener("submit", save);

// Añadir validaciones de teclas al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
    // Añadir validaciones de teclas
    categoria.addEventListener("keyup", (event) => remover(event, categoria));
});
