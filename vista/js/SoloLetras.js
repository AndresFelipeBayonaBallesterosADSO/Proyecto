// SoloLetras.js

export default function SoloLetras(value) { // Define una función llamada 'SoloLetras' que toma un parámetro 'value'.
    return /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(value); // Retorna 'true' si el valor contiene solo letras (mayúsculas y minúsculas), acentos, eñes y espacios.
} // Si el valor contiene algo distinto, retorna 'false'.
