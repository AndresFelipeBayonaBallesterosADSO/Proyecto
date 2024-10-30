import is_valid from "./isValid.js"; 
// Importa la función 'is_valid' del archivo 'isValid.js', que se espera que valide los campos del formulario.

import SoloLetras from "./SoloLetras.js"; 
// Importa la función 'SoloLetras' del archivo 'SoloLetras.js', que probablemente permite solo letras en un campo de entrada.

import remover from "./remover.js"; 
// Importa la función 'remover' del archivo 'remover.js', que se usará para limpiar o modificar la entrada del campo.

import { URL } from "./config.js"; 
// Importa la constante 'URL' del archivo 'config.js', que contiene la URL base para las solicitudes a la API.

document.addEventListener("DOMContentLoaded", () => {
// Agrega un evento que espera hasta que todo el contenido del DOM (Document Object Model) esté completamente cargado antes de ejecutar el código dentro de la función.

    const $formulario = document.querySelector('#form-categoria');
// Selecciona el elemento del DOM con el ID 'form-categoria' y lo asigna a la constante '$formulario'.

    const categoria = document.querySelector("#nombre_categoria"); 
// Selecciona el elemento del DOM con el ID 'nombre_categoria' y lo asigna a la constante 'categoria'.

    const button = document.querySelector(".formulario__boton");
// Selecciona el primer elemento del DOM con la clase 'formulario__boton' y lo asigna a la constante 'button'.

    // Función para guardar la categoría
    const guardar = (data) => {
    // Define una función llamada 'guardar' que toma un parámetro 'data'.

        fetch(`${URL}/categorias`, { 
        // Realiza una solicitud HTTP utilizando la API Fetch a la URL que se encuentra en 'URL', concatenando '/categorias'.
        
            method: 'POST', 
            // Especifica que el método de la solicitud es 'POST', lo que indica que se están enviando datos al servidor.

            body: JSON.stringify(data), 
            // Convierte el objeto 'data' en una cadena JSON para enviarlo en el cuerpo de la solicitud.

            headers: { 
            // Define los encabezados de la solicitud.
                'Content-Type': 'application/json; charset=UTF-8', 
                // Indica que el tipo de contenido es JSON y especifica la codificación de caracteres.
            },
        })
        .then((response) => { 
        // Maneja la respuesta de la solicitud.
            if (!response.ok) { 
            // Comprueba si la respuesta no es correcta (código de estado HTTP no en el rango 200-299).
                throw new Error('Error en la respuesta de la API'); 
                // Lanza un error si la respuesta no es exitosa.
            }
            return response.json(); 
            // Convierte la respuesta a formato JSON y la devuelve.
        })
        .then(() => { 
        // Maneja el resultado de la conversión JSON.
            limpiarForm(); 
            // Llama a la función 'limpiarForm' para limpiar el formulario.
            alert("Categoría guardada exitosamente"); 
            // Muestra un mensaje de alerta indicando que la categoría se guardó correctamente.
        })
        .catch((error) => { 
        // Captura cualquier error que ocurra en las promesas anteriores.
            console.error("Error:", error); 
            // Imprime el error en la consola para el desarrollo.
            alert("No se pudo completar el registro de la categoría."); 
            // Muestra un mensaje de alerta indicando que no se pudo guardar la categoría.
        });
    };

    // Función para limpiar el formulario
    const limpiarForm = () => { 
    // Define la función 'limpiarForm' que no toma parámetros.
        categoria.value = ""; 
        // Limpia el valor del campo de entrada 'categoria'.
        categoria.classList.remove("correcto", "error"); 
        // Elimina las clases 'correcto' y 'error' del campo 'categoria', para restablecer su estado visual.
    };

    // Función para manejar el evento de guardar la categoría
    const save = (event) => { 
    // Define la función 'save' que toma un objeto 'event' como parámetro.
        event.preventDefault(); 
        // Evita que el formulario se envíe de la manera tradicional y refresque la página.

        // Validar si el campo categoría no está vacío
        let response = is_valid(event, "form[required]"); 
        // Llama a la función 'is_valid' para verificar si los campos requeridos están completos en el evento de envío del formulario.

        if (response) { 
        // Comprueba si la respuesta de la validación es verdadera.
            const data = { 
            // Define un objeto 'data' que se enviará al servidor.
                nombre_categoria: categoria.value.trim(), 
                // Asigna al campo 'nombre_categoria' el valor del campo 'categoria' sin espacios en blanco.
            };
            guardar(data); 
            // Llama a la función 'guardar' y pasa el objeto 'data' para enviarlo al servidor.
        } else { 
            alert("Por favor, completa todos los campos requeridos."); 
            // Muestra un mensaje de alerta si los campos requeridos no están completos.
        }
    };

    // Añadir el evento al formulario
    $formulario.addEventListener("submit", save); 
    // Añade un evento de escucha al formulario que ejecuta la función 'save' cuando se envía.

    // Añadir validaciones de teclas
    categoria.addEventListener("keyup", (event) => remover(event, categoria)); 
    // Añade un evento de escucha que llama a la función 'remover' en el campo 'categoria' cuando se presiona una tecla.

    // Restringir entrada a solo letras en el campo de categoría
    categoria.addEventListener("keypress", (event) => SoloLetras(event, categoria)); 
    // Añade un evento de escucha que llama a la función 'SoloLetras' en el campo 'categoria' cuando se presiona una tecla, restringiendo la entrada a solo letras.
});
