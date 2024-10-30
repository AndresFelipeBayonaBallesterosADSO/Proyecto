// SoloLetras.js
const SoloLetras = (event) => {
    const letras = /^[a-zA-ZÀ-ÿ\s]+$/;
    if (!letras.test(event.key)) {
        console.log("No");
        event.preventDefault();
    } else {
        console.log("Si");
    }
};

export default SoloLetras;