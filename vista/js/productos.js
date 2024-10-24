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

// Validación de campos
const validarFormulario = () => {
    const nombre = nombreProducto.value.trim();
    const precioValue = parseFloat(precio.value);
    const cantidadValue = parseInt(cantidad.value);

    if (nombre === "") {
        alert("El nombre del producto es obligatorio.");
        return false;
    }

    if (isNaN(precioValue) || precioValue <= 0) {
        alert("El precio debe ser un número válido y mayor que 0.");
        return false;
    }

    if (isNaN(cantidadValue) || cantidadValue < 1) {
        alert("La cantidad debe ser un número entero válido y mayor que 0.");
        return false;
    }

    if (categoria.value === "") {
        alert("Por favor, selecciona una categoría.");
        return false;
    }

    return true;
};

// Función para guardar el producto al enviar el formulario
const save = (event) => {
    event.preventDefault();

    // Validar el formulario antes de guardar
    if (!validarFormulario()) {
        return;
    }

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

        console.log(categorias); // Verificar la estructura de los datos

        // Verifica si el arreglo está vacío
        if (!categorias.length) {
            alert("No hay categorías disponibles.");
            return;
        }

        // Añadir la opción predeterminada
        const defaultOption = document.createElement('option');
        defaultOption.textContent = "Seleccionar Categoría:";
        defaultOption.value = ""; 
        categoria.appendChild(defaultOption);

        // Añadir las opciones de las categorías
        categorias.forEach(cat => {
            console.log(cat); // Ver los datos de cada categoría
            const option = document.createElement('option');
            option.value = cat.id; // Asegúrate de que este sea el ID correcto
            option.textContent = cat.nombre; // Asegúrate de que esta sea la propiedad correcta
            categoria.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
        alert("Hubo un problema al cargar las categorías.");
    }
};

// Cargar las categorías al cargar el documento
document.addEventListener("DOMContentLoaded", cargarCategorias);