class TodoList {
    constructor() {
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addTodoBtn');
        this.todoList = document.getElementById('todoList');
        this.filterAll = document.getElementById('filterAll');
        this.filterActive = document.getElementById('filterActive');
        this.filterCompleted = document.getElementById('filterCompleted');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.todoCount = document.getElementById('todoCount');
        
        this.todos = [];
        this.currentFilter = 'all';
        
        this.loadTodos();
        this.initEventListeners();
        this.render();
    }
    
    loadTodos() {
        this.todos = getStorage(STORAGE_KEYS.TODO_LIST, []);
    }
    
    saveTodos() {
        setStorage(STORAGE_KEYS.TODO_LIST, this.todos);
        this.updateStats();
    }
    
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        updateTodoStats(total, completed);
        this.updateCount();
    }
    
    updateCount() {
        const active = this.todos.filter(t => !t.completed).length;
        this.todoCount.textContent = active;
    }
    
    initEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        
        this.filterAll.addEventListener('click', () => this.setFilter('all'));
        this.filterActive.addEventListener('click', () => this.setFilter('active'));
        this.filterCompleted.addEventListener('click', () => this.setFilter('completed'));
        
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
    }
    
    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;
        
        const todo = {
            id: Date.now(),
            text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.push(todo);
        this.todoInput.value = '';
        this.saveTodos();
        this.render();
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }
    
    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.render();
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        
        [this.filterAll, this.filterActive, this.filterCompleted].forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.getElementById(`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`).classList.add('active');
        
        this.render();
    }
    
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }
    
    render() {
        const filteredTodos = this.getFilteredTodos();
        
        this.todoList.innerHTML = filteredTodos.map(todo => `
            <div class="todo-item" data-id="${todo.id}">
                <label class="todo-checkbox">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                           onchange="todoApp.toggleTodo(${todo.id})">
                    <span class="checkmark"></span>
                </label>
                <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
                <button class="delete-btn" onclick="todoApp.deleteTodo(${todo.id})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `).join('');
        
        this.updateCount();
    }
}