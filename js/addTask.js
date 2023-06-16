var newCategoryColors = ['#8AA4FF', '#FF0000', '#2AD300', '#FF8A00', '#E200BE', '#0038FF'];
var categoryInputContainer;
var assignToInputContainer;
var onInputSubTask;
var subtaskInput;
var appendixSubtask;
var categoryList;
var choseContacts = [];
var l = false;
var j = false;
var p = false

var priority;
var priorityImg;
var addsubtask;
var subTasks = [];
var selectedSubtasks = [];
var userName;
var newAssingedContact;
var newLetters2;
var selectedContactLetters = [];
var newContacts = [];
var newAddedContactLetters = [];
var arrayContactColor = [];
var helpVarSumit = false;
var theMail;
/**global variable for addTask() function */
var title;
var description;
var contact;
var subTaskDone;
var category;
var categoryColor;
var dueDate;
var subTask;
var idTask;
var progress;

/**
 * this function is used to load AddTask-HTML page (init function)
 */
function onloadAddTask() {
    init('addTask');
    updateCalender();
}

/*Subtask*/
/**By clicking the + Symbol changed to New subTask Input*/
function createNewSubtask() {
    addsubtask = document.getElementById('addSubtaskBtn');
    onInputSubTask = document.getElementById('subtaskOninput');
    addsubtask.style.display = "none";
    onInputSubTask.style.display = "flex";
}

/**onclick cross mark all Subtasks are deleted except of the subTasks[0] -> it only left the default value in subTasks Array */
function deleteSubTask() {
    addsubtask = document.getElementById('addSubtaskBtn');
    onInputSubTask = document.getElementById('subtaskOninput');
    subtaskInput = document.getElementById('subtasksInput');
    appendixSubtask = document.getElementById('SubtaskAppendixContainer');
    subtaskInput.value = "";
    addsubtask.style.display = "flex";
    onInputSubTask.style.display = "none";
    subTasks.pop();
    renderSubtasks();
}

/**
 * This function wait for the subTask input and render the SubTask one after one when the user insert subtask
 */
function addSubTask() {
    subtaskInput = document.getElementById('subtasksInput');
    addsubtask.style.display = "flex";
    onInputSubTask.style.display = "none";
    if (subtaskInput.value != "") {
        let subTask = subtaskInput.value;
        subTasks.push(subTask);
        renderSubtasks();
    }
    subtaskInput.value = "";
}


/** This function insert the checked SubTask to the Array*/
function chooseSubtasks() {
    selectedSubtasks.splice(0);
    let allChekbox = document.querySelectorAll(`.checkedSubTasks`);
    for (let i = 0; i < allChekbox.length; i++) {
        const checkbox = allChekbox[i];
        if (checkbox.checked) {
            selectedSubtasks.push(checkbox.value);
        }
        else if (checkbox.checked == false) {
            selectedSubtasks.splice(checkbox.value, 0);
        }
    }
}

/**
 * This function tender all subTasks with their check boxes
 * onclick="chooseSubtasks()"
 */
function renderSubtasks() {
    selectedSubtasks.splice(0);
    appendixSubtask = document.getElementById('SubtaskAppendixContainer');
    appendixSubtask.innerHTML = "";
    for (let i = 0; i < subTasks.length; i++) {
        const showSubTask = subTasks[i];
        appendixSubtask.innerHTML += /*html*/`
            <label class="container">
                <input type="checkbox" class="checkedSubTasks" onclick="chooseSubtasks()" value="${showSubTask}" checked/>
                <span class="checkmark" id="checkmark${i}"></span>
                <div class="subtaskCheck">${showSubTask}</div>
            </label>
            `;
        selectedSubtasks.push(showSubTask);
    }
}

/**
 * This function is used to create a (Project Management Task Object) which include the information of the title, description, due date, priority, the department, contact etc.
 */
async function addTask() {
    await loadUserAccountsFromBackend();
    tasks = userAccounts[activeUser].userTasks;
    title = document.getElementById('title');
    description = document.getElementById('description');
    contact = choseContacts;
    subTaskDone = [];
    category = document.getElementById('input');
    categoryColor = document.getElementById('color').style.background;
    dueDate = document.getElementById('date');
    getPriorityInformation();
    subTask = selectedSubtasks;
    idTask = generateTaskId(tasks);
    if (typeof progress == 'undefined')
        progress = "To Do";
    if (p == true)
        newTaskpush(title, description, category, contact, dueDate, subTask, subTaskDone, priority, priorityImg, idTask, progress);
    else
        warnForSelectPriority();
}

/**
 * This fucktion makes the newTask JSON object with all information of Task and the keyword for the backend
 * @param {string} title - title for the task
 * @param {string} description - description for the task
 * @param {string} category - category for the task
 * @param {string} contact - contact name for the task
 * @param {number} dueDate - time stamp number for the due date of task
 * @param {string} subTask - subtask text
 * @param {string} subTaskDone - done text
 * @param {string} priority - priority text
 * @param {img} priorityImg - suitable image of the priority
 * @param {id number} idTask - index number for sort the Task 
 * @param {string} progress - progress information text
 */
