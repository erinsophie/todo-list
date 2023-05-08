import { inboxList } from './inbox.js';
import { projectsList } from './projects.js';
import { isToday, isThisWeek, parseISO } from 'date-fns';

class Task {
  constructor(title, dueDate, priority, isCompleted) {
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.isCompleted = isCompleted;
  }

  toggleCompletion() {
    this.isCompleted = !this.isCompleted;
  }

  edit(newTitle, newDueDate, newPriority) {
    this.title = newTitle;
    this.dueDate = newDueDate;
    this.priority = newPriority;
  }
}

function getAllTasks() {
  const allTasks = [...inboxList.tasks];
  projectsList.projects.forEach((project) => allTasks.push(...project.tasks));
  return allTasks;
}

function getTasksDueToday() {
  const allTasks = getAllTasks();
  return allTasks.filter((task) => isToday(parseISO(task.dueDate)));
}

function getTasksDueThisWeek() {
  const allTasks = getAllTasks();

  return allTasks.filter(task => {
    const taskDueDate = parseISO(task.dueDate);
    return isThisWeek(taskDueDate, { weekStartsOn: 0 });
  });
}

export default Task;
export { getAllTasks, getTasksDueToday, getTasksDueThisWeek };
