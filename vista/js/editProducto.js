import SoloNumeros from '../js/SoloNumeros.js'; 
// Importa la función 'SoloNumeros' desde el archivo 'SoloNumeros.js', que se utilizará para validar que los campos de entrada solo contengan números.

import SoloLetras from '../js/SoloLetras.js'; 
// Importa la función 'SoloLetras' desde el archivo 'SoloLetras.js', que se utilizará para validar que el campo de entrada solo contenga letras.

import { URL } from "./config.js"; 
// Importa la constante 'URL' del archivo 'config.js', que contiene la URL base para realizar solicitudes a la API.

document.addEventListener('DOMContentLoaded', () => { 
// Agrega un evento al documento que espera a que todo el contenido del DOM (Document Object Model) esté completamente cargado antes de ejecutar el código dentro de la función.

    const urlParams = new URLSearchParams(window.location.search); 
    // Crea un objeto 'URLSearchParams' que permite manejar los parámetros de la URL de la página actual.

    const productoId = urlParams.get('id'); 
    // Obtiene el valor del parámetro 'id' de la URL y lo asigna a la variable 'productoId', que se usará para identificar el producto que se va a cargar.

    cargarCategorias().then(() => { 
    // Llama a la función 'cargarCategorias' y espera su finalización.
        if (productoId) { 
        // Comprueba si 'productoId' tiene un valor (es decir, si se pasó en la URL).
            cargarProducto(productoId); 
            // Si 'productoId' es válido, llama a la función 'cargarProducto' pasando el ID del producto.
        }
    });

    const editarFormProducto = document.getElementById('form-producto'); 
    // Obtiene el elemento del DOM con el ID 'form-producto' y lo asigna a la constante 'editarFormProducto'.

    editarFormProducto.addEventListener('submit', function (event) { 
    // Agrega un evento de escucha al formulario que ejecuta la función anónima cuando se envía.
        event.preventDefault(); 
        // Evita que el formulario se envíe de manera tradicional y refresque la página.

        const productoActualizado = { 
        // Define un objeto llamado 'productoActualizado'.
            nombre: document.getElementById('nombre').value.trim(), 
            // Asigna el valor del campo de entrada con el ID 'nombre', eliminando espacios en blanco al inicio y al final.
            precio: document.getElementById('precio').value.trim(), 
            // Asigna el valor del campo de entrada con el ID 'precio', eliminando espacios en blanco al inicio y al final.
            cantidad: document.getElementById('cantidad').value.trim(), 
            // Asigna el valor del campo de entrada con el ID 'cantidad', eliminando espacios en blanco al inicio y al final.
            categoria: document.getElementById('categoria').value 
            // Asigna el valor del campo de selección con el ID 'categoria' a la propiedad 'categoria' del objeto.
        };

        console.log('Valores recogidos:', productoActualizado); 
        // Imprime en la consola los valores recogidos en el objeto 'productoActualizado'.
        console.log('ID del producto:', productoId); 
        // Imprime en la consola el ID del producto.

        // Validar campos usando expresiones regulares
        const nombreValido = /^[a-zA-ZÀ-ÿ\s]+$/.test(productoActualizado.nombre); 
        // Utiliza una expresión regular para comprobar si el nombre solo contiene letras y espacios. 
        // El resultado se asigna a 'nombreValido'.
        
        const precioValido = /^[0-9]+$/.test(productoActualizado.precio) && Number(productoActualizado.precio) > 0; 
        // Verifica que el precio solo contenga números y sea mayor que 0. 
        // El resultado se asigna a 'precioValido'.

        const cantidadValida = /^[0-9]+$/.test(productoActualizado.cantidad) && Number(productoActualizado.cantidad) >= 0; 
        // Verifica que la cantidad solo contenga números y sea mayor o igual a 0. 
        // El resultado se asigna a 'cantidadValida'.

        console.log(`Validaciones: Nombre - ${nombreValido}, Precio - ${precioValido}, Cantidad - ${cantidadValida}`); 
        // Imprime en la consola los resultados de las validaciones.

        if (nombreValido && precioValido && cantidadValida) { 
        // Comprueba si 'nombreValido', 'precioValido' y 'cantidadValida' son verdaderos.
            console.log('Datos a enviar para actualizar:', JSON.stringify(productoActualizado)); 
            // Imprime en la consola los datos que se enviarán a la API, convirtiendo 'productoActualizado' a una cadena JSON.
            actualizarProducto(productoId, productoActualizado); 
            // Llama a la función 'actualizarProducto' pasando el ID del producto y los datos actualizados.
        } else { 
            alert("Por favor, revisa los datos ingresados."); 
            // Muestra un mensaje de alerta si alguno de los campos no es válido.
        }
    });

    // Agregar eventos a los campos de entrada para validar
    document.getElementById('nombre').addEventListener('keypress', SoloLetras); 
    // Agrega un evento de escucha al campo de entrada 'nombre' que llama a la función 'SoloLetras' para validar la entrada mientras se presionan teclas.
    document.getElementById('precio').addEventListener('keypress', SoloNumeros); 
    // Agrega un evento de escucha al campo de entrada 'precio' que llama a la función 'SoloNumeros' para validar la entrada.
    document.getElementById('cantidad').addEventListener('keypress', SoloNumeros); 
    // Agrega un evento de escucha al campo de entrada 'cantidad' que llama a la función 'SoloNumeros' para validar la entrada.
});

