const input = document.getElementById('inputBox');
const buttons = document.querySelectorAll('button');

let expression = "";
let justCalculated = false;

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        const value = e.target.innerText;

        if (value === 'AC') {
            expression = "";
            input.value = "";
            justCalculated = false;
        } else if (value === 'DEL') {
            expression = expression.slice(0, -1);
            input.value = expression;
        } else if (value === '=') {
            const result = safeEvaluate(expression);
            input.value = result;
            expression = typeof result === 'number' ? result.toString() : '';
            justCalculated = true;
        } else if (value === '%') {
            const lastNumberMatch = expression.match(/(\d+\.?\d*)$/);
            if (lastNumberMatch) {
                const number = parseFloat(lastNumberMatch[1]);
                const percent = number / 100;
                expression = expression.replace(/(\d+\.?\d*)$/, percent.toString());
                input.value = expression;
            }
        } else {
            if (justCalculated && /[0-9]/.test(value)) {
                expression = value;
            } else {
                expression += value;
            }
            input.value = expression;
            justCalculated = false;
        }
    });
});


function safeEvaluate(expr) {
    try {
        const tokens = [];
        let current = '';
        for (let i = 0; i < expr.length; i++) {
            const char = expr[i];
            if ('+-*/'.includes(char)) {
                if (i === 0 || '+-*/'.includes(expr[i - 1])) {
                    current += char; 
                } else {
                    tokens.push(current);
                    tokens.push(char);
                    current = '';
                }
            } else {
                current += char;
            }
        }
        if (current !== '') tokens.push(current);

        let result = parseFloat(tokens[0]);
        if (isNaN(result)) return 'Ошибка';

        for (let i = 1; i < tokens.length; i += 2) {
            const operator = tokens[i];
            const nextNum = parseFloat(tokens[i + 1]);

            if (isNaN(nextNum)) return 'Ошибка';

            switch (operator) {
                case '+': result += nextNum; break;
                case '-': result -= nextNum; break;
                case '*': result *= nextNum; break;
                case '/':
                    if (nextNum === 0) return 'Ошибка: деление на 0';
                    result /= nextNum;
                    break;
                default: return 'Ошибка: неизвестный оператор';
            }
        }

        return parseFloat(result.toFixed(6)); 
    } catch {
        return 'Ошибка';
    }
}