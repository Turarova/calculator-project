class Calculator {
  constructor() {
    this.current = '';
    this.previous = '';
    this.operation = '';
    this.history = [];
    this.waitingForNewInput = false;

    this.display = document.getElementById('result');
    this.historyEl = document.getElementById('history');
    this.themeBtn = document.getElementById('themeBtn');

    this.loadTheme();
    this.renderHistory();
    this.bindEvents();
  }


  add(num) {
    if (this.waitingForNewInput) {
      this.current = '';
      this.waitingForNewInput = false;
    }
    if (num === '.' && this.current.includes('.')) return;
    this.current += num;
    this.updateDisplay();
  }

  op(sign) {
    if (this.current === '' && this.previous === '') return;
    if (this.previous !== '' && this.current !== '') this.calculate();
    else if (this.current === '' && this.previous !== '') { this.operation = sign; return; }
    this.previous = this.current;
    this.current = '';
    this.operation = sign;
    this.waitingForNewInput = false;
  }
  sqrt() {
    if (this.current === '' || this.current === '0') return;
    const num = parseFloat(this.current);
    if (num < 0) { alert("Cannot take square root of negative number!"); return; }
    const result = Math.sqrt(num);
    const rounded = Number(result.toFixed(4));
    const expr = `√${num} = ${rounded}`;
    this.current = rounded.toString();
    this.display.value = rounded;
    this.waitingForNewInput = true;
    this.addToHistory(expr);
  }

  toggleSign() {
    if (this.current === '' || this.current === '0') return;
    this.current = this.current.startsWith('-') 
      ? this.current.slice(1) 
      : '-' + this.current;
    this.updateDisplay();
  }

  calculate() {
    if (this.current === '' || this.previous === '') return;

    let a = parseFloat(this.previous);
    let b = parseFloat(this.current);
    let result = 0;
    let expr = '';

    if (this.operation === '+') { result = a + b; expr = `${a} + ${b} = ${result}`; }
    else if (this.operation === '-') { result = a - b; expr = `${a} - ${b} = ${result}`; }
    else if (this.operation === '*') { result = a * b; expr = `${a} × ${b} = ${result}`; }
    else if (this.operation === '/') {
      if (b === 0) { alert("Cannot divide by zero!"); this.clearAll(); return; }
      result = a / b; expr = `${a} ÷ ${b} = ${result}`;
    }

    const rounded = Number(result.toFixed(4));
    expr = expr.replace(result + '', rounded + '');

    this.current = rounded.toString();
    this.display.value = rounded;
    this.previous = ''; this.operation = ''; this.waitingForNewInput = true;
    this.addToHistory(expr);
  }


  backspace() {
    if (this.waitingForNewInput) { this.current = ''; this.waitingForNewInput = false; }
    if (this.current.length > 0) { this.current = this.current.slice(0, -1); this.updateDisplay(); }
  }

  clearEntry() { this.current = ''; this.updateDisplay(); }
  clearAll() { this.current = ''; this.previous = ''; this.operation = ''; this.waitingForNewInput = false; this.updateDisplay(); }

  addToHistory(expression) {
    this.history.unshift(expression);
    if (this.history.length > 10) this.history.pop();
    this.renderHistory();
  }

  renderHistory() {
    if (this.history.length === 0) {
      this.historyEl.innerHTML = '<div class="hist-item">No History</div>';
      return;
    }
    const lastFive = this.history.slice(0, 5);
    this.historyEl.innerHTML = lastFive
      .map(expr => `<div class="hist-item">${expr}</div>`)
      .join('');
  }
}

const calc = new Calculator();