const is_valid = (event, form) => {
    event.preventDefault();
    const elemts = document.querySelectorAll(form);
    let TodosLlenos = true;
    elemts.forEach(element =>{
        if (element.value === "") {
            element.classList.add("error");
            TodosLlenos = false;
        }else{
            element.classList.remove("error");
            element.classList.add("correcto");
        }
    });

    if (TodosLlenos) {
        alert("Llenitos")
    }else{
        alert("No llenitos")
    };
    return TodosLlenos;
};

export default is_valid;