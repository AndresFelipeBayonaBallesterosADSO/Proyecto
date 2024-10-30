import SoloLetras from '../js/SoloLetras.js'; // Validación solo letras
import { URL } from "./config.js"; // URL de la API

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaId = urlParams.get('id');

    cargarCategorias().then(() => {
        if (categoriaId) {
            cargarCategoria(categoriaId);
        }
    });

    const editarFormCategoria = document.getElementById('form-categoria');
    editarFormCategoria.addEventListener('submit', function (event) {
        event.preventDefault();

        const categoriaActualizada = {
            nombre_categoria: document.getElementById('nombre_categoria').value.trim(),
        };

        console.log('Valores recogidos:', categoriaActualizada);
        console.log('ID de la categoría:', categoriaId);

        // Validar el nombre usando expresiones regulares
        const nombreValido = /^[a-zA-ZÀ-ÿ\s]+$/.test(categoriaActualizada.nombre_categoria);

        console.log(`Validación: Nombre - ${nombreValido}`);

        if (nombreValido) {
            console.log('Datos a enviar para actualizar:', JSON.stringify(categoriaActualizada));
            actualizarCategoria(categoriaId, categoriaActualizada);
        } else {
            alert("Por favor, revisa el nombre ingresado.");
        }
    });

    // Agregar eventos a los campos de entrada para validar
    document.getElementById('nombre_categoria').addEventListener('keypress', SoloLetras);
});

// Función para cargar una categoría por ID
const cargarCategoria = (id) => {
    fetch(`${URL}/categorias/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar la categoría');
            }
            return response.json();
        })
        .then(categoria => {
            document.getElementById('nombre_categoria').value = categoria.nombre_categoria;
        })
        .catch(error => {
            console.error('Error al cargar los datos de la categoría:', error);
            alert('Hubo un problema al cargar los datos de la categoría.');
        });
};

// Función para actualizar la categoría
const actualizarCategoria = (id, categoriaActualizada) => {
    if (!id) {
        alert("ID de categoría no encontrado.");
        return;
    }

    fetch(`${URL}/categorias/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoriaActualizada)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar la categoría');
        }
        return response.json();
    })
    .then(data => {
        alert('Categoría actualizada correctamente');
        window.location.href = 'index.html'; // Redirigir a la lista de categorías
    })
    .catch(error => {
        console.error('Error al actualizar la categoría:', error);
        alert('Hubo un problema al actualizar la categoría.');
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
        // Aquí podrías manejar la lógica de mostrar categorías si necesitas hacerlo
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
        alert("Hubo un problema al cargar las categorías.");
    }
};
