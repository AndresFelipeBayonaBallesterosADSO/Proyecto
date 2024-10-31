import is_valid from "./isValid.js"; 
// Importa la función 'is_valid' del archivo 'isValid.js', que valida los campos del formulario.

import SoloLetras from "./SoloLetras.js"; 
// Importa la función 'SoloLetras' que permite solo letras en un campo de entrada.

import remover from "./remover.js"; 
// Importa la función 'remover' que limpia o modifica la entrada del campo.

import { URL } from "./config.js"; 
// Importa la constante 'URL' que contiene la URL base para las solicitudes a la API.

document.addEventListener("DOMContentLoaded", () => {
    // Espera hasta que todo el contenido del DOM esté completamente cargado.

    const $formulario = document.querySelector('#form-categoria');
    // Selecciona el formulario con el ID 'form-categoria'.

    const nombreCategoria = document.querySelector("#nombre_categoria"); 
    // Selecciona el campo de entrada para el nombre de la categoría.

    const button = document.querySelector(".formulario__boton");
    // Selecciona el botón del formulario.

    // Función para guardar la categoría
    const guardar = (data) => {
        // Realiza una solicitud POST a la API para guardar la nueva categoría.
        fetch(`${URL}/categorias`, { 
            method: 'POST', 
            body: JSON.stringify(data), // Convierte el objeto 'data' a formato JSON para enviarlo.
            headers: { 
                'Content-Type': 'application/json; charset=UTF-8', // Especifica que el contenido es JSON.
            },
        })
        .then((response) => { 
            // Verifica si la respuesta de la API es correcta.
            if (!response.ok) { 
                throw new Error('Error en la respuesta de la API'); // Lanza un error si la respuesta no es correcta.
            }
            return response.json(); // Convierte la respuesta a formato JSON.
        })
        .then(() => { 
            limpiarForm(); // Llama a la función para limpiar el formulario después de guardar.
            alert("Categoría guardada exitosamente"); // Muestra un mensaje de éxito.
            // Redirige a la página de gestión de categorías.
            window.location.href = "../gestionarCategorias/index.html"; 
        })
        .catch((error) => { 
            // Manejo de errores.
            console.error("Error:", error); // Muestra el error en la consola.
            alert("No se pudo completar el registro de la categoría."); // Mensaje de alerta si hubo un error.
        });
    };

    // Función para limpiar el formulario
    const limpiarForm = () => { 
        nombreCategoria.value = ""; // Limpia el campo de entrada para el nombre de la categoría.
        nombreCategoria.classList.remove("correcto", "error"); // Elimina las clases de validación.
    };

    // Función para manejar el evento de guardar la categoría
    const save = (event) => { 
        event.preventDefault(); // Previene el comportamiento por defecto del formulario.

        // Validar si el campo categoría no está vacío.
        let response = is_valid(event, "form[required]"); // Llama a la función de validación.

        if (response) { 
            // Si la validación es exitosa, se crea un objeto con el nombre de la categoría.
            const data = { 
                nombre_categoria: nombreCategoria.value.trim(), // Recoge el valor del campo y elimina espacios en blanco.
            };
            guardar(data); // Llama a la función guardar para enviar los datos a la API.
        } else { 
            alert("Por favor, completa todos los campos requeridos."); // Mensaje de alerta si hay campos vacíos.
        }
    };

    // Añadir el evento al formulario
    $formulario.addEventListener("submit", save); 
    // Agrega un evento que llama a la función 'save' cuando se envía el formulario.

    // Añadir validaciones de teclas
    nombreCategoria.addEventListener("keyup", (event) => remover(event, nombreCategoria)); 
    // Llama a la función 'remover' al soltar una tecla para limpiar mensajes de error en el campo.

    // Restringir entrada a solo letras en el campo de categoría
    nombreCategoria.addEventListener("keypress", (event) => SoloLetras(event, nombreCategoria)); 
    // Llama a la función 'SoloLetras' al presionar una tecla para permitir solo letras en el campo.
});