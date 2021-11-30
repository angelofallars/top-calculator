"use strict";
const MAX_RESULT_LEN = 8;
const MAX_INPUT_LEN = 12;
const displayInput = document.querySelector(".calc__display__input");
const displayResult = document.querySelector(".calc__display__result");
const buttons = document.querySelectorAll(".calc__btn");
const digitButtons = document.querySelectorAll(".calc__btn--num");
const operationButtons = document.querySelectorAll(".calc__btn--op");
const periodButton = document.querySelector("#period");
const deleteButton = document.querySelector("#delete");
const clearButton = document.querySelector("#clear");
const equalsButton = document.querySelector("#equals");
const operationSymbols = ["+", "-", "x", "/", "%"];
let typedExpression = "";
// Display functions
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
function shakeDisplayInput() {
    if (displayInput.classList.contains("calc__display__input--pop")) {
        displayInput.classList.add("calc__display__input--reset");
        setTimeout(() => displayInput.classList.remove("calc__display__input--reset"), 1);
    }
    displayInput.classList.add("calc__display__input--pop");
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
    displayInput.classList.remove("calc__display__input--error");
    if (typedExpression.length > MAX_INPUT_LEN) {
        shakeDisplayInput();
        return;
    }
    typedExpression += char;
    updateDisplayInput();
}
function appendDigit(digit) {
    addToExpression(digit);
}
function appendPeriod() {
    // Prevent overload of periods
    for (let i = typedExpression.length - 1; (!operationSymbols.includes(typedExpression[i]) && i > -1); i--) {
        if (typedExpression[i] === ".") {
            shakeDisplayInput();
            return;
        }
    }
    addToExpression(".");
    updateDisplayInput();
}
function appendOperation(operationType) {
    const lastChar = typedExpression.slice(-1);
    const lastLastChar = typedExpression.slice(-2, -1);
    let invalidInput = false;
    if (operationType !== "subtract") {
        // Don't put operations when there are no numbers yet
        if (!typedExpression)
            invalidInput = true;
        // Can't stack another operation after another
        if (operationSymbols.includes(lastChar))
            invalidInput = true;
    }
    // Safety checks around + and - operators
    if ((lastChar === "+" || lastChar === "-") &&
        (operationSymbols.includes(lastLastChar)
            || lastLastChar === "-"
            || operationType === "subtract"))
        invalidInput = true;
    if (invalidInput) {
        if (typedExpression !== "")
            shakeDisplayInput();
        return;
    }
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
    if (typedExpression === "")
        return;
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
    if (operationSymbols.includes(typedExpression.slice(-1))) {
        shakeDisplayInput();
        return;
    }
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
                shakeDisplayInput();
                displayInput.classList.add("calc__display__input--error");
                updateDisplayInput("Can't divide by zero, sorry :(");
                return;
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
    if (String(result) === String(parseFloat(typedExpression))) {
        shakeDisplayInput();
        return;
    }
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
// Visual functions
function fadeOutButtonTap(button) {
    if (button.classList.contains("calc__btn--tap")) {
        button.classList.add("calc__btn--reset");
        setTimeout(() => button.classList.remove("calc__btn--reset"), 1);
    }
    button.classList.add("calc__btn--tap");
}
digitButtons.forEach((digit) => {
    digit.addEventListener("click", () => appendDigit(digit.id));
});
operationButtons.forEach((operation) => {
    operation.addEventListener("click", () => appendOperation(operation.id));
});
periodButton.addEventListener("click", appendPeriod);
deleteButton.addEventListener("click", deleteLastChar);
clearButton.addEventListener("click", clearDisplay);
equalsButton.addEventListener("click", calculateExpression);
displayInput.addEventListener("animationend", (e) => {
    const target = e.target;
    target.classList.remove("calc__display__input--pop");
});
// Nice button fade-out animations after clicking
buttons.forEach(button => {
    button.addEventListener("click", () => fadeOutButtonTap(button));
    button.addEventListener("animationend", (e) => {
        const target = e.target;
        if (target.classList.contains("calc__btn--tap")) {
            target.classList.remove("calc__btn--tap");
        }
    });
});
// Keyboard-driven calculator
window.addEventListener("keydown", (e) => {
    const keyCode = e.key;
    // Digits (0-9)
    if (!isNaN(parseInt(keyCode))) {
        const digitButton = document.getElementById(keyCode);
        appendDigit(keyCode);
        fadeOutButtonTap(digitButton);
        // Decimal sign (.)
    }
    else if (keyCode === ".") {
        appendPeriod();
        fadeOutButtonTap(periodButton);
        // Equals (enter)
    }
    else if (keyCode === "Enter") {
        calculateExpression();
        fadeOutButtonTap(equalsButton);
        // Backspace or clear screen
    }
    else if (keyCode === "Backspace") {
        if (typedExpression !== "") {
            deleteLastChar();
            fadeOutButtonTap(deleteButton);
        }
        else {
            clearDisplay();
            fadeOutButtonTap(clearButton);
        }
        // Operations buttons
    }
    else if (keyCode === "+" || keyCode === "=") {
        const operationButton = document.querySelector("#add");
        appendOperation(operationButton.id);
        fadeOutButtonTap(operationButton);
    }
    else if (keyCode === "-") {
        const operationButton = document.querySelector("#subtract");
        appendOperation(operationButton.id);
        fadeOutButtonTap(operationButton);
    }
    else if (keyCode === "x" || keyCode === "*") {
        const operationButton = document.querySelector("#multiply");
        appendOperation(operationButton.id);
        fadeOutButtonTap(operationButton);
    }
    else if (keyCode === "/") {
        const operationButton = document.querySelector("#divide");
        appendOperation(operationButton.id);
        fadeOutButtonTap(operationButton);
    }
    else if (keyCode === "%") {
        const operationButton = document.querySelector("#modulo");
        appendOperation(operationButton.id);
        fadeOutButtonTap(operationButton);
    }
});
