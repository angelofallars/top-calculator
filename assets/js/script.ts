const MAX_RESULT_LEN = 10;
const MAX_INPUT_LEN = 14;
const displayInput = document.querySelector(".calc__display__input") as Element;
const displayResult = document.querySelector(".calc__display__result") as Element;
const digitButtons = document.querySelectorAll(".calc__btn--num");
const operationButtons = document.querySelectorAll(".calc__btn--op");
const periodButton = document.querySelector("#period") as Element;
const deleteButton = document.querySelector("#delete") as Element;
const clearButton = document.querySelector("#clear") as Element;
const equalsButton = document.querySelector("#equals") as Element;
const operationSymbols = ["+", "-", "x", "/", "%"];

let typedExpression: string = "";

type operation = (a: number, b: number) => number;

// Display functions

function updateDisplayInput(updateString?: string) {
  displayInput.classList.remove("calc__display--gray");
  displayResult.classList.add("calc__display--gray");

  if (updateString) {
    displayInput.textContent = updateString;
  } else {
    displayInput.textContent = String(typedExpression);
  }
}

function updateDisplayResult(updateString: string) {
  displayResult.textContent = updateString;
}

function clearDisplay() {
  typedExpression = "";
  updateDisplayInput();
  updateDisplayResult("");
}

function shakeDisplayInput() {
  displayInput.classList.add("calc__display__input--pop");
}

function shortenNumber(n: number): string {
  if (String(n).length < MAX_RESULT_LEN) {
    return String(n);
  } else {
    return n.toPrecision(MAX_RESULT_LEN);
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

function addToExpression(char: string) {
  if (typedExpression.length > MAX_INPUT_LEN) {
    shakeDisplayInput();
    return;
  }

  typedExpression += char;
  updateDisplayInput();
}

function appendDigit(event: any) {
  addToExpression(event.target.id);
}

function appendPeriod() {
  // Prevent overload of periods
  for (let i = typedExpression.length - 1;
       (!operationSymbols.includes(typedExpression[i]) && i > -1);
       i--) {

    if (typedExpression[i] === ".") {
      shakeDisplayInput();
      return;
    }
  }

  addToExpression(".");
  updateDisplayInput();
}

function appendOperation(event: any) {
  const lastChar = typedExpression.slice(-1);
  const lastLastChar = typedExpression.slice(-2, -1);
  const operationType = event.target.id;
  let invalidInput = false;

  if (operationType !== "subtract") {
    // Don't put operations when there are no numbers yet
    if (!typedExpression) invalidInput = true;

    // Can't stack another operation after another
    if (operationSymbols.includes(lastChar)) invalidInput =true;
  }

  // Safety checks around + and - operators
  if ((lastChar === "+" || lastChar === "-") && 
      (operationSymbols.includes(lastLastChar)
       || lastLastChar === "-"
       || operationType === "subtract")) invalidInput = true;

  if (invalidInput) {
    if (typedExpression !== "") shakeDisplayInput();
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
  typedExpression = typedExpression.slice(0, -1);
  updateDisplayInput();
}

function calculateExpression() {
  let currentNumber = "";
  let operation: operation = add;
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
    } else if (currentNumber === "" && char === "-") {
      currentNumber += char;

    } else if (operationSymbols.includes(char) || i === typedExpression.length) {
      // Edge case: Division by zero
      if (currentNumber === "0" && operation === divide) {
        typedExpression = "";
        shakeDisplayInput();
        updateDisplayInput("No zero division!");
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
  if (String(result) === typedExpression) {
    shakeDisplayInput();
    return;
  }

  // Clear the user input
  typedExpression = "";
  displayInput.classList.add("calc__display--gray");
  displayResult.classList.remove("calc__display--gray");

  if (isNaN(result)) {
    updateDisplayResult("Error")
  } else {
    // Display the result of the expression with updateDisplayResult()
    updateDisplayResult(shortenNumber(result));
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

displayInput.addEventListener("animationend", (e) => {
  const target = e.target as HTMLTextAreaElement;
  target.classList.remove("calc__display__input--pop");
});
