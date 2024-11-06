// SoloNumeros.js

export default function SoloNumeros(value) { // Define una función llamada 'SoloNumeros' que toma un parámetro 'value'.
    return /^\d+$/.test(value); // Retorna 'true' si el valor contiene solo dígitos numéricos (uno o más).
} // Si el valor contiene caracteres no numéricos, retorna 'false'.
