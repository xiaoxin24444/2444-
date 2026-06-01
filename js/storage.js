const STORAGE_KEYS = {
    PASSWORD_CONFIG: 'toolbox_password_config',
    PASSWORD_STATS: 'toolbox_password_stats',
    TODO_LIST: 'toolbox_todo_list',
    TODO_STATS: 'toolbox_todo_stats',
    LOTTERY_CONFIG: 'toolbox_lottery_config',
    LOTTERY_STATS: 'toolbox_lottery_stats',
    THEME: 'toolbox_theme',
    LAST_VISIT: 'toolbox_last_visit'
};

function getStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error('Failed to get storage:', e);
        return defaultValue;
    }
}

function setStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Failed to set storage:', e);
        return false;
    }
}

function removeStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('Failed to remove storage:', e);
        return false;
    }
}

function exportAllData() {
    try {
        const data = {
            passwordConfig: getStorage(STORAGE_KEYS.PASSWORD_CONFIG),
            passwordStats: getStorage(STORAGE_KEYS.PASSWORD_STATS),
            todoList: getStorage(STORAGE_KEYS.TODO_LIST),
            todoStats: getStorage(STORAGE_KEYS.TODO_STATS),
            lotteryConfig: getStorage(STORAGE_KEYS.LOTTERY_CONFIG),
            lotteryStats: getStorage(STORAGE_KEYS.LOTTERY_STATS),
            theme: getStorage(STORAGE_KEYS.THEME),
            exportTime: new Date().toISOString()
        };
        return data;
    } catch (e) {
        console.error('Failed to export data:', e);
        return null;
    }
}

function importAllData(data) {
    try {
        if (data.passwordConfig !== undefined) {
            setStorage(STORAGE_KEYS.PASSWORD_CONFIG, data.passwordConfig);
        }
        if (data.passwordStats !== undefined) {
            setStorage(STORAGE_KEYS.PASSWORD_STATS, data.passwordStats);
        }
        if (data.todoList !== undefined) {
            setStorage(STORAGE_KEYS.TODO_LIST, data.todoList);
        }
        if (data.todoStats !== undefined) {
            setStorage(STORAGE_KEYS.TODO_STATS, data.todoStats);
        }
        if (data.lotteryConfig !== undefined) {
            setStorage(STORAGE_KEYS.LOTTERY_CONFIG, data.lotteryConfig);
        }
        if (data.lotteryStats !== undefined) {
            setStorage(STORAGE_KEYS.LOTTERY_STATS, data.lotteryStats);
        }
        if (data.theme !== undefined) {
            setStorage(STORAGE_KEYS.THEME, data.theme);
        }
        return true;
    } catch (e) {
        console.error('Failed to import data:', e);
        return false;
    }
}

function downloadData() {
    const data = exportAllData();
    if (!data) return false;
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toolbox-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
}

function uploadData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                const success = importAllData(data);
                if (success) {
                    resolve('导入成功');
                } else {
                    reject('导入失败');
                }
            } catch (e) {
                reject('无效的JSON文件');
            }
        };
        reader.onerror = () => reject('文件读取失败');
        reader.readAsText(file);
    });
}

function getTheme() {
    return getStorage(STORAGE_KEYS.THEME, 'light');
}

function setTheme(theme) {
    setStorage(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    return newTheme;
}

function initTheme() {
    const savedTheme = getTheme();
    setTheme(savedTheme);
}

function getStats() {
    const passwordStats = getStorage(STORAGE_KEYS.PASSWORD_STATS, { generateCount: 0 });
    const todoStats = getStorage(STORAGE_KEYS.TODO_STATS, { total: 0, completed: 0 });
    const lotteryStats = getStorage(STORAGE_KEYS.LOTTERY_STATS, { drawCount: 0 });
    
    return {
        password: passwordStats,
        todo: todoStats,
        lottery: lotteryStats,
        totalTools: 3,
        totalUsage: passwordStats.generateCount + todoStats.total + lotteryStats.drawCount
    };
}

function incrementPasswordGenerateCount() {
    const stats = getStorage(STORAGE_KEYS.PASSWORD_STATS, { generateCount: 0 });
    stats.generateCount++;
    setStorage(STORAGE_KEYS.PASSWORD_STATS, stats);
}

function updateTodoStats(total, completed) {
    setStorage(STORAGE_KEYS.TODO_STATS, { total, completed });
}

function incrementLotteryDrawCount() {
    const stats = getStorage(STORAGE_KEYS.LOTTERY_STATS, { drawCount: 0 });
    stats.drawCount++;
    setStorage(STORAGE_KEYS.LOTTERY_STATS, stats);
}