import SoloLetras from '../js/SoloLetras.js'; 
// Importa la función 'SoloLetras' desde el archivo 'SoloLetras.js', que se utilizará para validar que el campo solo contenga letras.

import { URL } from "./config.js"; 
// Importa la constante 'URL' del archivo 'config.js', que contiene la URL base para hacer solicitudes a la API.

document.addEventListener('DOMContentLoaded', () => {
// Agrega un evento al documento que espera a que todo el contenido del DOM (Document Object Model) esté completamente cargado antes de ejecutar el código dentro de la función.

    const urlParams = new URLSearchParams(window.location.search); 
    // Crea un objeto 'URLSearchParams' que permite manejar los parámetros de la URL de la página actual.

    const categoriaId = urlParams.get('id'); 
    // Obtiene el valor del parámetro 'id' de la URL y lo asigna a la variable 'categoriaId'.

    cargarCategorias().then(() => { 
    // Llama a la función 'cargarCategorias' y espera su finalización.
        if (categoriaId) { 
        // Comprueba si 'categoriaId' tiene un valor (es decir, si se pasó en la URL).
            cargarCategoria(categoriaId); 
            // Si 'categoriaId' es válido, llama a la función 'cargarCategoria' pasando el ID de la categoría.
        }
    });

    const editarFormCategoria = document.getElementById('form-categoria'); 
    // Obtiene el elemento del DOM con el ID 'form-categoria' y lo asigna a la constante 'editarFormCategoria'.

    editarFormCategoria.addEventListener('submit', function (event) { 
    // Agrega un evento de escucha al formulario que ejecuta la función anónima cuando se envía.
        event.preventDefault(); 
        // Evita que el formulario se envíe de manera tradicional y refresque la página.

        const categoriaActualizada = { 
        // Define un objeto llamado 'categoriaActualizada'.
            nombre_categoria: document.getElementById('nombre_categoria').value.trim(), 
            // Asigna el valor del campo de entrada con el ID 'nombre_categoria', eliminando espacios en blanco al inicio y al final.
        };

        console.log('Valores recogidos:', categoriaActualizada); 
        // Imprime en la consola los valores recogidos en el objeto 'categoriaActualizada'.
        console.log('ID de la categoría:', categoriaId); 
        // Imprime en la consola el ID de la categoría.

        // Validar el nombre usando expresiones regulares
        const nombreValido = /^[a-zA-ZÀ-ÿ\s]+$/.test(categoriaActualizada.nombre_categoria); 
        // Utiliza una expresión regular para comprobar si el nombre de la categoría solo contiene letras y espacios. Asigna el resultado a 'nombreValido'.

        console.log(`Validación: Nombre - ${nombreValido}`); 
        // Imprime en la consola el resultado de la validación.

        if (nombreValido) { 
        // Comprueba si 'nombreValido' es verdadero.
            console.log('Datos a enviar para actualizar:', JSON.stringify(categoriaActualizada)); 
            // Imprime en la consola los datos que se enviarán a la API, convirtiendo 'categoriaActualizada' a una cadena JSON.
            actualizarCategoria(categoriaId, categoriaActualizada); 
            // Llama a la función 'actualizarCategoria' pasando el ID de la categoría y los datos actualizados.
        } else { 
            alert("Por favor, revisa el nombre ingresado."); 
            // Muestra un mensaje de alerta si el nombre no es válido.
        }
    });

    // Agregar eventos a los campos de entrada para validar
    document.getElementById('nombre_categoria').addEventListener('keypress', SoloLetras); 
    // Agrega un evento de escucha al campo de entrada 'nombre_categoria' que llama a la función 'SoloLetras' para validar la entrada mientras se presionan teclas.
});

