// Importa la función SoloLetras desde el archivo SoloLetras.js para validar que los campos contengan solo letras
import SoloLetras from "./SoloLetras.js"; 

// Importa la función SoloNumeros desde el archivo SoloNumeros.js para validar que los campos contengan solo números
import SoloNumeros from "./SoloNumeros.js"; 

// Importa la URL de la configuración, que contiene la base de la URL para las peticiones a la API
import { URL } from "./config.js"; 

// Este evento se ejecuta cuando el documento HTML ha sido completamente cargado
document.addEventListener('DOMContentLoaded', () => { 
    // Recupera el ID del usuario almacenado en el localStorage. Si no existe, redirige al login
    const usuarioId = localStorage.getItem('usuarioId'); 

    // Si no se encuentra un usuario autenticado, muestra una alerta y redirige al login
    if (!usuarioId) {
        alert("No hay un usuario autenticado. Por favor inicie sesión.");
        window.location.href = '../index.html'; // Redirige al login
        return; // Detiene la ejecución del código
    }

    // Define un objeto que contiene las referencias a los elementos del DOM donde se mostrarán los datos del usuario
    const dataElements = {
        id: document.querySelector('.usuario__id'), // Campo para mostrar el ID del usuario
        usuario: document.querySelector('.usuario__data--usuario'), // Campo para mostrar el nombre de usuario
        nombre: document.querySelector('.usuario__data--nombre'), // Campo para mostrar el nombre
        apellidos: document.querySelector('.usuario__data--apellidos'), // Campo para mostrar los apellidos
        email: document.querySelector('.usuario__data--email'), // Campo para mostrar el correo electrónico
        contrasena: document.querySelector('.usuario__data--contrasena'), // Campo para mostrar la contraseña
    };

    // Asigna el ID del usuario al campo correspondiente en el formulario
    dataElements.id.value = usuarioId;

    // Función que realiza una solicitud a la API para cargar los datos del usuario
    function cargarUsuario() {
        // Realiza una solicitud fetch para obtener los datos del usuario desde la API
        fetch(`${URL}/users/${usuarioId}`) 
            .then(response => {
                // Si la respuesta no es exitosa, lanza un error
                if (!response.ok) {
                    throw new Error('Error en la carga del usuario');
                }
                // Convierte la respuesta en formato JSON
                return response.json(); 
            })
            .then(data => {
                // Asigna los datos obtenidos a los campos correspondientes del formulario
                dataElements.usuario.value = data.usuario; 
                dataElements.nombre.value = data.nombre; 
                dataElements.apellidos.value = data.apellidos; 
                dataElements.email.value = data.email; 
                dataElements.contrasena.value = data.contrasena; 

                // Llama a la función de validación para comprobar los datos cargados
                validarDatosCargados(data);
            })
            .catch(error => {
                // En caso de error al cargar los datos, muestra un mensaje en la consola y una alerta
                console.error('Error al cargar los datos del usuario:', error);
                alert('No se pudo cargar el usuario. Verifique el ID.'); 
            });
    }

    // Función que valida los datos cargados en los campos del formulario
    function validarDatosCargados(data) {
        // Verifica que el nombre solo contenga letras
        if (!SoloLetras(data.nombre)) {
            alert("El nombre cargado contiene caracteres no válidos.");
            dataElements.nombre.value = ""; // Limpia el campo si no es válido
        }

        // Verifica que los apellidos solo contengan letras
        if (!SoloLetras(data.apellidos)) {
            alert("Los apellidos cargados contienen caracteres no válidos.");
            dataElements.apellidos.value = ""; // Limpia el campo si no es válido
        }

        // Verifica que la contraseña solo contenga números
        if (!SoloNumeros(data.contrasena)) {
            alert("La contraseña cargada debe contener solo números.");
            dataElements.contrasena.value = ""; // Limpia el campo si no es válido
        }
    }

    // Función que guarda los cambios realizados en los datos del usuario
    function guardarCambios() {
        // Obtiene y limpia los valores de los campos de nombre, apellidos y contraseña
        const nombreValue = dataElements.nombre.value.trim();
        const apellidosValue = dataElements.apellidos.value.trim();
        const contrasenaValue = dataElements.contrasena.value.trim();

        // Verifica que el nombre sea válido (solo letras y no vacío)
        if (!nombreValue || !SoloLetras(nombreValue)) {
            alert("El nombre debe contener solo letras y no puede estar vacío.");
            return; // Detiene la ejecución si el nombre no es válido
        }

        // Verifica que los apellidos sean válidos (solo letras y no vacíos)
        if (!apellidosValue || !SoloLetras(apellidosValue)) {
            alert("Los apellidos deben contener solo letras y no pueden estar vacíos.");
            return; // Detiene la ejecución si los apellidos no son válidos
        }

        // Verifica que la contraseña sea válida (solo números y no vacía)
        if (!contrasenaValue || !SoloNumeros(contrasenaValue)) {
            alert("La contraseña debe contener solo números y no puede estar vacía.");
            return; // Detiene la ejecución si la contraseña no es válida
        }

        // Crea un objeto con los datos modificados del usuario
        const usuarioModificado = {
            usuario: dataElements.usuario.value, // Nombre de usuario
            nombre: nombreValue, // Nombre del usuario
            apellidos: apellidosValue, // Apellidos del usuario
            email: dataElements.email.value, // Correo electrónico
            contrasena: contrasenaValue, // Contraseña del usuario
        };

        // Realiza una solicitud PUT para actualizar los datos del usuario en la API
        fetch(`${URL}/users/${usuarioId}`, {
            method: 'PUT', // Método HTTP utilizado para actualizar los datos
            headers: {
                'Content-Type': 'application/json', // Especifica que el cuerpo de la solicitud es un JSON
            },
            body: JSON.stringify(usuarioModificado), // Convierte el objeto de datos a JSON
        })
        .then(response => {
            // Si la respuesta no es exitosa, lanza un error
            if (!response.ok) {
                throw new Error('Error al guardar los cambios'); 
            }
            // Convierte la respuesta en formato JSON
            return response.json(); 
        })
        .then(data => {
            // Muestra un mensaje de éxito si los datos se guardaron correctamente
            alert('Datos actualizados correctamente'); 
            cargarUsuario(); // Vuelve a cargar los datos del usuario
        })
        .catch(error => {
            // En caso de error al guardar los cambios, muestra un mensaje en la consola y una alerta
            console.error('Error al guardar los cambios:', error);
            alert('No se pudo guardar los cambios.'); 
        });
    }

    // Obtiene el botón de "guardar" y asigna un evento de click para guardar los cambios
    const guardarBtn = document.querySelector('.guardar'); 
    guardarBtn.addEventListener('click', guardarCambios); 

    // Carga los datos del usuario cuando la página se carga
    cargarUsuario(); 
});
