import {
  format,
  parse,
  isValid,
  parseISO,
  differenceInCalendarDays,
} from 'date-fns';
import Project from './project';
import { projectsList } from './projects';
import { inboxList } from './inbox';
import { saveToLocalStorage, loadFromLocalStorage } from './storage';
import { getTasksDueToday, getTasksDueThisWeek } from './tasks';

// IIFE that exposes initialise function only
const uiModule = (() => {
  let currentTab = null;
  setProjectTitle();

  // capitalise the first letter of inputs
  function capitaliseLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // projects
  // Display the project on the page
  function displayProject(project) {
    const projectListUI = document.querySelector('.project-list');
    const projectElement = document.createElement('li');
    projectElement.classList.add('project');

    const projectTitle = document.createElement('p');
    const capitalisedTitle = capitaliseLetter(project.title);

    const dueDate = parse(project.dueDate, 'yyyy-MM-dd', new Date());
    const formattedDate = format(dueDate, 'dd/MM/yyyy');

    projectTitle.textContent = `${capitalisedTitle} (${formattedDate})`;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-project-btn');
    deleteBtn.innerHTML = '<i class="fa-solid fa-x"></i>';

    projectElement.append(projectTitle, deleteBtn);
    projectListUI.appendChild(projectElement);

    console.log('list of projects:', projectsList.projects);

    // open project when clicked
    projectElement.addEventListener('click', () => {
      openProject(project, projectElement);
    });

    deleteBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      removeProject(project, projectElement);
    });
  }

  // clear task list ul
  function clearTaskListElement() {
    const taskList = document.querySelector('.task-list');
    taskList.innerHTML = '';
  }

  // remove project
  function removeProject(project, projectElement) {
    // Remove the project and its tasks from the projects list array
    projectsList.deleteProject(project);
    project.tasks.length = 0;

    // remove project from project-list ul
    projectElement.remove();

    // remove tasks from task-list ul
    clearTaskListElement();

    // direct back to inbox tab
    openInbox();

    // call local storage
    saveToLocalStorage(projectsList, inboxList);

    console.log('list of projects:', projectsList.projects);
    console.log('this projects tasks:', project);
  }

  // open project and highlight the selected project
  function openProject(project) {
    currentTab = project;
    setProjectTitle();
    showAddTaskBtn();
    clearTaskListElement();
    console.log('current tab is:', currentTab);

    project.tasks.forEach((task) => {
      const remainingDays = getRemainingDays(task.dueDate);
      displayTask(task, remainingDays);
    });
  }

  // Create a new project
  function createProject(title, dueDate) {
    const project = new Project(title, dueDate);
    displayProject(project);
    saveToLocalStorage(projectsList, inboxList);
  }

  // Handle creating a new project
  function addNewProject(event) {
    event.preventDefault();
    const titleInput = document.getElementById('title-input');
    const dueDateInput = document.getElementById('date-input');

    const title = titleInput.value;
    const dueDate = dueDateInput.value;

    const parsedDueDate = parse(dueDate, 'yyyy-MM-dd', new Date());
    // Check if the due date is valid
    if (!isValid(parsedDueDate)) {
      alert("Please enter a valid due date in the format 'dd/mm/yyyy'");
      return;
    }

    if (title && dueDate) {
      closeModal();
      createProject(title, dueDate);
      clearInputFields(titleInput, dueDateInput);
    } else {
      alert('Please fill out all fields.');
    }
  }

  // open modal
  function openModal() {
    const modal = document.querySelector('.modal');
    modal.classList.add('active');
    const overlay = document.querySelector('.overlay');
    overlay.classList.add('active');
  }

  // close modal
  function closeModal() {
    const modal = document.querySelector('.modal');
    modal.classList.remove('active');
    const overlay = document.querySelector('.overlay');
    overlay.classList.remove('active');
  }

  // tasks
  // display task
  function displayTask(task, remainingDays) {
    const taskList = document.querySelector('.task-list');
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');

    const container1 = document.createElement('div');
    container1.classList.add('container1');
    const container2 = document.createElement('div');
    container2.classList.add('container2');

    const taskTitle = document.createElement('p');
    taskTitle.classList.add('task-title');
    const capitalisedTitle = capitaliseLetter(task.title);
    taskTitle.textContent = `${capitalisedTitle}`;

    const daysLeft = document.createElement('p');
    if(remainingDays === 0) {
      daysLeft.textContent = '(Due today)';
    } else {
      daysLeft.textContent = `(${remainingDays} days left)`;
    }
    
    const dueDate = parse(task.dueDate, 'yyyy-MM-dd', new Date());
    const formattedDate = format(dueDate, 'dd/MM/yyyy');

    const taskDueDate = document.createElement('p');
    taskDueDate.classList.add('task-due-date');
    taskDueDate.textContent = formattedDate;

    const priority = document.createElement('p');
    priority.classList.add('priority');
    setTaskPriority(task, priority);

    const deleteTaskBtn = document.createElement('button');
    deleteTaskBtn.classList.add('delete-task');
    deleteTaskBtn.innerHTML = '<i class="fa-solid fa-x"></i>';

    const completeBtn = document.createElement('input');
    completeBtn.classList.add('complete-btn');
    completeBtn.setAttribute('type', 'checkbox');
    setTaskAsComplete(task, taskTitle, completeBtn);

    container1.append(completeBtn, taskTitle);
    container2.append(daysLeft, formattedDate, priority, deleteTaskBtn);

    taskItem.append(container1, container2);
    taskList.append(taskItem);

    // delete button and complete button
    deleteTaskBtn.addEventListener('click', () => {
      deleteTask(taskItem, task);
    });

    completeBtn.addEventListener('click', () => {
      completeTask(taskTitle, task);
    });
  }

  // remaining days
  function getRemainingDays(taskDueDate) {
    const today = new Date();
    const dueDate = parseISO(taskDueDate);
    return differenceInCalendarDays(dueDate, today);
  }

  // task priority
  function setTaskPriority(task, priority) {
    if (task.priority === 'Low') {
      priority.classList.add('priority-low');
    } else if (task.priority === 'Medium') {
      priority.classList.add('priority-medium');
    } else {
      priority.classList.add('priority-high');
    }
  }

  // set task as complete
  function setTaskAsComplete(task, taskTitle, completeBtn) {
    if (task.isCompleted) {
      taskTitle.classList.add('strike-through');
      completeBtn.checked = true;
    }
  }

  // complete task
  function completeTask(capitalisedTitle, task) {
    // toggle completion in task class
    task.toggleCompletion();

    // cross item off in ui
    if (task.isCompleted) {
      capitalisedTitle.classList.add('strike-through');
    } else {
      capitalisedTitle.classList.remove('strike-through');
    }
    // save to local storage
    saveToLocalStorage(projectsList, inboxList);
  }

  // delete task
  function deleteTask(taskItem, task) {
    // remove from inbox or project array
    if (currentTab === null) {
      inboxList.deleteTask(task);
    } else {
      currentTab.deleteTask(task);
    }
    // remove from task-list ul
    taskItem.remove();
    console.log('current inbox tasks:', inboxList.tasks);
    if (currentTab !== null) {
      console.log('current projects tasks:', currentTab.tasks);
    }
    // save to local storage
    saveToLocalStorage(projectsList, inboxList);
  }

  // Create a new task and add it to the project's tasks array or the inbox's tasks array
  function createTask(title, dueDate, priority, project = null) {
    let task;

    if (project) {
      task = project.addTask(title, dueDate, priority);
      console.log('task added to this project:', project);
    } else {
      task = inboxList.addTask(title, dueDate, priority);
      console.log('task added to inbox:', inboxList.tasks);
    }

    const remainingDays = getRemainingDays(task.dueDate);
    displayTask(task, remainingDays);
    saveToLocalStorage(projectsList, inboxList);
  }

  // add task to project
  function addTaskToProject(event) {
    event.preventDefault();
    const taskContainer = document.querySelector('.task-form-container');

    const titleInput = document.getElementById('task-title');
    const dueDateInput = document.getElementById('task-date');
    const priorityInput = document.getElementById('task-priority');

    const title = titleInput.value;
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;

    const parsedDueDate = parse(dueDate, 'yyyy-MM-dd', new Date());
    // Check if the due date is valid
    if (!isValid(parsedDueDate)) {
      alert("Please enter a valid due date in the format 'dd/mm/yyyy'");
      return;
    }

    if (title && dueDate && priority) {
      taskContainer.style.display = 'none';
      createTask(title, dueDate, priority, currentTab);
      clearInputFields(titleInput, dueDateInput, priorityInput);
    } else {
      alert('Please fill out all fields.');
    }
  }

  // open task form
  function openTaskForm() {
    const taskContainer = document.querySelector('.task-form-container');
    taskContainer.style.display = 'block';
  }

  // close task form
  function closeTaskForm(event) {
    event.preventDefault();
    const taskContainer = document.querySelector('.task-form-container');
    taskContainer.style.display = 'none';

    const titleInput = document.getElementById('task-title');
    const dueDateInput = document.getElementById('task-date');
    const priorityInput = document.getElementById('task-priority');
    clearInputFields(titleInput, dueDateInput, priorityInput);
  }

  // functions for both projects and tasks

  function clearInputFields(titleInput, dateInput, priorityInput) {
    if (titleInput) {
      titleInput.value = '';
    }
    if (dateInput) {
      dateInput.value = '';
    }
    if (priorityInput) {
      priorityInput.value = '';
    }
  }

  // open inbox
  function openInbox() {
    currentTab = null;
    setProjectTitle();
    showAddTaskBtn();
    clearTaskListElement();
    console.log('current tab is index', currentTab);

    // Display tasks from the inbox
    inboxList.tasks.forEach((task) => {
      const remainingDays = getRemainingDays(task.dueDate);
      displayTask(task, remainingDays);
    });
  }

  // set project title when opened
  function setProjectTitle() {
    const currentProject = document.querySelector('.current-project');

    if (currentTab) {
      currentProject.textContent = capitaliseLetter(currentTab.title);
    } else {
      currentProject.textContent = 'Inbox';
    }
  }

  // hide add task button
  function hideAddTaskBtn() {
    const addTaskBtn = document.querySelector('.add-task-btn');
    addTaskBtn.style.display = 'none';
  }

  function showAddTaskBtn() {
    const addTaskBtn = document.querySelector('.add-task-btn');
    addTaskBtn.style.display = 'block';
  }

  // display tasks due today
  function displayTodaysTasks() {
    clearTaskListElement();
    hideAddTaskBtn();
    const title = document.querySelector('.current-project');
    title.textContent = 'Tasks due today';

    const todaysTasks = getTasksDueToday();
    todaysTasks.forEach((task) => {
      const remainingDays = getRemainingDays(task.dueDate);
      displayTask(task, remainingDays);
    });
  }

  // display tasks due this week
  function displayThisWeeksTasks() {
    clearTaskListElement();
    hideAddTaskBtn();
    const title = document.querySelector('.current-project');
    title.textContent = 'Tasks due this week';

    const thisWeeksTasks = getTasksDueThisWeek();
    thisWeeksTasks.forEach((task) => {
      const remainingDays = getRemainingDays(task.dueDate);
      displayTask(task, remainingDays);
    });
  }

  // event listeners
  function eventListeners() {
    // create a project button
    const addProjectButton = document.querySelector('.create-project-btn');
    addProjectButton.addEventListener('click', openModal);

    // add project to project array
    const addButton = document.querySelector('.add-project-btn');
    addButton.addEventListener('click', addNewProject);

    // create task button
    const addTaskButton = document.querySelector('.add-task-btn');
    addTaskButton.addEventListener('click', openTaskForm);

    // add task to project
    const addTaskToProjectBtn = document.querySelector('.add-task-to-project');
    addTaskToProjectBtn.addEventListener('click', addTaskToProject);

    // inbox button
    const inboxBtn = document.querySelector('.inbox-btn');
    inboxBtn.addEventListener('click', openInbox);

    // cancel task
    const cancelTaskButton = document.querySelector('.cancel-task');
    cancelTaskButton.addEventListener('click', closeTaskForm);

    // cancel project
    const cancelProjectButton = document.querySelector('.cancel-project');
    cancelProjectButton.addEventListener('click', closeModal);

    // open todays tasks
    const todayBtn = document.querySelector('.today-btn');
    todayBtn.addEventListener('click', displayTodaysTasks);

    // open this weeks tasks
    const thisWeekBtn = document.querySelector('.this-week-btn');
    thisWeekBtn.addEventListener('click', displayThisWeeksTasks);
  }

  // load projects from local storage
  function initialize() {
    eventListeners();
    loadFromLocalStorage();

    // Display inbox tasks
    inboxList.tasks.forEach((task) => {
      const remainingDays = getRemainingDays(task.dueDate);
      displayTask(task, remainingDays);
    });

    // Display saved projects and their tasks
    projectsList.projects.forEach((project) => {
      displayProject(project);
    });
  }
  return {
    initialize,
  };
})();

export default uiModule;
