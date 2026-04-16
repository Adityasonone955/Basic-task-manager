class TaskManager {
    constructor() {
        this.taskList = document.getElementById('taskList');
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.emptyState = document.getElementById('emptyState');

        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.init();
    }

    init() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.render();
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (text === '') return;

        const task = {
            id: Date.now(),
            text: text,
            completed: false
        };

        this.tasks.unshift(task);
        this.taskInput.value = '';
        this.saveTasks();
        this.render();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.render();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    render() {
        this.taskList.innerHTML = '';

        if (this.tasks.length === 0) {
            this.emptyState.classList.remove('d-none');
            return;
        }

        this.emptyState.classList.add('d-none');

        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `list-group-item d-flex align-items-center ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="form-check form-check-inline me-3">
                    <input class="form-check-input" type="checkbox" id="task_${task.id}" ${task.completed ? 'checked' : ''} onchange="taskManager.toggleTask(${task.id})">
                </div>
                <div class="flex-grow-1">
                    <label class="form-check-label mb-0 task-text fw-medium ${task.completed ? 'completed' : ''}" for="task_${task.id}">
                        ${this.escapeHtml(task.text)}
                    </label>
                    ${task.completed ? '<span class="badge completed-badge bg-success ms-2">Task Completed ✓</span>' : ''}
                </div>
                <button class="btn btn-danger btn-sm delete-btn ms-auto" onclick="taskManager.deleteTask(${task.id})">
                    ❌ Delete
                </button>
            `;
            this.taskList.appendChild(li);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app
const taskManager = new TaskManager();
