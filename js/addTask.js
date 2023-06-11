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

var theMail;

/**
 * this function is used to load AddTask-HTML page (init function)
 */
function onloadAddTask() {
    init('addTask');
    renderSubtasks();
    updateCalender();
}

/**
 * This function is use to render Category with a Color Dots
 */
function renderCategory() {
    let categories = userAccounts[activeUser].userCategory;
    let categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = `<div class="categoryAndColor" onclick=" newCategoryInput()">
    <div>New category</div> </div>`;
    let index;
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i]['category'];
        const color = categories[i]['color'];
        categoryList.innerHTML += categoryHTMLtemplate(i, category, color);
        index = i;
    }
    categoryList.innerHTML += `<button onclick= "deleteLastCategory(${index})" class="deleteNewCatBtn">delete new category</button>`;
}

/**
 * This function retrun the HTML for renderCategory() function
 * @param {number} i - index number
 * @param {string} category - string of the category
 * @param {hex. number} color - color code in hexadecimal
 * @returns 
 */
function categoryHTMLtemplate(i, category, color) {
    return `
    <div class="categoryAndColor" onclick="chooseCategory(${i}, '${category}', '${color}')" >
        <div>${category}</div>
        <div class="color"  style="background-color:${color}"></div>
    </div>
    `;
}

/**This function set Category InputField to default as in beginning with a placholder and a drop down Button*/
function unsetCategoryInputField() {
    rejectNewCategory();
}

/**This function shows Category Select Menu - toggle at clicking on the dropdown Button */
function dropDown() {
    categoryList = document.getElementById('categoryList');
    if (categoryList.style.display == "block") {
        closeDropdownCategory();
    } else {
        showDropdownCategory();
    } closeDropDownAssignTo();
}

/**This function closes the Category Select Menu*/
function closeDropdownCategory() {
    var categoryList = document.getElementById('categoryList');
    categoryInputContainer = document.getElementById('inputContainer');
    categoryList.style.display = "none";
    categoryInputContainer.style.border = "1px solid #D1D1D1";
    categoryInputContainer.style.borderRadius = "10px";
    if (l == true) {
        document.getElementById("input").disabled = true;
    } else {
        document.getElementById("input").disabled = false;
    }
}

/**This function shows the Category Select Menu*/
function showDropdownCategory() {
    if (j == false) {
        categoryList = document.getElementById('categoryList');
        categoryInputContainer = document.getElementById('inputContainer');
        categoryList.style.display = "block";
        categoryInputContainer.style.borderBottom = "none";
        categoryInputContainer.style.borderRadius = "10px 10px 0 0";
        renderCategory();
    }
}

/**
 * This function choose one Category with it's color dot from the Category DropDown Menu
 * @param {number} index - position of the Category in the Array
 * @param {string} category - the name of the category
 * @param {color-hex-string} color - background color hex. code
 */
function chooseCategory(index, category, color) {
    let input = document.getElementById('input');
    input.value = '';
    input.value = category;
    document.getElementById('color').style.background = color;
    document.getElementById('newCategoryInput').style.display = "none";
    document.getElementById('buttonDropDown').style.display = "flex";
}


/** This function allows to insert in the category input field for new category input */
function newCategoryInput() {
    closeDropdownCategory();
    document.getElementById('input').value = "";
    document.getElementById('input').placeholder = 'New Category Name';
    document.getElementById('newCategoryInput').style.display = "flex";
    document.getElementById('buttonDropDown').style.display = "none";
    document.getElementById('color').style.background = "white";
    document.getElementById('newCategoryColorsBox').style.display = "flex";
    document.getElementById("input").disabled = false;
    l = true;
    j = true;
}

/**
 *  This function gets the background color for the new category color dot
*/
var newCategoryColor;
function newColor(color) {
    document.getElementById('color').style.background = color;
    newCategoryColor = color;
}

/**
 * The function allows to input new category name in the Category Array and input the color for the color Array
 */
