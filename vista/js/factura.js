import { URL } from "./config.js"; // Importa la URL de la configuración para realizar solicitudes a la API.

// Escucha el evento 'DOMContentLoaded' para asegurarse de que el DOM esté completamente cargado antes de ejecutar el código.
document.addEventListener("DOMContentLoaded", () => {
    const $formulario = document.querySelector('#form-factura'); // Selecciona el formulario de factura.
    const productoSelect = document.querySelector("#producto"); // Selecciona el campo de selección de productos.
    const totalInput = document.querySelector("#total"); // Selecciona el campo de entrada para el total de la factura.
    const listaProductos = document.getElementById('listaProductos'); // Selecciona la lista donde se mostrarán los productos agregados a la factura.

    // Función para cargar los productos desde la API
    const cargarProductos = async () => {
        try {
            const response = await fetch(`${URL}/productos`); // Realiza una solicitud GET a la API para obtener los productos.
            if (!response.ok) {
                throw new Error('Error al cargar productos'); // Lanza un error si la respuesta no es correcta.
            }

            const productos = await response.json(); // Convierte la respuesta en formato JSON.

            // Limpiar el select antes de cargar nuevos productos
            productoSelect.innerHTML = ''; // Limpia las opciones existentes en el campo de selección.

            // Opción predeterminada
            const defaultOption = document.createElement('option'); // Crea una nueva opción de selección.
            defaultOption.value = ''; // Establece el valor de la opción predeterminada.
            defaultOption.textContent = 'Selecciona producto'; // Establece el texto de la opción predeterminada.
            defaultOption.disabled = true; // Desactiva la opción para que no se pueda seleccionar.
            defaultOption.selected = true; // Marca esta opción como seleccionada inicialmente.
            productoSelect.appendChild(defaultOption); // Agrega la opción predeterminada al campo de selección.

            // Agregar las opciones de productos
            productos.forEach(producto => { // Itera sobre cada producto recibido de la API.
                const option = document.createElement('option'); // Crea un nuevo elemento de opción.
                option.value = producto.id; // Asigna el ID del producto como valor de la opción.
                option.textContent = `${producto.nombre} - Cantidad: ${producto.cantidad}`; // Establece el texto de la opción que muestra el nombre y la cantidad.
                option.dataset.cantidad = producto.cantidad; // Guarda la cantidad disponible en un atributo de datos.
                option.dataset.precio = producto.precio; // Guarda el precio en un atributo de datos.
                productoSelect.appendChild(option); // Agrega la opción al campo de selección.
            });
        } catch (error) {
            console.error("Error al cargar productos:", error.message); // Imprime el error en la consola si ocurre algún problema.
        }
    };

    // Función para agregar un producto a la lista de factura
    const agregarProducto = () => {
        const cantidadInput = document.querySelector("#cantidad"); // Selecciona el campo de entrada para la cantidad.
        const cantidad = parseInt(cantidadInput.value); // Convierte el valor de la cantidad a un número entero.
        const productoId = productoSelect.value; // Obtiene el ID del producto seleccionado.
        const optionSelected = productoSelect.options[productoSelect.selectedIndex]; // Obtiene la opción seleccionada en el campo de selección.

        // Verificar si se seleccionó un producto
        if (!productoId) {
            alert("Por favor, selecciona un producto."); // Muestra un mensaje de alerta si no se selecciona ningún producto.
            return; // Sale de la función si no hay un producto seleccionado.
        }

        const nombreProducto = optionSelected.text.split(' - ')[0]; // Obtiene el nombre del producto de la opción seleccionada.
        const cantidadDisponible = parseInt(optionSelected.dataset.cantidad); // Obtiene la cantidad disponible del producto.

        if (isNaN(cantidad) || cantidad <= 0) { // Verifica si la cantidad ingresada es válida.
            alert("Por favor, ingrese una cantidad válida."); // Muestra un mensaje de alerta si la cantidad no es válida.
            return; // Sale de la función si la cantidad no es válida.
        }

        // Validar que no se supere el stock
        if (cantidad > cantidadDisponible) {
            alert(`No hay suficiente stock. Solo hay ${cantidadDisponible} disponibles.`); // Muestra un mensaje de alerta si se supera el stock disponible.
            return; // Sale de la función si la cantidad supera la disponibilidad.
        }

        // Crear el elemento de lista y agregarlo a la interfaz
        const listaItem = document.createElement('li'); // Crea un nuevo elemento de lista para mostrar el producto agregado.
        listaItem.textContent = `${nombreProducto} - Cantidad: ${cantidad}`; // Establece el texto del elemento de lista.
        listaProductos.appendChild(listaItem); // Agrega el elemento de lista a la interfaz.

        // Actualizar el total
        const total = parseInt(totalInput.value) || 0; // Obtiene el total actual, o 0 si está vacío.
        const precioProducto = parseInt(optionSelected.dataset.precio); // Obtiene el precio del producto seleccionado.
        totalInput.value = total + (precioProducto * cantidad); // Calcula el nuevo total y lo actualiza en el campo correspondiente.

        // Actualizar la cantidad en el producto seleccionado
        const nuevaCantidad = cantidadDisponible - cantidad; // Calcula la nueva cantidad disponible del producto.
        optionSelected.dataset.cantidad = nuevaCantidad; // Actualiza la cantidad disponible en el atributo de datos de la opción seleccionada.
        optionSelected.textContent = `${nombreProducto} - Cantidad: ${nuevaCantidad}`; // Actualiza el texto del select para reflejar la nueva cantidad.

        // Reiniciar el select a la opción predeterminada
        productoSelect.selectedIndex = 0; // Selecciona la opción predeterminada en el campo de selección.
        cantidadInput.value = ''; // Limpia el campo de cantidad para el siguiente ingreso.
    };

    // Función para guardar la factura
    const guardarFactura = async () => {
        const total = totalInput.value; // Obtiene el total ingresado.

        // Prepara los datos de los productos en la lista para enviar a la API.
        const listaProductosData = Array.from(listaProductos.children).map(li => { // Convierte los elementos de la lista en un array y extrae la información necesaria.
            const cantidad = li.textContent.match(/Cantidad: (\d+)/)[1]; // Extrae la cantidad del texto del elemento de lista.
            const nombreProducto = li.textContent.match(/^(.*?) -/)[1]; // Extrae el nombre del producto del texto del elemento de lista.
            const productoId = Array.from(productoSelect.options).find(option => // Busca el ID del producto en el select.
                option.textContent.includes(nombreProducto)).value;

            return {
                id: productoId, // Devuelve un objeto con el ID del producto y su cantidad.
                cantidad: parseInt(cantidad)
            };
        });

        if (listaProductosData.length === 0) { // Verifica si no se han agregado productos a la factura.
            alert("Debe agregar al menos un producto a la factura."); // Muestra un mensaje de alerta si no hay productos.
            return; // Sale de la función si no hay productos.
        }

        const facturaData = { // Crea un objeto que contiene los datos de la factura a enviar.
            productos: listaProductosData.map(p => ({ id: p.id, cantidad: p.cantidad })), // Mapea los productos a un formato adecuado para la API.
            total: parseInt(total) // Incluye el total de la factura.
        };

        try {
            const response = await fetch(`${URL}/facturas`, { // Realiza una solicitud POST para guardar la factura.
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // Especifica que se enviarán datos en formato JSON.
                body: JSON.stringify(facturaData) // Convierte los datos de la factura a formato JSON.
            });

            if (!response.ok) {
                throw new Error(`Error al guardar factura: ${response.status}`); // Lanza un error si la respuesta no es correcta.
            }

            // Actualizar las cantidades de los productos en el servidor
            for (const producto of listaProductosData) { // Itera sobre cada producto en la lista de productos de la factura.
                await actualizarCantidadProducto(producto.id, producto.cantidad); // Llama a la función para actualizar la cantidad del producto en el servidor.
            }

            alert("Factura guardada exitosamente"); // Muestra un mensaje de éxito al guardar la factura.
            listaProductos.innerHTML = ''; // Limpia la lista de productos en la interfaz.
            totalInput.value = '0'; // Reinicia el total a 0.
            cargarProductos(); // Carga nuevamente los productos para reflejar las cantidades actualizadas.

            // Redirigir a la página de gestión de facturas
            window.location.href = '../gestionarFacturas/index.html'; // Redirige al usuario a la página de gestión de facturas.
        } catch (error) {
            console.error('Error al guardar la factura:', error.message); // Imprime el error en la consola si ocurre un problema al guardar la factura.
            alert(`No se pudo guardar la factura: ${error.message}`); // Muestra un mensaje de alerta con el error.
        }
    };

    // Función para actualizar la cantidad del producto en el servidor
    const actualizarCantidadProducto = async (productoId, cantidadReducida) => {
        try {
            // Obtener cantidad actual del producto desde el servidor
            const response = await fetch(`${URL}/productos/${productoId}`); // Realiza una solicitud GET para obtener los detalles del producto.
            if (!response.ok) {
                throw new Error('Error al obtener la cantidad del producto'); // Lanza un error si la respuesta no es correcta.
            }

            const producto = await response.json(); // Convierte la respuesta en formato JSON.
            const nuevaCantidad = producto.cantidad - cantidadReducida; // Calcula la nueva cantidad del producto.

            // Realiza una solicitud PATCH para actualizar la cantidad del producto en el servidor.
            const updateResponse = await fetch(`${URL}/productos/${productoId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }, // Especifica que se enviarán datos en formato JSON.
                body: JSON.stringify({ cantidad: nuevaCantidad }) // Convierte la nueva cantidad a formato JSON.
            });

            if (!updateResponse.ok) {
                throw new Error('Error al actualizar la cantidad del producto'); // Lanza un error si la respuesta no es correcta.
            }
        } catch (error) {
            console.error("Error al actualizar cantidad del producto:", error.message); // Imprime el error en la consola si ocurre un problema al actualizar la cantidad.
        }
    };

    cargarProductos(); // Llama a la función para cargar los productos al inicio.
    document.getElementById("agregarProducto").addEventListener("click", agregarProducto); // Agrega un listener para el botón de agregar producto.
    document.getElementById("guardarFactura").addEventListener("click", guardarFactura); // Agrega un listener para el botón de guardar factura.
});