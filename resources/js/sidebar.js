document.addEventListener('DOMContentLoaded', function() {
    // Sidebar and dropdown elements
    const dropdownBtn = document.getElementById('dropdownBtn');
    const sidebar = document.querySelector('.sidebar');
    let isSidebarVisible = false; // Track sidebar state

    // Toggle sidebar function
    function toggleSidebar() {
        if (isSidebarVisible) {
            sidebar.style.display = 'none';
            localStorage.setItem('sidebarState', 'hidden');
        } else {
            sidebar.style.display = 'block';
            localStorage.setItem('sidebarState', 'visible');
        }
        isSidebarVisible = !isSidebarVisible;
    }

    // Initialize sidebar state from localStorage
    const savedState = localStorage.getItem('sidebarState');
    if (savedState === 'visible') {
        sidebar.style.display = 'block';
        isSidebarVisible = true;
    } else {
        sidebar.style.display = 'none';
        isSidebarVisible = false;
    }

    // Dropdown button click handler
    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleSidebar();
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        if (isSidebarVisible && 
            !sidebar.contains(event.target) && 
            !dropdownBtn.contains(event.target)) {
            toggleSidebar();
        }
    });

    // Prevent sidebar from closing when clicking inside it
    sidebar.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Lists Management
    const addToList = document.getElementById('addToList');
    const newListName = document.getElementById('newListName');
    const createListBtn = document.getElementById('createListBtn');
    const listItems = document.getElementById('listItems');

    // Tags Management
    const tagBtn = document.getElementById('tagBtn');
    const tagName = document.getElementById('tagName');
    const tagsRow = document.getElementById('tagsRow');

    // Lists functionality
    function loadLists() {
        const lists = JSON.parse(localStorage.getItem('lists') || '[]');
        listItems.innerHTML = '';
        lists.forEach(list => {
            const newLi = document.createElement('li');
            newLi.innerHTML = `
                ${list.name}
                <button class="remove-btn">×</button>
            `;
            
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
            const lists = JSON.parse(localStorage.getItem('lists') || '[]');
            lists.push({ name: listName });
            localStorage.setItem('lists', JSON.stringify(lists));
            
            loadLists();
            
            newListName.value = '';
            newListName.style.display = 'none';
            createListBtn.style.display = 'none';
        }
    });

    // Tags functionality
    function loadTags() {
        const tags = JSON.parse(localStorage.getItem('tags') || '[]');
        tagsRow.innerHTML = '';
        tags.forEach(tag => {
            const newTag = document.createElement('span');
            newTag.classList.add('tag2');
            newTag.style.backgroundColor = tag.color;
            newTag.innerHTML = `
                ${tag.name}
                <button class="remove-tag-btn">×</button>
            `;
            
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
                const tags = JSON.parse(localStorage.getItem('tags') || '[]');
                tags.push({ name: tagText, color: color });
                localStorage.setItem('tags', JSON.stringify(tags));
                
                loadTags();
                
                tagName.value = '';
                tagName.style.display = 'none';
            }
        }
    });

    function getRandomColor() {
        const colors = ['#FFB6B6', '#B6FFB6', '#B6B6FF', '#FFE4B6', '#B6FFE4', '#E4B6FF'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Initial load
    loadLists();
    loadTags();
}); 