async function addNewCategory() {
    var newCategory = document.getElementById('input');
    document.getElementById('newCategoryColorsBox').style.display = "none";
    document.getElementById('newCategoryInput').style.display = "none";
    document.getElementById('buttonDropDown').style.display = "flex";
    document.getElementById('color').style.background = newCategoryColor;
    if (newCategory !== '') {
        pushNewCategoryToBackend(newCategory);
    } j = false;
}

/**
 * This function push and save new category to backend
 * @param {string} newCategory - the value of the category input field
 */
function pushNewCategoryToBackend(newCategory) {
    let newCategories = {
        'category': newCategory.value,
        'color': newCategoryColor
    }
    let category = userAccounts[activeUser].userCategory;
    category.push(newCategories);
    saveUserAccountsToBackend();
}

/**
 * This function delete the new category input and save to the backend - index smaller than 1 are not deleted because they are dummy category
 * @param {value} index - the index value of the userCategory-Array backend
 */
function deleteLastCategory(index) {
    if (index > 1) {
        let category = userAccounts[activeUser].userCategory;
        category.pop();
        saveUserAccountsToBackend();
        document.getElementById('color').style.background = "white";
        document.getElementById('input').value = "";
        document.getElementById('input').placeholder = 'Select Task Category';
    }
    renderCategory();
}

/*** The function returns the Category Container to the default */
function rejectNewCategory() {
    document.getElementById('buttonDropDown').style.display = "flex";
    document.getElementById('newCategoryInput').style.display = "none";
    document.getElementById('input').value = "";
    document.getElementById('input').placeholder = 'Select task Category';
    document.getElementById('newCategoryColorsBox').style.display = "none";
    document.getElementById("input").disabled = true;
    document.getElementById('color').style = 'background: rgb(255,255,255)';
    j = false;
}

/**
 *  The function render the assigned user contacts
 *  and allows to invite the new contact via email
 * */
async function renderAssignTo() {
    await loadUserAccountsFromBackend();
    loadActiveUserLocal();
    let assignedContactList = document.getElementById('assignedList');
    assignedContactList.innerHTML = ""; //clear container inside html
    for (let i = 0; i < userAccounts[activeUser]['userContacts'].length; i++) {
        userName = userAccounts[activeUser]['userContacts'][i]['name'];
        assignedContactList.innerHTML += templateRenderAssignToContacts(userName);
    }
    assignedContactList.innerHTML += templateRenderAssignToNewContact();
}

/**
 * This function is a HTML-template to render the assigned contacts
 * @param {string} userName - the name of the assigned contact at certain index
 * @returns - the contact names
 */
function templateRenderAssignToContacts(userName) {
    return /*html*/`
    <div class="assignedContact" >
        <div>${userName}</div>
        <label class="filledCheckboxContainer">
            <input type="checkbox" class="checkboxForContacts" value="${userName}" onclick="chooseContact('${userName} ')">
            <span class="checkmark"></span>
        </label>
    </div>
    `;
}

/** This function is a HTML-template to render the invite new contact Text and it's image*/
function templateRenderAssignToNewContact() {
    return /*html*/`
    <div class="assignedContact" onclick="assignToInput()">
        <div>invite new contacts</div>
        <img src="assets/img/new_contact.png" class="newContactImg">
    </div>
`;
}

/**
 * This function allows user to choose the contact with the checkbox - the check marked contact is showing below in a cirle
 * @param {string} name - the name of the contact which was selected from the userAccounts in the renderAssignTo() function 
 */
function chooseContact(name) {
    let inputAssignedContact = document.getElementById('assignInput');
    inputAssignedContact.value = name;
    choseContacts.splice(0);
    let allChekbox = document.querySelectorAll('.checkboxForContacts');
    for (let i = 0; i < allChekbox.length; i++) {
        const checkbox = allChekbox[i];
        if (checkbox.checked) {
            choseContacts.push(checkbox.value);
        }
        displayChosenContactsForTask();
    }
}

