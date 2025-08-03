const buttons = [
  { value: "ON", type: "start", classes: ["btn", "on-off"] },
  { value: "AC", type: "clearAll", classes: ["btn"] },
  { value: "C", type: "clear", classes: ["btn"] },
  { value: "/", type: "divide", classes: ["btn"] },
  { value: "9", type: "number", classes: ["btn"] },
  { value: "8", type: "number", classes: ["btn"] },
  { value: "7", type: "number", classes: ["btn"] },
  { value: "*", type: "multiply", classes: ["btn"] },
  { value: "6", type: "number", classes: ["btn"] },
  { value: "5", type: "number", classes: ["btn"] },
  { value: "4", type: "number", classes: ["btn"] },
  { value: "-", type: "substract", classes: ["btn"] },
  { value: "3", type: "number", classes: ["btn"] },
  { value: "2", type: "number", classes: ["btn"] },
  { value: "1", type: "number", classes: ["btn"] },
  { value: "+", type: "add", classes: ["btn"] },
  { value: ".", type: "comma", classes: ["btn"] },
  { value: "0", type: "number", classes: ["btn"] },
  { value: "=", type: "equals", classes: ["btn", "last"] },
];

const startBtn = document.querySelector("h1");
const overlay = document.getElementById("overlay");
const calculator = document.querySelector(".calculator");
const screen = document.querySelector(".screen");
const mainInput = document.getElementById("main-input");
const secondaryInput = document.getElementById("secondary-input");

let num1 = "0"; // 0 o "" ????
let num2 = "";
let operand = "";
let numInMainScreen = "0";
let result = "";
let fullExpression = "";
let isCalculatorTurnedOn = false;
let isOperandSet = false;
let isResultShown = false;

function restart(type) {
  num1 = "0";
  num2 = "";
  operand = "";
  numInMainScreen = "0";
  result = "";
  fullExpression = "";
  if (type === "turnOn") {
    isCalculatorTurnedOn = true;
  }
  isOperandSet = false;
  isResultShown = false;
  mainInput.value = numInMainScreen;
  secondaryInput.value = fullExpression;
}

startBtn.addEventListener("click", () => {
  init();
  hideStartBtn();
});

function init() {
  //mostrar calculadora, pantalla y botones
  calculator.classList.add("show");
  screen.classList.add("screen-show");
  const btns = document.querySelectorAll(".btn");
  for (const [index, b] of btns.entries()) {
    b.classList.add("btn-show");
    b.classList.add("btn-show-initial-timing-function");
    b.style.transitionDuration = "0.5s";
    b.style.transitionDelay = 0.6 + 0.12 * index + "s";
  }
  setTimeout(removeButtonTransitions, 1000);
}

function hideStartBtn() {
  startBtn.classList.add("hide");
  overlay.style.display = "none";
}

function removeButtonTransitions() {
  const btns = document.querySelectorAll(".btn");
  for (const b of btns) {
    b.style.transitionDelay = "";
    b.style.transitionDuration = "";
    b.classList.remove("btn-show-initial-timing-function");
  }
}

const buttonsDOM = document.createElement("div");
buttonsDOM.classList.add("buttons");
calculator.appendChild(buttonsDOM);

buttons.forEach((button) => {
  placeButtonsOnScreen(button);
});

function placeButtonsOnScreen(button) {
  const buttonDOM = document.createElement("button");
  buttonDOM.textContent = button.value;
  for (const c of button.classes) {
    buttonDOM.classList.add(c);
  }
  buttonDOM.setAttribute("data-value", button.value);
  buttonDOM.setAttribute("data-type", button.type);
  buttonsDOM.appendChild(buttonDOM);

  addListenerToButton(buttonDOM);
}

