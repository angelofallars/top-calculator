"use strict";
const display = document.querySelector(".calc__display");
const digitButtons = document.querySelectorAll(".calc__btn--num");
const operationButtons = document.querySelectorAll(".calc__btn--op");
const periodButton = document.querySelector("#period");
const deleteButton = document.querySelector("#delete");
const clearButton = document.querySelector("#clear");
const equalsButton = document.querySelector("#equals");
const operations = ["+", "-", "x", "/", "%"];
let typedExpression = "";
function updateDisplay(updateString) {
    if (updateString) {
        display.textContent = updateString;
    }
    else {
        display.textContent = String(typedExpression);
    }
}
// Arithmetic functions
function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    return a / b;
}
function modulo(a, b) {
    return a % b;
}
function operate(operator, numbers) {
    return operator(...numbers);
}
// Button click functions
function appendDigit(event) {
    typedExpression += event.target.id;
    updateDisplay();
}
function appendPeriod() {
    typedExpression += ".";
    updateDisplay();
}
function appendOperation(event) {
    switch (event.target.id) {
        case "add":
            typedExpression += "+";
            break;
        case "subtract":
            typedExpression += "-";
            break;
        case "multiply":
            typedExpression += "x";
            break;
        case "divide":
            typedExpression += "/";
            break;
        case "modulo":
            typedExpression += "%";
            break;
    }
    updateDisplay();
}
function deleteLastChar() {
    typedExpression = typedExpression.slice(0, -1);
    updateDisplay();
}
function clearDisplay() {
    typedExpression = "";
    updateDisplay();
}
function calculateExpression() {
    let currentNumber = "";
    let operation = add;
    let result = 0;
    // Split the typed expression into an array
    for (let i = 0; i < typedExpression.length + 1; i++) {
        const char = typedExpression[i];
        if (!isNaN(parseInt(char)) || char === ".") {
            currentNumber += char;
        }
        else if (operations.includes(char) || i === typedExpression.length) {
            // Calculate an operation right away
            result = operate(operation, [result, parseInt(currentNumber)]);
            currentNumber = "";
            if (operations.includes(char)) {
                switch (char) {
                    case "+":
                        operation = add;
                        break;
                    case "-":
                        operation = subtract;
                        break;
                    case "x":
                        operation = multiply;
                        break;
                    case "/":
                        operation = divide;
                        break;
                    case "%":
                        operation = modulo;
                        break;
                }
            }
        }
    }
    // Clear the user input
    typedExpression = "";
    if (isNaN(result)) {
        updateDisplay("Error");
    }
    else {
        // Display the result of the expression with updateDisplay()
        updateDisplay(String(result));
    }
}
digitButtons.forEach((digit) => {
    digit.addEventListener("click", appendDigit);
});
operationButtons.forEach((operation) => {
    operation.addEventListener("click", appendOperation);
});
periodButton.addEventListener("click", appendPeriod);
deleteButton.addEventListener("click", deleteLastChar);
clearButton.addEventListener("click", clearDisplay);
equalsButton.addEventListener("click", calculateExpression);
