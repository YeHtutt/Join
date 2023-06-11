 /**
 * Close the dropdown container from category
 * 
 */
function closeDropdownCategoryBoard() {
    let categoryInputContainer = document.getElementById('inputContainer'); 
    let categoryList = document.getElementById('categoryList');
    categoryList.style.display = "none";
    categoryInputContainer.style.border = "1px solid #D1D1D1";
    categoryInputContainer.style.borderRadius = "10px";
}


/**
 * Selected variable for renderAssignToBoardContacts()
 * 
 * @param {number} cards 
 */
async function renderAssignToBoard(cards) {
    let user = userAccounts[activeUser]['userTasks'];
    let todo = user.find((item) => item.id === cards);
    let assignedContactList = document.getElementById('assignedList'); 
    assignedContactList.innerHTML = ""; 
    let users = userAccounts[activeUser]['userContacts'];
    renderAssignToBoardContacts(users, assignedContactList, todo)
}


/**
 * Show all Contacts includes with checkboxes
 * 
 * @param {string} users 
 * @param {string} assignedContactList 
 * @param {object} todo 
 */
function renderAssignToBoardContacts(users, assignedContactList, todo) {
    for (let i = 0; i < users.length; i++) {
        let userName = users[i]['name'];
        const element = todo.contact;
        const contact = element.includes(userName);
        const checkedAttribute = contact ? 'checked' : '';
        assignedContactList.innerHTML += renderAssignToBoardContactsHTML(userName, checkedAttribute, todo)
    }
}


/**
 * Select all chosed Contacts and push them into checkbox
 * 
 * @param {string} name 
 * @param {number} cards 
 */
function chooseContactBoard(name, cards) {
    let user = userAccounts[activeUser]['userTasks'];
    let todo = user.find((item) => item.id === cards);
    let inputAssignedContact = document.getElementById('assignInput');
    inputAssignedContact.value = '';
    inputAssignedContact.value = name;
    choosedContact.splice(0);
    let allChekbox = document.querySelectorAll('.checkboxForContacts');
    for (let i = 0; i < allChekbox.length; i++) {
        const checkbox = allChekbox[i];
        if (checkbox.checked) {
            choosedContact.push(checkbox.value);
            renderContactsOverlayChange(todo);
        }
    }
}


/**
 * Save all changes to backend
 * 
 * @param {number} cards 
 */
async function saveInputTask(cards) {
    let user = userAccounts[activeUser]['userTasks'];
    let todo = user.find((item) => item.id === cards);
    let newDescription = document.getElementById('inputDescription').value;
    let newDueDate = document.getElementById('date').value;
    todo.description = newDescription;
    todo.dueDate = newDueDate;
    newTitleSave(todo);
    prioritySave(todo);
    contactChoosed(todo);
    chooseSubtasksBoard(todo);
    newTitleSave(todo);
    await saveAndNewRender(cards)
}

 
/**
 * Show Overlay and update HTML
 * 
 * @param {number} cards 
 */
async function saveAndNewRender(cards) {
    await saveTasksToBackend()
    await saveUserAccountsToBackend();
    updateHTML()
    showOverlay(cards)
}


/**
 * checkes if title new
 * 
 * @param {object} todo 
 */
function newTitleSave(todo) {
    let newTitle = document.getElementById('inputTittle').value;
    if (newTitle == '') {
        newTitle = todo.title;
    }
    todo.title = newTitle;
}

// 
/**
 * Save choosedConatact for render and save contacts to task
 * 
 * @param {object} todo 
 */
function contactChoosed(todo) {
    if (choosedContact.length === 0) {
        for (let i = 0; i < todo['contact'].length; i++) {
            const element = todo['contact'][i];
            choosedContact.push(element);
        }
    }
    if (!todo.contact.includes(todo.contact)) {
        todo.contact = choosedContact
    }
}


/**
 * Show the priority 
 * 
 * @returns 
 */