/**
 * This function render the check marked contacts
 */
async function renderAssignToCheckMarked() {
    await loadUserAccountsFromBackend();
    loadActiveUserLocal();
    let assignedContactList = document.getElementById('assignedList');
    assignedContactList.innerHTML = ""; //clear container inside html
    for (let i = 0; i < userAccounts[activeUser]['userContacts'].length; i++) {
        let userName = userAccounts[activeUser]['userContacts'][i]['name'];
        const element = choseContacts;
        const contact = element.includes(userName);
        const checkedAttribute = contact ? 'checked' : '';
        assignedContactList.innerHTML += renderAssignToCheckMarkedHTML(userName, checkedAttribute)
    }
    assignedContactList.innerHTML += renderAssignToCheckMarkedHTMLNewContact();
}

/**
 * HTML-Template for render the check marked contacts
 * @param {string} userName - contact name
 * @param {true/false} checkedAttribute - checkbox true or false
 * @returns - HTML Code of name and checked attribute of checkbox
 */
function renderAssignToCheckMarkedHTML(userName, checkedAttribute) {
    return `
    <div class="assignedContact" >
        <div>${userName}</div>
        <label class="filledCheckboxContainer">
            <input type="checkbox" class="checkboxForContacts" value="${userName}" ${checkedAttribute} onclick="chooseContact('${userName} ')">
                <span class="checkmark"></span>
        </label>
    </div>
    `;
}

/**
 * HTML-Template for render new contact
 * @returns 
 */
function renderAssignToCheckMarkedHTMLNewContact() {
    return /*html*/`
    <div class="assignedContact" onclick="assignToInput()">
            <div>invite new contacts</div>
            <img src="assets/img/new_contact.png" class="newContactImg">
        </div>
    `;
}

/**Show AssignTo Select Menu - toggle at clicking on the dropdown Button*/
function dropDownAssignTo() {
    var assignedList = document.getElementById('assignedList');
    assignToInputContainer = document.getElementById('contactInputContainer');
    document.getElementById('circleContactsContainer').style.display = "flex";
    if (assignedList.style.display == "block") {
        closeDropDownAssignTo();
    } else {
        showDropDownAssignTo();
    }
    closeDropdownCategory();
}

/*** close the dropdown AssignTo Menu*/
function closeDropDownAssignTo() {
    var assignedList = document.getElementById('assignedList');
    assignToInputContainer = document.getElementById('contactInputContainer');
    assignedList.style.display = "none";
    assignToInputContainer.style.border = "1px solid #D1D1D1";
    assignToInputContainer.style.borderRadius = "10px";
    document.getElementById('circleContactsContainer').style.display = "flex";
}

/**open the dropdown AssignTo Menu*/
function showDropDownAssignTo() {
    var assignedList = document.getElementById('assignedList');
    assignToInputContainer = document.getElementById('contactInputContainer');
    assignedList.style.display = "block";
    assignToInputContainer.style.borderBottom = "none";
    assignToInputContainer.style.borderRadius = "10px 10px 0 0";
    if (choseContacts == '') {
        renderAssignTo();
    } else {
        renderAssignToCheckMarked();
        displayChosenContactsForTask();
    }
}

/**This function is used for invite new contact via an Email to assign into the Kanban Project Managment Tool*/
function assignToInput() {
    helpVarSumit = true; // /Join/send-email.php 
    document.getElementById('assignedList').style.display = "none";
    showInvitePopUp();
}

/**
 * This function send to new user an invitation email to sign up
 * @param {fetch string} event - to fetch the email information string from the server php page
 */
async function sendInvitationEmail(event) {
    event.preventDefault(); //This line prevent not to run the default action - prevent php page to load
    const formData = new FormData();
    formData.append('email', document.getElementById("email").value);
    let response = await fetch("https://ye-htut-aung.developerakademie.net/Join_yehtut/send-email.php", {
        method: "post",
        body: formData
    });
    document.getElementById('bg').style.zIndex = 15;
    if (response.ok){
        showEmailSentStatus(); //shows email was sent successfully
    }
    else
        showEmailNotSend(); //shows email fail to send
}

