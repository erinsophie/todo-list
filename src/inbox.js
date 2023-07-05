import Task from './tasks';

export class Inbox {
  constructor() {
    this.tasks = [];
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

export const inboxList = new Inbox();
