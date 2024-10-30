import { URL } from "./config.js"; // Importa la URL base para la API desde un archivo de configuración

document.addEventListener('DOMContentLoaded', () => { // Espera a que el contenido del DOM esté completamente cargado
    // Obtén el ID del usuario del localStorage o establece un ID predeterminado
    const usuarioId = localStorage.getItem('usuarioId') || "6653"; // Cambia esto a un ID válido si no hay en localStorage
    const dataElements = {
        id: document.querySelector('.usuario__id'), // Elemento que contiene el ID del usuario
        usuario: document.querySelector('.usuario__data--usuario'), // Elemento para el nombre de usuario
        nombre: document.querySelector('.usuario__data--nombre'), // Elemento para el nombre
        apellidos: document.querySelector('.usuario__data--apellidos'), // Elemento para los apellidos
        email: document.querySelector('.usuario__data--email'), // Elemento para el email
        contrasena: document.querySelector('.usuario__data--contrasena'), // Elemento para la contraseña
    };

    // Asignamos el ID del usuario al campo oculto
    dataElements.id.value = usuarioId;

    // Función para cargar los datos del usuario
    function cargarUsuario() {
        fetch(`${URL}/users/${usuarioId}`) // Petición para obtener los datos del usuario por su ID
            .then(response => {
                if (!response.ok) { // Comprobamos si la respuesta es correcta
                    throw new Error('Error en la carga del usuario'); // Lanza un error si la respuesta no es correcta
                }
                return response.json(); // Convierte la respuesta a JSON
            })
            .then(data => {
                // Asignamos los datos a los elementos de la página
                dataElements.usuario.value = data.usuario; // Asignamos el nombre de usuario
                dataElements.nombre.value = data.nombre; // Asignamos el nombre
                dataElements.apellidos.value = data.apellidos; // Asignamos los apellidos
                dataElements.email.value = data.email; // Asignamos el email
                dataElements.contrasena.value = data.contrasena; // Carga la contraseña si es necesario
            })
            .catch(error => { // Manejo de errores
                console.error('Error al cargar los datos del usuario:', error); // Muestra el error en la consola
                alert('No se pudo cargar el usuario. Verifique el ID.'); // Mensaje de alerta para el usuario
            });
    }

    // Función para guardar los cambios
    function guardarCambios() {
        const usuarioModificado = {
            usuario: dataElements.usuario.value, // Recoge el nombre de usuario modificado
            nombre: dataElements.nombre.value, // Recoge el nombre modificado
            apellidos: dataElements.apellidos.value, // Recoge los apellidos modificados
            email: dataElements.email.value, // Recoge el email modificado
            contrasena: dataElements.contrasena.value, // Recoge la contraseña modificada
        };

        fetch(`${URL}/users/${usuarioId}`, {
            method: 'PUT', // Usamos PUT para actualizar los datos del usuario
            headers: {
                'Content-Type': 'application/json', // Especificamos que el contenido es JSON
            },
            body: JSON.stringify(usuarioModificado), // Convertimos el objeto a JSON
        })
        .then(response => {
            if (!response.ok) { // Comprobamos si la respuesta es correcta
                throw new Error('Error al guardar los cambios'); // Lanza un error si la respuesta no es correcta
            }
            return response.json(); // Convierte la respuesta a JSON
        })
        .then(data => {
            alert('Datos actualizados correctamente'); // Mensaje de éxito
            cargarUsuario(); // Recargamos los datos para mostrar los cambios
        })
        .catch(error => {
            console.error('Error al guardar los cambios:', error); // Muestra el error en la consola
        });
    }

    // Evento para el botón de guardar cambios
    const guardarBtn = document.querySelector('.usuario__btn.guardar'); // Seleccionamos el botón de guardar
    guardarBtn.addEventListener('click', guardarCambios); // Agregamos un evento de clic al botón que llama a guardarCambios

    // Llamamos a la función para cargar los datos del usuario al cargar la página
    cargarUsuario(); // Cargar los datos del usuario al inicio
});