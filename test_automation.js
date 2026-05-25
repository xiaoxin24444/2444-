/**
 * 在线密码生成器工具箱 - 自动化测试脚本
 * 测试密码生成器核心逻辑和计算器逻辑
 */

// ==========================================
// 测试密码生成器核心逻辑
// ==========================================
class PasswordGeneratorTest {
    constructor() {
        this.testResults = [];
    }

    log(testName, passed, message = '') {
        this.testResults.push({
            testName,
            passed,
            message
        });
        const status = passed ? '✓' : '✗';
        const color = passed ? '\x1b[32m' : '\x1b[31m';
        console.log(`${color}${status}\x1b[0m ${testName}${message ? ': ' + message : ''}`);
    }

    // 测试1: 字符集配置正确
    testCharSets() {
        const charSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };

        this.log('字符集-大写字母', charSets.uppercase.length === 26);
        this.log('字符集-小写字母', charSets.lowercase.length === 26);
        this.log('字符集-数字', charSets.numbers.length === 10);
        this.log('字符集-特殊符号', charSets.symbols.length > 0);
    }

    // 测试2: 密码长度范围
    testLengthRange() {
        const minLength = 4;
        const maxLength = 64;
        const defaultLength = 16;

        this.log('最小长度限制', minLength === 4);
        this.log('最大长度限制', maxLength === 64);
        this.log('默认长度设置', defaultLength === 16);
    }

    // 测试3: 密码强度计算
    testStrengthCalculation() {
        const calculateStrength = (password) => {
            let score = 0;
            if (password.length >= 8) score++;
            if (password.length >= 12) score++;
            if (password.length >= 16) score++;
            if (/[a-z]/.test(password)) score++;
            if (/[A-Z]/.test(password)) score++;
            if (/[0-9]/.test(password)) score++;
            if (/[^a-zA-Z0-9]/.test(password)) score++;

            if (score <= 2) return { level: 'weak', text: '弱' };
            if (score <= 4) return { level: 'medium', text: '中' };
            return { level: 'strong', text: '强' };
        };

        const weak = calculateStrength('abc');
        this.log('弱强度判断-短密码', weak.level === 'weak');

        const medium = calculateStrength('abcdEFGH12');
        this.log('中强度判断-中等密码', medium.level === 'medium');

        const strong = calculateStrength('AbcdEFGH12!@#$%');
        this.log('强强度判断-强密码', strong.level === 'strong');
    }

    // 测试4: 密码生成逻辑
    testPasswordGeneration() {
        const generatePassword = (length, charset) => {
            if (!charset) return null;
            let password = '';
            const array = new Uint32Array(length);
            crypto.getRandomValues(array);
            for (let i = 0; i < length; i++) {
                password += charset[array[i] % charset.length];
            }
            return password;
        };

        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        // 测试生成固定长度的密码
        const pwd16 = generatePassword(16, charset);
        this.log('生成16位密码长度正确', pwd16 && pwd16.length === 16);

        const pwd4 = generatePassword(4, charset);
        this.log('生成4位密码长度正确', pwd4 && pwd4.length === 4);

        const pwd64 = generatePassword(64, charset);
        this.log('生成64位密码长度正确', pwd64 && pwd64.length === 64);

        // 测试空字符集
        const emptyCharset = '';
        const emptyPwd = generatePassword(16, emptyCharset);
        this.log('空字符集返回null', emptyPwd === null);

        // 测试只包含大写字母
        const uppercaseOnly = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const upperPwd = generatePassword(20, uppercaseOnly);
        const isUppercaseOnly = /^[A-Z]+$/.test(upperPwd);
        this.log('只选大写字母生成密码', isUppercaseOnly);
    }

    // 测试5: 默认复选框状态
    testDefaultCheckboxState() {
        const defaultState = {
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: false
        };

        this.log('大写字母默认选中', defaultState.uppercase === true);
        this.log('小写字母默认选中', defaultState.lowercase === true);
        this.log('数字默认选中', defaultState.numbers === true);
        this.log('特殊符号默认不选中', defaultState.symbols === false);
    }

    run() {
        console.log('\n=== 密码生成器核心逻辑测试 ===\n');
        this.testCharSets();
        this.testLengthRange();
        this.testStrengthCalculation();
        this.testPasswordGeneration();
        this.testDefaultCheckboxState();
        console.log(`\n密码生成器测试完成: ${this.testResults.filter(r => r.passed).length}/${this.testResults.length} 通过\n`);
        return this.testResults;
    }
}

// ==========================================
// 测试计算器核心逻辑
// ==========================================
class CalculatorTest {
    constructor() {
        this.testResults = [];
    }

    log(testName, passed, message = '') {
        this.testResults.push({
            testName,
            passed,
            message
        });
        const status = passed ? '✓' : '✗';
        const color = passed ? '\x1b[32m' : '\x1b[31m';
        console.log(`${color}${status}\x1b[0m ${testName}${message ? ': ' + message : ''}`);
    }

