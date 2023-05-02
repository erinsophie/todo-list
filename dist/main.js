(()=>{"use strict";const t=class{constructor(t,e,n,s){this.title=t,this.dueDate=e,this.priority=n,this.isCompleted=s}toggleCompletion(){this.isCompleted=!this.isCompleted}edit(t,e,n){this.title=t,this.dueDate=e,this.priority=n}},e=new class{constructor(){this.projects=[]}addProject(t){this.projects.push(t)}deleteProject(t){const e=this.projects.indexOf(t);-1!==e&&this.projects.splice(e,1)}},n=class{constructor(t,n,s){this.title=t,this.dueDate=n,this.priority=s,this.tasks=[],e.addProject(this)}addTask(e,n,s){const c=new t(e,n,s,!1);this.tasks.push(c)}deleteTask(t){const e=this.tasks.indexOf(t);-1!==e&&this.tasks.splice(e,1)}},s=new class{constructor(){this.tasks=[]}addTask(e,n,s){const c=new t(e,n,s,!1);this.tasks.push(c)}deleteTask(t){const e=this.tasks.indexOf(t);-1!==e&&this.tasks.splice(e,1)}};let c=null;function o(t,e,n){t.value="",e.value="",n.value=""}function d(t){t.preventDefault();const s=document.getElementById("title-input"),d=document.getElementById("date-input"),l=document.getElementById("priority-input"),a=s.value,r=d.value,u=l.value;a&&r&&u?(document.querySelector(".modal").classList.remove("active"),function(t,s,o){!function(t){const n=document.createElement("li");n.classList.add("project"),n.dataset.index=e.projects.indexOf(t);const s=document.createElement("p");s.classList.add("project-title"),s.textContent=`${t.title} (${t.dueDate})`;const o=document.createElement("button");o.classList.add("delete-project-btn"),o.textContent="Delete",n.append(s,o),document.getElementById("project-list").appendChild(n),n.addEventListener("click",(()=>{!function(t){c=t,console.log("current tab is:",c),document.getElementById("task-list").innerHTML="",t.tasks.forEach((t=>{i(t)}))}(t)})),o.addEventListener("click",(s=>{s.stopPropagation(),function(t,n){e.deleteProject(n),n.tasks.length=0,t.remove(),document.getElementById("project-list").childNodes.forEach(((t,e)=>{t.dataset.index=e})),console.log("projectslist array:",e.projects),console.log("this projects tasks:",n.tasks)}(n,t)}))}(new n(t,s,o))}(a,r,u),o(s,d,l)):alert("Please fill out all fields.")}function l(){document.querySelector(".modal").classList.add("active")}function i(t){const e=document.getElementById("task-list"),n=document.createElement("li"),s=document.createElement("p");s.classList.add("task-title"),s.textContent=`${t.title}`;const c=document.createElement("p");c.classList.add("due-date"),c.textContent=`${t.dueDate}`;const o=document.createElement("p");o.classList.add("priority-level"),o.textContent=`${t.priority}`,n.append(s,c,o),e.append(n)}function a(){document.querySelector(".task-div").style.display="block"}function r(t){t.preventDefault(),document.querySelector(".task-div").style.display="none"}function u(e){e.preventDefault();const n=document.querySelector(".task-div"),d=document.getElementById("task-title"),l=document.getElementById("task-date"),a=document.getElementById("task-priority"),r=d.value,u=l.value,m=a.value;r&&u&&m?(n.style.display="none",function(e,n,c,o=null){const d=new t(e,n,c,!1);o?o.addTask(e,n,c):s.addTask(e,n,c),i(d)}(r,u,m,c),o(d,l,a)):alert("Please fill out all fields.")}function m(){c=null,console.log("current tab is index",c),document.getElementById("task-list").innerHTML="",s.tasks.forEach((t=>{i(t)}))}function p(){document.getElementById("create-project-btn").addEventListener("click",l),document.getElementById("add-project-btn").addEventListener("click",d),document.getElementById("add-task-btn").addEventListener("click",a),document.getElementById("add-task-to-project").addEventListener("click",u),document.getElementById("inbox-btn").addEventListener("click",m),document.getElementById("cancel-task").addEventListener("click",r)}p(),p(),s.tasks.forEach((t=>{i(t)}))})();