import Task from './tasks';
import { projectsList } from './projects';

class Project {
  constructor(title, dueDate) {
    this.title = title;
    this.dueDate = dueDate;
    this.tasks = [];
    projectsList.addProject(this);
  }

  addTask(title, dueDate, priority) {
    const newTask = new Task(title, dueDate, priority, false);
    this.tasks.push(newTask);
    return newTask;
  }

  deleteTask(task) {
    const index = this.tasks.indexOf(task);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }
  
  getAllTasks() {
    return this.tasks;
  }
}

export default Project;
