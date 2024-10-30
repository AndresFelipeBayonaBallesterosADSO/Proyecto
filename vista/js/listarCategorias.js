import { URL } from "./config.js"; 
// Importa la constante 'URL' del archivo 'config.js', que contiene la URL base para las solicitudes a la API.

document.addEventListener('DOMContentLoaded', () => { 
// Agrega un evento que espera hasta que todo el contenido del DOM (Document Object Model) esté completamente cargado antes de ejecutar el código dentro de la función.

    const tablaCategorias = document.querySelector('.categorias__tbody'); 
    // Selecciona el cuerpo de la tabla donde se mostrarán las categorías y lo asigna a la constante 'tablaCategorias'.

    const prevPageBtn = document.getElementById('prevPage'); 
    // Selecciona el botón de la página anterior y lo asigna a la constante 'prevPageBtn'.

    const nextPageBtn = document.getElementById('nextPage'); 
    // Selecciona el botón de la página siguiente y lo asigna a la constante 'nextPageBtn'.

    const pageNumberEl = document.getElementById('pageNumber'); 
    // Selecciona el elemento que muestra el número de página actual y lo asigna a la constante 'pageNumberEl'.

    let currentPage = 1; 
    // Inicializa la variable 'currentPage' a 1 para llevar un registro de la página actual.

    const rowsPerPage = 15; 
    // Define cuántas filas se mostrarán por página.

    let categorias = []; 
    // Inicializa un array vacío para almacenar las categorías.

    // Función para cargar las categorías desde la API
    function cargarCategorias() { 
    // Define la función 'cargarCategorias' que no toma parámetros.
        fetch(`${URL}/categorias`) 
        // Realiza una solicitud HTTP utilizando la API Fetch a la URL que se encuentra en 'URL', concatenando '/categorias'.
            .then(response => { 
            // Maneja la respuesta de la solicitud.
                if (!response.ok) { 
                // Comprueba si la respuesta no es correcta (código de estado HTTP no en el rango 200-299).
                    throw new Error('Error al cargar las categorías'); 
                    // Lanza un error si la respuesta no es exitosa.
                }
                return response.json(); 
                // Convierte la respuesta a formato JSON y la retorna.
            })
            .then(data => { 
            // Maneja los datos obtenidos.
                categorias = data; 
                // Guarda las categorías obtenidas en la variable 'categorias'.
                mostrarCategorias(currentPage); 
                // Muestra las categorías de la página actual.
                actualizarBotones(); 
                // Actualiza los botones de paginación.
            })
            .catch(error => { 
            // Captura cualquier error que ocurra durante la carga de categorías.
                console.error('Error al cargar los datos:', error); 
                // Imprime el error en la consola para el desarrollo.
                alert('Hubo un problema al cargar las categorías'); 
                // Muestra un mensaje de alerta si hay un problema al cargar las categorías.
            });
    }

    // Función para mostrar las categorías en la tabla
    function mostrarCategorias(page) { 
    // Define la función 'mostrarCategorias' que toma el número de página como parámetro.
        const start = (page - 1) * rowsPerPage; 
        // Calcula el índice desde el cual comenzar a mostrar las categorías.

        const end = start + rowsPerPage; 
        // Calcula el índice hasta el cual mostrar las categorías.

        const categoriasPagina = categorias.slice(start, end); 
        // Obtiene las categorías correspondientes a la página actual.

        tablaCategorias.innerHTML = ''; 
        // Limpia el contenido actual de la tabla de categorías.

        categoriasPagina.forEach(categoria => { 
        // Recorre cada categoría en la página actual.
            const fila = document.querySelector('.categorias__template').content.cloneNode(true); 
            // Clona la plantilla de la categoría para crear una nueva fila.

            // Asignamos los datos de la categoría
            fila.querySelector('.categorias__data--nombre').textContent = categoria.nombre_categoria; 
            // Establece el nombre de la categoría en la celda correspondiente.

            // Agregamos los eventos a los botones
            fila.querySelector('.categorias__btn--modificar').addEventListener('click', () => { 
            // Agrega un evento al botón de modificar.
                window.location.href = `editCategoria.html?id=${categoria.id}`; 
                // Redirige a la página de edición de la categoría seleccionada.
            });

            fila.querySelector('.categorias__btn--eliminar').addEventListener('click', () => { 
            // Agrega un evento al botón de eliminar.
                eliminarCategoria(categoria.id); 
                // Llama a la función para eliminar la categoría seleccionada.
            });

            tablaCategorias.appendChild(fila); 
            // Agrega la fila a la tabla de categorías.
        });
    }

    // Función para eliminar una categoría
    function eliminarCategoria(id) { 
    // Define la función 'eliminarCategoria' que toma el ID de la categoría como parámetro.
        fetch(`${URL}/categorias/${id}`, { 
        // Realiza una solicitud HTTP utilizando la API Fetch a la URL que se encuentra en 'URL', concatenando '/categorias/' y el ID de la categoría.
            method: 'DELETE' 
            // Establece el método de la solicitud como DELETE.
        })
        .then(response => { 
            // Maneja la respuesta de la solicitud.
            if (response.ok) { 
            // Comprueba si la respuesta fue exitosa.
                categorias = categorias.filter(categoria => categoria.id !== id); 
                // Filtra la lista de categorías para eliminar la categoría que se acaba de eliminar.
                mostrarCategorias(currentPage); 
                // Muestra las categorías de la página actual.
                actualizarBotones(); 
                // Actualiza los botones de paginación.
            } else { 
                alert('Error al eliminar la categoría'); 
                // Muestra un mensaje de alerta si hubo un error al eliminar la categoría.
            }
        })
        .catch(error => { 
            console.error('Error al eliminar la categoría:', error); 
            // Muestra el error en la consola si hubo un problema al eliminar la categoría.
        });
    }

    // Función para actualizar los botones de paginación
    function actualizarBotones() { 
    // Define la función 'actualizarBotones' que no toma parámetros.
        const totalPages = Math.ceil(categorias.length / rowsPerPage); 
        // Calcula el número total de páginas dividiendo la cantidad total de categorías por las filas por página.

        pageNumberEl.textContent = currentPage; 
        // Muestra el número de la página actual.

        // Deshabilitamos el botón de "Anterior" si estamos en la primera página
        prevPageBtn.disabled = currentPage === 1; 
        // Deshabilita el botón de "Anterior" si estamos en la primera página.

        // Deshabilitamos el botón de "Siguiente" si estamos en la última página
        nextPageBtn.disabled = currentPage === totalPages; 
        // Deshabilita el botón de "Siguiente" si estamos en la última página.
    }

    // Eventos de clic para ir a la página anterior
    prevPageBtn.addEventListener('click', () => { 
    // Agrega un evento de escucha al botón de la página anterior.
        if (currentPage > 1) { 
        // Solo si no estamos en la primera página.
            currentPage--; 
            // Reduce el número de página.
            mostrarCategorias(currentPage); 
            // Muestra las categorías de la nueva página.
            actualizarBotones(); 
            // Actualiza los botones de paginación.
        }
    });

    // Eventos de clic para ir a la página siguiente
    nextPageBtn.addEventListener('click', () => { 
    // Agrega un evento de escucha al botón de la página siguiente.
        const totalPages = Math.ceil(categorias.length / rowsPerPage); 
        // Calcula el número total de páginas.
        if (currentPage < totalPages) { 
        // Solo si no estamos en la última página.
            currentPage++; 
            // Aumenta el número de página.
            mostrarCategorias(currentPage); 
            // Muestra las categorías de la nueva página.
            actualizarBotones(); 
            // Actualiza los botones de paginación.
        }
    });

    // Llamamos a la función para cargar las categorías cuando la página se carga
    cargarCategorias(); 
    // Llama a la función 'cargarCategorias' para obtener y mostrar las categorías al iniciar la página.
});
