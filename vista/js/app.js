import isValid from './isValid.js';

const $formulario = document.querySelector('#registro-form');
const usuario = document.querySelector("#usuario");
const nombre = document.querySelector("#nombre");
const apellido = document.querySelector("#apellido");
const contrasena = document.querySelector("#contrasena");
const confirmarContrasena = document.querySelector("#confirmar-contrasena");
const email = document.querySelector("#email");

$formulario.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el envío del formulario por defecto

    // Validar que las contraseñas coincidan
    if (contrasena.value !== confirmarContrasena.value) {
        alert("Las contraseñas no coinciden. Por favor, verifícalas.");
        return;
    }

    const data = {
        usuario: usuario.value,
        nombre: nombre.value,
        apellido: apellido.value,
        contrasena: contrasena.value,
        email: email.value
    };

    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST', // Usa POST para enviar datos
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Aquí puedes redirigir al usuario a otra página o mostrar un mensaje de éxito
            alert("Registro exitoso. Ya puedes iniciar sesión.");
            // Redirigir a la página de inicio de sesión si es necesario
            window.location.href = './index.html';
        } else {
            // Manejo de errores
            alert("Error en el registro: " + result.message);
            console.error("Error en el registro", result);
        }
    } catch (error) {
        console.error("Error de conexión", error);
        alert("Error de conexión, por favor intente de nuevo.");
    }
});

