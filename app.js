// Get references to DOM elements
const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
// Before (bad for production):
const response = await fetch('http://127.0.0.1:5000/tasks');

// After (good for production):
const response = await fetch('/tasks');
// Function to load tasks from Flask
const loadTasks = async () => {
    try {
        const response = await fetch('http://127.0.0.1:5000/tasks');
        if (!response.ok) {
            throw new Error('Failed to load tasks');
        }
        const tasks = await response.json();
        
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center px-4 py-3 border-b border-gray-200';
            li.setAttribute('data-id', task.id);
            li.innerHTML = `
                <span>${task.name}</span>
                <button class="deleteBtn text-red-500 hover:text-red-600 flex items-center gap-2"> 
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 2a1 1 0 000 2h8a1 1 0 100-2H6zM5 6a1 1 0 00-1 1v9a2 2 0 002 2h8a2 2 0 002-2V7a1 1 0 00-1-1H5zM7 9a1 1 0 012 0v5a1 1 0 11-2 0V9zm4 0a1 1 0 012 0v5a1 1 0 11-2 0V9z" />
                    </svg> 
                    Delete
                </button>
            `;
            
            const deleteBtn = li.querySelector('.deleteBtn');
            addDeleteListener(deleteBtn, li);

            taskList.appendChild(li);
        });
    } catch (error) {
        alert('Error loading tasks: ' + error.message);
    }
};

// Add event listener for the "Add Task" button
addTaskBtn.addEventListener('click', async () => {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const task = { name: taskText };

    try {
        const response = await fetch('http://127.0.0.1:5000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });

        if (!response.ok) {
            throw new Error('Failed to add task');
        }

        const newTask = await response.json();
        
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center px-4 py-3 border-b border-gray-200';
        li.setAttribute('data-id', newTask.id);
        li.innerHTML = `
            <span>${newTask.name}</span>
            <button class="deleteBtn text-red-500 hover:text-red-600 flex items-center gap-2"> 
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 2a1 1 0 000 2h8a1 1 0 100-2H6zM5 6a1 1 0 00-1 1v9a2 2 0 002 2h8a2 2 0 002-2V7a1 1 0 00-1-1H5zM7 9a1 1 0 012 0v5a1 1 0 11-2 0V9zm4 0a1 1 0 012 0v5a1 1 0 11-2 0V9z" />
                </svg> 
                Delete
            </button>
        `;

        const deleteBtn = li.querySelector('.deleteBtn');
        addDeleteListener(deleteBtn, li);

        taskList.appendChild(li);
        taskInput.value = '';  // Clear input after adding the task
    } catch (error) {
        alert('Error adding task: ' + error.message);
    }
});

// Function to add delete functionality to task items
const addDeleteListener = (deleteBtn, li) => {
    deleteBtn.addEventListener('click', async () => {
        const taskId = li.getAttribute('data-id');

        try {
            const response = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            li.remove();
        } catch (error) {
            alert('Error deleting task: ' + error.message);
        }
    });
};

// Load tasks when page loads
loadTasks();