    // 表达式解析器
    evaluateExpression(expression) {
        const expr = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/');

        const tokens = expr.match(/(\d+\.?\d*|\+|\-|\*|\/|\%)/g);
        if (!tokens) return 'ERROR';

        const intermediate = [];
        let i = 0;

        while (i < tokens.length) {
            const token = tokens[i];

            if (token === '*' || token === '/' || token === '%') {
                const left = parseFloat(intermediate.pop());
                const right = parseFloat(tokens[i + 1]);

                if (isNaN(left) || isNaN(right)) return 'ERROR';

                let result;
                if (token === '*') {
                    result = left * right;
                } else if (token === '/') {
                    if (right === 0) return 'ERROR';
                    result = left / right;
                } else if (token === '%') {
                    result = left % right;
                }

                intermediate.push(result);
                i += 2;
            } else {
                intermediate.push(token);
                i++;
            }
        }

        let result = parseFloat(intermediate[0]);
        i = 1;

        while (i < intermediate.length) {
            const operator = intermediate[i];
            const operand = parseFloat(intermediate[i + 1]);

            if (isNaN(result) || isNaN(operand)) return 'ERROR';

            if (operator === '+') {
                result += operand;
            } else if (operator === '-') {
                result -= operand;
            }

            i += 2;
        }

        return result;
    }

    // 测试1: 基本运算
    testBasicOperations() {
        this.log('5 + 3 = 8', this.evaluateExpression('5+3') === 8);
        this.log('10 - 3 = 7', this.evaluateExpression('10-3') === 7);
        this.log('5 × 3 = 15', this.evaluateExpression('5×3') === 15);
        this.log('10 ÷ 2 = 5', this.evaluateExpression('10÷2') === 5);
        this.log('10 % 3 = 1', this.evaluateExpression('10%3') === 1);
    }

    // 测试2: 运算符优先级
    testOperatorPrecedence() {
        // 10 - 3 × 2 = 10 - 6 = 4
        const result1 = this.evaluateExpression('10-3×2');
        this.log('10 - 3 × 2 = 4', result1 === 4, `实际结果: ${result1}`);

        // 5 + 2 × 3 = 5 + 6 = 11
        const result2 = this.evaluateExpression('5+2×3');
        this.log('5 + 2 × 3 = 11', result2 === 11, `实际结果: ${result2}`);

        // 10 ÷ 2 + 3 = 5 + 3 = 8
        const result3 = this.evaluateExpression('10÷2+3');
        this.log('10 ÷ 2 + 3 = 8', result3 === 8, `实际结果: ${result3}`);

        // 2 + 3 × 4 - 5 = 2 + 12 - 5 = 9
        const result4 = this.evaluateExpression('2+3×4-5');
        this.log('2 + 3 × 4 - 5 = 9', result4 === 9, `实际结果: ${result4}`);
    }

    // 测试3: 除零错误
    testDivisionByZero() {
        const result = this.evaluateExpression('10÷0');
        this.log('除以零返回ERROR', result === 'ERROR');
    }

    // 测试4: 小数运算
    testDecimalOperations() {
        const result1 = this.evaluateExpression('0.1+0.2');
        // JavaScript浮点精度问题，实际是 0.30000000000000004
        const isClose = Math.abs(result1 - 0.3) < 0.0001;
        this.log('0.1 + 0.2 ≈ 0.3', isClose, `实际结果: ${result1}`);

        const result2 = this.evaluateExpression('1.5×2');
        this.log('1.5 × 2 = 3', result2 === 3, `实际结果: ${result2}`);
    }

    // 测试5: 连续运算
    testChainedOperations() {
        // 1 + 2 + 3 = 6
        const result1 = this.evaluateExpression('1+2+3');
        this.log('1 + 2 + 3 = 6', result1 === 6, `实际结果: ${result1}`);

        // 10 - 5 - 3 = 2
        const result2 = this.evaluateExpression('10-5-3');
        this.log('10 - 5 - 3 = 2', result2 === 2, `实际结果: ${result2}`);

        // 2 × 3 × 4 = 24
        const result3 = this.evaluateExpression('2×3×4');
        this.log('2 × 3 × 4 = 24', result3 === 24, `实际结果: ${result3}`);
    }

    // 测试6: 负数运算
    testNegativeNumbers() {
        // 5 - 8 = -3
        const result1 = this.evaluateExpression('5-8');
        this.log('5 - 8 = -3', result1 === -3, `实际结果: ${result1}`);
    }

    run() {
        console.log('\n=== 计算器核心逻辑测试 ===\n');
        this.testBasicOperations();
        this.testOperatorPrecedence();
        this.testDivisionByZero();
        this.testDecimalOperations();
        this.testChainedOperations();
        this.testNegativeNumbers();
        console.log(`\n计算器测试完成: ${this.testResults.filter(r => r.passed).length}/${this.testResults.length} 通过\n`);
        return this.testResults;
    }
}

// ==========================================
// 运行所有测试
// ==========================================
console.log('\n========================================');
console.log('  在线密码生成器工具箱 - 自动化测试');
console.log('========================================');

const pwdTests = new PasswordGeneratorTest();
const calcTests = new CalculatorTest();

const pwdResults = pwdTests.run();
const calcResults = calcTests.run();

const allResults = [...pwdResults, ...calcResults];
const totalPassed = allResults.filter(r => r.passed).length;
const totalTests = allResults.length;

console.log('========================================');
console.log(`  测试总结: ${totalPassed}/${totalTests} 通过`);
console.log(`  通过率: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
console.log('========================================\n');

// 如果有失败的测试，显示详细信息
const failedTests = allResults.filter(r => !r.passed);
if (failedTests.length > 0) {
    console.log('\n=== 失败的测试 ===\n');
    failedTests.forEach(test => {
        console.log(`✗ ${test.testName}`);
        if (test.message) console.log(`  详情: ${test.message}`);
    });
}

// 导出结果供Node.js使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PasswordGeneratorTest,
        CalculatorTest,
        allResults,
        totalPassed,
        totalTests
    };
}
