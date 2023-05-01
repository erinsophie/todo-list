class TodoItem {
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

export default TodoItem;
