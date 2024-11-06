const remover = (e, input) => { // Define una función llamada 'remover' que toma dos parámetros: el evento 'e' y un elemento 'input'.
    if (input.value != "") { // Verifica si el valor del campo de entrada no está vacío.
        input.classList.remove("error"); // Si el campo tiene valor, elimina la clase 'error' (indicando que el campo tiene un error).
        input.classList.add("correcto"); // Luego agrega la clase 'correcto' al campo (indicando que el campo es válido).
    };
};

export default remover; // Exporta la función 'remover' para que pueda ser utilizada en otros módulos.
