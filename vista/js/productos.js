import { URL } from "./config.js"; // Importa la URL desde el archivo de configuración

// Selecciona el formulario para productos
const $formulario = document.querySelector('#form-producto'); 
// Selecciona el campo de nombre del producto
const nombreProducto = document.querySelector("#nombre"); 
// Selecciona el campo de precio
const precio = document.querySelector("#precio"); 
// Selecciona el campo de cantidad
const cantidad = document.querySelector("#cantidad"); 
// Selecciona el campo de categoría
const categoria = document.querySelector("#categoria"); 

// Función para cargar las categorías
const cargarCategorias = async () => {
    try {
        // Realiza una petición GET a la API para obtener las categorías
        const response = await fetch(`${URL}/categorias`); 
        if (!response.ok) {
            throw new Error('Error al cargar las categorías'); // Lanza un error si la respuesta no es OK
        }
        // Convierte la respuesta a formato JSON
        const categorias = await response.json(); 
        console.log("Categorías cargadas:", categorias); // Muestra las categorías en la consola

        categoria.innerHTML = ""; // Limpiar contenido existente

        // Crea una opción por defecto
        const defaultOption = document.createElement('option'); 
        defaultOption.textContent = "Seleccionar Categoría:"; // Texto de la opción por defecto
        defaultOption.value = ""; // Valor de la opción por defecto
        categoria.appendChild(defaultOption); // Añade la opción por defecto al select

        // Recorre las categorías y las añade al select
        categorias.forEach(cat => {
            // Crea una nueva opción para cada categoría
            const option = document.createElement('option'); 
            option.value = cat.id; // Asigna el ID de la categoría como valor
            option.textContent = cat.nombre_categoria; // Asigna el nombre de la categoría como texto
            categoria.appendChild(option); // Añade la opción al select
        });
    } catch (error) {
        console.error("Error al cargar las categorías:", error); // Muestra el error en la consola
        alert("Hubo un problema al cargar las categorías."); // Muestra una alerta de error
    }
};

// Función para guardar el producto
const guardarProducto = async (data) => {
    try {
        const response = await fetch(`${URL}/productos`, {
            method: 'POST', // Método para enviar datos
            body: JSON.stringify(data), // Convierte los datos a formato JSON
            headers: {
                'Content-Type': 'application/json; charset=UTF-8', // Tipo de contenido
            },
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta de la API'); // Lanza un error si la respuesta no es OK
        }
        await response.json(); // Convierte la respuesta a formato JSON
        limpiarForm(); // Limpia el formulario después de agregar el producto
        alert("Producto agregado exitosamente"); // Muestra una alerta de éxito
        
        // Redirigir a la página de gestionar productos
        window.location.href = '../gestionarProductos/index.html'; // Redirige a la página de gestión de productos
    } catch (error) {
        console.error("Error:", error); // Muestra el error en la consola
        alert("No se pudo completar la adición del producto."); // Muestra una alerta de error
    }
};

// Función para limpiar el formulario
const limpiarForm = () => {
    nombreProducto.value = ""; // Limpia el campo de nombre
    precio.value = ""; // Limpia el campo de precio
    cantidad.value = ""; // Limpia el campo de cantidad
    categoria.selectedIndex = 0; // Resetea la selección de la categoría
};

// Validación de campos
const validarFormulario = () => {
    // Elimina espacios en blanco del nombre
    const nombre = nombreProducto.value.trim(); 
    // Convierte el valor del precio a un número
    const precioValue = parseFloat(precio.value); 
    // Convierte el valor de la cantidad a un número entero
    const cantidadValue = parseInt(cantidad.value); 

    // Validaciones
    if (nombre === "") {
        alert("El nombre del producto es obligatorio."); // Alerta si el nombre está vacío
        return false; // Retorna false si la validación falla
    }

    if (isNaN(precioValue) || precioValue <= 0) {
        alert("El precio debe ser un número válido y mayor que 0."); // Alerta si el precio es inválido
        return false; // Retorna false si la validación falla
    }

    if (isNaN(cantidadValue) || cantidadValue < 1) {
        alert("La cantidad debe ser un número entero válido y mayor que 0."); // Alerta si la cantidad es inválida
        return false; // Retorna false si la validación falla
    }

    if (categoria.value === "") {
        alert("Por favor, selecciona una categoría."); // Alerta si no se ha seleccionado una categoría
        return false; // Retorna false si la validación falla
    }

    return true; // Retorna true si todas las validaciones son exitosas
};

// Función para guardar el producto al enviar el formulario
const save = (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Validar el formulario antes de guardar
    if (!validarFormulario()) {
        return; // Sale de la función si la validación falla
    }

    // Prepara los datos del producto
    const data = {
        nombre: nombreProducto.value,
        precio: parseFloat(precio.value),
        cantidad: parseInt(cantidad.value),
        categoria: categoria.value
    };

    guardarProducto(data); // Llama a la función para guardar el producto
};

// Agregar el evento al formulario
$formulario.addEventListener("submit", save); // Escucha el evento submit y llama a la función save

// Cargar las categorías al cargar el documento
document.addEventListener("DOMContentLoaded", cargarCategorias); // Llama a la función cargarCategorias al cargar el documento