/**
 * This function shows the popup menu for invite a new contact via email
 */
function showInvitePopUp() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    document.getElementById('bg').style.zIndex = 30;
    document.getElementById('bg').style.display = '';
    document.getElementById('email-form').classList.remove('sendmailContainer-hidden');
    document.getElementById('email-form').classList.add('sendmailContainer');
}

/**
 * This function hide the popup window for the invite new contact
 */
function hideInvitePopUp() {
    document.getElementById('bg').style.zIndex = 15;
    document.getElementById('bg').style.display = 'none';
    document.getElementById('email-form').classList.add('sendmailContainer-hidden');
    document.getElementById('email-form').classList.remove('sendmailContainer');
    assignToInputContainer = document.getElementById('contactInputContainer');
    assignToInputContainer.style.border = "1px solid #D1D1D1";
    assignToInputContainer.style.borderRadius = "10px";
}


/**
 * This function allows to set the AssignTo input field to default style
 */
function rejectAssignTo() {
    document.getElementById('assignInput').value = "";
    document.getElementById('assignInput').placeholder = "Select contacts to assign";
    closeDropDownAssignTo();
    document.getElementById('newAssignToInput').style.display = "none";
    document.getElementById('assignDropDown').style.display = "flex";
    document.getElementById('circleContactsContainer').style.display = "flex";
}

/**This function call the other function which shows the e-mail has been sent to the new contact*/
function addnewContact() {
    showEmailSentStatus();
}

/**This function shows the email sent status in a box*/
function showEmailSentStatus() {
    document.getElementById('bg').style.display = 'none';
    document.getElementById('email-form').classList.add('sendmailContainer-hidden');
    document.getElementById('email-form').classList.remove('sendmailContainer');
    newAssingedContact = document.getElementById('assignInput');
    assignToInputContainer.style.borderBottom = "none";
    assignToInputContainer.style.borderRadius = "10px 10px 0 0";
    newContacts.push(newAssingedContact.value);
    document.getElementById('assignedList').style.display = "block";
    document.getElementById('assignedList').value = "";
    document.getElementById('assignedList').innerHTML = `Email was sent successfully!`;
}

/**This function shows the email not send status in a box */
function showEmailNotSend() {
    document.getElementById('bg').style.display = 'none';
    document.getElementById('email-form').classList.add('sendmailContainer-hidden');
    document.getElementById('email-form').classList.remove('sendmailContainer');
    newAssingedContact = document.getElementById('assignInput');
    assignToInputContainer.style.borderBottom = "none";
    assignToInputContainer.style.borderRadius = "10px 10px 0 0";
    newContacts.push(newAssingedContact.value);
    document.getElementById('assignedList').style.display = "block";
    document.getElementById('assignedList').value = "";
    document.getElementById('assignedList').innerHTML = `Error Email cannot send to recipent! Check the email address again!`;
}

/** This function shows the chosen contacts under AssignTo-box in a filled cirlce of two letters for each chosen contact */
function displayChosenContactsForTask() {
    document.getElementById('circleContactsContainer').style.display = "flex";
    renderCircleName();
}

/**This function shows the contact name into two captial letters and gives the color for each contact*/
function showContactsByTwoLetters() {
    for (let i = 0; i < choseContacts.length; i++) {
        let chosenContact = choseContacts[i];
        const firstLetter = chosenContact.charAt(0).toUpperCase();
        const remainingLetters = chosenContact.slice(1);
        contactName = firstLetter + remainingLetters;
        contactColor = getUserColor(i);
        arrayContactColor.push(contactColor);
        fillSelectedContactInLettersArray(chosenContact, contactName);
    }
}

