import SoloLetras from "./SoloLetras.js"; 
import SoloNumeros from "./SoloNumeros.js"; 
import { URL } from "./config.js"; 

document.addEventListener('DOMContentLoaded', () => { 
    const usuarioId = localStorage.getItem('usuarioId'); 

    if (!usuarioId) {
        alert("No hay un usuario autenticado. Por favor inicie sesión.");
        window.location.href = '../index.html'; 
        return; 
    }

    const dataElements = {
        id: document.querySelector('.usuario__id'), 
        usuario: document.querySelector('.usuario__data--usuario'), 
        nombre: document.querySelector('.usuario__data--nombre'), 
        apellidos: document.querySelector('.usuario__data--apellidos'), 
        email: document.querySelector('.usuario__data--email'), 
        contrasena: document.querySelector('.usuario__data--contrasena'), 
    };

    dataElements.id.value = usuarioId;

    function cargarUsuario() {
        fetch(`${URL}/users/${usuarioId}`) 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la carga del usuario');
                }
                return response.json(); 
            })
            .then(data => {
                dataElements.usuario.value = data.usuario; 
                dataElements.nombre.value = data.nombre; 
                dataElements.apellidos.value = data.apellidos; 
                dataElements.email.value = data.email; 
                dataElements.contrasena.value = data.contrasena; 

                // Validaciones después de cargar los datos
                validarDatosCargados(data);
            })
            .catch(error => {
                console.error('Error al cargar los datos del usuario:', error);
                alert('No se pudo cargar el usuario. Verifique el ID.'); 
            });
    }

    function validarDatosCargados(data) {
        // Validar nombre
        if (!SoloLetras(data.nombre)) {
            alert("El nombre cargado contiene caracteres no válidos.");
            dataElements.nombre.value = ""; // Limpia el campo si es inválido
        }

        // Validar apellidos
        if (!SoloLetras(data.apellidos)) {
            alert("Los apellidos cargados contienen caracteres no válidos.");
            dataElements.apellidos.value = ""; // Limpia el campo si es inválido
        }

        // Validar contraseña
        if (!SoloNumeros(data.contrasena)) {
            alert("La contraseña cargada debe contener solo números.");
            dataElements.contrasena.value = ""; // Limpia el campo si es inválido
        }
    }

    function guardarCambios() {
        const nombreValue = dataElements.nombre.value.trim();
        const apellidosValue = dataElements.apellidos.value.trim();
        const contrasenaValue = dataElements.contrasena.value.trim();

        if (!nombreValue || !SoloLetras(nombreValue)) {
            alert("El nombre debe contener solo letras y no puede estar vacío.");
            return;
        }
        if (!apellidosValue || !SoloLetras(apellidosValue)) {
            alert("Los apellidos deben contener solo letras y no pueden estar vacíos.");
            return;
        }
        if (!contrasenaValue || !SoloNumeros(contrasenaValue)) {
            alert("La contraseña debe contener solo números y no puede estar vacía.");
            return;
        }

        const usuarioModificado = {
            usuario: dataElements.usuario.value, 
            nombre: nombreValue, 
            apellidos: apellidosValue, 
            email: dataElements.email.value, 
            contrasena: contrasenaValue, 
        };

        fetch(`${URL}/users/${usuarioId}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(usuarioModificado), 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al guardar los cambios'); 
            }
            return response.json(); 
        })
        .then(data => {
            alert('Datos actualizados correctamente'); 
            cargarUsuario(); 
        })
        .catch(error => {
            console.error('Error al guardar los cambios:', error);
            alert('No se pudo guardar los cambios.'); 
        });
    }

    const guardarBtn = document.querySelector('.guardar'); 
    guardarBtn.addEventListener('click', guardarCambios); 

    cargarUsuario(); 
});
