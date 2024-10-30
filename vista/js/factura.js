import { URL } from "./config.js"; 
// Importa la constante 'URL' del archivo 'config.js', que contiene la URL base para las solicitudes a la API.

document.addEventListener("DOMContentLoaded", () => { 
// Agrega un evento que espera hasta que todo el contenido del DOM (Document Object Model) esté completamente cargado antes de ejecutar el código dentro de la función.

    const $formulario = document.querySelector('#form-factura'); 
    // Selecciona el elemento del DOM con el ID 'form-factura' y lo asigna a la constante '$formulario'.

    const productoSelect = document.querySelector("#producto"); 
    // Selecciona el elemento del DOM con el ID 'producto' y lo asigna a la constante 'productoSelect'.

    const totalInput = document.querySelector("#total"); 
    // Selecciona el elemento del DOM con el ID 'total' y lo asigna a la constante 'totalInput'.

    const listaProductos = document.getElementById('listaProductos'); 
    // Selecciona el elemento del DOM con el ID 'listaProductos' y lo asigna a la constante 'listaProductos'.

    // Función para cargar los productos desde la API
    const cargarProductos = async () => { 
    // Define una función asíncrona llamada 'cargarProductos' que no toma parámetros.
        try {
            const response = await fetch(`${URL}/productos`); 
            // Realiza una solicitud HTTP utilizando la API Fetch a la URL que se encuentra en 'URL', concatenando '/productos'.
            
            if (!response.ok) { 
            // Comprueba si la respuesta no es correcta (código de estado HTTP no en el rango 200-299).
                throw new Error('Error al cargar productos'); 
                // Lanza un error si la respuesta no es exitosa.
            }

            const productos = await response.json(); 
            // Convierte la respuesta a formato JSON y la asigna a la constante 'productos'.

            // Llenar el select de productos
            productoSelect.innerHTML = ''; 
            // Limpia el contenido actual del select de productos.

            productos.forEach(producto => { 
            // Itera sobre cada producto en el array 'productos'.
                const option = document.createElement('option'); 
                // Crea un nuevo elemento 'option' para agregar al select.
                option.value = producto.id; 
                // Establece el valor del option al ID del producto.
                option.textContent = `${producto.nombre} - Cantidad: ${producto.cantidad}`; 
                // Establece el texto del option para mostrar el nombre y la cantidad del producto.
                productoSelect.appendChild(option); 
                // Agrega el option al select de productos.
            });
        } catch (error) { 
        // Captura cualquier error que ocurra durante la carga de productos.
            console.error("Error al cargar productos:", error.message); 
            // Imprime el error en la consola para el desarrollo.
        }
    };

    // Función para agregar un producto a la lista de factura
    const agregarProducto = () => { 
    // Define la función 'agregarProducto' que no toma parámetros.
        const cantidadInput = document.querySelector("#cantidad"); 
        // Selecciona el elemento del DOM con el ID 'cantidad' y lo asigna a la constante 'cantidadInput'.

        const cantidad = parseInt(cantidadInput.value); 
        // Obtiene el valor del input de cantidad y lo convierte a un entero.

        if (isNaN(cantidad) || cantidad <= 0) { 
        // Comprueba si la cantidad no es un número o es menor o igual a cero.
            alert("Por favor, ingrese una cantidad válida."); 
            // Muestra un mensaje de alerta si la cantidad no es válida.
            return; // Sale de la función si la cantidad no es válida.
        }

        const productoId = productoSelect.value; 
        // Obtiene el ID del producto seleccionado en el select.

        const nombreProducto = productoSelect.options[productoSelect.selectedIndex].text; 
        // Obtiene el texto del producto seleccionado, que contiene el nombre y la cantidad.

        const listaItem = document.createElement('li'); 
        // Crea un nuevo elemento 'li' para agregar a la lista de productos.
        listaItem.textContent = `${nombreProducto} - Cantidad: ${cantidad}`; 
        // Establece el texto del elemento 'li' con el nombre y la cantidad del producto.
        listaProductos.appendChild(listaItem); 
        // Agrega el nuevo 'li' a la lista de productos.

        // Actualizar total
        const total = parseInt(totalInput.value) || 0; 
        // Obtiene el valor total actual, convirtiéndolo a un entero o asigna 0 si es NaN.
        const precioProducto = parseInt(productoSelect.options[productoSelect.selectedIndex].dataset.precio); 
        // Obtiene el precio del producto desde el atributo 'data' del option seleccionado.
        totalInput.value = total + (precioProducto * cantidad); 
        // Actualiza el total multiplicando el precio del producto por la cantidad y sumándolo al total existente.
    };

    // Función para guardar la factura
    const guardarFactura = async () => { 
    // Define una función asíncrona llamada 'guardarFactura' que no toma parámetros.
        const total = totalInput.value; 
        // Obtiene el valor total del input de total.

        // Obtener la lista de productos agregados a la factura
        const listaProductos = Array.from(document.getElementById('listaProductos').children).map(li => { 
        // Convierte la lista de hijos del elemento 'listaProductos' en un array y mapea cada 'li' a un objeto.
            const cantidad = li.textContent.match(/Cantidad: (\d+)/)[1]; 
            // Obtiene la cantidad de texto del elemento 'li'.
            const nombreProducto = li.textContent.match(/^(.*?) -/)[1]; 
            // Obtiene el nombre del producto del texto del elemento 'li'.
            // Obtener ID del producto buscando en el select
            const productoId = Array.from(document.getElementById('producto').options).find(option => 
                option.textContent.includes(nombreProducto)).value; 
            // Encuentra el ID del producto en el select que coincide con el nombre del producto en el 'li'.

            return { 
                id: productoId, // ID del producto
                cantidad: parseInt(cantidad) // Cantidad del producto
            };
        });

        // Validar si se han agregado productos a la factura
        if (listaProductos.length === 0) { 
        // Comprueba si no hay productos en la lista de productos.
            alert("Debe agregar al menos un producto a la factura."); 
            // Muestra un mensaje de alerta si no hay productos.
            return; // Sale de la función si no hay productos.
        }

        // Preparar los datos de la factura para enviar
        const facturaData = { 
            productos: listaProductos.map(p => ({ id: p.id, cantidad: p.cantidad })), 
            // Mapea los productos a un formato que incluye el ID y la cantidad para enviar.
            total: parseInt(total) // Total de la factura
        };

        try { 
            // Guardar la factura en la API
            const response = await fetch(`${URL}/facturas`, { 
            // Realiza una solicitud HTTP utilizando la API Fetch a la URL que se encuentra en 'URL', concatenando '/facturas'.
                method: 'POST', // Método POST para crear la factura.
                headers: { 
                    'Content-Type': 'application/json', // Indica que el contenido es JSON.
                },
                body: JSON.stringify(facturaData) // Envía los datos de la factura como JSON.
            });

            // Verificar si la respuesta fue exitosa
            if (!response.ok) { 
            // Comprueba si la respuesta no es correcta.
                throw new Error(`Error al guardar factura: ${response.status}`); 
                // Lanza un error si la respuesta no es exitosa.
            }

            // Actualizar las cantidades de los productos en el servidor
            for (const producto of listaProductos) { 
            // Itera sobre cada producto en la lista de productos.
                await actualizarCantidadProducto(producto.id, -producto.cantidad); 
                // Llama a la función 'actualizarCantidadProducto' para restar la cantidad del producto en el servidor.
            }

            alert("Factura guardada exitosamente"); 
            // Muestra un mensaje de alerta indicando que la factura se guardó correctamente.
            listaProductos.innerHTML = ''; 
            // Limpia la lista de productos.
            totalInput.value = '0'; 
            // Reinicia el total a 0.
            cargarProductos(); 
            // Recarga productos para mostrar la cantidad actualizada.
        } catch (error) { 
            console.error('Error al guardar la factura:', error.message); 
            // Muestra el error en la consola.
            alert(`No se pudo guardar la factura: ${error.message}`); 
            // Muestra un mensaje de alerta indicando que no se pudo guardar la factura.
        }
    };

    // Registrar eventos después de cargar el DOM
    document.addEventListener('DOMContentLoaded', () => { 
    // Agrega un evento que espera hasta que todo el contenido del DOM esté completamente cargado.
        cargarProductos(); 
        // Llama a la función 'cargarProductos' para cargar productos al iniciar.
        // Agregar evento para agregar producto al hacer clic
        document.getElementById("agregarProducto").addEventListener("click", agregarProducto); 
        // Agrega un evento de escucha al botón para agregar productos a la factura.

        // Agregar evento para guardar factura al hacer clic
        document.getElementById("guardarFactura").addEventListener("click", guardarFactura); 
        // Agrega un evento de escucha al botón para guardar la factura.
    });
});