async function newTaskpush(title, description, category, contact, dueDate, subTask, subTaskDone, priority, priorityImg, idTask, progress) {
    var newTask = {
        "title": title.value,
        "description": description.value,
        "category": category.value,
        "categoryColor": categoryColor,
        "contact": contact,
        "dueDate": dueDate.value,
        "subTask": subTask,
        "subTaskDone": subTaskDone,
        "priority": priority,
        "priorityImg": priorityImg,
        "id": idTask,
        "progress": progress
    }; pushNewTaskToBackEnd(newTask);
}

/**
 * This function push the newTask JSON object to the backend
 * @param {JSON} newTask - JSON object with all informations and keywords of the new Task for backend
 */
async function pushNewTaskToBackEnd(newTask) {
    tasks.push(newTask);
    await saveTasksToBackend();
    await saveUserAccountsToBackend();
}

/**
 * This function alerts when the priority wasn't selected by adding new Task
 */
function warnForSelectPriority() {
    document.getElementById('checkprio').classList.remove('d-none');
    //document.getElementById('textColorRed').classList.add('textColorRed');
    document.getElementById('checkprio').innerHTML = 'Please select a priority!';
}

/**
 * This function is used to create a (Project Management Task Object) which include the information of the title, description, due date, priority, the department, contact etc.
 * This function was called on AddTask Main Page
 */
async function addTaskToBoard() {
    await addTask();
    if (p == true) {
        annimationTaskAddedToBoard();
        setAllFieldsToDefault();
        closeDropdownCategory();
        closeDropDownAssignTo();
        choseContacts = [];
        selectedSubtasks = [];
        subTasks = [];
    }
}

/**
 * This function is used to create a (Project Management Task Object) which include the information of the title, description, due date, priority, the department, contact etc.
 * This function was called on Board Page and Contact Page
 */
async function addTaskOnSubPages() {
    await addTask();
    await loadTasksFromBackend();
    await loadUserAccountsFromBackend();
    if (p == true) {
        document.getElementById('bg').style.display = 'none';
        annimationTaskAddedToBoardForPopOut();
        setAllFieldsToDefault();
        closeDropdownCategory();
        closeDropDownAssignTo();
        choseContacts = [];
        selectedSubtasks = [];
        subTasks = [];
        //userAccounts[activeUser]['userTasks'] = tasks;
        await updateHTML();
        p = false;
    }
}

/** This function decides with the priority background color which Priority has been activated and get all the inputs of the one priority box*/
function getPriorityInformation() {
    if (document.getElementById('prioUrgentBox').classList.contains('bgUrgent')) {
        p = true;
        getPriorityUrgentBoxInfos();
    } else if (document.getElementById('prioMediumBox').classList.contains('bgMedium')) {
        p = true;
        getPriorityMediumBoxInfos();
    } else if (document.getElementById('prioLowBox').classList.contains('bgLow')) {
        p = true;
        getPriorityLowBoxInfos();
    }
}

/**This function gives the strings and image datas which are necessary for a new Task*/
function getPriorityUrgentBoxInfos() {
    priority = document.getElementById('prioUrgentBox').innerText;
    priorityImg = document.createElement("prioUrgentImg");
    priorityImg = "assets/img/urgent.png";
}

/**This function gives the strings and image datas which are necessary for a new Task*/
function getPriorityMediumBoxInfos() {
    priority = document.getElementById('prioMediumBox').innerText;
    priorityImg = document.createElement("prioMediumImg");
    priorityImg = "assets/img/medium.png";
}

/**This function gives the strings and image datas which are necessary for a new Task*/
function getPriorityLowBoxInfos() {
    priority = document.getElementById('prioLowBox').innerText;
    priorityImg = document.createElement("prioLowImg");
    priorityImg = "../assets/img/low.png";
}

/**This function return the priority boxes to default style*/
function setPrioBoxesTodefault() {
    document.getElementById('prioUrgentBox').classList.remove('bgUrgent');
    document.getElementById('prioMediumBox').classList.remove('bgMedium');
    document.getElementById('prioLowBox').classList.remove('bgLow');
    document.getElementById('prioUrgentBox').classList.remove('bgTextWhite');
    document.getElementById('prioMediumBox').classList.remove('bgTextWhite');
    document.getElementById('prioLowBox').classList.remove('bgTextWhite');
    document.getElementById('prioUrgentImg').classList.remove('Img-white');
    document.getElementById('prioMediumImg').classList.remove('Img-white');
    document.getElementById('prioLowImg').classList.remove('Img-white');
}

/**
 * Function to generate new Id if one Id contains in the Task
 * @param {number} tasks - it shows the Id-Number of (Project Management Task Object) 
 * @returns {number} id - return a new Id-Number (the next larger number)
 */
function generateTaskId(tasks) {
    if (tasks.length == 0)
        id = 0;
    else {
        var id = tasks.length;
        var idExists = true;
        while (idExists) {
            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].id === id) {
                    idExists = true;
                    break;
                } else
                    idExists = false;
            } if (idExists)
                id++;
        }
    } return id;
}


