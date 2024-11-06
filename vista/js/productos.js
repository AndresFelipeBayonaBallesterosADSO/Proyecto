import { URL } from "./config.js"; // Importa la URL desde el archivo de configuración, que se utiliza para realizar las peticiones a la API

// Selecciona el formulario para productos
const $formulario = document.querySelector('#form-producto'); // Obtiene el formulario de productos por su ID ('form-producto')

// Selecciona el campo de nombre del producto
const nombreProducto = document.querySelector("#nombre"); // Obtiene el campo de entrada para el nombre del producto por su ID ('nombre')

// Selecciona el campo de precio
const precio = document.querySelector("#precio"); // Obtiene el campo de entrada para el precio del producto por su ID ('precio')

// Selecciona el campo de cantidad
const cantidad = document.querySelector("#cantidad"); // Obtiene el campo de entrada para la cantidad del producto por su ID ('cantidad')

// Selecciona el campo de categoría
const categoria = document.querySelector("#categoria"); // Obtiene el campo de selección para la categoría del producto por su ID ('categoria')

// Función para cargar las categorías
const cargarCategorias = async () => {
    try {
        // Realiza una petición GET a la API para obtener las categorías
        const response = await fetch(`${URL}/categorias`); // Realiza una solicitud GET a la URL base + '/categorias' para obtener las categorías de productos
        if (!response.ok) { 
            throw new Error('Error al cargar las categorías'); // Si la respuesta de la API no es OK, lanza un error
        }
        // Convierte la respuesta a formato JSON
        const categorias = await response.json(); // Convierte la respuesta de la API en un objeto JSON con la lista de categorías
        console.log("Categorías cargadas:", categorias); // Muestra las categorías cargadas en la consola para depuración

        categoria.innerHTML = ""; // Limpiar contenido existente en el campo de selección de categoría

        // Crea una opción por defecto
        const defaultOption = document.createElement('option'); // Crea un nuevo elemento <option> para la opción por defecto
        defaultOption.textContent = "Seleccionar Categoría:"; // Asigna el texto de la opción por defecto
        defaultOption.value = ""; // Asigna un valor vacío a la opción por defecto
        categoria.appendChild(defaultOption); // Añade la opción por defecto al campo de selección

        // Recorre las categorías y las añade al select
        categorias.forEach(cat => { 
            // Crea una nueva opción para cada categoría
            const option = document.createElement('option'); // Crea un nuevo elemento <option> para la categoría
            option.value = cat.id; // Asigna el ID de la categoría como valor de la opción
            option.textContent = cat.nombre_categoria; // Asigna el nombre de la categoría como texto de la opción
            categoria.appendChild(option); // Añade la opción al campo de selección de categorías
        });
    } catch (error) {
        console.error("Error al cargar las categorías:", error); // Muestra el error en la consola si ocurre un problema al cargar las categorías
        alert("Hubo un problema al cargar las categorías."); // Muestra una alerta si ocurrió un error al cargar las categorías
    }
};

// Función para guardar el producto
const guardarProducto = async (data) => {
    try {
        const response = await fetch(`${URL}/productos`, { // Realiza una solicitud POST a la URL base + '/productos' para guardar un nuevo producto
            method: 'POST', // Establece el método de la solicitud como POST
            body: JSON.stringify(data), // Convierte los datos del producto a formato JSON antes de enviarlos
            headers: {
                'Content-Type': 'application/json; charset=UTF-8', // Establece el tipo de contenido como JSON
            },
        });

        if (!response.ok) { 
            throw new Error('Error en la respuesta de la API'); // Si la respuesta no es OK, lanza un error
        }
        await response.json(); // Convierte la respuesta de la API a formato JSON (aunque no se usa el valor retornado)
        limpiarForm(); // Llama a la función para limpiar el formulario después de guardar el producto
        alert("Producto agregado exitosamente"); // Muestra una alerta indicando que el producto fue agregado con éxito
        
        // Redirigir a la página de gestionar productos
        window.location.href = '../gestionarProductos/index.html'; // Redirige a la página de gestión de productos después de guardar el producto
    } catch (error) {
        console.error("Error:", error); // Muestra el error en la consola si ocurre un problema durante la operación
        alert("No se pudo completar la adición del producto."); // Muestra una alerta indicando que hubo un problema al agregar el producto
    }
};

// Función para limpiar el formulario
const limpiarForm = () => {
    nombreProducto.value = ""; // Limpia el campo de nombre del producto
    precio.value = ""; // Limpia el campo de precio del producto
    cantidad.value = ""; // Limpia el campo de cantidad del producto
    categoria.selectedIndex = 0; // Resetea la selección de la categoría a la opción por defecto
};

// Validación de campos
const validarFormulario = () => {
    // Elimina espacios en blanco del nombre
    const nombre = nombreProducto.value.trim(); // Elimina los espacios en blanco al inicio y al final del valor del nombre del producto
    // Convierte el valor del precio a un número
    const precioValue = parseFloat(precio.value); // Convierte el valor del precio a un número decimal
    // Convierte el valor de la cantidad a un número entero
    const cantidadValue = parseInt(cantidad.value); // Convierte el valor de la cantidad a un número entero

    // Validaciones
    if (nombre === "") {
        alert("El nombre del producto es obligatorio."); // Muestra una alerta si el nombre del producto está vacío
        return false; // Retorna false para indicar que la validación falló
    }

    if (isNaN(precioValue) || precioValue <= 0) {
        alert("El precio debe ser un número válido y mayor que 0."); // Muestra una alerta si el precio no es un número o es menor o igual a 0
        return false; // Retorna false para indicar que la validación falló
    }

    if (isNaN(cantidadValue) || cantidadValue < 1) {
        alert("La cantidad debe ser un número entero válido y mayor que 0."); // Muestra una alerta si la cantidad no es un número entero o es menor que 1
        return false; // Retorna false para indicar que la validación falló
    }

    if (categoria.value === "") {
        alert("Por favor, selecciona una categoría."); // Muestra una alerta si no se ha seleccionado una categoría
        return false; // Retorna false para indicar que la validación falló
    }

    return true; // Retorna true si todas las validaciones son exitosas
};

// Función para guardar el producto al enviar el formulario
const save = (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario (que es recargar la página)

    // Validar el formulario antes de guardar
    if (!validarFormulario()) { 
        return; // Sale de la función si la validación falla
    }

    // Prepara los datos del producto
    const data = {
        nombre: nombreProducto.value, // Obtiene el nombre del producto
        precio: parseFloat(precio.value), // Obtiene el precio del producto
        cantidad: parseInt(cantidad.value), // Obtiene la cantidad del producto
        categoria: categoria.value // Obtiene el valor de la categoría seleccionada
    };

    guardarProducto(data); // Llama a la función para guardar el producto con los datos preparados
};

// Agregar el evento al formulario
$formulario.addEventListener("submit", save); // Añade un listener para el evento 'submit' del formulario y llama a la función 'save' cuando se envíe el formulario

// Cargar las categorías al cargar el documento
document.addEventListener("DOMContentLoaded", cargarCategorias); // Llama a la función 'cargarCategorias' cuando el documento ha cargado completamente para cargar las categorías disponibles
