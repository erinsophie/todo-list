import Task from "./tasks.js";
import { projectsList } from "./projects.js";

class Project {
  constructor(title, dueDate, priority) {
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.tasks = [];
    projectsList.addProject(this);
  }

  addTask(title, dueDate, priority) {
    const newTask = new Task(title, dueDate, priority, false);
    this.tasks.push(newTask);
  }

  deleteTask(task) {
    const index = this.tasks.indexOf(task);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }
}

export default Project 
