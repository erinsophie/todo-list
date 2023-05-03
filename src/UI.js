import { format, parse, isValid } from "date-fns";
import Project from "./project.js";
import { projectsList } from "./projects.js";
import { inboxList } from "./inbox.js";

let currentTab = null;

// projects
// Display the project on the page
function displayProject(project) {
  const projectElement = document.createElement("li");
  projectElement.classList.add("project");

  const projectTitle = document.createElement("p");
  projectTitle.classList.add("project-title");

  const projectDate = document.getElementById("date-input");
  const dueDate = parse(projectDate.value, "dd/MM/yyyy", new Date());
  const formattedDate = format(dueDate, "dd/MM/yyyy");

  projectTitle.textContent = `${project.title} (${formattedDate})`;

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
    openProject(project, projectElement);
  });

  deleteBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent triggering the click event on the projectElement
    removeProject(projectElement, project);
  });
}

// clear task list ul
function clearTaskListElement() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";
}

// remove project
function removeProject(projectElement, project) {
  // Remove the project and its tasks from the projects list array
  projectsList.deleteProject(project);
  project.tasks.length = 0;
  // remove project from project-list ul
  projectElement.remove();
  // remove tasks from task-list ul
  clearTaskListElement();
}

// open project and highlight the selected project
function openProject(project, projectElement) {
  currentTab = project;
  console.log("current tab is:", currentTab);
  clearTaskListElement();

  // Display tasks associated with the clicked project
  project.tasks.forEach((task) => {
    displayTask(task);
  });

  const inboxBtn = document.getElementById("inbox-btn");
  const projectElements = document.querySelectorAll(".project");
  projectElements.forEach((element) => {
    element.classList.remove("current-tab");
  });

  inboxBtn.classList.remove("current-tab");
  projectElement.classList.add("current-tab");
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

  const parsedDueDate = parse(dueDate, "dd/MM/yyyy", new Date());
  // Check if the due date is valid
  if (!isValid(parsedDueDate)) {
    alert("Please enter a valid due date in the format 'dd/mm/yyyy'");
    return;
  }

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

  const dueDate = parse(task.dueDate, "dd/MM/yyyy", new Date());
  const formattedDate = format(dueDate, "dd/MM/yyyy");
  const taskDueDate = document.createElement("p");
  taskDueDate.classList.add("task-due-date");
  taskDueDate.textContent = formattedDate;

  const priority = document.createElement("p");
  priority.classList.add("priority-level");
  priority.textContent = `${task.priority}`;

  const deleteTaskBtn = document.createElement("button");
  deleteTaskBtn.classList.add("delete-task");
  deleteTaskBtn.textContent = "Delete task";

  taskItem.append(taskTitle, taskDueDate, priority, deleteTaskBtn);
  taskList.append(taskItem);

  deleteTaskBtn.addEventListener("click", () => {
    deleteTask(taskItem, task);
  });
}

function deleteTask(taskItem, task) {
  // remove from inbox or project array
  if (currentTab === null) {
    inboxList.deleteTask(task);
  } else {
    currentTab.deleteTask(task);
  }
  // remove from task-list ul
  taskItem.remove();
  console.log("current inbox tasks:", inboxList.tasks);
  if (currentTab !== null) {
    console.log("current projects tasks:", currentTab.tasks);
  }
}

// Create a new task and add it to the project's tasks array or the inbox's tasks array
function createTask(title, dueDate, priority, project = null) {
  let task;

  if (project) {
    task = project.addTask(title, dueDate, priority);
    console.log("task added to project:", project.tasks);
  } else {
    task = inboxList.addTask(title, dueDate, priority);
    console.log("task added to inbox:", inboxList.tasks);
  }
  displayTask(task);
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

  const parsedDueDate = parse(dueDate, "dd/MM/yyyy", new Date());
  // Check if the due date is valid
  if (!isValid(parsedDueDate)) {
    alert("Please enter a valid due date in the format 'dd/mm/yyyy'");
    return;
  }

  if (title && dueDate && priority) {
    taskDiv.style.display = "none";
    createTask(title, dueDate, priority, currentTab);
    clearInputFields(titleInput, dueDateInput, priorityInput);
  } else {
    alert("Please fill out all fields.");
  }
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
  const titleInput = document.getElementById("task-title");
  const dueDateInput = document.getElementById("task-date");
  const priorityInput = document.getElementById("task-priority");
  clearInputFields(titleInput, dueDateInput, priorityInput);
}

/// /////////////////////////////////////////////////////////////
// functions for both projects and tasks

function clearInputFields(titleInput, dateInput, priorityInput) {
  titleInput.value = "";
  dateInput.value = "";
  priorityInput.value = "";
}

// open inbox
function openInbox() {
  currentTab = null;
  console.log("current tab is index", currentTab);
  clearTaskListElement();

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
  console.log("inbox tasks:", inboxList.tasks);
}

// event listeners
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

  // cancel project
  const cancelProjectButton = document.getElementById("cancel-project");
  cancelProjectButton.addEventListener("click", closeModal);
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
