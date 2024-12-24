document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const currentDate = document.getElementById('currentDate');
    const calendarBody = document.getElementById('calendarBody');
    const dropdownBtn = document.getElementById('dropdownBtn');
    const sidebar = document.querySelector('.sidebar');
    
    // Dropdown button click handler
    dropdownBtn.addEventListener('click', function() {
        if (sidebar.style.display === 'block') {
            sidebar.style.display = 'none';
        } else {
            sidebar.style.display = 'block';
        }
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && !dropdownBtn.contains(event.target)) {
            sidebar.style.display = 'none';
        }
    });
    
    // Rest of your calendar code...
    function getMonthDisplay() {
        if (window.innerWidth <= 480) {
            return { month: 'short', year: 'numeric' };
        }
        return { month: 'long', year: 'numeric' };
    }
    
    currentDate.textContent = today.toLocaleDateString('en-US', getMonthDisplay());

    function generateCalendar() {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        let date = 1;
        let calendar = '';

        for (let i = 0; i < 6; i++) {
            let row = '<tr>';
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < startingDay) {
                    row += '<td></td>';
                } else if (date > totalDays) {
                    row += '<td></td>';
                } else {
                    const isToday = date === 9 ? 'today' : '';
                    row += `<td class="${isToday}">${date}</td>`;
                    date++;
                }
            }
            row += '</tr>';
            calendar += row;
        }

        calendarBody.innerHTML = calendar;
    }

    generateCalendar();

    window.addEventListener('resize', function() {
        currentDate.textContent = today.toLocaleDateString('en-US', getMonthDisplay());
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const currentDate = document.getElementById('currentDate');
    const calendarBody = document.getElementById('calendarBody');
    
    // Create modal HTML
    const modalHTML = `
        <div id="dateTaskModal" class="date-task-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modalDate">Tasks for </h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="task-form">
                        <input type="text" id="taskTitle" placeholder="Task title">
                        <textarea id="taskDescription" placeholder="Task description"></textarea>
                        <button id="addTaskBtn">Add Task</button>
                    </div>
                    <div class="task-list">
                        <h3>Tasks for this date:</h3>
                        <ul id="dateTaskList"></ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Modal elements
    const modal = document.getElementById('dateTaskModal');
    const closeModal = document.querySelector('.close-modal');
    const modalDateTitle = document.getElementById('modalDate');
    const taskList = document.getElementById('dateTaskList');
    const addTaskBtn = document.getElementById('addTaskBtn');
    let selectedDate = null;

    function generateCalendar() {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        let date = 1;
        let calendar = '';

        for (let i = 0; i < 6; i++) {
            let row = '<tr>';
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < startingDay) {
                    row += '<td></td>';
                } else if (date > totalDays) {
                    row += '<td></td>';
                } else {
                    const currentDate = new Date(today.getFullYear(), today.getMonth(), date);
                    const dateStr = currentDate.toISOString().split('T')[0];
                    const tasks = JSON.parse(localStorage.getItem(`tasks_${dateStr}`) || '[]');
                    const hasTask = tasks.length > 0 ? 'has-task' : '';
                    
                    row += `<td class="calendar-day ${hasTask}" data-date="${dateStr}">${date}</td>`;
                    date++;
                }
            }
            row += '</tr>';
            calendar += row;
            if (date > totalDays) break;
        }

        calendarBody.innerHTML = calendar;
        
        // Add click handlers to calendar days
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.addEventListener('click', function() {
                if (this.textContent) {
                    selectedDate = this.dataset.date;
                    openModal(selectedDate);
                }
            });
        });
    }

    function openModal(dateStr) {
        const date = new Date(dateStr);
        modalDateTitle.textContent = `Tasks for ${date.toLocaleDateString()}`;
        loadTasksForDate(dateStr);
        modal.style.display = 'block';
    }

    function loadTasksForDate(dateStr) {
        const tasks = JSON.parse(localStorage.getItem(`tasks_${dateStr}`) || '[]');
        taskList.innerHTML = tasks.map(task => `
            <li class="task-item">
                <div class="task-content">
                    <h4>${task.title}</h4>
                    <p>${task.description}</p>
                </div>
                <button class="delete-task" data-id="${task.id}">&times;</button>
            </li>
        `).join('');

        // Add delete handlers
        document.querySelectorAll('.delete-task').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteTask(dateStr, this.dataset.id);
            });
        });
    }

    function addTask(dateStr, title, description) {
        const tasks = JSON.parse(localStorage.getItem(`tasks_${dateStr}`) || '[]');
        const newTask = {
            id: Date.now().toString(),
            title,
            description,
            date: dateStr
        };
        tasks.push(newTask);
        localStorage.setItem(`tasks_${dateStr}`, JSON.stringify(tasks));
        loadTasksForDate(dateStr);
        generateCalendar(); // Refresh calendar to show task indicators
    }

    function deleteTask(dateStr, taskId) {
        const tasks = JSON.parse(localStorage.getItem(`tasks_${dateStr}`) || '[]');
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem(`tasks_${dateStr}`, JSON.stringify(updatedTasks));
        loadTasksForDate(dateStr);
        generateCalendar(); // Refresh calendar to update task indicators
    }

    // Event Listeners
    addTaskBtn.addEventListener('click', function() {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        
        if (title && selectedDate) {
            addTask(selectedDate, title, description);
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDescription').value = '';
        }
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Initialize calendar
    generateCalendar();
});