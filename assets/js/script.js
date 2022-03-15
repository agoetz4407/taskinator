//Add Task button functionality
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check for invalid inputs - no value
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to enter a task name and choose a task type.")
        return false;
    }

    formEl.reset();
    //collect data from varaibles into an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    //send object as an argument for createTaskEl function
    createTaskEl(taskDataObj);
};

var createTaskEl = function(taskDataObj) {
        // create list item
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
    
        // create div to hold task info and add to list item
        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

        listItemEl.appendChild(taskInfoEl);
    
        //add entire list item div to <ul>
        tasksToDoEl.appendChild(listItemEl);
};


formEl.addEventListener("submit", taskFormHandler);