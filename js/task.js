const baseURL = 'https://to-do-app-fv27.onrender.com/api/tasks'; 

async function fetchTasks() {
  try {
    const response = await fetch(baseURL);
    let tasks = await response.json();
    tasks = tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort tasks by createdAt in descending order
    displayTasks(tasks);
  } catch (error) {
    console.error('session expired, please login:', error);
    window.location.href = '/'
  }
}

async function toggleTaskStatus(taskId, completed) {
  try {
    const response = await fetch(`${baseURL}/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed })
    });
    const updatedTask = await response.json();
    fetchTasks();
  } catch (error) {
    console.error('Error updating task status:', error);
  }
}

async function deleteTask(taskId) {
  try {
    const response = await fetch(`${baseURL}/${taskId}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    console.log(data.message); // Log the message from the server
    fetchTasks(); // Refresh the task list after deletion
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

async function updateTask(taskId, newName) {
  try {
    const response = await fetch(`${baseURL}/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ taskName: newName })
    });
    const updatedTask = await response.json();
    console.log('Task updated:', updatedTask);
    fetchTasks(); // Refresh the task list after updating
  } catch (error) {
    console.error('Error updating task:', error);
  }
}

function enableTaskEditing(taskId, taskNameElement, editButton = null) {
  const taskName = taskNameElement.textContent;
  const originalName = taskName; // Store the original task name
  const input = document.createElement('input');
  input.type = 'text';
  input.value = taskName;
  input.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
      const newName = input.value.trim();
      if (newName !== '') {
        updateTask(taskId, newName);
      }
    }
  });
  taskNameElement.textContent = '';
  taskNameElement.appendChild(input);
  input.focus();

  // Change the edit button to a save button if provided
  if (editButton) {
    editButton.textContent = 'Save';
    editButton.addEventListener('click', () => {
      const newName = input.value.trim();
      if (newName !== '') {
        updateTask(taskId, newName);
      } else {
        // If the input is empty, revert back to the original name
        input.value = originalName;
      }
    });
  }
}




function displayTasks(tasks) {
  const tasksList = document.getElementById('tasksList');
  tasksList.innerHTML = '';

  tasks.forEach(task => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      toggleTaskStatus(task._id, checkbox.checked);
    });
    taskCard.appendChild(checkbox);

    const taskName = document.createElement('div');
    taskName.classList.add('task-name');
    taskName.textContent = task.name;
    if (task.completed) {
      taskName.style.textDecoration = 'line-through';
    }
    taskName.addEventListener('dblclick', () => {
      enableTaskEditing(task._id, taskName);
    });
    taskCard.appendChild(taskName);

    const taskButtons = document.createElement('div');
    taskButtons.classList.add('task-buttons');

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
      enableTaskEditing(task._id, taskName, editButton);
    });
    taskButtons.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', () => {
      deleteTask(task._id);
    });
    taskButtons.appendChild(deleteButton);

    taskCard.appendChild(taskButtons);

    tasksList.appendChild(taskCard);
  });
}



async function addTask(event) {
  event.preventDefault();
  const taskName = document.getElementById('taskName').value;
  try {
    const response = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ taskName: taskName })
    });
    const newTask = await response.json();
    fetchTasks();
    // Clear the input field after adding the task
    document.getElementById('taskName').value = '';
  } catch (error) {
    console.error('Error adding task:', error);
  }
}

document.getElementById('addTaskForm').addEventListener('submit', addTask);

fetchTasks();

