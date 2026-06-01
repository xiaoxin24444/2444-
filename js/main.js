let passwordApp, todoApp, lotteryApp;

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTabs();
    initThemeToggle();
    initDataExport();
    initStats();
    
    passwordApp = new PasswordGenerator();
    todoApp = new TodoList();
    lotteryApp = new Lottery();
});

function initTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;
            
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    themeToggle.addEventListener('change', () => {
        const newTheme = toggleTheme();
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
    
    const currentTheme = getTheme();
    themeToggle.checked = currentTheme === 'dark';
    themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
}

function initDataExport() {
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importInput = document.getElementById('importInput');
    
    exportBtn.addEventListener('click', () => {
        const success = downloadData();
        if (success) {
            alert('数据导出成功！');
        } else {
            alert('数据导出失败');
        }
    });
    
    importBtn.addEventListener('click', () => {
        importInput.click();
    });
    
    importInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const result = await uploadData(file);
            alert(result);
            location.reload();
        } catch (error) {
            alert(error);
        }
        
        e.target.value = '';
    });
}

function initStats() {
    const stats = getStats();
    
    document.getElementById('statPassword').textContent = stats.password.generateCount;
    document.getElementById('statTodo').textContent = stats.todo.total;
    document.getElementById('statLottery').textContent = stats.lottery.drawCount;
    document.getElementById('statTotal').textContent = stats.totalUsage;
    
    const todoRate = stats.todo.total > 0 
        ? Math.round((stats.todo.completed / stats.todo.total) * 100) 
        : 0;
    document.getElementById('statTodoRate').textContent = `${todoRate}%`;
}

function refreshStats() {
    initStats();
}