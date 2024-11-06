const ValidarCorreo = (event, elemento) => { // Define una función llamada 'ValidarCorreo' que toma dos parámetros: 'event' y 'elemento'.
    let expresion = /^[\w-._]+@[\w-._]+(\.[a-zA-Z]{2,4}){1,2}$/; // Define una expresión regular que valida el formato de un correo electrónico.
    console.log(expresion, elemento.value); // Muestra en la consola la expresión regular y el valor del campo 'elemento'.
    console.log(expresion.test(elemento.value)); // Muestra en la consola si el valor del campo coincide con la expresión regular (true o false).
    
    if (expresion.test(elemento.value)) { // Si el valor del campo coincide con el formato de correo electrónico.
        console.log("Si"); // Muestra 'Si' en la consola si la validación es exitosa.
        elemento.classList.remove("error"); // Elimina la clase 'error' del elemento si es válido.
        elemento.classList.add("correcto"); // Añade la clase 'correcto' al elemento para marcarlo como válido.
    } else { // Si el valor del campo no coincide con el formato de correo electrónico.
        console.log("No"); // Muestra 'No' en la consola si la validación falla.
        elemento.classList.remove("correcto"); // Elimina la clase 'correcto' del elemento si es inválido.
        elemento.classList.add("error"); // Añade la clase 'error' al elemento para marcarlo como inválido.
    };
};

export default ValidarCorreo; // Exporta la función 'ValidarCorreo' para que pueda ser utilizada en otros módulos.
