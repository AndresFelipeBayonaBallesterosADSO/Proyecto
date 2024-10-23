import { URL } from "./config.js";

const $formulario = document.querySelector('#form-producto');
const nombreProducto = document.querySelector("#nombre");
const precio = document.querySelector("#precio");
const cantidad = document.querySelector("#cantidad");
const categoria = document.querySelector("#categoria");

// Función para guardar el producto
const guardarProducto = (data) => {
    fetch(`${URL}/productos`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json();
        })
        .then(() => {
            limpiarForm();
            alert("Producto agregado exitosamente");
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("No se pudo completar la adición del producto.");
        });
};

// Función para limpiar el formulario
const limpiarForm = () => {
    nombreProducto.value = "";
    precio.value = "";
    cantidad.value = "";
    categoria.selectedIndex = 0;
};

// Función para guardar el producto al enviar el formulario
const save = (event) => {
    event.preventDefault();

    const data = {
        nombre: nombreProducto.value,
        precio: parseFloat(precio.value),
        cantidad: parseInt(cantidad.value),
        categoria: categoria.value
    };

    guardarProducto(data);
};

// Agregar el evento al formulario
$formulario.addEventListener("submit", save);

// Función para cargar las categorías
const cargarCategorias = async () => {
    try {
        const response = await fetch(`${URL}/categorias`);
        if (!response.ok) {
            throw new Error('Error al cargar las categorías');
        }
        const categorias = await response.json();

        console.log(categorias); 

        // Añadir la opción predeterminada
        const defaultOption = document.createElement('option');
        defaultOption.textContent = "Seleccionar Categoría:";
        defaultOption.value = ""; 
        categoria.appendChild(defaultOption);

        // Añadir las opciones de las categorías
        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.nombre; 
            categoria.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
    }
};


// Cargar las categorías al cargar el documento
document.addEventListener("DOMContentLoaded", cargarCategorias);