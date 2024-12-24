// Task Management
const addBox = document.querySelector('.addBox');
const formContainer = document.getElementById('formContainer');
const submitBtn = document.getElementById('submitBtn');
const NewTitle = document.getElementById('NewTitle');
const newTask = document.getElementById('newTask');
const wallOfContent = document.querySelector('.wallOfContent');
const cancelBtn = document.getElementById('cancelBtn');

// Show form when clicking add box
addBox.addEventListener('click', () => {
    formContainer.style.display = 'block';
});

// Cancel button functionality
cancelBtn.addEventListener('click', () => {
    formContainer.style.display = 'none';
    NewTitle.value = '';
    newTask.value = '';
});

// Submit new sticky note and add to tasks
submitBtn.addEventListener('click', () => {
    const title = NewTitle.value.trim();
    const task = newTask.value.trim();

    if (title && task) {
        // Create sticky note for wall
        const color = getRandomColor();
        const newBox = document.createElement('div');
        newBox.classList.add('box1');
        newBox.innerHTML = `
            <h3>${title}</h3><br>
            <p>${task}</p>
        `;
        newBox.style.background = color;

        // Add delete button
        const deletebtn = document.createElement('button');
        deletebtn.innerHTML = 'Remove';
        deletebtn.classList.add('removeBtn');
        deletebtn.addEventListener('click', function() {
            wallOfContent.removeChild(newBox);
            // Also remove from tasks
            removeFromTasks(title, task);
        });
        newBox.appendChild(deletebtn);

        // Add to wall
        wallOfContent.insertBefore(newBox, formContainer);

        // Save to tasks (for today.html)
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push({
            title: title,
            task: task,
            completed: false,
            date: new Date().toISOString(),
            color: color
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Update task count in sidebar
        updateTaskCount();

        // Clear form
        NewTitle.value = '';
        newTask.value = '';
        formContainer.style.display = 'none';
    } else {
        alert('Please fill in both title and task');
    }
});

// Helper function to remove task from localStorage
function removeFromTasks(title, task) {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedTasks = tasks.filter(t => t.title !== title || t.task !== task);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    updateTaskCount();
}

// Helper function for random colors
function getRandomColor() {
    const colors = ['#FFD7C4', '#B7E0FF', '#FFF5CD'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Update task count in sidebar
function updateTaskCount() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const incompleteTasks = tasks.filter(task => !task.completed).length;
    const todayCount = document.querySelector('li a[href="today.html"]')?.parentElement.querySelector('h6');
    if (todayCount) {
        todayCount.textContent = incompleteTasks;
    }
}

// Load existing sticky notes
function loadStickyNotes() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.forEach(task => {
        const newBox = document.createElement('div');
        newBox.classList.add('box1');
        newBox.innerHTML = `
            <h3>${task.title}</h3><br>
            <p>${task.task}</p>
        `;
        newBox.style.background = task.color || getRandomColor();

        const deletebtn = document.createElement('button');
        deletebtn.innerHTML = 'Remove';
        deletebtn.classList.add('removeBtn');
        deletebtn.addEventListener('click', function() {
            wallOfContent.removeChild(newBox);
            removeFromTasks(task.title, task.task);
        });
        newBox.appendChild(deletebtn);

        wallOfContent.insertBefore(newBox, formContainer);
    });
}

// Initial load
loadStickyNotes();
updateTaskCount();

// Sidebar toggle functionality
const dropdownBtn = document.getElementById('dropdownBtn');
const sidebar = document.querySelector('.sidebar');

dropdownBtn.addEventListener('click', function() {
    sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
});

// Lists Management
const addToList = document.getElementById('addToList');
const newListName = document.getElementById('newListName');
const createListBtn = document.getElementById('createListBtn');
const listItems = document.getElementById('listItems');

// Load existing lists
function loadLists() {
    const lists = JSON.parse(localStorage.getItem('lists') || '[]');
    listItems.innerHTML = ''; // Clear existing items
    lists.forEach(list => {
        const newLi = document.createElement('li');
        newLi.innerHTML = `
            ${list.name}
            <button class="remove-btn">×</button>
        `;
        
        // Add remove functionality
        const removeBtn = newLi.querySelector('.remove-btn');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            newLi.remove();
            const updatedLists = lists.filter(l => l.name !== list.name);
            localStorage.setItem('lists', JSON.stringify(updatedLists));
        });
        
        listItems.appendChild(newLi);
    });
}

addToList.addEventListener('click', function() {
    if (newListName.style.display === 'none' || newListName.style.display === '') {
        newListName.style.display = 'block';
        createListBtn.style.display = 'block';
    }
});

createListBtn.addEventListener('click', function() {
    const listName = newListName.value.trim();
    if (listName) {
        // Save to localStorage
        const lists = JSON.parse(localStorage.getItem('lists') || '[]');
        lists.push({ name: listName });
        localStorage.setItem('lists', JSON.stringify(lists));
        
        // Create new list item
        const newLi = document.createElement('li');
        newLi.innerHTML = `
            ${listName}
            <button class="remove-btn">×</button>
        `;
        
        // Add remove functionality
        const removeBtn = newLi.querySelector('.remove-btn');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            newLi.remove();
            const updatedLists = lists.filter(l => l.name !== listName);
            localStorage.setItem('lists', JSON.stringify(updatedLists));
        });
        
        listItems.appendChild(newLi);
        
        // Clear and hide input
        newListName.value = '';
        newListName.style.display = 'none';
        createListBtn.style.display = 'none';
    }
});

// Tags Management
const tagBtn = document.getElementById('tagBtn');
const tagName = document.getElementById('tagName');
const tagsRow = document.getElementById('tagsRow');

// Load existing tags
function loadTags() {
    const tags = JSON.parse(localStorage.getItem('tags') || '[]');
    tagsRow.innerHTML = ''; // Clear existing tags
    tags.forEach(tag => {
        const newTag = document.createElement('span');
        newTag.classList.add('tag2');
        newTag.style.backgroundColor = tag.color;
        newTag.innerHTML = `
            ${tag.name}
            <button class="remove-tag-btn">×</button>
        `;
        
        // Add remove functionality
        const removeBtn = newTag.querySelector('.remove-tag-btn');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            newTag.remove();
            const updatedTags = tags.filter(t => t.name !== tag.name);
            localStorage.setItem('tags', JSON.stringify(updatedTags));
        });
        
        tagsRow.appendChild(newTag);
    });
}

tagBtn.addEventListener('click', function() {
    if (tagName.style.display === 'none' || tagName.style.display === '') {
        tagName.style.display = 'block';
    } else {
        const tagText = tagName.value.trim();
        if (tagText) {
            const color = getRandomColor();
            
            // Save to localStorage
            const tags = JSON.parse(localStorage.getItem('tags') || '[]');
            tags.push({ name: tagText, color: color });
            localStorage.setItem('tags', JSON.stringify(tags));
            
            // Create new tag
            const newTag = document.createElement('span');
            newTag.classList.add('tag2');
            newTag.style.backgroundColor = color;
            newTag.innerHTML = `
                ${tagText}
                <button class="remove-tag-btn">×</button>
            `;
            
            // Add remove functionality
            const removeBtn = newTag.querySelector('.remove-tag-btn');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                newTag.remove();
                const updatedTags = tags.filter(t => t.name !== tagText);
                localStorage.setItem('tags', JSON.stringify(updatedTags));
            });
            
            tagsRow.appendChild(newTag);
            tagName.value = '';
            tagName.style.display = 'none';
        }
    }
});

// Load existing data
loadLists();
loadTags();
