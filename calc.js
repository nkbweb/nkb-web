let currentInput = '0';
let history = '';
let pendingFunction = null;
let isDegreeMode = true; 
let darkMode = false;

function updateDisplay() {
    document.getElementById('result').textContent = currentInput;
    document.getElementById('history').textContent = history;
}

function appendNumber(number) {
    if (currentInput === '0' || currentInput === 'Error') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function appendOperator(operator) {
    if (currentInput !== 'Error' && !history.includes(' ')) {
        history = currentInput + ' ' + operator;
        currentInput = '0';
        pendingFunction = null;
        updateDisplay();
    }
}

function appendFunction(func) {
    if (pendingFunction) return;  

    pendingFunction = func;
    history = func + '( )' + (isTrigFunction(func) ? ' [' + (isDegreeMode ? 'DEG' : 'RAD') + ']' : '');
    currentInput = '0';
    updateDisplay();
}

function calculate() {
    if (pendingFunction) {
        applyFunction(pendingFunction);
        pendingFunction = null;
    } else {
        try {
            currentInput = eval(history + ' ' + currentInput).toString();
            history = '';
        } catch {
            currentInput = 'Error';
        }
    }
    updateDisplay();
}

function applyFunction(func) {
    let num = parseFloat(currentInput);
    let result;

    if (isNaN(num)) {
        currentInput = 'Error';
        return;
    }

    switch (func) {
        case 'sqrt': result = Math.sqrt(num); break;
        case 'pow': result = Math.pow(num, 2); break;
        case 'sin': result = Math.sin(isDegreeMode ? num * Math.PI / 180 : num); break;
        case 'cos': result = Math.cos(isDegreeMode ? num * Math.PI / 180 : num); break;
        case 'tan': result = Math.tan(isDegreeMode ? num * Math.PI / 180 : num); break;
        case 'log': result = Math.log10(num); break;
        default: return;
    }

    currentInput = isNaN(result) ? 'Error' : result.toFixed(6);
    history = func + '(' + num + ')' + (isTrigFunction(func) ? ' [' + (isDegreeMode ? 'DEG' : 'RAD') + ']' : '');
}

function isTrigFunction(func) {
    return func === 'sin' || func === 'cos' || func === 'tan';
}

function clearAll() {
    currentInput = '0';
    history = '';  
    pendingFunction = null;
    updateDisplay();
}

function backspace() {
    currentInput = currentInput.slice(0, -1) || '0';
    updateDisplay();
}

function toggleSign() {
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
}

function toggleMode() {
    isDegreeMode = !isDegreeMode;

    if (pendingFunction && isTrigFunction(pendingFunction)) {
        history = pendingFunction + '( )' + (isDegreeMode ? ' [DEG]' : ' [RAD]');
    }

    updateDisplay();
}

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode');
}

document.addEventListener('keydown', (event) => {
    if (event.key.match(/[0-9]/)) appendNumber(event.key);
    else if (event.key.match(/[+\-*/]/)) appendOperator(event.key);
    else if (event.key === 'Enter') calculate();
    else if (event.key === 'Backspace') backspace();
});
           
