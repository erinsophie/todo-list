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
  projectElement.dataset.index = projectsList.projects.indexOf(project);

  const projectTitle = document.createElement("p");
  projectTitle.classList.add("project-title");
  projectTitle.textContent = `${project.title} (${project.dueDate})`;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-project-btn");
  deleteBtn.textContent = "Delete";

  projectElement.append(projectTitle, deleteBtn);

  const projectListUI = document.getElementById("project-list");
  projectListUI.appendChild(projectElement);

  console.log("list of projects:", projectsList.projects);
  console.log("this projects tasks:", project.tasks);

  // open project when clicked
  projectElement.addEventListener("click", () => {
    openProject(project);
  });

  deleteBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent triggering the click event on the projectElement
    removeProject(projectElement, project);
  });
}

// remove project
function removeProject(projectElement, project) {
  // Remove the project and its tasks from the projects array
  projectsList.deleteProject(project);
  project.tasks.length = 0;

  // Remove the project and its tasks from the UI
  projectElement.remove();
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  // Update the data-index attributes for the remaining projects
  const projectListUI = document.getElementById("project-list");
  projectListUI.childNodes.forEach((project, index) => {
    project.dataset.index = index;
  });
  console.log("projectslist array:", projectsList.projects);
  console.log("this projects tasks:", project.tasks);
}

// open project
function openProject(project) {
  currentTab = project;
  console.log("current tab is:", currentTab);

  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  // Display tasks associated with the clicked project
  project.tasks.forEach((task) => {
    displayTask(task);
  });

  // Highlight the selected project
  const inboxBtn = document.getElementById('inbox-btn');
  const projectElements = document.querySelectorAll(".project");
  projectElements.forEach((projectElement) => {
    projectElement.classList.remove("current-tab");
    if (
      projectElement.dataset.index ===
      projectsList.projects.indexOf(project).toString()
    ) {
      projectElement.classList.add("current-tab");
      inboxBtn.classList.remove('current-tab')
    }
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
    alert("Please fill out all fields.");
  }
}

// open modal
function openModal() {
  const modal = document.querySelector(".modal");
  modal.classList.add("active");
}

// close modal
function closeModal() {
  const modal = document.querySelector(".modal");
  modal.classList.remove("active");
}

/// /////////////////////////////////////////////////////////////

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

  const deleteTaskBtn = document.createElement("button");
  deleteTaskBtn.classList.add("delete-task");
  deleteTaskBtn.textContent = "Delete task";

  taskItem.append(taskTitle, taskDate, priority, deleteTaskBtn);
  taskList.append(taskItem);
}

// Create a new task and add it to the project's tasks array or the inbox's tasks array
function createTask(title, dueDate, priority, project = null) {
  const task = new Task(title, dueDate, priority, false);

  if (project) {
    project.addTask(title, dueDate, priority);
  } else {
    inboxList.addTask(title, dueDate, priority);
  }
  displayTask(task, project);
}

// open task form
function openTaskForm() {
  const taskDiv = document.querySelector(".task-div");
  taskDiv.style.display = "block";
}

// close task form
function closeTaskForm(event) {
  event.preventDefault();
  const taskDiv = document.querySelector(".task-div");
  taskDiv.style.display = "none";
}

// add task to project
function addTaskToProject(event) {
  event.preventDefault();
  const taskDiv = document.querySelector(".task-div");

  const titleInput = document.getElementById("task-title");
  const dueDateInput = document.getElementById("task-date");
  const priorityInput = document.getElementById("task-priority");

  const title = titleInput.value;
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;

  if (title && dueDate && priority) {
    taskDiv.style.display = "none";
    createTask(title, dueDate, priority, currentTab);
    clearInputFields(titleInput, dueDateInput, priorityInput);
  } else {
    alert("Please fill out all fields.");
  }
}

/// /////////////////////////////////////////////////////////////
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

  // Highlight the inbox
  const inboxBtn = document.getElementById("inbox-btn");
  const projectElements = document.querySelectorAll(".project");
  projectElements.forEach((projectElement) => {
    projectElement.classList.remove("current-tab");
  });
  inboxBtn.classList.add("current-tab");
}

function eventListeners() {
  // create a project button
  const addProjectButton = document.getElementById("create-project-btn");
  addProjectButton.addEventListener("click", openModal);

  // add project to project array
  const addButton = document.getElementById("add-project-btn");
  addButton.addEventListener("click", addNewProject);

  // create task button
  const addTaskButton = document.getElementById("add-task-btn");
  addTaskButton.addEventListener("click", openTaskForm);

  // add task to project
  const addTaskToProjectBtn = document.getElementById("add-task-to-project");
  addTaskToProjectBtn.addEventListener("click", addTaskToProject);

  // inbox button
  const inboxBtn = document.getElementById("inbox-btn");
  inboxBtn.addEventListener("click", openInbox);

  // cancel task
  const cancelTaskButton = document.getElementById("cancel-task");
  cancelTaskButton.addEventListener("click", closeTaskForm);
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