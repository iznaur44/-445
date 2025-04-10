const input = document.getElementById('inputBox');
const buttons = document.querySelectorAll('button');

const OPERATIONS = {
    sum: '+',
    subtract: '-',
    multiply: '*',
    division: '/'
};

function calculate({ a, b, operation }) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        return 'Ошибка: аргументы должны быть числами';
    }

    let result = null;

    switch (operation) {
        case OPERATIONS.sum:
            result = sum(a, b);
            break;
        case OPERATIONS.subtract:
            result = subtract(a, b);
            break;
        case OPERATIONS.multiply:
            result = multiply(a, b);
            break;
        case OPERATIONS.division:
            result = division(a, b);
            break;
        default:
            result = 'Ошибка: неизвестная операция';
    }

    return result;
}

function sum(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function division(a, b) {
    if (b === 0) return '0';
    return a / b;
}

let expression = "";

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        const value = e.target.innerText;

        if (value === 'AC') {
            expression = "";
            input.value = "";
        } else if (value === 'DEL') {
            expression = expression.slice(0, -1);
            input.value = expression;
        } else if (value === '=') {
            const parsed = parseExpression(expression);
            if (parsed) {
                const result = calculate(parsed);
                input.value = result;
                expression = result.toString();
            } else {
                input.value = 'Ошибка';
                expression = '';
            }
        } else if (value === '%') {
            if (expression.length > 0) {
                const lastNumberMatch = expression.match(/(\d+\.?\d*)$/);
                if (lastNumberMatch) {
                    const number = parseFloat(lastNumberMatch[1]);
                    const percent = number / 100;
                    expression = expression.replace(/(\d+\.?\d*)$/, percent.toString());
                    input.value = expression;
                }
            }
        } else {
            expression += value;
            input.value = expression;
        }
    });
});


function parseExpression(expr) {
    const match = expr.match(/^(\d+\.?\d*)([+\-*/])(\d+\.?\d*)$/);
    if (!match) return null;

    const a = parseFloat(match[1]);
    const operation = match[2];
    const b = parseFloat(match[3]);

    return { a, b, operation };
}