function getPriority() {
    let priority;
    let priorityImg;
    if (document.getElementById('prioUrgentBox').classList.contains('bgUrgent')) {
        priority = document.getElementById('prioUrgentBox').innerText;
        priorityImg = "assets/img/urgent.png";
    } else if (document.getElementById('prioMediumBox').classList.contains('bgMedium')) {
        priority = document.getElementById('prioMediumBox').innerText;
        priorityImg = "assets/img/medium.png";
    } else {
        priority = document.getElementById('prioLowBox').innerText;
        priorityImg = "assets/img/low.png";
    }
    return { priority, priorityImg };
}


/**
 *  Change the priority 
 * 
 * @param {object} todo 
 * @param {string} priority 
 * @param {string} priorityImg 
 */
function setPriority(todo, priority, priorityImg) {
    todo.priority = priority;
    todo.priorityImg = priorityImg;
}


/**
 * Save the priority
 * 
 * @param {object} todo 
 */ 
function prioritySave(todo) {
    const { priority, priorityImg } = getPriority();
    setPriority(todo, priority, priorityImg);
}


/**
 * Selected if Subtask is done
 * 
 * @param {object} todo 
 */
async function chooseSubtasksBoard(todo) {
    todo.subTaskDone = [];
    let allChekbox = document.querySelectorAll(`.checkedSubTasks`);
    for (let i = 0; i < allChekbox.length; i++) {
        const checkbox = allChekbox[i];
        if (checkbox.checked) {
            todo.subTaskDone.push(checkbox.value);
        }
    }
    await saveTasksToBackend()
    await saveUserAccountsToBackend();
}

// 
/**
 * Render subtasks
 * 
 * @param {number} cards 
 */
function renderSubtasksBoard(cards) {
    let user = userAccounts[activeUser]['userTasks'];
    let todo = user.find((item) => item.id === cards);
    let content = document.getElementById('subtasks');
    let subTaskDone = todo.subTaskDone
    content.innerHTML = "";
    for (let j = 0; j < todo['subTask'].length; j++) {
        const showSubTask = todo['subTask'][j];
        const subTaskIsDone = subTaskDone.includes(showSubTask);
        const checkedAttribute = subTaskIsDone ? 'checked' : '';
        content.innerHTML += renderSubtasksBoardHTML(showSubTask, checkedAttribute, j);
    }
}


/**
 * Render the progressbar (cards)
 * 
 * @param {number} cards 
 */
async function changeProgressbar(cards) {
    const progress = document.getElementById(`progressBar${cards}`);
    const contant = document.getElementById(`countDone${cards}`);
    const todo = userAccounts[activeUser]['userTasks'].find((item) => item.id === cards);
    const present = todo.subTaskDone.length;
    const result = present ? `${(present * 100) / todo.subTask.length}%` : 0;
    progress.style.width = result;
    contant.innerHTML = `${present}/${todo.subTask.length} Done`;
    if (todo.subTask.length == 0) {
        contant.classList.add('d-none');
    }
    if ( todo.subTask.length > 0) {
        document.getElementById(`progress${cards}`).style.backgroundColor = "#F4F4F4";
    }
}


/**
 * Select witch searchinput and checked if its includes
 * 
 */
function filterHtml() {
    let { search } = chooseSearchInput();
    search = search.toLowerCase();
    let title = userAccounts[activeUser]['userTasks'];
    let text = userAccounts[activeUser]['userTasks'];
    for (let i = 0; i < title.length; i++) {
        let element = title[i]['title'];
        let description = text[i]['description'];
        element = element.toLowerCase();
        description = description.toLowerCase();
        if (element.includes(search) || description.includes(search)) {
            renderfilter(search, i)
        } }
}

/**
 * Choose the right searchfield
 * 
 * @returns 
 */
function chooseSearchInput(){
    if (window.innerWidth <= 640) {
        var search = document.getElementById('searchSmall').value;
    } else {
        var search = document.getElementById('search').value;
    }
    return {search}
} 


