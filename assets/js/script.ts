const display = document.querySelector(".calc__display") as Element;
const digitButtons = document.querySelectorAll(".calc__btn--num");
const operationButtons = document.querySelectorAll(".calc__btn--op");
const periodButton = document.querySelector("#period") as Element;
const deleteButton = document.querySelector("#delete") as Element;
const clearButton = document.querySelector("#clear") as Element;
const equalsButton = document.querySelector("#equals") as Element;

let typedExpression: string = "";

type operations = "add" | "subtract" | "multiply" | "divide" | "modulo";

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
  let expressions = [];
  let currentNumber = "";

  // Split the typed expression into an array
  for (let i = 0; i < typedExpression.length; i++) {
    const char = typedExpression[i];

    // Digit
    if (!isNaN(parseInt(char))) {
      currentNumber += char;
    // Period
    } else if (char === ".") {
      currentNumber += ".";
    // Operation (+ - x / %)
    } else {
      expressions.push(parseInt(currentNumber));
      expressions.push(char);
      currentNumber = "";
    }

    // Push the last number into the array
    if (i === typedExpression.length - 1) {
      expressions.push(parseInt(currentNumber));
    }
  }

  // Iterate through the array with .reduce
  const result: number = expressions.reduce((final, current, index, array) => {
    // Operators
    if (current === "+") {
      final = operate(add, [result, array[index + 1] as number]);
    }
    return final;
  });
  // Display the result of the expression with updateDisplay()
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
