let runningTotal = 0;
let buffer = "0";
let previousOperator = null;

const screen = document.getElementById('screen');

function buttonClick(value) {
    if (isNaN(parseInt(value)) === false) {
        handleNumber(value);
    } else {
        handleSymbol(value);
    }
    screen.innerText = buffer;
}

function handleNumber(numberString) {
    if (buffer === '0' || buffer === 'Error') {
        buffer = numberString;
    } else {
        buffer += numberString;
    }
}

function handleSymbol(symbol) {
    switch (symbol) {
        case 'c':
            buffer = '0';
            runningTotal = 0;
            previousOperator = null;
            break;
        case 'back':
            if (buffer.length === 1) {
                buffer = '0';
            } else {
                buffer = buffer.substring(0, buffer.length - 1);
            }
            break;
        case '.':
            if (!buffer.includes('.')) {
                buffer += '.';
            }
            break;
        case '=':
            if (previousOperator === null) {
                return;
            }
            flushOperator(parseFloat(buffer));
            previousOperator = null;
            buffer = `${runningTotal}`;
            runningTotal = 0;
            break;
        case '+':
        case '-':
        case '*':
        case '/':
            handleMath(symbol);
            break;
    }
}

function handleMath(symbol) {
    if (buffer === 'Error') return;

    if (previousOperator !== null) {
        flushOperator(parseFloat(buffer));
    } else {
        runningTotal = parseFloat(buffer);
    }
    previousOperator = symbol;
    buffer = '0';
}

function flushOperator(intBuffer) {
    if (previousOperator === '+') {
        runningTotal += intBuffer;
    } else if (previousOperator === '-') {
        runningTotal -= intBuffer;
    } else if (previousOperator === '*') {
        runningTotal *= intBuffer;
    } else if (previousOperator === '/') {
        if (intBuffer === 0) {
            runningTotal = 'Error';
            buffer = 'Error';
            return;
        }
        runningTotal /= intBuffer;
    }
    runningTotal = trimResult(runningTotal);
}

function trimResult(num) {
    if (typeof num !== 'number' || !isFinite(num)) return num;
    let str = num.toString();
    if (str.length > 10) {
        return parseFloat(num.toPrecision(8));
    }
    return num;
}

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') buttonClick(e.key);
    else if (e.key === '.') buttonClick('.');
    else if (['+', '-', '*', '/'].includes(e.key)) buttonClick(e.key);
    else if (e.key === 'Enter' || e.key === '=') buttonClick('=');
    else if (e.key === 'Backspace') buttonClick('back');
    else if (e.key === 'Escape') buttonClick('c');
});