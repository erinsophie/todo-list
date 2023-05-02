import Project from "./project.js";
import { projectsList } from "./projects.js";
import Task from "./tasks.js";
import { inboxList } from "./inbox.js";

let currentTab = null;

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
function handleCreateProject() {
  const title = prompt("Enter the project title:");
  const dueDate = prompt("Enter the project due date:");
  const priority = prompt("Enter priority level:");
  if (title && dueDate && priority) {
    createProject(title, dueDate, priority);
  } else {
    alert("Both title and due date are required.");
  }
}

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

// handle create task
function handleCreateTask() {
  const title = prompt("Title of task:");
  const dueDate = prompt("Task due date:");
  const priority = prompt("Priority level:");

  if (title && dueDate && priority) {
    createTask(title, dueDate, priority, currentTab);
  } else {
    alert("Both title and due date are required.");
  }
}

function eventListeners() {
  // create project button
  const createProjectButton = document.getElementById("create-project-btn");
  createProjectButton.addEventListener("click", handleCreateProject);

  // create task button
  const addTaskButton = document.getElementById("add-task-btn");
  addTaskButton.addEventListener("click", handleCreateTask);

  // inbox button
  const inboxBtn = document.getElementById("inbox-btn");
  inboxBtn.addEventListener("click", () => {
    currentTab = null;
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    // Display tasks from the inbox
    inboxList.tasks.forEach((task) => {
      displayTask(task);
    });
  });
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
