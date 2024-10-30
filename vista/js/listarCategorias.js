import { URL } from "./config.js";

document.addEventListener('DOMContentLoaded', () => {
    const tablaCategorias = document.querySelector('.categorias__tbody'); // Seleccionamos el cuerpo de la tabla
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumberEl = document.getElementById('pageNumber');

    let currentPage = 1;
    const rowsPerPage = 15;

    let categorias = [];

    // Función para cargar las categorías desde la API
    function cargarCategorias() {
        fetch(`${URL}/categorias`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar las categorías');
                }
                return response.json();
            })
            .then(data => {
                categorias = data; // Guardamos las categorías
                mostrarCategorias(currentPage); // Mostramos las categorías de la página actual
                actualizarBotones(); // Actualizamos los botones de paginación
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error);
                alert('Hubo un problema al cargar las categorías');
            });
    }

    // Función para mostrar las categorías en la tabla
    function mostrarCategorias(page) {
        const start = (page - 1) * rowsPerPage; // Calculamos desde qué categoría comenzar a mostrar
        const end = start + rowsPerPage; // Calculamos hasta qué categoría mostrar
        const categoriasPagina = categorias.slice(start, end); // Obtenemos las categorías de esa página

        tablaCategorias.innerHTML = '';

        categoriasPagina.forEach(categoria => { // Recorremos las categorías de la página actual
            const fila = document.querySelector('.categorias__template').content.cloneNode(true); // Clonamos la plantilla

            // Asignamos los datos de la categoría
            fila.querySelector('.categorias__data--nombre').textContent = categoria.nombre_categoria;

            // Agregamos los eventos a los botones
            fila.querySelector('.categorias__btn--modificar').addEventListener('click', () => {
                window.location.href = `editCategoria.html?id=${categoria.id}`; // Redirigimos a la página de edición
            });

            fila.querySelector('.categorias__btn--eliminar').addEventListener('click', () => {
                eliminarCategoria(categoria.id); // Función para eliminar la categoría
            });

            tablaCategorias.appendChild(fila); // Añadimos la fila a la tabla
        });
    }

    // Función para eliminar una categoría
    function eliminarCategoria(id) {
        fetch(`${URL}/categorias/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                categorias = categorias.filter(categoria => categoria.id !== id); // Actualizamos la lista de categorías
                mostrarCategorias(currentPage); // Mostramos las categorías de la página actual
                actualizarBotones(); // Actualizamos los botones de paginación
            } else {
                alert('Error al eliminar la categoría');
            }
        })
        .catch(error => {
            console.error('Error al eliminar la categoría:', error);
        });
    }

    // Función para actualizar los botones de paginación
    function actualizarBotones() {
        const totalPages = Math.ceil(categorias.length / rowsPerPage); // Calculamos el número total de páginas
        pageNumberEl.textContent = currentPage; // Mostramos el número de la página actual

        // Deshabilitamos el botón de "Anterior" si estamos en la primera página
        prevPageBtn.disabled = currentPage === 1;
        // Deshabilitamos el botón de "Siguiente" si estamos en la última página
        nextPageBtn.disabled = currentPage === totalPages;
    }

    // Eventos de clic para ir a la página anterior
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) { // Solo si no estamos en la primera página
            currentPage--; // Reducimos el número de página
            mostrarCategorias(currentPage); // Mostramos las categorías de la nueva página
            actualizarBotones(); // Actualizamos los botones de paginación
        }
    });

    // Eventos de clic para ir a la página siguiente
    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(categorias.length / rowsPerPage); // Calculamos el número total de páginas
        if (currentPage < totalPages) { // Solo si no estamos en la última página
            currentPage++; // Aumentamos el número de página
            mostrarCategorias(currentPage); // Mostramos las categorías de la nueva página
            actualizarBotones(); // Actualizamos los botones de paginación
        }
    });

    // Llamamos a la función para cargar las categorías cuando la página se carga
    cargarCategorias();
});
