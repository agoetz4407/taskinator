//Declaring global variables
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

// function to get task name and type, objectify and pass along
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

    var isEdit = formEl.hasAttribute("data-task-id");
    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, so create object as normal and pass to createTaskEl function
    else {
    //collect data from varaibles into an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        }
    //send object as an argument for createTaskEl function
    createTaskEl(taskDataObj);
    }
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

        // adding the data-task-id to task object before incrementing ID counter
        taskDataObj.id = taskIdCounter;
        //adding the task data object to the tasks array
        tasks.push(taskDataObj);

        //save tasks array to local storage
        saveTasks();

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

    // create new array to update task objects to reflect GUI
    var updatedTaskAr = [];

    //loop through current tasks and add all tasks to new array that are not our deleted task
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskAr.push(tasks[i]);
        }
    }
    //reassign task object array to be new updated task object array without task being deleted
    tasks = updatedTaskAr;

    //save tasks array to local storage
    saveTasks();
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

//function to complete editing a task
var completeEditTask = function(taskName, taskType, taskId) {
    //find matching list item
    var taskSelected = document.querySelector(`.task-item[data-task-id="${taskId}"]`);

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and update task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    //save tasks array to local storage
    saveTasks();
    //telling user we updated the task
    alert("Task Updated!");
    //reset button and remove data-task-id from form
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

//function to move task to different column when status is changed with dropdown
var taskStatusChangeHandler = function(event) {
  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id");

  // get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // check value and add list item to corresponding section  
  if (statusValue === "to do") {
      tasksToDoEl.appendChild(taskSelected);
  }
  else if (statusValue === "in progress") {
      tasksInProgressEl.appendChild(taskSelected);
  }
  else if (statusValue === "completed") {
      tasksCompletedEl.appendChild(taskSelected);
  }

  //for loop that update the task status in tasks array
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
        tasks[i].status = statusValue;
    }
  }
  //save tasks array to local storage 
  saveTasks();
};

//function to save "tasks" object array whenever data is changed
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function() {
    // Gets task items from localStorage
    tasks = localStorage.getItem("tasks");
    //checks if there was nothing stored previously, reassigns tasks array to empty and ends function
    if (!tasks) {
        tasks = [];
        return false;
    }
    // Converts tasks from the string format back into an array of objects
    tasks = JSON.parse(tasks);
    // Iterates through a tasks array and creates task elements on the page from each object in the array
    for (i = 0; i < tasks.length; i++) {
        //setting task id
        tasks[i].id = taskIdCounter;
        // creating list element with task-item class and data-task-id
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
        // add task id as custom attribute
        listItemEl.setAttribute("data-task-id", tasks[i].id);
        //creating div element for task info and adding to to list item
        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
        listItemEl.appendChild(taskInfoEl);
        //calling create task actions function to create buttons and dropdown, add to list item
        taskActionsEl = createTaskActions(tasks[i].id);
        listItemEl.appendChild(taskActionsEl);
        //if statement checking task status and appending list item appropriately
        if (tasks[i].status === "to do") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEl);
        }
        else if (tasks[i].status === "in progress") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
        }
        else if (tasks[i].status === "completed") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl);
        }
        taskIdCounter++;
    }
};

loadTasks();

//form change handler for dropdown menu when changing task status
pageContentEl.addEventListener("change", taskStatusChangeHandler);

//task edit/delete button click handler
pageContentEl.addEventListener("click", taskButtonHandler);

//submitting/saving task click handler
formEl.addEventListener("submit", taskFormHandler);
