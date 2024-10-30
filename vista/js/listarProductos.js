import { URL } from "./config.js"; // Importa la URL de configuración desde un archivo externo

document.addEventListener('DOMContentLoaded', () => { // Espera a que el contenido del DOM esté completamente cargado
    const tablaProductos = document.querySelector('.productos__tbody'); // Seleccionamos el cuerpo de la tabla de productos
    const prevPageBtn = document.getElementById('prevPage'); // Seleccionamos el botón de página anterior
    const nextPageBtn = document.getElementById('nextPage'); // Seleccionamos el botón de siguiente página
    const pageNumberEl = document.getElementById('pageNumber'); // Seleccionamos el elemento que mostrará el número de página

    let currentPage = 1; // Inicializamos la página actual en 1
    const rowsPerPage = 15; // Definimos cuántas filas se mostrarán por página

    let productos = []; // Inicializamos un arreglo vacío para almacenar los productos
    let categorias = []; // Inicializamos un arreglo vacío para almacenar las categorías

    // Función para cargar los productos y categorías desde la API
    function cargarProductos() {
        Promise.all([ // Realizamos múltiples promesas de manera simultánea
            fetch(`${URL}/productos`), // Petición para obtener productos
            fetch(`${URL}/categorias`) // Petición para obtener categorías
        ])
        .then(responses => Promise.all(responses.map(res => res.json()))) // Convertimos las respuestas a JSON
        .then(([productosData, categoriasData]) => {
            productos = productosData; // Guardamos los datos de productos
            categorias = categoriasData; // Guardamos los datos de categorías
            mostrarProductos(currentPage); // Mostramos los productos de la página actual
            actualizarBotones(); // Actualizamos los botones de paginación
        })
        .catch(error => { // Manejo de errores
            console.error('Error al cargar los datos:', error); // Mostramos el error en la consola
            alert('Hubo un problema al cargar los productos'); // Mostramos un mensaje de alerta al usuario
        });
    };

    // Función para mostrar los productos en la tabla
    function mostrarProductos(page) {
        const start = (page - 1) * rowsPerPage; // Calculamos desde qué producto comenzar a mostrar
        const end = start + rowsPerPage; // Calculamos hasta qué producto mostrar
        const productosPagina = productos.slice(start, end); // Obtenemos los productos de esa página

        tablaProductos.innerHTML = ''; // Limpiamos el contenido previo de la tabla

        productosPagina.forEach(producto => { // Recorremos los productos de la página actual
            const fila = document.querySelector('.productos__template').content.cloneNode(true); // Clonamos la plantilla para la fila

            // Asignamos los datos del producto
            fila.querySelector('.productos__data--nombre').textContent = producto.nombre; // Asignamos el nombre del producto
            fila.querySelector('.productos__data--precio').textContent = producto.precio; // Asignamos el precio del producto
            fila.querySelector('.productos__data--cantidad').textContent = producto.cantidad; // Asignamos la cantidad del producto

            // Buscar el nombre de la categoría
            const categoria = categorias.find(cat => cat.id === producto.categoria); // Buscamos la categoría correspondiente
            fila.querySelector('.productos__data--categoria').textContent = categoria ? categoria.nombre_categoria : 'Sin categoría'; // Asignamos el nombre de la categoría o 'Sin categoría' si no se encuentra

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
        fetch(`${URL}/productos/${id}`, { // Realizamos una petición DELETE para eliminar el producto
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) { // Si la respuesta es exitosa
                productos = productos.filter(producto => producto.id !== id); // Actualizamos la lista de productos eliminando el producto eliminado
                mostrarProductos(currentPage); // Mostramos los productos de la página actual
                actualizarBotones(); // Actualizamos los botones de paginación
            } else {
                alert('Error al eliminar el producto'); // Mensaje de error si la eliminación falla
            }
        })
        .catch(error => {
            console.error('Error al eliminar el producto:', error); // Mostramos el error en la consola
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