// Función para cargar un producto por ID
const cargarProducto = (id) => { 
// Define la función 'cargarProducto' que toma un parámetro 'id'.
    fetch(`${URL}/productos/${id}`) 
    // Realiza una solicitud HTTP a la URL que se encuentra en 'URL', concatenando '/productos/' y el ID proporcionado.
        .then(response => { 
        // Maneja la respuesta de la solicitud.
            if (!response.ok) { 
            // Comprueba si la respuesta no es correcta (código de estado HTTP no en el rango 200-299).
                throw new Error('Error al cargar el producto'); 
                // Lanza un error si la respuesta no es exitosa.
            }
            return response.json(); 
            // Convierte la respuesta a formato JSON y la devuelve.
        })
        .then(producto => { 
        // Maneja el producto obtenido de la respuesta.
            document.getElementById('nombre').value = producto.nombre; 
            // Asigna el valor del campo 'nombre' al nombre del producto cargado.
            document.getElementById('precio').value = producto.precio; 
            // Asigna el valor del campo 'precio' al precio del producto cargado.
            document.getElementById('cantidad').value = producto.cantidad; 
            // Asigna el valor del campo 'cantidad' a la cantidad del producto cargado.
            const categoriaSelect = document.getElementById('categoria'); 
            // Obtiene el campo de selección con el ID 'categoria' y lo asigna a 'categoriaSelect'.
            categoriaSelect.value = producto.categoria; 
            // Asigna el valor de la categoría del producto cargado al campo de selección.
        })
        .catch(error => { 
        // Captura cualquier error que ocurra en las promesas anteriores.
            console.error('Error al cargar los datos del producto:', error); 
            // Imprime el error en la consola para el desarrollo.
            alert('Hubo un problema al cargar los datos del producto.'); 
            // Muestra un mensaje de alerta indicando que hubo un problema al cargar el producto.
        });
};

// Función para actualizar el producto
const actualizarProducto = (id, productoActualizado) => { 
// Define la función 'actualizarProducto' que toma dos parámetros: 'id' y 'productoActualizado'.
    if (!id) { 
    // Comprueba si 'id' no está presente.
        alert("ID de producto no encontrado."); 
        // Muestra un mensaje de alerta si no se encuentra el ID.
        return; 
        // Sale de la función si no hay ID.
    }

    fetch(`${URL}/productos/${id}`, { 
    // Realiza una solicitud HTTP a la URL de la API para actualizar el producto, utilizando el ID.
        method: 'PUT', 
        // Especifica que el método de la solicitud es 'PUT', lo que indica que se están enviando datos para actualizar en el servidor.
        headers: { 
        // Define los encabezados de la solicitud.
            'Content-Type': 'application/json', 
            // Indica que el tipo de contenido es JSON.
        },
        body: JSON.stringify(productoActualizado) 
        // Convierte el objeto 'productoActualizado' a una cadena JSON y lo envía en el cuerpo de la solicitud.
    })
    .then(response => { 
    // Maneja la respuesta de la solicitud.
        if (!response.ok) { 
        // Comprueba si la respuesta no es correcta.
            throw new Error('Error al actualizar el producto'); 
            // Lanza un error si la respuesta no es exitosa.
        }
        return response.json(); 
        // Convierte la respuesta a formato JSON y la devuelve.
    })
    .then(data => { 
    // Maneja la respuesta del producto actualizado.
        alert('Producto actualizado correctamente'); 
        // Muestra un mensaje de alerta indicando que el producto se actualizó con éxito.
        window.location.href = 'index.html'; 
        // Redirige al usuario a la página 'index.html' después de la actualización.
    })
    .catch(error => { 
    // Captura cualquier error que ocurra en las promesas anteriores.
        console.error('Error al actualizar el producto:', error); 
        // Imprime el error en la consola.
        alert('Hubo un problema al actualizar el producto.'); 
        // Muestra un mensaje de alerta indicando que hubo un problema.
    });
};

// Función para cargar las categorías
const cargarCategorias = async () => { 
// Define la función asíncrona 'cargarCategorias'.
    try { 
    // Inicia un bloque try para manejar errores.
        const response = await fetch(`${URL}/categorias`); 
        // Realiza una solicitud HTTP a la API para obtener todas las categorías y espera la respuesta.
        if (!response.ok) { 
        // Comprueba si la respuesta no es correcta.
            throw new Error('Error al cargar las categorías'); 
            // Lanza un error si la respuesta no es exitosa.
        }
        const categorias = await response.json(); 
        // Convierte la respuesta a formato JSON y la asigna a la variable 'categorias'.

        const categoria = document.getElementById('categoria'); 
        // Obtiene el campo de selección con el ID 'categoria' y lo asigna a la constante 'categoria'.
        categoria.innerHTML = ""; 
        // Limpia el contenido actual del campo de selección.

        const defaultOption = document.createElement('option'); 
        // Crea un nuevo elemento de opción.
        defaultOption.textContent = "Seleccionar Categoría:"; 
        // Asigna el texto de la opción por defecto.
        defaultOption.value = ""; 
        // Asigna un valor vacío a la opción por defecto.
        categoria.appendChild(defaultOption); 
        // Agrega la opción por defecto al campo de selección.

        categorias.forEach(cat => { 
        // Itera sobre cada categoría en el array 'categorias'.
            const option = document.createElement('option'); 
            // Crea un nuevo elemento de opción para cada categoría.
            option.value = cat.id; 
            // Asigna el ID de la categoría como valor de la opción.
            option.textContent = cat.nombre_categoria; 
            // Asigna el nombre de la categoría como texto de la opción.
            categoria.appendChild(option); 
            // Agrega la opción de la categoría al campo de selección.
        });
    } catch (error) { 
    // Captura cualquier error que ocurra en el bloque try.
        console.error("Error al cargar las categorías:", error); 
        // Imprime el error en la consola.
        alert("Hubo un problema al cargar las categorías."); 
        // Muestra un mensaje de alerta indicando que hubo un problema.
    }
};