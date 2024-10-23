const SoloLetras = (event, elemento)=>{
    let letras = /^[a-zA-ZÀ-ÿ\s]+$/;
    if (letras.test(event.key)) {
        console.log("Si")
    }
    else{
        console.log("No")
        event.preventDefault();
    }
};

export default SoloLetras;