/**
 * Render all cards where Search includes title
 * 
 * @param {string} search 
 * @param {number} j 
 */
async function renderfilter(search, j) {
    await loadTasksFromBackend();
    await loadUserAccountsFromBackend();
    let user = userAccounts[activeUser]['userTasks'];
    document.getElementById('toDoContent').innerHTML = '';
    document.getElementById('inProgressContent').innerHTML = '';
    document.getElementById('awaitingFeedbackContent').innerHTML = '';
    document.getElementById('doneContent').innerHTML = '';
    for (let i = 0; i < user.length; i++) {
        const userTasks = user[i];
        cards = userTasks['progress'];
        renderFilterHtml(userTasks, search, cards);
    }
}


/**
 * Render search HTML
 * 
 * @param {object} userTasks 
 * @param {string} search 
 * @param {string} cards 
 */
function renderFilterHtml(userTasks, search, cards) {
    renderFilterHtmlToDo(userTasks, search, cards);
    renderFilterHtmlInProgress(userTasks, search, cards);
    renderFilterHtmlAwaitingFeedback(userTasks, search, cards);
    renderFilterHtmlDone(userTasks, search, cards);
}


/**
 * Render search HTML To Do
 * 
 * @param {object} userTasks 
 * @param {string} search 
 * @param {string} cards 
 */
function renderFilterHtmlToDo(userTasks, search, cards) {
    let title = cards == 'To Do' && userTasks['title'].toLowerCase().includes(search);
    let text = cards == 'To Do' && userTasks['description'].toLowerCase().includes(search);
    if (title || text) {
        document.getElementById('toDoContent').innerHTML += generateHTML1(userTasks) + generateHTML2(userTasks), loadForUpdateHTML(userTasks);
    }
}


/**
 * Render search HTML in progress
 * 
 * @param {object} userTasks 
 * @param {string} search 
 * @param {string} cards 
 */
function renderFilterHtmlInProgress(userTasks, search, cards) {
    let title = cards == 'In progress' && userTasks['title'].toLowerCase().includes(search);
    let text = cards == 'In progress' && userTasks['description'].toLowerCase().includes(search);
    if (title || text) {
        document.getElementById('inProgressContent').innerHTML += generateHTML1(userTasks) + generateHTML2(userTasks), loadForUpdateHTML(userTasks);
    }
}


/**
 * Render search HTML Awaiting Feedback
 * 
 * @param {object} userTasks 
 * @param {string} search 
 * @param {string} cards 
 */
function renderFilterHtmlAwaitingFeedback(userTasks, search, cards) {
    let title = cards == 'Awaiting Feedback' && userTasks['title'].toLowerCase().includes(search);
    let text = cards == 'Awaiting Feedback' && userTasks['description'].toLowerCase().includes(search);
    if (title || text) {
        document.getElementById('awaitingFeedbackContent').innerHTML += generateHTML1(userTasks) + generateHTML2(userTasks), loadForUpdateHTML(userTasks);
    }
}


/**
 * Render search HTML Done
 * 
 * @param {object} userTasks 
 * @param {string} search 
 * @param {string} cards 
 */
function renderFilterHtmlDone(userTasks, search, cards) {
    let title = cards == 'Done' && userTasks['title'].toLowerCase().includes(search);
    let text = cards == 'Done' && userTasks['description'].toLowerCase().includes(search);
    if (title || text) {
        document.getElementById('doneContent').innerHTML += generateHTML1(userTasks) + generateHTML2(userTasks), loadForUpdateHTML(userTasks);
    }
}


/**
 * Delete a task from backend and update HTML
 * 
 * @param {number} number 
 */
async function deleteTaskActiveUser(number) {
    let user = userAccounts[activeUser]['userTasks'];
    for (let i = 0; i < user.length; i++) {
        if (user[i].id === number) {
            user.splice(i, 1);
            break;
        }
    }
    await saveTasksToBackend()
    await saveUserAccountsToBackend();
    closeOverlay();
    updateHTML();
}