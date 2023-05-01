import Project from "./Project.js";
import { projectsList } from "./Projects.js";
import Task from "./tasks.js";

const createProjectButton = document.getElementById("create-project-btn");
const addTaskButton = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const projectList = document.getElementById("project-list");
const taskContainer = document.querySelector(".task-list-container");

// Display the project on the page
function displayProject(project) {
  const projectElement = document.createElement("li");
  projectElement.classList.add("project");
  projectElement.dataset.projectIndex = projectsList.projects.indexOf(project);

  const projectTitle = document.createElement("p");
  projectTitle.classList.add("project-title");
  projectTitle.textContent = `${project.title} (${project.dueDate})`;

  projectElement.append(projectTitle);
  projectList.appendChild(projectElement);

  projectElement.addEventListener("click", () => {
    taskList.innerHTML = "";
    const title = document.createElement("p");
    title.textContent = `${project.title}`;
    taskContainer.append(title);
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

// display task in general task list
function displayTask(task) {
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

// create a new task
function createTask(title, dueDate, priority) {
  const task = new Task(title, dueDate, priority);
  displayTask(task);
}

// handle create task
function handleCreateTask() {
  const title = prompt("Title of task:");
  const dueDate = prompt("Task due date:");
  const priority = prompt("Priority level:");
  if (title && dueDate && priority) {
    createTask(title, dueDate, priority);
  } else {
    alert("Both title and due date are required.");
  }
}

createProjectButton.addEventListener("click", handleCreateProject);
addTaskButton.addEventListener("click", handleCreateTask);
