const ValidarCorreo = (event, elemento) => {
    let expresion = /^[\w-._]+@[\w-._]+(\.[a-zA-Z]{2,4}){1,2}$/;
    console.log(expresion, elemento.value);
    console.log(expresion.test(elemento.value));
    if (expresion.test(elemento.value)) {
        console.log("Si");
        elemento.classList.remove("error");
        elemento.classList.add("correcto");    
    } else {
        console.log("No");
        elemento.classList.remove("correcto");
        elemento.classList.add("error");
    };
};

export default ValidarCorreo;