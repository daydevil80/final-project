// Variables
const taskForm = document.getElementById('task-form');
const taskNameInput = document.getElementById('task-name');
const taskDateInput = document.getElementById('task-date');
const taskPriorityInput = document.getElementById('task-priority');
const taskList = document.getElementById('tasks');
const searchInput = document.getElementById('search');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const timerButton = document.getElementById('start-timer');
const timerDisplay = document.getElementById('timer-display');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let timerInterval;

// Add Task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const task = {
    id: Date.now(),
    name: taskNameInput.value,
    dueDate: taskDateInput.value,
    priority: taskPriorityInput.value,
    completed: false
  };
  tasks.push(task);
  saveTasks();
  renderTasks();
  taskForm.reset();
});

// Render Tasks
function renderTasks(filteredTasks = tasks) {
  taskList.innerHTML = '';
  filteredTasks.forEach(task => {
    const taskEl = document.createElement('div');
    taskEl.classList.add('task', task.priority);
    if (task.completed) taskEl.classList.add('completed');

    taskEl.innerHTML = `
      <span>${task.name} (Due: ${task.dueDate})</span>
      <div>
        <button onclick="toggleComplete(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;
    taskList.appendChild(taskEl);
  });
  updateProgress();
}

// Update Progress
function updateProgress() {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  progressBar.value = progress;
  progressText.textContent = `${Math.round(progress)}% Completed`;
}

// Toggle Task Completion
function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Search Tasks
searchInput.addEventListener('input', () => {
  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchInput.value.toLowerCase())
  );
  renderTasks(filteredTasks);
});

// Pomodoro Timer
timerButton.addEventListener('click', startTimer);

function startTimer() {
  let time = 25 * 60; // 25 minutes
  timerDisplay.textContent = "25:00";
  timerButton.disabled = true;

  timerInterval = setInterval(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    time--;

    if (time < 0) {
      clearInterval(timerInterval);
      alert('Pomodoro Timer Finished! Take a short break.');
      timerButton.disabled = false;
      timerDisplay.textContent = "00:00";
    }
  }, 1000);
}

// Save Tasks to LocalStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initial Render
renderTasks();
