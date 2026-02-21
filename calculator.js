let displayValue = '0';
let expression = '';
let lastResult = null;
let hasError = false;

const displayElement = document.getElementById('display');
const expressionElement = document.getElementById('expression');

function updateDisplay() {
  displayElement.textContent = displayValue;
  expressionElement.textContent = expression;
}

function appendNumber(num) {
  if (hasError) clearDisplay();

  if (displayValue === '0' && num !== '.') {
    displayValue = num;
  } else if (num === '.' && displayValue.includes('.')) {
    return;
  } else {
    displayValue += num;
  }
  updateDisplay();
}

function appendOperator(op) {
  if (hasError) clearDisplay();

  if (displayValue.endsWith('.')) {
    displayValue = displayValue.slice(0, -1);
  }

  expression = displayValue + ' ' + op;
  displayValue = '0';
  updateDisplay();
}

function calculateResult() {
  if (!expression || hasError) return;

  try {
    let fullExpression = (expression + ' ' + displayValue)
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/(\d+\.?\d*)%/g, '($1/100)');

    const result = Function('"use strict"; return (' + fullExpression + ')')();

    if (!isFinite(result)) throw Error();

    displayValue = String(Math.round(result * 1e9) / 1e9);
    expression = '';
    lastResult = displayValue;
  } catch {
    displayValue = 'Error';
    expression = '';
    hasError = true;
  }
  updateDisplay();
}

function clearDisplay() {
  displayValue = '0';
  expression = '';
  lastResult = null;
  hasError = false;
  updateDisplay();
}

function deleteLastChar() {
  if (displayValue.length > 1) {
    displayValue = displayValue.slice(0, -1);
  } else {
    displayValue = '0';
  }
  updateDisplay();
}

document.addEventListener('keydown', (e) => {
  if (/\d/.test(e.key)) appendNumber(e.key);
  if (e.key === '.') appendNumber('.');
  if (e.key === '+') appendOperator('+');
  if (e.key === '-') appendOperator('−');
  if (e.key === '*') appendOperator('×');
  if (e.key === '/') appendOperator('÷');
  if (e.key === 'Enter') calculateResult();
  if (e.key === 'Backspace') deleteLastChar();
  if (e.key.toLowerCase() === 'c') clearDisplay();
});

updateDisplay();
