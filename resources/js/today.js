document.addEventListener('DOMContentLoaded', function() {
    const taskList = document.getElementById('taskList');
    
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        taskList.innerHTML = '';
        
        tasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-item');
            if (task.completed) {
                taskElement.classList.add('completed');
            }
            
            taskElement.innerHTML = `
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-description">${task.task}</div>
                </div>
                <button class="delete-btn">Delete</button>
            `;

            const checkbox = taskElement.querySelector('.checkbox');
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                taskElement.classList.toggle('completed');
                const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
                tasks[index].completed = checkbox.checked;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                updateTaskCount();
            });

            const deleteBtn = taskElement.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                loadTasks();
                updateTaskCount();
            });

            taskList.appendChild(taskElement);
        });
    }

    function updateTaskCount() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const incompleteTasks = tasks.filter(task => !task.completed).length;
        const todayCount = document.querySelector('li a[href="today.html"]')?.parentElement.querySelector('h6');
        if (todayCount) {
            todayCount.textContent = incompleteTasks;
        }
    }

    // Initial load
    loadTasks();
    updateTaskCount();

    // Reuse sidebar functionality from script.js
    const dropdownBtn = document.getElementById('dropdownBtn');
    const sidebar = document.querySelector('.sidebar');

    dropdownBtn.addEventListener('click', function() {
        sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
    });
});