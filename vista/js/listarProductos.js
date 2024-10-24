import { URL } from "./config.js";

document.addEventListener('DOMContentLoaded', () => {
    const tablaProductos = document.querySelector('.productos__tbody'); // Seleccionamos el cuerpo de la tabla
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumberEl = document.getElementById('pageNumber');

    let currentPage = 1;
    const rowsPerPage = 15;

    let productos = [];
    let categorias = [];

    // Función para cargar los productos y categorías desde la API
    function cargarProductos() {
        Promise.all([
            fetch(`${URL}/productos`),
            fetch(`${URL}/categorias`)
        ])
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(([productosData, categoriasData]) => {
            productos = productosData; // Guardamos los productos
            categorias = categoriasData; // Guardamos las categorías
            mostrarProductos(currentPage); // Mostramos los productos de la página actual
            actualizarBotones(); // Actualizamos los botones de paginación
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
            alert('Hubo un problema al cargar los productos');
        });
    };

    // Función para mostrar los productos en la tabla
    function mostrarProductos(page) {
        const start = (page - 1) * rowsPerPage; // Calculamos desde qué producto comenzar a mostrar
        const end = start + rowsPerPage; // Calculamos hasta qué producto mostrar
        const productosPagina = productos.slice(start, end); // Obtenemos los productos de esa página

        tablaProductos.innerHTML = '';

        productosPagina.forEach(producto => { // Recorremos los productos de la página actual
            const fila = document.querySelector('.productos__template').content.cloneNode(true); // Clonamos la plantilla

            // Asignamos los datos del producto
            fila.querySelector('.productos__data--nombre').textContent = producto.nombre;
            fila.querySelector('.productos__data--precio').textContent = producto.precio;
            fila.querySelector('.productos__data--cantidad').textContent = producto.cantidad;

            // Buscar el nombre de la categoría
            const categoria = categorias.find(cat => cat.id === producto.categoria);
            fila.querySelector('.productos__data--categoria').textContent = categoria ? categoria.nombre_categoria : 'Sin categoría';

            // Agregamos los eventos a los botones
            fila.querySelector('.productos__btn--modificar').addEventListener('click', () => {
                window.location.href = `editProducto.html?id=${producto.id}`; // Redirigimos a la página de edición
            });

            fila.querySelector('.productos__btn--eliminar').addEventListener('click', () => {
                eliminarProducto(producto.id); // Función para eliminar el producto
            });

            tablaProductos.appendChild(fila); // Añadimos la fila a la tabla
        });
    }

    // Función para eliminar un producto
    function eliminarProducto(id) {
        fetch(`${URL}/productos/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                productos = productos.filter(producto => producto.id !== id); // Actualizamos la lista de productos
                mostrarProductos(currentPage); // Mostramos los productos de la página actual
                actualizarBotones(); // Actualizamos los botones de paginación
            } else {
                alert('Error al eliminar el producto');
            }
        })
        .catch(error => {
            console.error('Error al eliminar el producto:', error);
        });
    }

    // Función para actualizar los botones de paginación
    function actualizarBotones() {
        const totalPages = Math.ceil(productos.length / rowsPerPage); // Calculamos el número total de páginas
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
            mostrarProductos(currentPage); // Mostramos los productos de la nueva página
            actualizarBotones(); // Actualizamos los botones de paginación
        }
    });

    // Eventos de clic para ir a la página siguiente
    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(productos.length / rowsPerPage); // Calculamos el número total de páginas
        if (currentPage < totalPages) { // Solo si no estamos en la última página
            currentPage++; // Aumentamos el número de página
            mostrarProductos(currentPage); // Mostramos los productos de la nueva página
            actualizarBotones(); // Actualizamos los botones de paginación
        }
    });

    // Llamamos a la función para cargar los productos cuando la página se carga
    cargarProductos();
});