

let addElem = document.getElementById("add");
let subElem = document.getElementById("sub");
let mulElem = document.getElementById("mul");
let divElem = document.getElementById("div");

let inputOneElem = document.getElementById("input1");
let inputSecondElem = document.getElementById("input2");

let calculate = document.getElementById("Calculate");

let output = document.getElementById("Output");
output.textContent = 0;

let selectedoperator = ' ';
let selectedElem = null;

addElem.addEventListener('click', function () {
    if (selectedElem != null) {
        selectedElem.style.backgroundColor = "";
        selectedElem.style.color = "";
    }

    selectedElem = addElem;
    selectedoperator = addElem.textContent;

    addElem.style.backgroundColor = "blue";
    addElem.style.color = "white";
});

subElem.addEventListener('click', function () {
    if (selectedElem != null) {
        selectedElem.style.backgroundColor = "";
        selectedElem.style.color = "";
    }

    selectedElem = subElem;
    selectedoperator = subElem.textContent;

    subElem.style.backgroundColor = "blue";
    subElem.style.color = "white";
});

mulElem.addEventListener('click', function () {
    if (selectedElem != null) {
        selectedElem.style.backgroundColor = "";
        selectedElem.style.color = "";
    }

    selectedElem = mulElem;
    selectedoperator = mulElem.textContent;

    mulElem.style.backgroundColor = "blue";
    mulElem.style.color = "white";
});

divElem.addEventListener('click', function () {
    if (selectedElem != null) {
        selectedElem.style.backgroundColor = "";
        selectedElem.style.color = "";
    }

    selectedElem = divElem;
    selectedoperator = divElem.textContent;

    divElem.style.backgroundColor = "blue";
    divElem.style.color = "white";
});

calculate.addEventListener('click', function () {

    let valOne = Number(inputOneElem.value);
    let valTwo = Number(inputSecondElem.value);

switch(selectedoperator) {
    case "+":
        output.textContent = valOne + valTwo;
        break;

    case "-":
        output.textContent = valOne - valTwo;
        break;

    case "*":
        output.textContent = valOne * valTwo;
        break;

    case "/":
        output.textContent = valOne / valTwo;
        break;

    default:
        output.textContent = "Select an operator";
        break;
}
});