/**
 * This function support the showContactByTwoLetters() function and save the Letters of contact in the array, here: selectedContactLetters[]
 * @param {string} chosenContact - checkbox selected contact from the assigned list contacts
 * @param {string} contactName - Full name of the contact
 */
function fillSelectedContactInLettersArray(chosenContact, contactName) {
    if (chosenContact.indexOf(' ') >= 0) {
        let helpLetter = contactName.split(" ");
        newLetters2 = helpLetter[0].charAt(0).toUpperCase() + helpLetter[1].charAt(0).toUpperCase();
        selectedContactLetters.push(newLetters2);
    } else {
        newLetters2 = firstLetter;
        selectedContactLetters.push(newLetters2);
    }
}

/** show Contact name in two letters in a Circle with a background color*/
function renderCircleName() {
    showContactsByTwoLetters();
    document.getElementById('circleContactsContainer').innerHTML = "";
    for (let i = 0; i < selectedContactLetters.length; i++) {
        const letters = selectedContactLetters[i];
        const bgContactColor = arrayContactColor[i];
        renderNamesInTwoLetters(bgContactColor, letters);
    }
    selectedContactLetters.splice(0);
    newAddedContactLetters.splice(0);
    newContacts.splice(0);
    arrayContactColor.splice(0);
}

/**HTML-templates for renderCircleName() */
function renderNamesInTwoLetters(bgContactColor, letters) {
    return document.getElementById('circleContactsContainer').innerHTML += `
    <div class="circleContact" id="circleContact" style="background-color: ${bgContactColor} !important">  ${letters}
    </div>
    `;
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
    }
}

/**
 * This function tender all subTasks with their check boxes
 */
function renderSubtasks() {
    appendixSubtask = document.getElementById('SubtaskAppendixContainer');
    appendixSubtask.innerHTML = "";
    for (let i = 0; i < subTasks.length; i++) {
        const showSubTask = subTasks[i];
        appendixSubtask.innerHTML += /*html*/`
            <label class="container">
                <input type="checkbox" class="checkedSubTasks" onclick="chooseSubtasks()" value="${showSubTask}" />
                <span class="checkmark" id="checkmark${i}"></span>
                <div class="subtaskCheck">${showSubTask}</div>
            </label>
            `;
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
    }
}

/**
 * This function is used to create a (Project Management Task Object) which include the information of the title, description, due date, priority, the department, contact etc.
 * This function was called on Board Page and Contact Page
 */
