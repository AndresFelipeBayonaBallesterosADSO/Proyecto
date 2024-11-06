// Función is_valid para validar si los campos de un formulario están completos
const is_valid = (event, form) => {
    event.preventDefault(); // Previene la acción predeterminada del formulario (enviar) para realizar la validación antes.

    // Selecciona todos los elementos dentro del formulario especificado.
    const elemts = document.querySelectorAll(form);
    let TodosLlenos = true; // Inicializa la variable que verifica si todos los campos están llenos.

    // Recorre todos los elementos seleccionados dentro del formulario
    elemts.forEach(element => {
        // Si el campo está vacío, se marca con clase 'error' y se cambia la bandera a false
        if (element.value === "") {
            element.classList.add("error"); // Agrega la clase 'error' al campo para indicar que está vacío.
            TodosLlenos = false; // Establece la bandera a false si hay algún campo vacío.
        } else {
            // Si el campo no está vacío, se marca con clase 'correcto' para indicar que está completo
            element.classList.remove("error"); // Elimina la clase 'error' si el campo no está vacío.
            element.classList.add("correcto"); // Agrega la clase 'correcto' para indicar que el campo está bien.
        }
    });

    // Si todos los campos están completos (TodosLlenos sigue siendo true)
    if (TodosLlenos) {
        alert("Llenitos"); // Muestra una alerta que indica que todos los campos están llenos.
    } else {
        alert("No llenitos"); // Muestra una alerta si al menos un campo está vacío.
    };

    // Devuelve el valor de TodosLlenos para indicar si la validación fue exitosa (true) o no (false)
    return TodosLlenos;
};

// Exporta la función is_valid para poder utilizarla en otros módulos
export default is_valid;
