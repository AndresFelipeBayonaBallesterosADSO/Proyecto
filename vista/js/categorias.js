// Importamos las funciones y variables necesarias de otros archivos JavaScript.
// `is_valid`: Función de validación de campos de formulario.
// `SoloLetras`: Función para validar que una cadena contenga solo letras.
// `remover`: Función para manejar el evento de limpieza de validación.
// `URL`: Variable que contiene la URL base de la API para hacer solicitudes HTTP.
import is_valid from "./isValid.js"; 
import SoloLetras from "./SoloLetras.js"; 
import remover from "./remover.js"; 
import { URL } from "./config.js"; 

// `DOMContentLoaded`: Evento que asegura que el código se ejecute después de que todo el contenido del DOM esté cargado.
document.addEventListener("DOMContentLoaded", () => {
    // Seleccionamos el formulario y algunos elementos importantes dentro de él para trabajar posteriormente.
    const $formulario = document.querySelector('#form-categoria'); // Formulario para gestionar la categoría
    const nombreCategoria = document.querySelector("#nombre_categoria"); // Campo de entrada para el nombre de la categoría
    const button = document.querySelector(".formulario__boton"); // Botón de envío del formulario

    // Función `guardar`: Envía una solicitud POST a la API para guardar la categoría ingresada en el servidor.
    const guardar = (data) => {
        fetch(`${URL}/categorias`, { // Realizamos una solicitud POST a la API en la URL indicada.
            method: 'POST', // Método HTTP utilizado para crear un nuevo recurso.
            body: JSON.stringify(data), // Convertimos los datos a JSON antes de enviarlos.
            headers: { 
                'Content-Type': 'application/json; charset=UTF-8', // Especificamos el tipo de contenido.
            },
        })
        .then((response) => { 
            // Validamos si la respuesta es correcta (código HTTP 200 o 201).
            if (!response.ok) { 
                throw new Error('Error en la respuesta de la API'); // Si no es correcto, lanzamos un error.
            }
            return response.json(); // Convertimos la respuesta a formato JSON si es exitosa.
        })
        .then(() => { 
            // Si la categoría se guarda con éxito:
            limpiarForm(); // Llamamos a la función para limpiar el formulario.
            alert("Categoría guardada exitosamente"); // Mostramos un mensaje de éxito.
            window.location.href = "../gestionarCategorias/index.html"; // Redirigimos a la página de gestión de categorías.
        })
        .catch((error) => { 
            // Si hay un error en el proceso, lo capturamos aquí:
            console.error("Error:", error); // Mostramos el error en la consola para depuración.
            alert("No se pudo completar el registro de la categoría."); // Notificamos al usuario del error.
        });
    };

    // Función `limpiarForm`: Restaura el campo de nombre de la categoría a su estado inicial.
    const limpiarForm = () => { 
        nombreCategoria.value = ""; // Vacía el valor del campo de entrada.
        nombreCategoria.classList.remove("correcto", "error"); // Remueve clases de validación anteriores.
    };

    // Función `save`: Se ejecuta al enviar el formulario. Realiza validaciones antes de intentar guardar la categoría.
    const save = (event) => { 
        event.preventDefault(); // Previene el envío predeterminado del formulario.

        const nombreCategoriaValue = nombreCategoria.value.trim(); // Elimina espacios en blanco adicionales del nombre de la categoría.

        // Validación de campo vacío
        if (!nombreCategoriaValue) {
            alert("Por favor, ingresa un nombre para la categoría."); // Alerta si el campo está vacío.
            return;
        }

        // Validación de solo letras
        if (!SoloLetras(nombreCategoriaValue)) { // Verifica si el nombre contiene solo letras.
            alert("El nombre de la categoría debe contener solo letras."); // Alerta si el nombre contiene caracteres inválidos.
            return;
        }

        // Llamada a `is_valid` para verificar si todos los campos obligatorios están completos.
        let response = is_valid(event, "form[required]"); 

        if (response) { 
            // Si la validación es exitosa, creamos un objeto `data` con el nombre de la categoría.
            const data = { 
                nombre_categoria: nombreCategoriaValue, 
            };
            guardar(data); // Llamamos a `guardar` para enviar los datos a la API.
        } else { 
            alert("Por favor, completa todos los campos requeridos."); // Alerta si algún campo obligatorio está incompleto.
        }
    };

    // `addEventListener` en `$formulario` para capturar el evento de envío y ejecutar `save`.
    $formulario.addEventListener("submit", save); 

    // `addEventListener` en `nombreCategoria` para ejecutar `remover` en el evento `keyup` (limpia validaciones en tiempo real).
    nombreCategoria.addEventListener("keyup", (event) => remover(event, nombreCategoria)); 

    // Validación en el evento `keypress` para permitir solo letras al escribir en el campo de nombre de categoría.
    nombreCategoria.addEventListener("keypress", (event) => {
        const key = event.key; // Captura la tecla presionada.
        const newValue = nombreCategoria.value + key; // Simula el nuevo valor después de agregar la tecla presionada.

        if (!SoloLetras(newValue)) { // Verifica si el nuevo valor contiene solo letras.
            event.preventDefault(); // Si contiene caracteres inválidos, previene la entrada.
            alert("Solo se permiten letras."); // Muestra una alerta si se intenta ingresar un carácter no permitido.
        }
    });
});