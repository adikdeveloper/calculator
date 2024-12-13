class Calculator {
    constructor() {
        // DOM elementlarini tanlab olish
        this.display = {
            previous: document.querySelector('.previous-operation'),
            current: document.querySelector('.current-operation'),
            memory: document.querySelector('.memory-indicator')
        };

        // Kalkulyator holatini saqlash uchun o'zgaruvchilar
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.memoryValue = 0;
        this.hasMemory = false;

        // Event listener'larni qo'shish
        this.addEventListeners();
        this.addKeyboardSupport();
    }

    // Event listener'larni qo'shish
    addEventListeners() {
        // Raqam tugmalari
        document.querySelectorAll('.number').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.textContent);
            });
        });

        // Operator tugmalari
        document.querySelectorAll('.operator').forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperation(button.textContent);
            });
        });

        // Maxsus operatorlar
        document.querySelectorAll('.advanced-operator').forEach(button => {
            button.addEventListener('click', () => {
                this.handleAdvancedOperation(button.textContent);
            });
        });

        // Xotira tugmalari
        document.querySelector('.mc').addEventListener('click', () => this.memoryClear());
        document.querySelector('.mr').addEventListener('click', () => this.memoryRecall());
        document.querySelector('.m-plus').addEventListener('click', () => this.memoryAdd());
        document.querySelector('.m-minus').addEventListener('click', () => this.memorySubtract());

        // Boshqaruv tugmalari
        document.querySelector('.clear').addEventListener('click', () => this.clear());
        document.querySelector('.delete').addEventListener('click', () => this.delete());
        document.querySelector('.equals').addEventListener('click', () => this.calculate());
    }

    // Klaviatura bilan kiritishni qo'shish
    addKeyboardSupport() {
        document.addEventListener('keydown', (event) => {
            // Raqamlar va nuqta
            if (/[0-9.]/.test(event.key)) {
                event.preventDefault();
                this.appendNumber(event.key);
            }
            // Operatorlar
            else if (['+', '-', '*', '/', '%'].includes(event.key)) {
                event.preventDefault();
                const operatorMap = {
                    '*': '×',
                    '/': '÷'
                };
                this.chooseOperation(operatorMap[event.key] || event.key);
            }
            // Enter va =
            else if (event.key === 'Enter' || event.key === '=') {
                event.preventDefault();
                this.calculate();
            }
            // Backspace
            else if (event.key === 'Backspace') {
                event.preventDefault();
                this.delete();
            }
            // Escape
            else if (event.key === 'Escape') {
                event.preventDefault();
                this.clear();
            }
        });
    }

    // Qolgan metodlar o'zgarishsiz qoladi...

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand.length >= 12) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    handleAdvancedOperation(operation) {
        const number = parseFloat(this.currentOperand);
        let result;

        switch(operation) {
            case 'x²':
                result = Math.pow(number, 2);
                break;
            case 'x³':
                result = Math.pow(number, 3);
                break;
            case '√':
                if (number < 0) {
                    this.showError();
                    return;
                }
                result = Math.sqrt(number);
                break;
            case '∛':
                result = Math.cbrt(number);
                break;
        }

        this.currentOperand = this.formatNumber(result);
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.showError();
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = (prev * current) / 100;
                break;
            default:
                return;
        }

        this.currentOperand = this.formatNumber(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    memoryClear() {
        this.memoryValue = 0;
        this.hasMemory = false;
        this.updateMemoryDisplay();
    }

    memoryRecall() {
        if (this.hasMemory) {
            this.currentOperand = this.formatNumber(this.memoryValue);
            this.updateDisplay();
        }
    }

    memoryAdd() {
        this.memoryValue += parseFloat(this.currentOperand) || 0;
        this.hasMemory = true;
        this.updateMemoryDisplay();
    }

    memorySubtract() {
        this.memoryValue -= parseFloat(this.currentOperand) || 0;
        this.hasMemory = true;
        this.updateMemoryDisplay();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === 'Xato') {
            this.clear();
            return;
        }
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        this.updateDisplay();
    }

    showError() {
        this.currentOperand = 'Xato';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    formatNumber(number) {
        if (isNaN(number)) return 'Xato';
        let stringNumber = number.toString();
        if (stringNumber.length > 12) {
            if (number > 999999999999) {
                return number.toExponential(6);
            }
            stringNumber = stringNumber.slice(0, 12);
        }
        return stringNumber;
    }

    updateDisplay() {
        this.display.current.textContent = this.currentOperand;
        if (this.operation != null) {
            this.display.previous.textContent = `${this.previousOperand} ${this.operation}`;
        } else {
            this.display.previous.textContent = '';
        }
    }

    updateMemoryDisplay() {
        this.display.memory.textContent = this.hasMemory ? 'M' : '';
    }
}

// Kalkulyatorni ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
});
