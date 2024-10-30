// SoloNumeros.js
const SoloNumeros = (event) => {
    if (event.key < '0' || event.key > '9') {
        event.preventDefault();
    }
};

export default SoloNumeros;