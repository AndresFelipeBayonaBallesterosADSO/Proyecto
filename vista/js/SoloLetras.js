// SoloLetras.js
export default function SoloLetras(value) {
    return /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(value); // Solo letras y espacios
}
