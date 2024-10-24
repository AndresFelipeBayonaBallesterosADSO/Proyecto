import validarNumeros from '../js/SoloNumeros.js';
import validarLetras from '../js/SoloLetras.js';
import { URL } from "./config.js";

// Espera a que la página esté completamente cargada
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('id'); // Busca el ID del producto

    // Cargar categorías
    cargarCategorias().then(() => {
        // Si hay un ID, intenta cargar los datos del producto
        if (productoId) {
            cargarProducto(productoId);
        }
    });

    // Maneja el envío del formulario para actualizar los datos del producto
    const editarFormProducto = document.getElementById('form-producto');
    editarFormProducto.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita que la página se recargue al enviar el formulario

        const productoActualizado = {
            nombre: document.getElementById('nombre').value,
            precio: document.getElementById('precio').value,
            cantidad: document.getElementById('cantidad').value,
            categoriaId: document.getElementById('categoria').value // Agrega categoriaId
        };

        if (!validarCamposProducto(productoActualizado)) {
            return; // Detener el envío si la validación falla
        }

        // Actualiza el producto
        actualizarProducto(productoId, productoActualizado);
    });

    // Funciones de validación...
    function validarCamposProducto(producto) {
        let valid = true;

        if (producto.nombre.trim() === '' || !validarLetras(producto.nombre)) {
            mostrarError('nombre', 'El nombre del producto solo debe contener letras y no puede estar vacío.');
            valid = false;
        } else {
            mostrarCorrecto('nombre');
        }

        if (!validarNumeros(producto.precio)) {
            mostrarError('precio', 'El precio debe ser un número.');
            valid = false;
        } else {
            mostrarCorrecto('precio');
        }

        if (!validarNumeros(producto.cantidad)) {
            mostrarError('cantidad', 'Las unidades disponibles deben ser un número.');
            valid = false;
        } else {
            mostrarCorrecto('cantidad');
        }

        return valid;
    }

    function mostrarError(inputId, mensaje) {
        const inputElement = document.getElementById(inputId);
        let errorElement = inputElement.nextElementSibling;

        if (!errorElement || errorElement.tagName !== 'P') {
            errorElement = document.createElement('p');
            inputElement.after(errorElement);
        }

        errorElement.textContent = mensaje;
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '12px';
        inputElement.classList.remove('correcto');
        inputElement.classList.add('error');
    }

    function mostrarCorrecto(inputId) {
        const inputElement = document.getElementById(inputId);
        let errorElement = inputElement.nextElementSibling;

        if (errorElement && errorElement.tagName === 'P') {
            errorElement.remove();
        }

        inputElement.classList.remove('error');
        inputElement.classList.add('correcto');
    }

    // Función para cargar un producto por ID
    const cargarProducto = (id) => {
        fetch(`${URL}/productos/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar el producto');
                }
                return response.json();
            })
            .then(producto => {
                // Llena los campos del formulario con los datos del producto
                document.getElementById('nombre').value = producto.nombre;
                document.getElementById('precio').value = producto.precio;
                document.getElementById('cantidad').value = producto.cantidad;

                // Asigna el ID de la categoría del producto al campo de selección
                const categoriaSelect = document.getElementById('categoria');
                categoriaSelect.value = producto.categoriaId; // Selecciona la categoría correspondiente
            })
            .catch(error => {
                console.error('Error al cargar los datos del producto:', error);
                alert('Hubo un problema al cargar los datos del producto.');
            });
    };

    // Función para actualizar el producto
    const actualizarProducto = (id, productoActualizado) => {
        fetch(`${URL}/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productoActualizado)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar el producto');
            }
            return response.json();
        })
        .then(data => {
            alert('Producto actualizado correctamente');
            window.location.href = 'index.html'; // Regresa a la tabla de productos
        })
        .catch(error => {
            console.error('Error al actualizar el producto:', error);
            alert('Hubo un problema al actualizar el producto.');
        });
    };
});

// Función para cargar las categorías
const cargarCategorias = async () => {
    try {
        const response = await fetch(`${URL}/categorias`);
        if (!response.ok) {
            throw new Error('Error al cargar las categorías');
        }
        const categorias = await response.json();
        console.log("Categorías cargadas:", categorias);

        const categoria = document.getElementById('categoria'); // Asegúrate de que este ID exista en tu HTML
        categoria.innerHTML = ""; // Limpiar contenido existente

        const defaultOption = document.createElement('option');
        defaultOption.textContent = "Seleccionar Categoría:";
        defaultOption.value = ""; 
        categoria.appendChild(defaultOption);

        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id; 
            option.textContent = cat.nombre_categoria;
            categoria.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
        alert("Hubo un problema al cargar las categorías.");
    }
};