//Add Task button functionality
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");

// fucntion to get task name and type, objectify and pass along
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

// function to add a task to the list with unique id
var createTaskEl = function(taskDataObj) {
        // create list item
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";

        // add task id as custom attribute
        listItemEl.setAttribute("data-task-id", taskIdCounter)
    
        // create div to hold task info and add to list item
        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

        listItemEl.appendChild(taskInfoEl);

        // create task actions and append to task list item
        var taskActionsEl = createTaskActions(taskIdCounter);
        listItemEl.appendChild(taskActionsEl);
    
        //add entire list item div to <ul>
        tasksToDoEl.appendChild(listItemEl);

        // increase task ID counter for new ID next time
        taskIdCounter++;
};

// function to create actions for each task
var createTaskActions = function(taskId) {
    // creating div wrapper with class
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // creating edit button and adding it to task actions wrapper
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // creating edit button and adding it to task actions wrapper
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //creating select element to change task status and adding to to actions wrapper
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    // generating status choices for status select dropdown element with for loop
    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        //create option element and append to status element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

// function to handle edit and delete buttons
var taskButtonHandler = function(event) {
    //get clicked button
    var targetEl = event.target
    // delete button find and run function
    if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
    //edit button find and run function
    else if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
};

// delete button function to run when clicked
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
    taskSelected.remove();
};

//edit button function to run when clicked
var editTask = function(taskId) {
    // getting task list item we want to edit
    var taskSelected = document.querySelector(`.task-item[data-task-id="${taskId}"]`);

    //getting content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    //changing name input field and type selector to current task to edit
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    //changing submit button to say "Save Task"
    document.querySelector("#save-task").textContent = "Save Task";
    
    formEl.setAttribute("data-task-id", taskId);
};


//task button click handler
pageContentEl.addEventListener("click", taskButtonHandler);

//submitting task click handler
formEl.addEventListener("submit", taskFormHandler);