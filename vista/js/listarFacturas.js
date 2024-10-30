// Importamos la URL base desde el archivo de configuración
import { URL } from "./config.js";

// Esperamos a que el contenido del documento se haya cargado
document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos el cuerpo de la tabla donde se mostrarán las facturas
    const tablaFacturas = document.querySelector('.facturas__tbody'); 
    // Seleccionamos los botones de paginación
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumberEl = document.getElementById('pageNumber');

    // Inicializamos variables para la paginación
    let currentPage = 1; // Página actual
    const rowsPerPage = 15; // Número de filas por página

    // Inicializamos arrays para guardar las facturas y productos
    let facturas = [];
    let productos = [];

    // Función para cargar las facturas y productos desde la API
    function cargarFacturas() {
        // Hacemos las peticiones a la API de facturas y productos en paralelo
        Promise.all([
            fetch(`${URL}/facturas`), // Llamamos a la API de facturas
            fetch(`${URL}/productos`) // Llamamos a la API de productos
        ])
        .then(responses => 
            Promise.all(responses.map(res => res.json())) // Convertimos las respuestas a JSON
        )
        .then(([facturasData, productosData]) => {
            // Guardamos los datos obtenidos en las variables
            facturas = facturasData; // Guardamos las facturas
            productos = productosData; // Guardamos los productos
            mostrarFacturas(currentPage); // Mostramos las facturas de la página actual
            actualizarBotones(); // Actualizamos los botones de paginación
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error); // Mostramos un error en la consola si falla la carga
            alert('Hubo un problema al cargar las facturas'); // Alertamos al usuario
        });
    }

    // Función para mostrar las facturas en la tabla
    function mostrarFacturas(page) {
        // Calculamos desde qué factura comenzar a mostrar en función de la página actual
        const start = (page - 1) * rowsPerPage; 
        // Calculamos hasta qué factura mostrar
        const end = start + rowsPerPage; 
        // Obtenemos las facturas que se mostrarán en la página actual
        const facturasPagina = facturas.slice(start, end); 

        // Limpiamos la tabla antes de agregar nuevas filas
        tablaFacturas.innerHTML = ''; 

        // Recorremos las facturas de la página actual
        facturasPagina.forEach(factura => { 
            // Clonamos la plantilla para una nueva fila
            const fila = document.querySelector('.facturas__template').content.cloneNode(true); 
            
            // Asignamos los datos de la factura a la fila
            fila.querySelector('.facturas__data--id').textContent = factura.id; // ID de la factura
            fila.querySelector('.facturas__data--total').textContent = factura.total; // Total de la factura

            // Procesamos los productos de la factura para mostrar la cantidad y el nombre
            const productosFacturaHTML = factura.productos.map(prod => {
                // Buscamos el producto correspondiente en el array de productos
                const productoInfo = productos.find(producto => producto.id === prod.id);
                // Retornamos el nombre y la cantidad del producto, o un mensaje si es desconocido
                return productoInfo ? `${productoInfo.nombre}: ${prod.cantidad}` : 'Producto desconocido'; 
            }).join('<br>'); // Unimos los productos con un salto de línea

            // Insertamos los productos en la fila
            fila.querySelector('.facturas__data--productos').innerHTML = productosFacturaHTML; 
            
            // Obtenemos el botón de eliminar de la plantilla
            const eliminarBtn = fila.querySelector('.facturas__btn--eliminar'); 
            // Llama a la función de eliminación cuando se hace clic en el botón
            eliminarBtn.addEventListener('click', () => eliminarFactura(factura.id)); 
            
            // Añadimos la fila a la tabla
            tablaFacturas.appendChild(fila); 
        });
    }

    // Función para eliminar una factura
    function eliminarFactura(id) {
        // Confirmamos si el usuario desea eliminar la factura
        if (confirm('¿Estás seguro de que quieres eliminar esta factura?')) {
            // Hacemos una petición DELETE a la API para eliminar la factura
            fetch(`${URL}/facturas/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                // Verificamos si la respuesta fue exitosa
                if (response.ok) {
                    // Filtramos las facturas eliminadas
                    facturas = facturas.filter(factura => factura.id !== id); 
                    // Mostramos las facturas de la nueva página
                    mostrarFacturas(currentPage); 
                    // Actualizamos los botones de paginación
                    actualizarBotones(); 
                } else {
                    alert('Error al eliminar la factura'); // Alertamos si hubo un error
                }
            })
            .catch(error => {
                console.error('Error al eliminar la factura:', error); // Mostramos un error en la consola
            });
        }
    }

    // Función para actualizar los botones de paginación
    function actualizarBotones() {
        // Calculamos el número total de páginas
        const totalPages = Math.ceil(facturas.length / rowsPerPage); 
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
            currentPage--; // Reducimos el número de página
            mostrarFacturas(currentPage); // Mostramos las facturas de la nueva página
            actualizarBotones(); // Actualizamos los botones de paginación
        }
    });

    // Eventos de clic para ir a la página siguiente
    nextPageBtn.addEventListener('click', () => {
        // Calculamos el número total de páginas
        const totalPages = Math.ceil(facturas.length / rowsPerPage); 
        // Solo si no estamos en la última página
        if (currentPage < totalPages) { 
            currentPage++; // Aumentamos el número de página
            mostrarFacturas(currentPage); // Mostramos las facturas de la nueva página
            actualizarBotones(); // Actualizamos los botones de paginación
        }
    });

    // Llamamos a la función para cargar las facturas cuando la página se carga
    cargarFacturas(); 
});