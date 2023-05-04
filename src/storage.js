import { projectsList } from "./projects.js";
import { inboxList } from "./inbox.js";
import Project from "./project.js";
import Task from "./tasks.js";

const LOCAL_STORAGE_PROJECTS_KEY = "task.projects";
const LOCAL_STORAGE_INBOX_KEY = "task.inbox";

function saveToLocalStorage() {
  localStorage.setItem(
    LOCAL_STORAGE_PROJECTS_KEY,
    JSON.stringify(projectsList.projects)
  );
  localStorage.setItem(
    LOCAL_STORAGE_INBOX_KEY,
    JSON.stringify(inboxList.tasks)
  );
}

function loadFromLocalStorage() {
  const projectsData = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY)
  );
  const inboxData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_INBOX_KEY));

  if (projectsData) {
    projectsData.forEach((projectData) => {
      const project = new Project(
        projectData.title,
        projectData.dueDate,
        projectData.priority
      );

      projectData.tasks.forEach((taskData) => {
        const task = new Task(
          taskData.title,
          taskData.dueDate,
          taskData.priority,
          taskData.isCompleted
        );
        project.tasks.push(task);
      });
    });
  }

  if (inboxData) {
    inboxData.forEach((taskData) => {
      const task = new Task(
        taskData.title,
        taskData.dueDate,
        taskData.priority,
        taskData.isCompleted
      );
      inboxList.tasks.push(task);
    });
  }
}

export { saveToLocalStorage, loadFromLocalStorage };
