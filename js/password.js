class PasswordGenerator {
    constructor() {
        this.output = document.getElementById('passwordOutput');
        this.copyBtn = document.getElementById('copyBtn');
        this.slider = document.getElementById('lengthSlider');
        this.lengthValue = document.getElementById('lengthValue');
        this.generateBtn = document.getElementById('generateBtn');
        this.uppercase = document.getElementById('uppercase');
        this.lowercase = document.getElementById('lowercase');
        this.numbers = document.getElementById('numbers');
        this.symbols = document.getElementById('symbols');
        this.segments = document.querySelectorAll('.strength-segment');
        this.strengthText = document.getElementById('strengthText');
        
        this.charsets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };
        
        this.strengthLabels = { weak: '弱', medium: '中', strong: '强' };
        
        this.loadConfig();
        this.initEventListeners();
        this.generate();
    }
    
    loadConfig() {
        const config = getStorage(STORAGE_KEYS.PASSWORD_CONFIG, {
            length: 16,
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: false
        });
        
        this.slider.value = config.length;
        this.lengthValue.textContent = config.length;
        this.uppercase.checked = config.uppercase;
        this.lowercase.checked = config.lowercase;
        this.numbers.checked = config.numbers;
        this.symbols.checked = config.symbols;
    }
    
    saveConfig() {
        const config = {
            length: parseInt(this.slider.value),
            uppercase: this.uppercase.checked,
            lowercase: this.lowercase.checked,
            numbers: this.numbers.checked,
            symbols: this.symbols.checked
        };
        setStorage(STORAGE_KEYS.PASSWORD_CONFIG, config);
    }
    
    initEventListeners() {
        this.slider.addEventListener('input', () => {
            this.lengthValue.textContent = this.slider.value;
            this.saveConfig();
        });
        
        [this.uppercase, this.lowercase, this.numbers, this.symbols].forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.saveConfig();
            });
        });
        
        this.generateBtn.addEventListener('click', () => this.generate());
        this.copyBtn.addEventListener('click', () => this.copy());
    }
    
    generate() {
        const len = parseInt(this.slider.value);
        let charset = '';
        
        if (this.uppercase.checked) charset += this.charsets.uppercase;
        if (this.lowercase.checked) charset += this.charsets.lowercase;
        if (this.numbers.checked) charset += this.charsets.numbers;
        if (this.symbols.checked) charset += this.charsets.symbols;
        
        if (!charset) {
            alert('请至少选择一种字符类型');
            return;
        }
        
        let password = '';
        const array = new Uint32Array(len);
        crypto.getRandomValues(array);
        
        for (let i = 0; i < len; i++) {
            password += charset[array[i] % charset.length];
        }
        
        this.output.value = password;
        this.updateStrength(password);
        incrementPasswordGenerateCount();
    }
    
    updateStrength(pwd) {
        let score = 0;
        
        if (pwd.length >= 8) score++;
        if (pwd.length >= 12) score++;
        if (pwd.length >= 16) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^a-zA-Z0-9]/.test(pwd)) score++;
        
        const level = score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';
        const text = this.strengthLabels[level];
        
        this.segments.forEach((s, i) => {
            s.className = 'strength-segment';
            if ((level === 'weak' && i < 1) || 
                (level === 'medium' && i < 2) || 
                (level === 'strong' && i < 4)) {
                s.classList.add(level);
            }
        });
        
        this.strengthText.textContent = text;
        this.strengthText.className = `strength-text ${level}`;
    }
    
    async copy() {
        if (!this.output.value) {
            alert('请先生成密码');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(this.output.value);
            this.copyBtn.textContent = '已复制!';
            this.copyBtn.classList.add('copied');
            setTimeout(() => {
                this.copyBtn.textContent = '复制';
                this.copyBtn.classList.remove('copied');
            }, 2000);
        } catch {
            alert('复制失败');
        }
    }
}