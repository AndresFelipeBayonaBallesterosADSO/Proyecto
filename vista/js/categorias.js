import is_valid from "./isValid.js"; 
import SoloLetras from "./SoloLetras.js"; 
import remover from "./remover.js"; 
import { URL } from "./config.js"; 

document.addEventListener("DOMContentLoaded", () => {
    const $formulario = document.querySelector('#form-categoria');
    const nombreCategoria = document.querySelector("#nombre_categoria"); 
    const button = document.querySelector(".formulario__boton");

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
            window.location.href = "../gestionarCategorias/index.html"; 
        })
        .catch((error) => { 
            console.error("Error:", error);
            alert("No se pudo completar el registro de la categoría.");
        });
    };

    const limpiarForm = () => { 
        nombreCategoria.value = ""; 
        nombreCategoria.classList.remove("correcto", "error"); 
    };

    const save = (event) => { 
        event.preventDefault(); 

        const nombreCategoriaValue = nombreCategoria.value.trim();

        // Validación de campo vacío
        if (!nombreCategoriaValue) {
            alert("Por favor, ingresa un nombre para la categoría.");
            return;
        }

        // Validación de solo letras
        if (!SoloLetras(nombreCategoriaValue)) {
            alert("El nombre de la categoría debe contener solo letras.");
            return;
        }

        let response = is_valid(event, "form[required]"); 

        if (response) { 
            const data = { 
                nombre_categoria: nombreCategoriaValue, 
            };
            guardar(data); 
        } else { 
            alert("Por favor, completa todos los campos requeridos."); 
        }
    };

    $formulario.addEventListener("submit", save); 

    nombreCategoria.addEventListener("keyup", (event) => remover(event, nombreCategoria)); 

    // Validar en el evento keypress
    nombreCategoria.addEventListener("keypress", (event) => {
        const key = event.key;
        const newValue = nombreCategoria.value + key;

        if (!SoloLetras(newValue)) {
            event.preventDefault(); // Previene la entrada de caracteres no válidos
            alert("Solo se permiten letras.");
        }
    });
});
