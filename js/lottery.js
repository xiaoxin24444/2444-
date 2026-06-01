class Lottery {
    constructor() {
        this.nameInput = document.getElementById('lotteryName');
        this.addBtn = document.getElementById('addLotteryBtn');
        this.lotteryList = document.getElementById('lotteryList');
        this.drawBtn = document.getElementById('drawBtn');
        this.resultDisplay = document.getElementById('lotteryResult');
        this.winnerName = document.getElementById('winnerName');
        
        this.participants = [];
        this.isDrawing = false;
        
        this.loadParticipants();
        this.initEventListeners();
        this.render();
    }
    
    loadParticipants() {
        const config = getStorage(STORAGE_KEYS.LOTTERY_CONFIG, { participants: [] });
        this.participants = config.participants;
    }
    
    saveParticipants() {
        setStorage(STORAGE_KEYS.LOTTERY_CONFIG, { participants: this.participants });
    }
    
    initEventListeners() {
        this.addBtn.addEventListener('click', () => this.addParticipant());
        this.nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addParticipant();
        });
        
        this.drawBtn.addEventListener('click', () => this.draw());
    }
    
    addParticipant() {
        const name = this.nameInput.value.trim();
        if (!name) return;
        if (this.participants.includes(name)) {
            alert('该名称已存在');
            return;
        }
        
        this.participants.push(name);
        this.nameInput.value = '';
        this.saveParticipants();
        this.render();
    }
    
    removeParticipant(index) {
        this.participants.splice(index, 1);
        this.saveParticipants();
        this.render();
    }
    
    async draw() {
        if (this.participants.length < 2) {
            alert('请至少添加2个参与者');
            return;
        }
        
        if (this.isDrawing) return;
        
        this.isDrawing = true;
        this.drawBtn.disabled = true;
        this.resultDisplay.style.display = 'block';
        
        let iterations = 0;
        const maxIterations = 20;
        
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * this.participants.length);
                this.winnerName.textContent = this.participants[randomIndex];
                this.winnerName.style.animation = 'none';
                setTimeout(() => {
                    this.winnerName.style.animation = 'pulse 0.3s ease-in-out';
                }, 10);
                
                iterations++;
                if (iterations >= maxIterations) {
                    clearInterval(interval);
                    this.isDrawing = false;
                    this.drawBtn.disabled = false;
                    
                    const finalWinner = this.participants[Math.floor(Math.random() * this.participants.length)];
                    this.winnerName.textContent = finalWinner;
                    this.winnerName.classList.add('winner');
                    
                    setTimeout(() => {
                        this.winnerName.classList.remove('winner');
                    }, 2000);
                    
                    incrementLotteryDrawCount();
                    resolve(finalWinner);
                }
            }, 100);
        });
    }
    
    render() {
        this.lotteryList.innerHTML = this.participants.map((name, index) => `
            <div class="lottery-item">
                <span class="lottery-name">${name}</span>
                <button class="delete-btn" onclick="lotteryApp.removeParticipant(${index})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `).join('') || '<div class="empty-state">暂无参与者</div>';
        
        this.drawBtn.disabled = this.participants.length < 2;
    }
}