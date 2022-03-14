//Add Task button functionality
var buttonEl = document.querySelector("#save-task");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function() {
    var taskItemEl = document.createElement("li");
    taskItemEl.className = "task-item";
    taskItemEl.textContent = "This is a new task";
    tasksToDoEl.appendChild(taskItemEl);
};

buttonEl.addEventListener("click", createTaskHandler);