function addListenerToButton(button) {
  switch (button.getAttribute("data-type")) {
    case "start":
      button.addEventListener("click", (e) => {
        turnCalculatorOnOff(e);
      });
      break;
    case "clearAll":
      button.addEventListener("click", (e) => {
        clear();
      });
      break;
    case "clear":
      button.addEventListener("click", (e) => {
        clearCurrentVar();
      });
      break;
    case "number":
      button.addEventListener("click", (e) => {
        addNumberToScreen(e, button.getAttribute("data-value"));
      });
      break;
    case "comma":
      button.addEventListener("click", (e) => {
        addCommaToScreen(e, button.getAttribute("data-value"));
      });
      break;
    case "divide":
      button.addEventListener("click", (e) => {
        setOperand("/");
      });
      break;
    case "multiply":
      button.addEventListener("click", (e) => {
        setOperand("*");
      });
      break;
    case "substract":
      button.addEventListener("click", (e) => {
        setOperand("-");
      });
      break;
    case "add":
      button.addEventListener("click", (e) => {
        setOperand("+");
      });
      break;
    case "equals":
      button.addEventListener("click", (e) => {
        calculate();
      });
      break;
    default:
    //console.log(button.getAttribute("data-type"));
  }
}

function turnCalculatorOnOff(e) {
  calculator.classList.toggle("on");
  if (!isCalculatorTurnedOn) {
    restart("turnOn");
    screen.classList.remove("off");
    screen.classList.add("on");
    e.target.textContent = "OFF";
  } else {
    isCalculatorTurnedOn = false;
    screen.classList.remove("on");
    screen.classList.add("off");
    e.target.textContent = "ON";
  }
}

function clear() {
  restart("clearAll");
}

function clearCurrentVar() {
  if (isResultShown) return;
  if (result === "") {
    numInMainScreen = "";
    mainInput.value = 0;
    setExpression();
  } else {
    numInMainScreen = "";
    mainInput.value = 0;
    num2 = "";
    setExpression();
  }
}

function addNumberToScreen(e, value) {
  isResultShown ? clear() : null;

  numInMainScreen === "0"
    ? (numInMainScreen = value)
    : (numInMainScreen = numInMainScreen + value);

  mainInput.value = numInMainScreen;
  setExpression();
}

function addCommaToScreen(e, value) {
  isResultShown ? clear() : null;

  if (numInMainScreen.indexOf(".") !== -1) {
    return;
  } else {
    numInMainScreen = numInMainScreen + value;
  }
  mainInput.value = numInMainScreen;
  setExpression();
}

function setExpression() {
  if (!isResultShown) {
    isOperandSet ? (num2 = numInMainScreen) : (num1 = numInMainScreen);
  } else {
    num1 = result;
    num2 = numInMainScreen;
    isResultShown = false;
  }

  fullExpression = num1 + operand + num2;
  secondaryInput.value = fullExpression;
}

function setOperand(selectedOperand) {
  if (!isOperandSet) {
    numInMainScreen = "";
    isOperandSet = true;
    operand = selectedOperand;
    setExpression();
  }
}

function calculate() {
  if (isOperandSet && num2 != "" && !isResultShown) {
    fullExpression += "=";
    secondaryInput.value = fullExpression;
    switch (operand) {
      case "+":
        add(num1, num2);
        break;
      case "-":
        substract(num1, num2);
        break;
      case "*":
        product(num1, num2);
        break;
      case "/":
        division(num1, num2);
        break;
      default:
        console.log("operation not available");
    }
    isResultShown = true;
    result = numInMainScreen;
    prepareForChainedOperations();
  }
}

function add(n1, n2) {
  numInMainScreen = parseFloat(n1) + parseFloat(n2);
}

function substract(n1, n2) {
  numInMainScreen = parseFloat(n1) - parseFloat(n2);
}

function product(n1, n2) {
  numInMainScreen = parseFloat(n1) * parseFloat(n2);
}

function division(n1, n2) {
  numInMainScreen = parseFloat(n1) / parseFloat(n2);
}

function prepareForChainedOperations() {
  mainInput.value = numInMainScreen;
  isOperandSet = false;
  operand = "";
}
