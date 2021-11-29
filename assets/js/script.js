"use strict";
const MAX_RESULT_LEN = 10;
const MAX_INPUT_LEN = 14;
const displayInput = document.querySelector(".calc__display__input");
const displayResult = document.querySelector(".calc__display__result");
const digitButtons = document.querySelectorAll(".calc__btn--num");
const operationButtons = document.querySelectorAll(".calc__btn--op");
const periodButton = document.querySelector("#period");
const deleteButton = document.querySelector("#delete");
const clearButton = document.querySelector("#clear");
const equalsButton = document.querySelector("#equals");
const operationSymbols = ["+", "-", "x", "/", "%"];
let typedExpression = "";
// Updating the display
function updateDisplayInput(updateString) {
    displayInput.classList.remove("calc__display--gray");
    displayResult.classList.add("calc__display--gray");
    if (updateString) {
        displayInput.textContent = updateString;
    }
    else {
        displayInput.textContent = String(typedExpression);
    }
}
function updateDisplayResult(updateString) {
    displayResult.textContent = updateString;
}
function clearDisplay() {
    typedExpression = "";
    updateDisplayInput();
    updateDisplayResult("");
}
function shortenNumber(n) {
    if (String(n).length < MAX_RESULT_LEN) {
        return String(n);
    }
    else {
        return n.toPrecision(MAX_RESULT_LEN);
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
function addToExpression(char) {
    if (typedExpression.length > MAX_INPUT_LEN)
        return;
    typedExpression += char;
    updateDisplayInput();
}
function appendDigit(event) {
    addToExpression(event.target.id);
}
function appendPeriod() {
    // Prevent overload of periods
    for (let i = typedExpression.length - 1; (!operationSymbols.includes(typedExpression[i]) && i > -1); i--) {
        if (typedExpression[i] === ".")
            return;
    }
    addToExpression(".");
    updateDisplayInput();
}
function appendOperation(event) {
    const lastChar = typedExpression.slice(-1);
    const lastLastChar = typedExpression.slice(-2, -1);
    const operationType = event.target.id;
    if (operationType !== "subtract") {
        // Don't put operations when there are no numbers yet
        if (!typedExpression)
            return;
        // Can't stack another operation after another
        if (operationSymbols.includes(lastChar))
            return;
    }
    // Safety checks around + and - operators
    if ((lastChar === "+" || lastChar === "-") &&
        (operationSymbols.includes(lastLastChar)
            || lastLastChar === "-"
            || operationType === "subtract"))
        return;
    switch (operationType) {
        case "add":
            addToExpression("+");
            break;
        case "subtract":
            addToExpression("-");
            break;
        case "multiply":
            addToExpression("x");
            break;
        case "divide":
            addToExpression("/");
            break;
        case "modulo":
            addToExpression("%");
            break;
    }
}
function deleteLastChar() {
    typedExpression = typedExpression.slice(0, -1);
    updateDisplayInput();
}
function calculateExpression() {
    let currentNumber = "";
    let operation = add;
    let result = 0;
    // If the user didn't type anything, just return
    if (typedExpression === "") {
        return;
    }
    // Don't allow incomplete expressions (stray operations at end)
    if (operationSymbols.includes(typedExpression.slice(-1)))
        return;
    // Split the typed expression into an array
    for (let i = 0; i < typedExpression.length + 1; i++) {
        const char = typedExpression[i];
        if (!isNaN(parseInt(char)) || char === ".") {
            currentNumber += char;
            // Detect negative numbers that start with -
        }
        else if (currentNumber === "" && char === "-") {
            currentNumber += char;
        }
        else if (operationSymbols.includes(char) || i === typedExpression.length) {
            // Edge case: Division by zero
            if (currentNumber === "0" && operation === divide) {
                typedExpression = "";
                return updateDisplayInput("No zero division!");
            }
            // Calculate an operation right away
            result = operate(operation, [result, Number(currentNumber)]);
            currentNumber = "";
            if (operationSymbols.includes(char)) {
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
    // If the evaluated result didn't do anything (same as input), return
    if (String(result) === typedExpression)
        return;
    // Clear the user input
    typedExpression = "";
    displayInput.classList.add("calc__display--gray");
    displayResult.classList.remove("calc__display--gray");
    if (isNaN(result)) {
        updateDisplayResult("Error");
    }
    else {
        // Display the result of the expression with updateDisplayResult()
        updateDisplayResult(shortenNumber(result));
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
