// Default filter value (select options)
let filterValue = "all";

// Selecting DOM elements:
const todolistForm = document.querySelector(".todolist__form");
const todolistInput = document.querySelector(".todolist__input");
const todolistList = document.querySelector(".todolist__list");
const todolistSelectFilter = document.querySelector(".todolist__filters");
const todolistModalBackdrop = document.querySelector(".modal-backdrop");
const todolistModal = document.querySelector(".modal");
const todolistCloseModalBtn = document.querySelector(".modal__header-close");
const todolistModalForm = document.querySelector(".modal__form");
const todolistModalInput = document.querySelector(".modal__form-input");
const todolistEditModalBtn = document.querySelector(".modal__edit-button");

// Event listeners:
todolistForm.addEventListener("submit", addNewTodo);

todolistSelectFilter.addEventListener("change", (event) => {
  filterValue = event.target.value;
  filterTodos();
});

// Hide modal when the user clicks on the backdrop or close button
todolistModalBackdrop.addEventListener("click", hideModal);
todolistCloseModalBtn.addEventListener("click", hideModal);

// Load and display todos from local storage when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
  const todos = getAllTodos();
  createTodos(todos);
});

// Functions:
function addNewTodo(event) {
  event.preventDefault(); // Prevent default form submission

  // Check if the input value is empty
  if (!todolistInput.value) return null;

  // Create a new todo object
  const newTodo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    title: todolistInput.value,
    isCompleted: false,
  };

  // Save the new todo to local storage using saveTodo
  saveTodo(newTodo);

  // Update displayed todos based on the current filter
  filterTodos();
}

function createTodos(todos) {
  // If the todos array is empty, clear the list
  if (todos.length === 0) todolistList.innerHTML = "";

  // Render todos on the DOM
  let todolistItem = "";
  todos.forEach((todo) => {
    // Create a new list item with dynamic values from the todo object
    todolistItem += `<li class="todolist__item">
          <p class="todolist__title ${todo.isCompleted && "todolist__completed"}">${todo.title}</p>
          <div class="todolist__wrapper">
            <span class="todolist__createdAt">${new Date(todo.createdAt).toLocaleDateString(
              "fa-IR"
            )}</span>
            <div class="todolist__buttons">
              <button data-todo-id=${
                todo.id
              } class="todolist__button todolist__button--edit" title="ویرایش">
                <i class='bx bx-edit'></i>
              </button>
              <button data-todo-id=${
                todo.id
              } class="todolist__button todolist__button--check" title="انجام شده">
                <i class="bx bx-check-square"></i>
              </button>
              <button data-todo-id=${
                todo.id
              } class="todolist__button todolist__button--remove" title="حذف کردن">
                <i class="bx bx-trash"></i>
              </button>
            </div>
          </div>
        </li>`;

    // Append the todo items to the parent list
    todolistList.innerHTML = todolistItem;

    // Clear the input value after submission
    todolistInput.value = "";

    // Select all remove buttons (after creating todos)
    const todolistRemoveBtn = [...document.querySelectorAll(".todolist__button--remove")];

    // Add event listener for remove buttons:
    todolistRemoveBtn.forEach((button) => {
      button.addEventListener("click", removeTodo);
    });

    // Select all check buttons (after creating todos)
    const todolistcheckBtn = [...document.querySelectorAll(".todolist__button--check")];

    // Add event listener for check buttons:
    todolistcheckBtn.forEach((button) => {
      button.addEventListener("click", checkTodo);
    });

    // Select all edit buttons (after creating todos)
    const todolistEditBtns = [...document.querySelectorAll(".todolist__button--edit")];

    // Add event listener for edit buttons:
    todolistEditBtns.forEach((button) => {
      button.addEventListener("click", editTodo);
    });
  });
}

function filterTodos() {
  // Determine filter option: 'all', 'completed', or 'uncompleted'
  const todos = getAllTodos(); // Retrieve all todos from local storage

  switch (filterValue) {
    case "all":
      // Render all todos on the DOM
      createTodos(todos);
      break;
    case "completed":
      // Filter completed todos and display them on the DOM
      const completedTodos = todos.filter((todo) => todo.isCompleted);
      createTodos(completedTodos);
      break;
    case "uncompleted":
      // Filter uncompleted todos and display them on the DOM
      const uncompletedTodos = todos.filter((todo) => !todo.isCompleted);
      createTodos(uncompletedTodos);
      break;
    default:
      createTodos(todos);
  }
}

function removeTodo(event) {
  // Retrieve the data-todo-id attribute from the clicked element
  const todoId = Number(event.target.dataset.todoId);

  let todos = getAllTodos(); // Retrieve all todos from local storage

  // Filter out the todo with the specified ID
  todos = todos.filter((todo) => todo.id !== todoId);
  saveAllTodos(todos); // Save the filtered todos in local storage

  // Update displayed todos based on the current filter
  filterTodos();
}

function checkTodo(event) {
  // Retrieve the data-todo-id attribute from the clicked element
  const todoId = Number(event.target.dataset.todoId);

  const todos = getAllTodos(); // Retrieve all todos from local storage

  // Find the todo with the specified ID and toggle its completion status
  const foundTodo = todos.find((todo) => todo.id === todoId);
  foundTodo.isCompleted = !foundTodo.isCompleted;

  saveAllTodos(todos); // Save the updated todos in local storage

  // Update displayed todos based on the current filter
  filterTodos();
}

function editTodo(event) {
  // Display the edit modal
  showModal();
  const todoId = Number(event.target.dataset.todoId);
  // Retrieve all todos from local storage
  const todos = getAllTodos();
  // Find the todo to edit using its ID
  const editedTodo = todos.find((todo) => todo.id === todoId);
  // Populate the modal input with the current todo title
  todolistModalInput.value = editedTodo.title;
  // Attach a submit event listener to the modal form
  todolistModalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // Update the todo title with the new input value
    editedTodo.title = todolistModalInput.value;
    // Save the updated todos to local storage
    saveAllTodos(todos);
    // Update displayed todos based on the current filter
    filterTodos();
    // Hide the edit modal
    hideModal();
  });
}

function showModal() {
  todolistModalBackdrop.classList.add("show-modal-backdrop");
  todolistModal.classList.add("show-modal");
}

function hideModal() {
  todolistModalBackdrop.classList.remove("show-modal-backdrop");
  todolistModal.classList.remove("show-modal");
}

// Local Storage Utility Functions:

// Retrieve all saved todos
function getAllTodos() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

// Save all todos to local storage
function saveAllTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Save and update a todo in local storage
function saveTodo(todo) {
  // Check for existing todos in local storage
  const savedTodos = getAllTodos();
  // Add the new todo to the saved todos
  savedTodos.push(todo);
  // Save the updated todos to local storage
  saveAllTodos(savedTodos);

  return savedTodos;
}