/**This function changes the Text and Image color to white of the Priority Urgent button, the other buttons (Prio Medium and Prio Low) change to their original color */
function insertUrgent() {
    document.getElementById('prioUrgentBox').classList.add('bgTextWhite');
    document.getElementById('prioMediumBox').classList.remove('bgTextWhite');
    document.getElementById('prioLowBox').classList.remove('bgTextWhite');
    document.getElementById('prioUrgentImg').classList.add("Img-white");
    document.getElementById('prioMediumImg').classList.remove("Img-white");
    document.getElementById('prioLowImg').classList.remove("Img-white");
    toggleInsertUrgent();
    document.getElementById('prioUrgentBox').classList.toggle('bgUrgent');
    document.getElementById('prioMediumBox').classList.remove('bgMedium');
    document.getElementById('prioLowBox').classList.remove('bgLow');
}

/**This function toggles the white Text and Image of Priority Urgent to original color*/
function toggleInsertUrgent() {
    document.getElementById("prioUrgentBox").addEventListener("click", function handleClick(event) {
        const hasClass = event.target.classList.contains('bgUrgent');
        if (hasClass) {
            document.getElementById('prioUrgentBox').classList.add('bgTextWhite');
            document.getElementById('prioUrgentImg').classList.add("Img-white");
        } else {
            document.getElementById('prioUrgentBox').classList.remove('bgTextWhite');
            document.getElementById('prioUrgentImg').classList.remove("Img-white");
        }
    });
}

/**This function changes the Text- and Image-color to white of the Priority Medium button, other buttons (Prio Urgent and Prio Low) change to their original color */
function insertMedium() {
    document.getElementById('prioMediumBox').classList.add('bgTextWhite');
    document.getElementById('prioUrgentBox').classList.remove('bgTextWhite');
    document.getElementById('prioLowBox').classList.remove('bgTextWhite');
    document.getElementById('prioLowImg').classList.remove("Img-white");
    document.getElementById('prioUrgentImg').classList.remove("Img-white");
    document.getElementById('prioMediumImg').classList.add("Img-white");
    toggleInsertMedium();
    document.getElementById('prioMediumBox').classList.toggle('bgMedium');
    document.getElementById('prioUrgentBox').classList.remove('bgUrgent');
    document.getElementById('prioLowBox').classList.remove('bgLow');

}

/**This function toggles the white Text and Image of Priority Medium to original color*/
function toggleInsertMedium() {
    document.getElementById("prioMediumBox").addEventListener("click", function handleClick(event) {
        const hasClass = event.target.classList.contains('bgMedium');
        if (hasClass) {
            document.getElementById('prioMediumBox').classList.add('bgTextWhite');
            document.getElementById('prioMediumImg').classList.add("Img-white");
        } else {
            document.getElementById('prioMediumBox').classList.remove('bgTextWhite');
            document.getElementById('prioMediumImg').classList.remove("Img-white");
        }
    });
}

/**This function changes the Text- and Image-color to white of the Priority low button, other buttons (Prio Urgent and Prio Medium) change to their original color */
function insertLow() {
    document.getElementById('prioLowBox').classList.add('bgTextWhite');
    document.getElementById('prioUrgentBox').classList.remove('bgTextWhite');
    document.getElementById('prioMediumBox').classList.remove('bgTextWhite');
    document.getElementById('prioLowImg').classList.add("Img-white");
    document.getElementById('prioMediumImg').classList.remove("Img-white");
    document.getElementById('prioUrgentImg').classList.remove("Img-white");
    toggleInsertLow();
    document.getElementById('prioLowBox').classList.toggle('bgLow');
    document.getElementById('prioUrgentBox').classList.remove('bgUrgent');
    document.getElementById('prioMediumBox').classList.remove('bgMedium');
}

/**This function toggles the white Text and Image of Priority Low to original color*/
function toggleInsertLow() {
    document.getElementById("prioLowBox").addEventListener("click", function handleClick(event) {
        const hasClass = event.target.classList.contains('bgLow');
        if (hasClass) {
            document.getElementById('prioLowBox').classList.add('bgTextWhite');
            document.getElementById('prioLowImg').classList.add("Img-white");
        } else {
            document.getElementById('prioLowBox').classList.remove('bgTextWhite');
            document.getElementById('prioLowImg').classList.remove("Img-white");
        }
    });
}

/**This function changes clear button Image to blue by hover */
function clearBtnhover() {
    document.getElementById('clearBtnImg').classList.remove('clearButtonImgGray');
    document.getElementById('clearBtnImg').classList.add('clearButtonImgblue');
}

/**This function changes clear button Image to the original color*/
function clearBtnCancelhover() {
    document.getElementById('clearBtnImg').classList.remove('clearButtonImgblue');
    document.getElementById('clearBtnImg').classList.remove('clearButtonImgGray');
}

/** This function change the color of the Clear Button to gray when it is onactive*/
function setClearBtnOnActive() {
    document.getElementById('clearBtnImg').classList.remove('clearButtonImgblue');
    document.getElementById('clearBtnImg').classList.add('clearButtonImgGray');
}