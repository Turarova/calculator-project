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