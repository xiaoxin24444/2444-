/* ===================================
   在线密码生成器工具箱 - JavaScript
   实现导航系统和工具数据隔离
   =================================== */

// ==========================================
// 工具状态管理 - 数据隔离机制
// 每个工具维护独立的状态对象
// ==========================================
const ToolStates = {
    // 密码生成器状态
    passwordGenerator: {
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false,
        currentPassword: '',
        history: [],              // 密码历史记录（最多50条）
        maxHistory: 50
    },
    
    // 计算器状态
    calculator: {
        currentValue: '0',
        previousValue: null,
        operator: null,
        shouldResetDisplay: false,
        expression: '',           // 当前表达式显示
        history: []              // 计算历史（最多5条）
    }
};

// ==========================================
// 导航系统实现
// ==========================================
class NavigationManager {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.toolPanels = document.querySelectorAll('.tool-panel');
        this.currentTool = 'password-generator';
        
        this.init();
    }
    
    init() {
        // 绑定标签点击事件
        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const toolName = e.target.dataset.tool;
                this.switchTool(toolName);
            });
        });
        
        // 初始化时显示默认工具
        this.showTool(this.currentTool);
    }
    
    switchTool(toolName) {
        if (toolName === this.currentTool) return;
        
        // 更新标签按钮状态
        this.tabButtons.forEach(btn => {
            if (btn.dataset.tool === toolName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // 切换工具面板
        this.showTool(toolName);
        
        // 更新当前工具标识
        this.currentTool = toolName;
    }
    
    showTool(toolName) {
        // 隐藏所有工具面板
        this.toolPanels.forEach(panel => {
            panel.classList.remove('active');
        });
        
        // 显示目标工具面板
        const targetPanel = document.getElementById(toolName);
        if (targetPanel) {
            targetPanel.classList.add('active');
            
            // 触发动画
            targetPanel.classList.remove('fade-in');
            // 强制重绘
            void targetPanel.offsetWidth;
            targetPanel.classList.add('fade-in');
        }
    }
}

// ==========================================
// 密码生成器工具实现
// ==========================================
class PasswordGenerator {
    constructor() {
        // DOM 元素引用
        this.passwordOutput = document.getElementById('passwordOutput');
        this.copyBtn = document.getElementById('copyBtn');
        this.lengthSlider = document.getElementById('lengthSlider');
        this.lengthValue = document.getElementById('lengthValue');
        this.generateBtn = document.getElementById('generateBtn');
        this.uppercaseCheckbox = document.getElementById('uppercase');
        this.lowercaseCheckbox = document.getElementById('lowercase');
        this.numbersCheckbox = document.getElementById('numbers');
        this.symbolsCheckbox = document.getElementById('symbols');
        this.strengthSegments = document.querySelectorAll('.strength-segment');
        this.strengthText = document.getElementById('strengthText');
        this.exportBtn = document.getElementById('exportBtn');
        this.historyList = document.getElementById('historyList');
        
        // 字符集配置
        this.CHAR_SETS = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };
        
        this.init();
    }
    
    init() {
        // 从状态对象恢复数据
        const state = ToolStates.passwordGenerator;
        this.lengthSlider.value = state.length;
        this.lengthValue.textContent = state.length;
        this.uppercaseCheckbox.checked = state.uppercase;
        this.lowercaseCheckbox.checked = state.lowercase;
        this.numbersCheckbox.checked = state.numbers;
        this.symbolsCheckbox.checked = state.symbols;
        
        // 绑定事件监听器
        this.bindEvents();
        
        // 渲染历史记录
        this.renderHistory();
        
        // 初始化时生成一个密码
        if (!state.currentPassword) {
            this.generate();
        } else {
            this.passwordOutput.value = state.currentPassword;
            this.updateStrength(state.currentPassword);
        }
    }
    
    bindEvents() {
        // 长度滑块
        this.lengthSlider.addEventListener('input', (e) => {
            this.lengthValue.textContent = e.target.value;
            ToolStates.passwordGenerator.length = parseInt(e.target.value);
        });
        
        // 字符类型复选框
        this.uppercaseCheckbox.addEventListener('change', () => {
            ToolStates.passwordGenerator.uppercase = this.uppercaseCheckbox.checked;
        });
        
        this.lowercaseCheckbox.addEventListener('change', () => {
            ToolStates.passwordGenerator.lowercase = this.lowercaseCheckbox.checked;
        });
        
        this.numbersCheckbox.addEventListener('change', () => {
            ToolStates.passwordGenerator.numbers = this.numbersCheckbox.checked;
        });
        
        this.symbolsCheckbox.addEventListener('change', () => {
            ToolStates.passwordGenerator.symbols = this.symbolsCheckbox.checked;
        });
        
        // 生成按钮
        this.generateBtn.addEventListener('click', () => this.generate());
        
        // 复制按钮
        this.copyBtn.addEventListener('click', () => this.copy());
        
        // 导出按钮
        this.exportBtn.addEventListener('click', () => this.exportToJSON());
    }
    
    getCharacterSet() {
        let charset = '';
        if (this.uppercaseCheckbox.checked) charset += this.CHAR_SETS.uppercase;
        if (this.lowercaseCheckbox.checked) charset += this.CHAR_SETS.lowercase;
        if (this.numbersCheckbox.checked) charset += this.CHAR_SETS.numbers;
        if (this.symbolsCheckbox.checked) charset += this.CHAR_SETS.symbols;
        return charset;
    }
    
    generate() {
        const length = parseInt(this.lengthSlider.value);
        const charset = this.getCharacterSet();
        
        if (!charset) {
            this.showToast('请至少选择一种字符类型', true);
            return;
        }
        
        // 使用加密随机数生成
        let password = '';
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        
        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }
        
        // 保存到状态对象
        ToolStates.passwordGenerator.currentPassword = password;
        
        // 添加淡入效果
        this.passwordOutput.classList.remove('fade-in');
        void this.passwordOutput.offsetWidth; // 强制重绘
        this.passwordOutput.value = password;
        this.passwordOutput.classList.add('fade-in');
        
        this.updateStrength(password);
        
        // 添加到历史记录
        this.addToHistory(password, length);
    }
    
    calculateStrength(password) {
        let score = 0;
        
        // 长度评分
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (password.length >= 16) score++;
        
        // 字符类型评分
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        
        // 强度分类
        if (score <= 2) return { level: 'weak', text: '弱' };
        if (score <= 4) return { level: 'medium', text: '中' };
        return { level: 'strong', text: '强' };
    }
    
    updateStrength(password) {
        const { level, text } = this.calculateStrength(password);
        
        // 更新强度条
        this.strengthSegments.forEach((segment, index) => {
            segment.className = 'strength-segment';
            if (level === 'weak' && index < 1) {
                segment.classList.add('weak');
            } else if (level === 'medium' && index < 2) {
                segment.classList.add('medium');
            } else if (level === 'strong' && index < 4) {
                segment.classList.add('strong');
            }
        });
        
        // 更新强度文本
        this.strengthText.textContent = text;
        this.strengthText.className = `strength-text ${level}`;
    }
    
    async copy() {
        if (!this.passwordOutput.value) {
            this.showToast('请先生成密码', true);
            return;
        }
        
        try {
            await navigator.clipboard.writeText(this.passwordOutput.value);
            
            // 添加复制成功视觉反馈
            this.copyBtn.textContent = '已复制';
            this.copyBtn.classList.add('copied');
            
            // 显示成功 Toast
            this.showToast('密码已复制到剪贴板', false, 'success');
            
            // 2秒后恢复原状
            setTimeout(() => {
                this.copyBtn.textContent = '复制';
                this.copyBtn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            this.showToast('复制失败，请手动复制', true);
        }
    }
    
    showToast(message, isError = false, type = 'success') {
        const toast = document.getElementById('toast');
        
        // 设置消息内容和类型
        toast.textContent = message;
        
        // 移除之前的类型类
        toast.classList.remove('success', 'error', 'info');
        
        // 根据类型设置样式
        if (isError) {
            toast.classList.add('error');
        } else if (type !== 'success') {
            toast.classList.add(type);
        } else {
            toast.classList.add('success');
        }
        
        // 显示 Toast
        toast.classList.remove('fade-out');
        toast.classList.add('show');
        
        // 2秒后自动隐藏（带淡出效果）
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.classList.remove('show', 'fade-out');
            }, 300);
        }, 2000);
    }
    
    /**
     * 添加密码到历史记录
     * @param {string} password - 生成的密码
     * @param {number} length - 密码长度
     */
    addToHistory(password, length) {
        const state = ToolStates.passwordGenerator;
        
        // 计算密码强度
        const { level } = this.calculateStrength(password);
        
        // 创建历史记录项
        const historyItem = {
            password: password,
            length: length,
            timestamp: new Date().toISOString(),
            strength: level
        };
        
        // 添加到历史数组开头
        state.history.unshift(historyItem);
        
        // 只保留最多50条
        if (state.history.length > state.maxHistory) {
            state.history.pop();
        }
        
        // 渲染历史记录
        this.renderHistory();
    }
    
    /**
     * 渲染历史记录列表
     */
    renderHistory() {
        const state = ToolStates.passwordGenerator;
        
        if (state.history.length === 0) {
            this.historyList.innerHTML = '<div class="history-empty">暂无历史记录</div>';
            return;
        }
        
        // 只显示最近10条
        const recentHistory = state.history.slice(0, 10);
        
        this.historyList.innerHTML = recentHistory.map((item, index) => {
            // 部分隐藏密码，只显示前3位和后3位
            const maskedPassword = item.password.length > 6 
                ? item.password.substring(0, 3) + '***' + item.password.substring(item.password.length - 3)
                : item.password.substring(0, 2) + '***';
            
            // 格式化时间
            const date = new Date(item.timestamp);
            const timeStr = date.toLocaleString('zh-CN', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // 强度标签
            const strengthLabel = {
                weak: '弱',
                medium: '中',
                strong: '强'
            };
            
            return `
                <div class="history-item" data-index="${index}">
                    <div class="history-password">${maskedPassword}</div>
                    <div class="history-meta">
                        <span class="history-strength ${item.strength}">${strengthLabel[item.strength]}</span>
                        <span class="history-time">${timeStr}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    /**
     * 导出历史记录为 JSON 文件
     */
    exportToJSON() {
        const state = ToolStates.passwordGenerator;
        
        if (state.history.length === 0) {
            this.showToast('暂无历史记录可导出', true);
            return;
        }
        
        // 准备导出数据
        const exportData = {
            exportDate: new Date().toISOString(),
            totalCount: state.history.length,
            passwords: state.history
        };
        
        // 创建 Blob 对象
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `passwords_${Date.now()}.json`;
        
        // 触发下载
        document.body.appendChild(a);
        a.click();
        
        // 清理
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast(`已导出 ${state.history.length} 条密码记录`, false, 'success');
    }
}

// ==========================================
// 计算器工具实现
// ==========================================
class Calculator {
    constructor() {
        // DOM 元素引用
        this.display = document.getElementById('calcDisplay');
        
        // 添加历史记录容器
        this.createHistoryContainer();
        
        // 绑定事件监听器
        this.bindEvents();
        
        // 从状态对象恢复数据
        this.updateDisplay();
        this.renderHistory();
        
        // 绑定键盘事件
        this.bindKeyboardEvents();
    }
    
    createHistoryContainer() {
        // 在计算器容器后添加历史记录区域
        const calcContainer = document.querySelector('.calculator');
        if (!document.querySelector('.calc-history')) {
            const historyContainer = document.createElement('div');
            historyContainer.className = 'calc-history';
            historyContainer.innerHTML = `
                <div class="history-header">
                    <span>计算历史</span>
                    <button class="history-clear" data-action="clear-history">清除历史</button>
                </div>
                <div class="history-list"></div>
            `;
            calcContainer.parentNode.insertBefore(historyContainer, calcContainer.nextSibling);
            
            // 绑定清除历史按钮事件
            const clearHistoryBtn = historyContainer.querySelector('.history-clear');
            clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        }
    }
    
    bindEvents() {
        // 获取所有计算器按钮
        const buttons = document.querySelectorAll('.calc-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                const value = button.dataset.value;
                
                switch(action) {
                    case 'number':
                        this.inputNumber(value);
                        break;
                    case 'operator':
                        this.inputOperator(value);
                        break;
                    case 'decimal':
                        this.inputDecimal();
                        break;
                    case 'equals':
                        this.calculate();
                        break;
                    case 'clear':
                        this.clear();
                        break;
                    case 'backspace':
                        this.backspace();
                        break;
                }
            });
        });
    }
    
    bindKeyboardEvents() {
        // 绑定键盘事件
        document.addEventListener('keydown', (e) => {
            // 仅在计算器激活时响应键盘输入
            if (!document.getElementById('calculator').classList.contains('active')) {
                return;
            }
            
            const key = e.key;
            
            // 数字键 0-9
            if (/^[0-9]$/.test(key)) {
                e.preventDefault();
                this.inputNumber(key);
            }
            // 运算符键
            else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
                e.preventDefault();
                // 将键盘符号转换为显示符号
                const displayMap = {
                    '*': '×',
                    '/': '÷'
                };
                this.inputOperator(key, displayMap[key] || key);
            }
            // 小数点
            else if (key === '.') {
                e.preventDefault();
                this.inputDecimal();
            }
            // 回车键计算
            else if (key === 'Enter') {
                e.preventDefault();
                this.calculate();
            }
            // 退格键
            else if (key === 'Backspace') {
                e.preventDefault();
                this.backspace();
            }
            // Esc 键清除
            else if (key === 'Escape') {
                e.preventDefault();
                this.clear();
            }
        });
    }
    
    updateDisplay() {
        const state = ToolStates.calculator;
        
        // 显示表达式和当前值
        if (state.expression) {
            this.display.value = state.expression + state.currentValue;
        } else {
            this.display.value = state.currentValue;
        }
    }
    
    inputNumber(value) {
        const state = ToolStates.calculator;
        
        // 如果应该重置显示（刚完成计算或首次输入）
        if (state.shouldResetDisplay) {
            state.currentValue = value;
            state.shouldResetDisplay = false;
        } else {
            // 防止超过15位
            if (state.currentValue.replace('.', '').length < 15) {
                if (state.currentValue === '0' && value !== '0') {
                    state.currentValue = value;
                } else if (state.currentValue !== '0') {
                    state.currentValue += value;
                }
            }
        }
        
        this.updateDisplay();
    }
    
    inputOperator(operator, displayOperator = null) {
        const state = ToolStates.calculator;
        
        // 构建表达式
        const displayOp = displayOperator || operator;
        if (state.shouldResetDisplay && state.expression) {
            // 如果刚完成计算，用户又按了运算符，替换最后一个运算符
            state.expression = state.expression.replace(/[+\-×÷%]$/, displayOp);
        } else {
            state.expression += state.currentValue + displayOp;
        }
        
        // 如果有正在等待的操作，先计算
        if (state.operator && !state.shouldResetDisplay) {
            const result = this.performCalculation(
                parseFloat(state.previousValue),
                parseFloat(state.currentValue),
                state.operator
            );
            
            if (result === 'ERROR') {
                this.clear();
                this.display.value = '错误';
                return;
            }
            
            state.currentValue = result.toString();
        }
        
        state.previousValue = parseFloat(state.currentValue);
        state.operator = operator;
        state.shouldResetDisplay = true;
        
        this.updateDisplay();
    }
    
    inputDecimal() {
        const state = ToolStates.calculator;
        
        if (state.shouldResetDisplay) {
            state.currentValue = '0.';
            state.shouldResetDisplay = false;
        } else if (!state.currentValue.includes('.')) {
            state.currentValue += '.';
        }
        
        this.updateDisplay();
    }
    
    performCalculation(a, b, operator) {
        let result;
        
        switch(operator) {
            case '+':
                result = a + b;
                break;
            case '-':
                result = a - b;
                break;
            case '*':
                result = a * b;
                break;
            case '/':
                if (b === 0) {
                    return 'ERROR';
                }
                result = a / b;
                break;
            case '%':
                result = a % b;
                break;
            default:
                return b;
        }
        
        return result;
    }
    
    calculate() {
        const state = ToolStates.calculator;
        
        if (state.operator === null || state.previousValue === null) {
            return;
        }
        
        const currentValue = parseFloat(state.currentValue);
        const expression = state.expression + state.currentValue;
        
        // 使用表达式解析器进行计算（支持运算符优先级）
        let result;
        try {
            result = this.evaluateExpression(expression);
        } catch (error) {
            this.clear();
            this.display.value = '错误';
            return;
        }
        
        // 检查是否为错误结果
        if (result === 'ERROR') {
            this.clear();
            this.display.value = '错误';
            return;
        }
        
        // 处理结果精度问题
        result = Math.round(result * 1000000000000) / 1000000000000;
        
        // 转换为字符串并限制长度
        let resultStr = result.toString();
        if (resultStr.length > 15) {
            resultStr = result.toExponential(6);
        }
        
        // 添加到历史记录
        this.addToHistory(expression, resultStr);
        
        state.currentValue = resultStr;
        state.previousValue = null;
        state.operator = null;
        state.expression = '';
        state.shouldResetDisplay = true;
        
        this.updateDisplay();
    }
    
    /**
     * 表达式解析器 - 支持运算符优先级
     * 实现原理：将表达式分割为数字和运算符数组，
     * 先处理乘除模运算，再处理加减运算
     */
    evaluateExpression(expression) {
        // 将显示符号转换回运算符
        const expr = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/');
        
        // 分割表达式为 tokens（数字和运算符）
        const tokens = expr.match(/(\d+\.?\d*|\+|\-|\*|\/|\%)/g);
        
        if (!tokens) {
            return 'ERROR';
        }
        
        // 第一遍：处理乘、除、模运算
        const intermediate = [];
        let i = 0;
        
        while (i < tokens.length) {
            const token = tokens[i];
            
            if (token === '*' || token === '/' || token === '%') {
                // 获取前一个操作数
                const left = parseFloat(intermediate.pop());
                const right = parseFloat(tokens[i + 1]);
                
                if (isNaN(left) || isNaN(right)) {
                    return 'ERROR';
                }
                
                let result;
                if (token === '*') {
                    result = left * right;
                } else if (token === '/') {
                    if (right === 0) {
                        return 'ERROR';
                    }
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
        
        // 第二遍：处理加、减运算
        let result = parseFloat(intermediate[0]);
        i = 1;
        
        while (i < intermediate.length) {
            const operator = intermediate[i];
            const operand = parseFloat(intermediate[i + 1]);
            
            if (isNaN(result) || isNaN(operand)) {
                return 'ERROR';
            }
            
            if (operator === '+') {
                result += operand;
            } else if (operator === '-') {
                result -= operand;
            }
            
            i += 2;
        }
        
        return result;
    }
    
    clear() {
        const state = ToolStates.calculator;
        state.currentValue = '0';
        state.previousValue = null;
        state.operator = null;
        state.expression = '';
        state.shouldResetDisplay = false;
        this.updateDisplay();
    }
    
    backspace() {
        const state = ToolStates.calculator;
        
        // 如果当前是表达式状态
        if (state.expression) {
            // 删除 currentValue 的最后一位
            if (state.currentValue.length > 1) {
                state.currentValue = state.currentValue.slice(0, -1);
            } else {
                state.currentValue = '0';
            }
        } else {
            // 正常删除
            if (state.currentValue.length > 1) {
                state.currentValue = state.currentValue.slice(0, -1);
            } else {
                state.currentValue = '0';
            }
        }
        
        this.updateDisplay();
    }
    
    addToHistory(expression, result) {
        const state = ToolStates.calculator;
        
        // 创建历史记录项
        const historyItem = {
            expression: expression,
            result: result,
            timestamp: Date.now()
        };
        
        // 添加到历史数组开头
        state.history.unshift(historyItem);
        
        // 只保留最近5条
        if (state.history.length > 5) {
            state.history.pop();
        }
        
        // 渲染历史记录
        this.renderHistory();
    }
    
    renderHistory() {
        const state = ToolStates.calculator;
        const historyList = document.querySelector('.history-list');
        
        if (!historyList) return;
        
        if (state.history.length === 0) {
            historyList.innerHTML = '<div class="history-empty">暂无历史记录</div>';
            return;
        }
        
        historyList.innerHTML = state.history.map((item, index) => `
            <div class="history-item" data-index="${index}">
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${item.result}</div>
            </div>
        `).join('');
        
        // 绑定点击事件，恢复历史表达式
        const historyItems = historyList.querySelectorAll('.history-item');
        historyItems.forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.restoreFromHistory(index);
            });
        });
    }
    
    restoreFromHistory(index) {
        const state = ToolStates.calculator;
        const item = state.history[index];
        
        if (!item) return;
        
        // 解析历史表达式
        const expr = item.expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/');
        
        const tokens = expr.match(/(\d+\.?\d*|\+|\-|\*|\/|\%)/g);
        
        if (!tokens || tokens.length < 3) return;
        
        // 提取最后一个数字作为当前值
        state.currentValue = tokens[tokens.length - 1];
        
        // 提取运算符（如果有）
        if (tokens.length >= 3) {
            state.operator = tokens[tokens.length - 2];
            state.previousValue = parseFloat(tokens[tokens.length - 3]);
            state.expression = tokens.slice(0, -2).join('').replace(/\*/g, '×').replace(/\//g, '÷');
            state.shouldResetDisplay = true;
        } else {
            state.expression = '';
            state.shouldResetDisplay = false;
        }
        
        this.updateDisplay();
    }
    
    clearHistory() {
        const state = ToolStates.calculator;
        state.history = [];
        this.renderHistory();
    }
}

// ==========================================
// 初始化应用程序
// ==========================================
let navigationManager;
let passwordGenerator;
let calculator;

document.addEventListener('DOMContentLoaded', () => {
    // 初始化导航系统
    navigationManager = new NavigationManager();
    
    // 初始化密码生成器
    passwordGenerator = new PasswordGenerator();
    
    // 初始化计算器
    calculator = new Calculator();
    
    console.log('应用初始化完成');
});

// ==========================================
// 工具函数
// ==========================================

// 全局 Toast 通知函数
function showToast(message, isError = false, type = 'success') {
    const toast = document.getElementById('toast');
    
    if (!toast) {
        console.error('Toast 元素不存在');
        return;
    }
    
    // 设置消息内容和类型
    toast.textContent = message;
    
    // 移除之前的类型类
    toast.classList.remove('success', 'error', 'info', 'fade-out');
    
    // 根据类型设置样式
    if (isError) {
        toast.classList.add('error');
    } else if (type !== 'success') {
        toast.classList.add(type);
    } else {
        toast.classList.add('success');
    }
    
    // 显示 Toast
    toast.classList.add('show');
    
    // 2秒后自动隐藏（带淡出效果）
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.classList.remove('show', 'fade-out');
        }, 300);
    }, 2000);
}

// 防抖函数（备用）
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数（备用）
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================
// 密码生成器键盘快捷键
// ==========================================
document.addEventListener('keydown', function(e) {
    // 检查当前工具是否为密码生成器
    if (!document.getElementById('password-generator').classList.contains('active')) {
        return;
    }
    
    // Ctrl+G: 生成密码
    if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        passwordGenerator.generate();
        return;
    }
    
    // Ctrl+Shift+C: 复制密码（避免覆盖原生 Ctrl+C）
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        passwordGenerator.copy();
        return;
    }
    
    // Escape: 关闭 Toast
    if (e.key === 'Escape') {
        const toast = document.getElementById('toast');
        if (toast.classList.contains('show')) {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.classList.remove('show', 'fade-out');
            }, 300);
        }
    }
});
