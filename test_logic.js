// 计算器功能测试脚本
console.log('🧮 计算器功能测试\n');

// 测试表达式解析器
function evaluateExpression(expression) {
    const expr = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/');
    
    const tokens = expr.match(/(\d+\.?\d*|\+|\-|\*|\/|\%)/g);
    
    if (!tokens) return 'ERROR';
    
    // 第一遍：处理乘、除、模运算
    const intermediate = [];
    let i = 0;
    
    while (i < tokens.length) {
        const token = tokens[i];
        
        if (token === '*' || token === '/' || token === '%') {
            const left = parseFloat(intermediate.pop());
            const right = parseFloat(tokens[i + 1]);
            
            if (isNaN(left) || isNaN(right)) return 'ERROR';
            
            let result;
            if (token === '*') result = left * right;
            else if (token === '/') {
                if (right === 0) return 'ERROR';
                result = left / right;
            }
            else if (token === '%') result = left % right;
            
            intermediate.push(result);
            i += 2;
        } else {
            intermediate.push(token);
            i++;
        }
    }
    
    // 第二遍：处理加、减运算
    let result = parseFloat(intermediate[0]);
    i = 1;
    
    while (i < intermediate.length) {
        const operator = intermediate[i];
        const operand = parseFloat(intermediate[i + 1]);
        
        if (isNaN(result) || isNaN(operand)) return 'ERROR';
        
        if (operator === '+') result += operand;
        else if (operator === '-') result -= operand;
        
        i += 2;
    }
    
    return result;
}

// 测试用例
const tests = [
    // 基础运算
    { expr: '5+3', expected: 8, name: '加法: 5+3' },
    { expr: '10-3', expected: 7, name: '减法: 10-3' },
    { expr: '7×6', expected: 42, name: '乘法: 7×6' },
    { expr: '20÷4', expected: 5, name: '除法: 20÷4' },
    
    // 运算符优先级
    { expr: '10-3×2', expected: 4, name: '优先级: 10-3×2 (先乘后减)' },
    { expr: '5+6÷3', expected: 7, name: '优先级: 5+6÷3 (先除后加)' },
    { expr: '8÷2×4', expected: 16, name: '优先级: 8÷2×4 (从左到右)' },
    { expr: '2+3×4-5', expected: 9, name: '优先级: 2+3×4-5 (先乘后加减)' },
    { expr: '10-5+3', expected: 8, name: '同优先级: 10-5+3 (从左到右)' },
    { expr: '2×3×4', expected: 24, name: '同优先级: 2×3×4 (从左到右)' },
    
    // 小数运算
    { expr: '0.5+0.3', expected: 0.8, name: '小数: 0.5+0.3' },
    { expr: '1.5×4', expected: 6, name: '小数: 1.5×4' },
    { expr: '10÷4', expected: 2.5, name: '小数: 10÷4' },
    { expr: '3.14×2', expected: 6.28, name: '小数: 3.14×2' },
    
    // 错误处理
    { expr: '5÷0', expected: 'ERROR', name: '错误: 5÷0 (除以零)' },
];

// 运行测试
console.log('开始测试...\n');
let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
    const result = evaluateExpression(test.expr);
    const isPass = result === test.expected;
    
    if (isPass) {
        passed++;
        console.log(`✅ 通过: ${test.name}`);
        console.log(`   结果: ${test.expr} = ${result}\n`);
    } else {
        failed++;
        console.log(`❌ 失败: ${test.name}`);
        console.log(`   预期: ${test.expected}`);
        console.log(`   实际: ${result}\n`);
    }
});

// 统计
console.log('=' .repeat(50));
console.log(`测试完成: ${passed} 通过, ${failed} 失败`);
console.log('=' .repeat(50));

if (failed === 0) {
    console.log('\n🎉 所有测试通过！计算器功能正常。\n');
} else {
    console.log(`\n⚠️  有 ${failed} 个测试失败，请检查代码。\n`);
}
