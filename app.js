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


  toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('calculator-theme', newTheme);
    this.themeBtn.textContent = isDark ? 'Moon' : 'Sun';
  }

  loadTheme() {
    const saved = localStorage.getItem('calculator-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    this.themeBtn.textContent = saved === 'dark' ? 'Sun' : 'Moon';
  }

  updateDisplay() {
    this.display.value = this.current || '0';
  }

  bindEvents() {
    document.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const value = btn.dataset.value;
        if (action === 'add') this.add(value);
        else if (action === 'op') this.op(value);
        else if (action === 'calculate') this.calculate();
        else if (action === 'clearEntry') this.clearEntry();
        else if (action === 'clearAll') this.clearAll();
        else if (action === 'backspace') this.backspace();
        else if (action === 'sqrt') this.sqrt();
        else if (action === 'toggleSign') this.toggleSign();
        else if (action === 'toggleTheme') this.toggleTheme();
      });
    });

    document.addEventListener('keydown', (e) => {
      const key = e.key;
      if (['Enter','Escape','Backspace','+','-','*','/','s','S','t','T',' '].includes(key)) e.preventDefault();

      if (key >= '0' && key <= '9') this.add(key);
      else if (key === '.') this.add('.');
      else if (key === '+') this.op('+');
      else if (key === '-') this.op('-');
      else if (key === '*') this.op('*');
      else if (key === '/') this.op('/');
      else if (key === 'Enter') this.calculate();
      else if (key === 'Backspace') this.backspace();
      else if (key === 'Escape') this.clearAll();
      else if (key === 'c' || key === 'C') this.clearEntry();
      else if (key === 's' || key === 'S') this.sqrt();
      else if (key === 't' || key === 'T') this.toggleSign();
      else if (key === ' ') this.toggleTheme();
    });
  }
}


const calc = new Calculator();