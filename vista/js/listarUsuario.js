import { URL } from "./config.js"; // Importa la URL base para la API

// Espera a que el contenido del DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => { 
    // Obtén el ID del usuario del localStorage
    const usuarioId = localStorage.getItem('usuarioId'); 

    // Verifica si hay un usuario autenticado
    if (!usuarioId) {
        alert("No hay un usuario autenticado. Por favor inicie sesión."); // Muestra un mensaje de alerta
        window.location.href = '../index.html'; // Redirige a la página de inicio de sesión
        return; // Termina la ejecución si no hay un usuario autenticado
    }

    // Objeto que contiene los elementos del DOM donde se mostrarán los datos del usuario
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
        // Petición para obtener los datos del usuario por su ID
        fetch(`${URL}/users/${usuarioId}`) 
            .then(response => {
                // Verifica si la respuesta es exitosa
                if (!response.ok) {
                    throw new Error('Error en la carga del usuario'); // Lanza un error si la carga falla
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
            .catch(error => {
                console.error('Error al cargar los datos del usuario:', error); // Muestra el error en la consola
                alert('No se pudo cargar el usuario. Verifique el ID.'); // Mensaje de alerta para el usuario
            });
    }

    // Función para guardar los cambios
    function guardarCambios() {
        // Objeto con los datos del usuario modificado
        const usuarioModificado = {
            usuario: dataElements.usuario.value, // Nombre de usuario modificado
            nombre: dataElements.nombre.value, // Nombre modificado
            apellidos: dataElements.apellidos.value, // Apellidos modificados
            email: dataElements.email.value, // Email modificado
            contrasena: dataElements.contrasena.value, // Contraseña modificada
        };

        // Petición para actualizar los datos del usuario
        fetch(`${URL}/users/${usuarioId}`, {
            method: 'PUT', // Método HTTP para actualizar
            headers: {
                'Content-Type': 'application/json', // Indica el tipo de contenido
            },
            body: JSON.stringify(usuarioModificado), // Convierte el objeto a JSON para enviar
        })
        .then(response => {
            // Verifica si la respuesta es exitosa
            if (!response.ok) {
                throw new Error('Error al guardar los cambios'); // Lanza un error si la guardado falla
            }
            return response.json(); // Convierte la respuesta a JSON
        })
        .then(data => {
            alert('Datos actualizados correctamente'); // Mensaje de éxito
            cargarUsuario(); // Recargamos los datos para mostrar los cambios
        })
        .catch(error => {
            console.error('Error al guardar los cambios:', error); // Muestra el error en la consola
            alert('No se pudo guardar los cambios.'); // Mensaje de alerta para el usuario
        });
    }

    // Evento para el botón de guardar cambios
    const guardarBtn = document.querySelector('.guardar'); // Selecciona el botón de guardar
    // Agregamos un evento de clic al botón que llama a guardarCambios
    guardarBtn.addEventListener('click', guardarCambios); 

    // Llamamos a la función para cargar los datos del usuario al cargar la página
    cargarUsuario(); // Cargar los datos del usuario al inicio
});
