import Project from "./project.js";
import { projectsList } from "./projects.js";
import Task from "./tasks.js";
import { inboxList } from "./inbox.js";

// both projects and tasks
let currentTab = null;

function clearInputFields(titleInput, dateInput, priorityInput) {
  titleInput.value = "";
  dateInput.value = "";
  priorityInput.value = "";
}

// projects
// Display the project on the page
function displayProject(project) {
  const projectElement = document.createElement("li");
  projectElement.classList.add("project");
  projectElement.dataset.projectIndex = projectsList.projects.indexOf(project);

  const projectTitle = document.createElement("p");
  projectTitle.classList.add("project-title");
  projectTitle.textContent = `${project.title} (${project.dueDate})`;

  projectElement.append(projectTitle);
  const projectList = document.getElementById("project-list");
  projectList.appendChild(projectElement);

  projectElement.addEventListener("click", () => {
    currentTab = project;
    console.log("current tab is this project:", currentTab);

    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    // Display tasks associated with the clicked project
    project.tasks.forEach((task) => {
      displayTask(task);
    });
  });
}

// Create a new project
function createProject(title, dueDate, priority) {
  const project = new Project(title, dueDate, priority);
  displayProject(project);
}

// Handle creating a new project
function addNewProject(event) {
  event.preventDefault();
  const titleInput = document.getElementById("title-input");
  const dueDateInput = document.getElementById("date-input");
  const priorityInput = document.getElementById("priority-input");

  const title = titleInput.value;
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;

  if (title && dueDate && priority) {
    closeModal();
    createProject(title, dueDate, priority);
    clearInputFields(titleInput, dueDateInput, priorityInput);
  } else {
    alert("Both title and due date are required.");
  }
}

function openModal() {
  const modal = document.querySelector(".modal");
  modal.classList.add("active");
}

function closeModal() {
  const modal = document.querySelector(".modal");
  modal.classList.remove("active");
}

////////////////////////////////////////////////////////////////

// tasks
// display task
function displayTask(task) {
  const taskList = document.getElementById("task-list");
  const taskItem = document.createElement("li");

  const taskTitle = document.createElement("p");
  taskTitle.classList.add("task-title");
  taskTitle.textContent = `${task.title}`;

  const taskDate = document.createElement("p");
  taskDate.classList.add("due-date");
  taskDate.textContent = `${task.dueDate}`;

  const priority = document.createElement("p");
  priority.classList.add("priority-level");
  priority.textContent = `${task.priority}`;

  taskItem.append(taskTitle, taskDate, priority);
  taskList.append(taskItem);
}

// Create a new task and add it to the project's tasks array or the inbox's tasks array
function createTask(title, dueDate, priority, project = null) {
  const task = new Task(title, dueDate, priority, false);

  if (project) {
    project.addTask(title, dueDate, priority);
    console.log("project tasks:", project.tasks);
  } else {
    inboxList.addTask(title, dueDate, priority);
    console.log("inbox tasks:", inboxList.tasks);
  }
  displayTask(task);
}

// open task form
function openTaskForm() {
  const taskDiv = document.querySelector('.task-div');
  taskDiv.style.display = 'block';
}

// add task to project
function addTaskToProject(event) {
  event.preventDefault();
  const taskDiv = document.querySelector('.task-div');
  
  const titleInput = document.getElementById("task-title");
  const dueDateInput = document.getElementById("task-date");
  const priorityInput = document.getElementById("task-priority");

  const title = titleInput.value;
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;

  if (title && dueDate && priority) {
    taskDiv.style.display = 'none';
    createTask(title, dueDate, priority, currentTab);
    clearInputFields(titleInput, dueDateInput, priorityInput);
  } else {
    alert("Both title and due date are required.");
  }
}


////////////////////////////////////////////////////////////////
// inbox and event listeners

// open inbox
function openInbox() {
  currentTab = null;
  console.log("current tab is index", currentTab);
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  // Display tasks from the inbox
  inboxList.tasks.forEach((task) => {
    displayTask(task);
  });
}

function eventListeners() {
  // create project button
  const createProjectButton = document.getElementById("create-project-btn");
  createProjectButton.addEventListener("click", openModal);

  // create task button
  const addTaskButton = document.getElementById("add-task-btn");
  addTaskButton.addEventListener("click", openTaskForm);

  // add task to project 
  const addTaskToProjectBtn = document.getElementById('add-task-to-project');
  addTaskToProjectBtn.addEventListener('click', addTaskToProject)

  // add new project
  const addButton = document.querySelector(".add-project-btn");
  addButton.addEventListener("click", addNewProject);

  // inbox button
  const inboxBtn = document.getElementById("inbox-btn");
  inboxBtn.addEventListener("click", openInbox);
}

eventListeners();

// Display tasks from the inbox by default
function initialize() {
  eventListeners();

  inboxList.tasks.forEach((task) => {
    displayTask(task);
  });
}

initialize();
