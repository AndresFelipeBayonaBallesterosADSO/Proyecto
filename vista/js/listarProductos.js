import { URL } from "./config.js"; // Importa la URL de configuración desde un archivo externo

// Espera a que el contenido del DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => { 
    // Seleccionamos el cuerpo de la tabla de productos
    const tablaProductos = document.querySelector('.productos__tbody'); 
    // Seleccionamos el botón de página anterior
    const prevPageBtn = document.getElementById('prevPage'); 
    // Seleccionamos el botón de siguiente página
    const nextPageBtn = document.getElementById('nextPage'); 
    // Seleccionamos el elemento que mostrará el número de página
    const pageNumberEl = document.getElementById('pageNumber'); 

    let currentPage = 1; // Inicializamos la página actual en 1
    const rowsPerPage = 15; // Definimos cuántas filas se mostrarán por página

    // Inicializamos un arreglo vacío para almacenar los productos
    let productos = []; 
    // Inicializamos un arreglo vacío para almacenar las categorías
    let categorias = []; 

    // Función para cargar los productos y categorías desde la API
    function cargarProductos() {
        // Realizamos múltiples promesas de manera simultánea
        Promise.all([ 
            fetch(`${URL}/productos`), // Petición para obtener productos
            fetch(`${URL}/categorias`) // Petición para obtener categorías
        ])
        .then(responses => 
            // Convertimos las respuestas a JSON
            Promise.all(responses.map(res => res.json()))) 
        .then(([productosData, categoriasData]) => {
            // Guardamos los datos de productos
            productos = productosData; 
            // Guardamos los datos de categorías
            categorias = categoriasData; 
            // Mostramos los productos de la página actual
            mostrarProductos(currentPage); 
            // Actualizamos los botones de paginación
            actualizarBotones(); 
        })
        .catch(error => { // Manejo de errores
            console.error('Error al cargar los datos:', error); // Mostramos el error en la consola
            alert('Hubo un problema al cargar los productos'); // Mostramos un mensaje de alerta al usuario
        });
    };

    // Función para mostrar los productos en la tabla
    function mostrarProductos(page) {
        // Calculamos desde qué producto comenzar a mostrar
        const start = (page - 1) * rowsPerPage; 
        // Calculamos hasta qué producto mostrar
        const end = start + rowsPerPage; 
        // Obtenemos los productos de esa página
        const productosPagina = productos.slice(start, end); 

        // Limpiamos el contenido previo de la tabla
        tablaProductos.innerHTML = ''; 

        // Recorremos los productos de la página actual
        productosPagina.forEach(producto => { 
            // Clonamos la plantilla para la fila
            const fila = document.querySelector('.productos__template').content.cloneNode(true); 

            // Asignamos los datos del producto
            fila.querySelector('.productos__data--nombre').textContent = producto.nombre; // Asignamos el nombre del producto
            fila.querySelector('.productos__data--precio').textContent = producto.precio; // Asignamos el precio del producto
            fila.querySelector('.productos__data--cantidad').textContent = producto.cantidad; // Asignamos la cantidad del producto

            // Buscar el nombre de la categoría
            const categoria = categorias.find(cat => cat.id === producto.categoria); // Buscamos la categoría correspondiente
            // Asignamos el nombre de la categoría o 'Sin categoría' si no se encuentra
            fila.querySelector('.productos__data--categoria').textContent = categoria ? categoria.nombre_categoria : 'Sin categoría'; 

            // Agregamos los eventos a los botones
            fila.querySelector('.productos__btn--modificar').addEventListener('click', () => {
                // Redirigimos a la página de edición del producto
                window.location.href = `editProducto.html?id=${producto.id}`; 
            });

            // Función para eliminar el producto
            fila.querySelector('.productos__btn--eliminar').addEventListener('click', () => {
                eliminarProducto(producto.id); // Llama a la función para eliminar el producto
            });

            // Añadimos la fila a la tabla
            tablaProductos.appendChild(fila); 
        });
    }

    // Función para eliminar un producto
    function eliminarProducto(id) {
        // Realizamos una petición DELETE para eliminar el producto
        fetch(`${URL}/productos/${id}`, { 
            method: 'DELETE'
        })
        .then(response => {
            // Si la respuesta es exitosa
            if (response.ok) { 
                // Actualizamos la lista de productos eliminando el producto eliminado
                productos = productos.filter(producto => producto.id !== id); 
                // Mostramos los productos de la página actual
                mostrarProductos(currentPage); 
                // Actualizamos los botones de paginación
                actualizarBotones(); 
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
        // Calculamos el número total de páginas
        const totalPages = Math.ceil(productos.length / rowsPerPage); 
        // Mostramos el número de la página actual
        pageNumberEl.textContent = currentPage; 

        // Deshabilitamos el botón de "Anterior" si estamos en la primera página
        prevPageBtn.disabled = currentPage === 1;
        // Deshabilitamos el botón de "Siguiente" si estamos en la última página
        nextPageBtn.disabled = currentPage === totalPages;
    }

    // Eventos de clic para ir a la página anterior
    prevPageBtn.addEventListener('click', () => {
        // Solo si no estamos en la primera página
        if (currentPage > 1) { 
            // Reducimos el número de página
            currentPage--; 
            // Mostramos los productos de la nueva página
            mostrarProductos(currentPage); 
            // Actualizamos los botones de paginación
            actualizarBotones(); 
        }
    });

    // Eventos de clic para ir a la página siguiente
    nextPageBtn.addEventListener('click', () => {
        // Calculamos el número total de páginas
        const totalPages = Math.ceil(productos.length / rowsPerPage); 
        // Solo si no estamos en la última página
        if (currentPage < totalPages) { 
            // Aumentamos el número de página
            currentPage++; 
            // Mostramos los productos de la nueva página
            mostrarProductos(currentPage); 
            // Actualizamos los botones de paginación
            actualizarBotones(); 
        }
    });

    // Llamamos a la función para cargar los productos cuando la página se carga
    cargarProductos(); 
});
