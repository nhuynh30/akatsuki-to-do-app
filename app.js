const STORAGE_KEY = 'clause-todos';

const addForm = document.getElementById('addForm');
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const footer = document.getElementById('footer');
const countEl = document.getElementById('count');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filters = document.getElementById('filters');

let todos = loadTodos();
let currentFilter = 'all';

function loadTodos() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function getFilteredTodos() {
  if (currentFilter === 'active') return todos.filter((t) => !t.done);
  if (currentFilter === 'completed') return todos.filter((t) => t.done);
  return todos;
}

function render() {
  const filtered = getFilteredTodos();

  todoList.innerHTML = '';

  if (filtered.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent =
      currentFilter === 'all'
        ? 'No tasks yet. Add one above.'
        : currentFilter === 'active'
          ? 'No active tasks.'
          : 'No completed tasks.';
    todoList.appendChild(empty);
  } else {
    filtered.forEach((todo) => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (todo.done ? ' done' : '');
      li.dataset.id = todo.id;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-checkbox';
      checkbox.checked = todo.done;
      checkbox.setAttribute('aria-label', todo.done ? 'Mark as not done' : 'Mark as done');
      checkbox.addEventListener('change', () => toggleTodo(todo.id));

      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = todo.text;

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'todo-delete';
      deleteBtn.textContent = 'Delete';
      deleteBtn.setAttribute('aria-label', 'Delete task');
      deleteBtn.addEventListener('click', () => removeTodo(todo.id));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    });
  }

  const activeCount = todos.filter((t) => !t.done).length;
  countEl.textContent = `${activeCount} item${activeCount === 1 ? '' : 's'} left`;
  clearCompletedBtn.style.visibility = todos.some((t) => t.done) ? 'visible' : 'hidden';
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  todos.push({
    id: crypto.randomUUID(),
    text: trimmed,
    done: false,
  });
  saveTodos();
  render();
  todoInput.value = '';
  todoInput.focus();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    saveTodos();
    render();
  }
}

function removeTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.done);
  saveTodos();
  render();
}

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(todoInput.value);
});

filters.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  render();
});

clearCompletedBtn.addEventListener('click', clearCompleted);

render();
