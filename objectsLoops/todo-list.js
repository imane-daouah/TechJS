const todoList = [{
  name: 'review course',
  dueDate: '2025-09-29'
}];

renderTodoList();

function renderTodoList() {
  let todoListHTML = '';

  // Loop over every toDo object and append it to "todoListHTML"
  // Show the objects inside the class "js-todo-list"
  // Loop over evey delete button and add an eventListener that deletes the toDo and rerender the Tasks
  todoList.forEach((todo, index) => {
    const { name, dueDate } = todo;
    const html = `
      <div>${name}</div>
      <div>${dueDate}</div>
      <button class="js-delete-button" data-index="${index}">Delete</button>
    `;
    todoListHTML += html;
  });

  document.querySelector('.js-todo-list').innerHTML = todoListHTML;

  document.querySelectorAll('.js-delete-button').forEach(button => {
    button.addEventListener('click', (event) => {
      const index = event.target.dataset.index;
      todoList.splice(index, 1);
      renderTodoList();
    });
  });

}

document.querySelector('.js-add-todo-button')
  .addEventListener('click', () => {
    addTodo();
  });

function addTodo() {
  const inputElement = document.querySelector('.js-name-input');
  const name = inputElement.value;

  const dateInputElement = document.querySelector('.js-due-date-input');
  const dueDate = dateInputElement.value;

  // Add these values to the variable "todoList"
if (name && dueDate) {
    todoList.push({ name, dueDate });
  }

  inputElement.value = '';
  dateInputElement.value = '';

  renderTodoList();
}