async function addTaskOnSubPages() {
    await addTask();
    if (p == true) {
        document.getElementById('bg').style.display = 'none';
        annimationTaskAddedToBoardForPopOut();
        setAllFieldsToDefault();
        closeDropdownCategory();
        closeDropDownAssignTo();
        choseContacts = [];
        updateHTML();
        selectedSubtasks = [];
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

/**Set other Inputfields to default values and the prio Buttons to the original text and color*/
function setAllFieldsToDefault() {
    title = document.getElementById('title');
    title.value = "";
    description = document.getElementById('description');
    description.value = "";
    category = document.getElementById('input');
    category.value = "";
    unsetCategoryInputField();
    document.getElementById('assignInput').value = "";
    let inputAssignedContact = document.getElementById('assignInput');
    inputAssignedContact = "";
    dueDate = document.getElementById('date');
    dueDate.value = "";
    setPrioBoxesTodefault();
    deleteSubTask();
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
 * show the animation when the Task is created and direct to the board page
 * while a task is being added to the board the addTask Button is disabled
 * */
function annimationTaskAddedToBoard() {
    document.getElementById('messageAddedTask').style.display = "flex";
    document.getElementById('messageAddedTask').classList.add('animate');
    setTimeout(function () {
        document.getElementById('messageAddedTask').style.display = "none";
    }, 3900)
    document.getElementById('addTaskBtn').classList.add('buttonDisabled');
    setTimeout(function () {
        document.getElementById('addTaskBtn').classList.add('buttonEnabled');
    }, 4000)
    setTimeout(function () {
        window.location = "./board.html";
    }, 3600)
}

/**
 * show the animation when the Task is created and direct to the board page
 * while a task is being added to the board the addTask Button is disabled
 * */
function annimationTaskAddedToBoardForPopOut() {
    document.getElementById('messageAddedTask').style.display = "flex";
    document.getElementById('messageAddedTask').classList.add('animate');
    setTimeout(function () {
        document.getElementById('messageAddedTask').style.display = "none";
    }, 3900)
    document.getElementById('addTaskBtn').classList.add('buttonDisabled');
    setTimeout(function () {
        document.getElementById('addTaskBtn').classList.add('buttonEnabled');
    }, 4000)
    setTimeout(function () {
        closePopOutAddTask();
    }, 3600)
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

/**This function modify calendar to only select current date or date in the future */
function updateCalender() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    document.getElementById('date').min = today;
}

/**clear all field of AddTask page*/
function clearAllAddTaskFields() {
    setAllFieldsToDefault();
}

/**show AddTaskPopOut.html*/
async function showAddTaskPopOut(progresscategory) {
    updateCalender();
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById('popOut-taskCard').classList = "popOut-taskCard";
    document.getElementById('contentContainer').classList.add('scrollY');
    document.getElementById('kanban').classList.add('kanban');
    document.getElementById('profile-container').classList.add('profile-container-d-none');
    document.getElementById('bodyBoard').classList.add('noScrollSite');
    document.getElementById('bg').style.display = '';
    progress = progresscategory;
    renderCategory();
    displayChosenContactsForTask();
}

/**hide AddTaskPopOut.html*/
function closePopOutAddTask() {
    document.getElementById('popOut-taskCard').classList = "popOut-hidden";
    document.getElementById('bg').style.display = 'none';
    document.getElementById('bodyBoard').classList.remove('noScrollSite');
    document.getElementById('kanban').classList.remove('kanban');
    document.getElementById('profile-container').classList.remove('profile-container-d-none');
    setAllFieldsToDefault();
    closeDropdownCategory();
    closeDropDownAssignTo();
    choseContacts = [];
}

/**
 * This funktion gets the usercolor from the assigned contacts
 * @param {number} userIndex - This is the Id-Number of one user
 * @returns - hex-code of the color user
 */
function getUserColor(userIndex) {
    const colorUser = userAccounts[activeUser]['userContacts'][userIndex]['color'];
    return colorUser;
}

/**
 * This function is used to filter contact by entering the letters
 */
function filterContact() {
    let search = document.getElementById('assignInput').value;
    search = search.toLowerCase();
    let content = document.getElementById('assignedList');
    content.innerHTML = '';
    assignToInputContainer = document.getElementById('contactInputContainer');
    content.style.display = "block";
    assignToInputContainer.style.borderBottom = "none";
    assignToInputContainer.style.borderRadius = "10px 10px 0 0";
    for (let i = 0; i < userAccounts[activeUser]['userContacts'].length; i++) {
        findUserName(i, search);
    }
}

/**
 * This function compare the name inputs with the contact name and shows the contact name if matches
 * @param {number} i - index number of the contact name
 * @param {string} search - input values of the entered letters
 */
function findUserName(i, search) {
    userName = userAccounts[activeUser]['userContacts'][i]['name'];
    userNameLowerLetter = userName.toLowerCase();
    if (userNameLowerLetter.includes(search)) {
        content.innerHTML += templateRenderAssignToContacts(userName);
    }
}

/**
 * this function delete the category from the user after the input number of the category
 * @param {number} number - this is the activUser category-array number 
 */
async function deleteCategory(number) {
    let user = userAccounts[activeUser]['userCategory'];
    for (let i = 0; i < user.length; i++) {
        if (i === number) {
            user.splice(i, 1);
            break;
        }
    }
    await saveTasksToBackend()
    await saveUserAccountsToBackend();
    closeOverlay();
    updateHTML();
}