const display = document.querySelector(".calc__display") as Element;
const digitButtons = document.querySelectorAll(".calc__btn--num");
const operationButtons = document.querySelectorAll(".calc__btn--op");
const periodButton = document.querySelector("#period") as Element;
const deleteButton = document.querySelector("#delete") as Element;
const clearButton = document.querySelector("#clear") as Element;
const equalsButton = document.querySelector("#equals") as Element;
const operations = ["+", "-", "x", "/", "%"];

let typedExpression: string = "";

type operation = (a: number, b: number) => number;

function updateDisplay(updateString?: string) {
  if (updateString) {
    display.textContent = updateString;
  } else {
    display.textContent = String(typedExpression);
  }
}

// Arithmetic functions

function add(a: number, b: number): number {
  return a + b;
}

function subtract(a: number, b: number): number {
  return a - b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

function divide(a: number, b: number): number {
  return a / b;
}

function modulo(a: number, b: number): number {
  return a % b;
}

function operate(operator: Function, numbers: [number, number]): number {
  return operator(...numbers);
}

// Button click functions

function appendDigit(event: any) {
  typedExpression += event.target.id;
  updateDisplay();
}

function appendPeriod() {
  typedExpression += ".";
  updateDisplay();
}

function appendOperation(event: any) {
  switch (event.target.id) {
    case "add":
      typedExpression += "+";
      break;
    case "subtract":
      typedExpression += "-";
      break
    case "multiply":
      typedExpression += "x";
      break
    case "divide":
      typedExpression += "/";
      break
    case "modulo":
      typedExpression += "%";
      break
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
  let operation: operation = add;
  let result = 0;

  // If the user didn't type anything, don't do anything
  if (!typedExpression) return;

  // Split the typed expression into an array
  for (let i = 0; i < typedExpression.length + 1; i++) {
    const char = typedExpression[i];

    if (!isNaN(parseInt(char)) || char === ".") {
      currentNumber += char;

    // Detect negative numbers that start with -
    } else if (currentNumber === "" && char === "-") {
      currentNumber += char;

    } else if (operations.includes(char) || i === typedExpression.length) {
      // Edge case: Division by zero
      if (currentNumber === "0" && operation === divide) {
        typedExpression = "";
        return updateDisplay("No zero division!");
      }

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
    updateDisplay("Error")
  } else {
    // Display the result of the expression with updateDisplay()
    updateDisplay(String(result));
  }
}

digitButtons.forEach((digit) => {
  digit.addEventListener("click", appendDigit)
});
operationButtons.forEach((operation) => {
  operation.addEventListener("click", appendOperation);
});
periodButton.addEventListener("click", appendPeriod);
deleteButton.addEventListener("click", deleteLastChar);
clearButton.addEventListener("click", clearDisplay);
equalsButton.addEventListener("click", calculateExpression);
