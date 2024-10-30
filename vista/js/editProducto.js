import SoloNumeros from '../js/SoloNumeros.js';
import SoloLetras from '../js/SoloLetras.js';
import { URL } from "./config.js";

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('id');

    cargarCategorias().then(() => {
        if (productoId) {
            cargarProducto(productoId);
        }
    });

    const editarFormProducto = document.getElementById('form-producto');
    editarFormProducto.addEventListener('submit', function (event) {
        event.preventDefault();

        const productoActualizado = {
            nombre: document.getElementById('nombre').value.trim(),
            precio: document.getElementById('precio').value.trim(),
            cantidad: document.getElementById('cantidad').value.trim(),
            categoria: document.getElementById('categoria').value
        };

        console.log('Valores recogidos:', productoActualizado);
        console.log('ID del producto:', productoId);

        // Validar campos usando expresiones regulares
        const nombreValido = /^[a-zA-ZÀ-ÿ\s]+$/.test(productoActualizado.nombre);
        const precioValido = /^[0-9]+$/.test(productoActualizado.precio) && Number(productoActualizado.precio) > 0;
        const cantidadValida = /^[0-9]+$/.test(productoActualizado.cantidad) && Number(productoActualizado.cantidad) >= 0;

        console.log(`Validaciones: Nombre - ${nombreValido}, Precio - ${precioValido}, Cantidad - ${cantidadValida}`);

        if (nombreValido && precioValido && cantidadValida) {
            console.log('Datos a enviar para actualizar:', JSON.stringify(productoActualizado));
            actualizarProducto(productoId, productoActualizado);
        } else {
            alert("Por favor, revisa los datos ingresados.");
        }
    });

    // Agregar eventos a los campos de entrada para validar
    document.getElementById('nombre').addEventListener('keypress', SoloLetras);
    document.getElementById('precio').addEventListener('keypress', SoloNumeros);
    document.getElementById('cantidad').addEventListener('keypress', SoloNumeros);
});

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
            document.getElementById('nombre').value = producto.nombre;
            document.getElementById('precio').value = producto.precio;
            document.getElementById('cantidad').value = producto.cantidad;
            const categoriaSelect = document.getElementById('categoria');
            categoriaSelect.value = producto.categoria;
        })
        .catch(error => {
            console.error('Error al cargar los datos del producto:', error);
            alert('Hubo un problema al cargar los datos del producto.');
        });
};

// Función para actualizar el producto
const actualizarProducto = (id, productoActualizado) => {
    if (!id) {
        alert("ID de producto no encontrado.");
        return;
    }

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
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Error al actualizar el producto:', error);
        alert('Hubo un problema al actualizar el producto.');
    });
};

// Función para cargar las categorías
const cargarCategorias = async () => {
    try {
        const response = await fetch(`${URL}/categorias`);
        if (!response.ok) {
            throw new Error('Error al cargar las categorías');
        }
        const categorias = await response.json();

        const categoria = document.getElementById('categoria');
        categoria.innerHTML = "";

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