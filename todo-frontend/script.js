document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    // IMPORTANT: Change this URL to your actual Spring Boot API endpoint.
    const API_BASE_URL = 'http://localhost:8080/task';

    // --- DOM ELEMENT SELECTION ---
    const taskList = document.getElementById('task-list');
    const addTaskForm = document.getElementById('add-task-form');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const loadingIndicator = document.getElementById('loading');
    
    // Edit Modal Elements
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-task-form');
    const editIdInput = document.getElementById('edit-id');
    const editTitleInput = document.getElementById('edit-title');
    const editDescriptionInput = document.getElementById('edit-description');
    const cancelEditBtn = document.getElementById('cancel-edit');

    // --- API FUNCTIONS ---

    /**
     * Fetches all tasks from the API.
     * @returns {Promise<Array>} A promise that resolves to an array of tasks.
     */
    const fetchTasks = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/get`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            showError("Could not load tasks. Please check the API connection.");
            return []; // Return empty array on error
        }
    };

    /**
     * Creates a new task.
     * @param {object} taskData - The task data {title, description}.
     * @returns {Promise<object>} A promise that resolves to the created task.
     */
    const createTask = async (taskData) => {
        const response = await fetch(`${API_BASE_URL}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        return await response.json();
    };

    /**
     * Updates an existing task.
     * @param {number} id - The ID of the task to update.
     * @param {object} taskData - The updated task data.
     * @returns {Promise<object>} A promise that resolves to the updated task.
     */
    const updateTask = async (id, taskData) => {
        const response = await fetch(`${API_BASE_URL}/update/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        return await response.json();
    };

    /**
     * Deletes a task by its ID.
     * @param {number} id - The ID of the task to delete.
     */
    const deleteTask = async (id) => {
        await fetch(`${API_BASE_URL}/delete/${id}`, {
            method: 'DELETE'
        });
    };

    // --- UI RENDERING ---

    /**
     * Renders a single task item in the list.
     * @param {object} task - The task object to render.
     */
    const renderTask = (task) => {
        const item = document.createElement('li');
        item.dataset.id = task.id;
        item.className = `task-item flex items-start p-4 bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-300 ${task.completed ? 'completed' : ''}`;

        // Checkbox for completion status
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.className = 'mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer';
        checkbox.addEventListener('change', () => handleToggleComplete(task.id, task));

        // Task content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'flex-1 ml-4';
        
        const title = document.createElement('h3');
        title.textContent = task.title;
        title.className = 'task-title font-semibold text-lg text-gray-800';
        
        const description = document.createElement('p');
        description.textContent = task.description || 'No description';
        description.className = 'task-description text-gray-600 mt-1';
        
        contentDiv.appendChild(title);
        contentDiv.appendChild(description);

        // Action buttons container
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'flex items-center space-x-2 ml-4';

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg>`;
        editBtn.className = 'text-gray-400 hover:text-blue-600 transition';
        editBtn.onclick = () => showEditModal(task);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" /></svg>`;
        deleteBtn.className = 'text-gray-400 hover:text-red-600 transition';
        deleteBtn.onclick = () => handleDeleteTask(task.id);
        
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        
        item.appendChild(checkbox);
        item.appendChild(contentDiv);
        item.appendChild(actionsDiv);
        taskList.appendChild(item);
    };

    /**
     * Main function to fetch and render all tasks.
     */
    const refreshTasks = async () => {
        showLoading(true);
        taskList.innerHTML = '';
        const tasks = await fetchTasks();
        showLoading(false);
        if (tasks.length === 0) {
            showEmptyMessage();
        } else {
            // Sort tasks: incomplete first, then by creation date
            tasks.sort((a, b) => a.completed - b.completed || new Date(b.createdAt) - new Date(a.createdAt));
            tasks.forEach(renderTask);
        }
    };
    
    /**
     * Shows or hides the loading indicator.
     * @param {boolean} isLoading - True to show, false to hide.
     */
    const showLoading = (isLoading) => {
        loadingIndicator.style.display = isLoading ? 'block' : 'none';
    };

    /**
     * Displays a message when the task list is empty.
     */
    const showEmptyMessage = () => {
        taskList.innerHTML = '<li class="text-center text-gray-500 py-4">No tasks yet. Add one above!</li>';
    };

    /**
     * Displays an error message in the task list area.
     * @param {string} message - The error message to display.
     */
    const showError = (message) => {
        taskList.innerHTML = `<li class="text-center text-red-500 font-semibold py-4">${message}</li>`;
    };


    // --- EVENT HANDLERS ---

    /**
     * Handles the submission of the "add task" form.
     */
    const handleAddTask = async (event) => {
        event.preventDefault();
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        if (!title) {
            alert('Title is required.');
            return;
        }
        const newTaskData = { title, description, completed: false };
        await createTask(newTaskData);
        addTaskForm.reset();
        await refreshTasks();
    };

    /**
     * Handles deleting a task.
     * @param {number} id - The ID of the task to delete.
     */
    const handleDeleteTask = async (id) => {
        if (confirm('Are you sure you want to delete this task?')) {
            await deleteTask(id);
            // Optimistic UI update: remove from DOM immediately
            const taskElement = document.querySelector(`li[data-id='${id}']`);
            if (taskElement) {
                taskElement.remove();
            }
            // If list becomes empty, show message
            if (taskList.children.length === 0) {
                showEmptyMessage();
            }
        }
    };

    /**
     * Handles toggling the completion status of a task.
     * @param {number} id - The task ID.
     * @param {object} task - The full task object.
     */
    const handleToggleComplete = async (id, task) => {
        const updatedTaskData = {
            ...task,
            completed: !task.completed
        };
        await updateTask(id, updatedTaskData);
        // Re-fetch and render to ensure data consistency and proper sorting
        await refreshTasks();
    };

    /**
     * Shows the edit modal and populates it with task data.
     * @param {object} task - The task object to edit.
     */
    const showEditModal = (task) => {
        editIdInput.value = task.id;
        editTitleInput.value = task.title;
        editDescriptionInput.value = task.description;
        editModal.classList.remove('hidden');
    };

    /**
     * Hides the edit modal.
     */
    const hideEditModal = () => {
        editModal.classList.add('hidden');
    };

    /**
     * Handles the submission of the edit form.
     */
    const handleEditTask = async (event) => {
        event.preventDefault();
        const id = editIdInput.value;
        const updatedData = {
            title: editTitleInput.value.trim(),
            description: editDescriptionInput.value.trim()
        };
        if (!updatedData.title) {
            alert('Title is required.');
            return;
        }
        await updateTask(id, updatedData);
        hideEditModal();
        await refreshTasks();
    };

    // --- INITIALIZATION ---
    addTaskForm.addEventListener('submit', handleAddTask);
    editForm.addEventListener('submit', handleEditTask);
    cancelEditBtn.addEventListener('click', hideEditModal);
    
    // Close modal if clicking outside of it
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            hideEditModal();
        }
    });

    // Initial load of tasks
    refreshTasks();
});
