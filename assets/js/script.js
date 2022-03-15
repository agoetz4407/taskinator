//Add Task button functionality
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function() {

    event.preventDefault();

    var taskItemEl = document.createElement("li");
    taskItemEl.className = "task-item";
    taskItemEl.textContent = "This is a new task";
    tasksToDoEl.appendChild(taskItemEl);
};

formEl.addEventListener("submit", createTaskHandler);