// Función para cargar una categoría por ID
const cargarCategoria = (id) => { 
// Define la función 'cargarCategoria' que toma un parámetro 'id'.
    fetch(`${URL}/categorias/${id}`) 
    // Realiza una solicitud HTTP a la URL que se encuentra en 'URL', concatenando '/categorias/' y el ID proporcionado.
        .then(response => { 
        // Maneja la respuesta de la solicitud.
            if (!response.ok) { 
            // Comprueba si la respuesta no es correcta (código de estado HTTP no en el rango 200-299).
                throw new Error('Error al cargar la categoría'); 
                // Lanza un error si la respuesta no es exitosa.
            }
            return response.json(); 
            // Convierte la respuesta a formato JSON y la devuelve.
        })
        .then(categoria => { 
        // Maneja la categoría obtenida de la respuesta.
            document.getElementById('nombre_categoria').value = categoria.nombre_categoria; 
            // Asigna el valor del campo 'nombre_categoria' al nombre de la categoría cargada.
        })
        .catch(error => { 
        // Captura cualquier error que ocurra en las promesas anteriores.
            console.error('Error al cargar los datos de la categoría:', error); 
            // Imprime el error en la consola para el desarrollo.
            alert('Hubo un problema al cargar los datos de la categoría.'); 
            // Muestra un mensaje de alerta indicando que hubo un problema al cargar la categoría.
        });
};

// Función para actualizar la categoría
const actualizarCategoria = (id, categoriaActualizada) => { 
// Define la función 'actualizarCategoria' que toma dos parámetros: 'id' y 'categoriaActualizada'.
    if (!id) { 
    // Comprueba si 'id' no está presente.
        alert("ID de categoría no encontrado."); 
        // Muestra un mensaje de alerta si no se encuentra el ID.
        return; 
        // Sale de la función si no hay ID.
    }

    fetch(`${URL}/categorias/${id}`, { 
    // Realiza una solicitud HTTP a la URL de la API para actualizar la categoría, utilizando el ID.
        method: 'PUT', 
        // Especifica que el método de la solicitud es 'PUT', lo que indica que se están enviando datos para actualizar en el servidor.
        headers: { 
        // Define los encabezados de la solicitud.
            'Content-Type': 'application/json', 
            // Indica que el tipo de contenido es JSON.
        },
        body: JSON.stringify(categoriaActualizada) 
        // Convierte el objeto 'categoriaActualizada' a una cadena JSON para enviarlo en el cuerpo de la solicitud.
    })
    .then(response => { 
    // Maneja la respuesta de la solicitud.
        if (!response.ok) { 
        // Comprueba si la respuesta no es correcta (código de estado HTTP no en el rango 200-299).
            throw new Error('Error al actualizar la categoría'); 
            // Lanza un error si la respuesta no es exitosa.
        }
        return response.json(); 
        // Convierte la respuesta a formato JSON y la devuelve.
    })
    .then(data => { 
    // Maneja la respuesta de la actualización.
        alert('Categoría actualizada correctamente'); 
        // Muestra un mensaje de alerta indicando que la categoría se actualizó correctamente.
        window.location.href = 'index.html'; 
        // Redirige a 'index.html', que probablemente es la página donde se listan las categorías.
    })
    .catch(error => { 
    // Captura cualquier error que ocurra en las promesas anteriores.
        console.error('Error al actualizar la categoría:', error); 
        // Imprime el error en la consola para el desarrollo.
        alert('Hubo un problema al actualizar la categoría.'); 
        // Muestra un mensaje de alerta indicando que hubo un problema al actualizar la categoría.
    });
};

// Función para cargar las categorías
const cargarCategorias = async () => { 
// Define la función asíncrona 'cargarCategorias' que no toma parámetros.
    try { 
    // Inicia un bloque try para manejar errores.
        const response = await fetch(`${URL}/categorias`); 
        // Realiza una solicitud HTTP a la URL de la API para obtener todas las categorías y espera la respuesta.
        if (!response.ok) { 
        // Comprueba si la respuesta no es correcta (código de estado HTTP no en el rango 200-299).
            throw new Error('Error al cargar las categorías'); 
            // Lanza un error si la respuesta no es exitosa.
        }
        const categorias = await response.json(); 
        // Convierte la respuesta a formato JSON y la asigna a 'categorias'.
        // Aquí podrías manejar la lógica de mostrar categorías si necesitas hacerlo
    } catch (error) { 
    // Captura cualquier error que ocurra en el bloque try.
        console.error("Error al cargar las categorías:", error); 
        // Imprime el error en la consola para el desarrollo.
        alert("Hubo un problema al cargar las categorías."); 
        // Muestra un mensaje de alerta indicando que hubo un problema al cargar las categorías.
    }
};
