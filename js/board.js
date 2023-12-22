let currentDraggedElement;
let loadOverlay = false;
let loadCircle = false;
let choosedContact = [];
let toDoCount= [];
let inProgressCount= [];
let awaitingCount= [];
let doneCount= [];


function onloadBoard() {
    init('board');
    updateHTML();
    loadActiveUserLocal();

}
/**
 * updates the HTML content by loading tasks and user accounts from a backend, emptying arrays, and rendering task cards according to their progress status.
 * 
 */
async function updateHTML() {
    await loadTasksFromBackend();
    await loadUserAccountsFromBackend();
    emptyArrays();
    let user = userAccounts[activeUser]['userTasks'];
    document.getElementById('toDoContent').innerHTML = '';
    document.getElementById('inProgressContent').innerHTML = '';
    document.getElementById('awaitingFeedbackContent').innerHTML = '';
    document.getElementById('doneContent').innerHTML = '';
    for (let i = 0; i < user.length; i++) {
        const userTasks = user[i];
        cards = userTasks['progress'];
        renderHTML(cards, userTasks);
    } updateHTMLNon();
}


/**
 * updates the HTML content for each category
 * 
 * @param {object} cards 
 * @param {object} userTasks 
 */
function renderHTML(cards, userTasks) {
    updateHTMLToDo(cards, userTasks);
    updateHTMLInProgress(cards, userTasks);
    updateHTMLAwaitingFeedback(cards, userTasks);
    updateHTMLDone(cards, userTasks);
}


/**
 * emptying arrays
 * 
 */
function emptyArrays(){
    toDoCount = [];
    inProgressCount = [];
    awaitingCount = [];
    doneCount = [];
}


/**
 * render the HTML content for each category if non tasks in category
 * 
 */
function updateHTMLNon(){
    if (toDoCount.length == 0) {
        document.getElementById('toDoContent').innerHTML = `<div class="no-cards"> No Task in To Do </div>`;
    }
    if (inProgressCount.length == 0) {
        document.getElementById('inProgressContent').innerHTML = `<div class="no-cards"> No Task in Progress </div>`;
    }
    if (awaitingCount.length == 0) {
        document.getElementById('awaitingFeedbackContent').innerHTML = `<div class="no-cards"> No Task in Awaiting Feedback </div>`;
    }
    if (doneCount.length == 0) {
        document.getElementById('doneContent').innerHTML = `<div class="no-cards"> No Task in Done </div>`;
    }
}


/**
 *  Render the HTML content for To Do
 * 
 * @param {object} cards 
 * @param {object} userTasks 
 */
function updateHTMLToDo(cards, userTasks) {
    if (cards == 'To Do') {
        document.getElementById('toDoContent').innerHTML += generateHTML1(userTasks) + generateHTML2(userTasks), loadForUpdateHTML(userTasks);
        toDoCount ++;
    }
}


/**
 *  Render the HTML content for In progress
 * 
 * @param {object} cards 
 * @param {object} userTasks 
 */
function updateHTMLInProgress(cards, userTasks) {
    if (cards == 'In progress') {
        document.getElementById('inProgressContent').innerHTML += generateHTML1(userTasks) + generateHTML2(userTasks), loadForUpdateHTML(userTasks);
        inProgressCount ++;
    }
}

  
/**
 *  Render the HTML content for Awaiting Feedback
 * 
 * @param {object} cards 
 * @param {object} userTasks 
 */
function updateHTMLAwaitingFeedback(cards, userTasks) {
    if (cards == 'Awaiting Feedback') {
        document.getElementById('awaitingFeedbackContent').innerHTML += generateHTML1(userTasks) + generateHTML2(userTasks), loadForUpdateHTML(userTasks);
        awaitingCount ++;
    }
}


/**
 *  Render the HTML content for Done
 * 
 * @param {object} cards 
 * @param {object} userTasks 
 */
function updateHTMLDone(cards, userTasks) {
    if (cards == 'Done') {
        document.getElementById('doneContent').innerHTML += generateHTML1(userTasks) + generateHTML2(userTasks), loadForUpdateHTML(userTasks);
        doneCount ++;
    }
}


/**
 * Load all informatoins for tasks
 * 
 * @param {object} userTasks 
 */
async function loadForUpdateHTML(userTasks) {
    priorityImgCard(userTasks);
    changeBackgroundColor(userTasks);
    SelectForRenderUserInitiales(userTasks);
    changeProgressbar(userTasks['id']);
}


/**
 * Select all informatoins for userinitiales
 * 
 * @param {object} cards 
 */
async function SelectForRenderUserInitiales(cards) {
    const { id, contact } = cards;
    const contactElem = document.getElementById(`userInitiales${id}`);
    contactElem.innerHTML = '';
    const user = userAccounts[activeUser].userContacts;
    renderUserInitiales(id, contact, contactElem, user)
}


/**
 * Render contactsletter on cards (tasks)
 * 
 * @param {number} id 
 * @param {object} contact 
 * @param {string} contactElem 
 * @param {object} user 
 */
function renderUserInitiales(id, contact, contactElem, user) {
    const userWithContacts = user.filter(({ name }) => contact.includes(name));
    const userContactsLength = userWithContacts.length;
    const userToDisplay = userContactsLength <= 3 ? userWithContacts : userWithContacts.slice(0, 2);
    userToDisplay.forEach((user, index) => {
        const idStr = id.toString() + index.toString();
        contactElem.innerHTML += renderUserInitialeHTML1(idStr, user);
        changeBackgroundCircle(`circle${idStr}`, user.color);
    });
    if (userContactsLength > 3) {
        const count = userContactsLength - 2;
        const idStr = id.toString() + '2';
        contactElem.innerHTML += renderUserInitialeHTML2(idStr, count);
    }
}


/**
 * Change Backgroundcolor from letters
 * 
 * @param {string} id 
 * @param {string} color 
 */
function changeBackgroundCircle(id, color) {
    const backgroundCircle = document.getElementById(id);
    backgroundCircle.style.backgroundColor = color;
}


/**
 * Change Backgroundcolor from headline
 * 
 * @param {object} cards 
 */
function changeBackgroundColor(cards) {
    let background = document.getElementById(`backgroundColor${cards['id']}`);
    let color = cards['categoryColor'];
    background.style.backgroundColor = `${color}`;
}


/**
 * Show the priority for cards
 * 
 * @param {object} cards 
 */
function priorityImgCard(cards) {
    let prio = document.getElementById(`priorityImage${cards['id']}`);
    let card = cards['priority'];
    if (card == 'Urgent') {
        prio.innerHTML = '<img src="assets/img/urgent.png">';
    } else if (card == 'Medium') {
        prio.innerHTML = '<img src="assets/img/medium.png">';
    } else {
        prio.innerHTML = '<img src="assets/img/low.png">'; 
    }
}


/**
 * Start drag and drop
 * 
 * @param {number} id 
 */
function startDragging(id) {
    currentDraggedElement = id;
    document.getElementById(`dragMe${id}`).classList.add('dragging');
}


/**
 * Allow drag and drop
 * 
 * @param {function} ev 
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * Save the new catergorry and update HTML
 * 
 * @param {string} category 
 */
async function moveTo(category) {
    let user = userAccounts[activeUser]['userTasks'];
    let todo = user.find((item) => item.id === currentDraggedElement);
    todo['progress'] = category;
    await saveTasksToBackend();
    await saveUserAccountsToBackend();
    document.getElementById('bodyBoard').style.backgroundColor = 'rgb(245,245,245)';
    updateHTML();
}

/**
 * This function points to the corresponding field of the category to be dragged into
 * 
 * @param {string} id 
 */
function highLight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');        
}

/**
 * This function removed the highlighted color of the categoryfield after drag leave
 * 
 * @param {string} id 
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

/**
 * This function return the highlighted color of the pointed categoryfield after drop dragging
 * 
 * @param {string} id 
 */
function returnOriginalColor(id) {
        document.getElementById(id).classList.remove('drag-area-highlight');
        document.getElementById(id).classList.add('drag-area');
}

/**
 * Show overlay for more informations
 * 
 * @param {number} cards 
 */
function showOverlay(cards) {
    calcScrollTo();
    document.getElementById('bodyBoard').classList.add('noscroll');
    document.getElementById('kanban').classList.add('display-none');
    let user = userAccounts[activeUser]['userTasks'];
    let todo = user.find((item) => item.id === cards);
    document.getElementById('overlay-background').classList.add('overlay-background');
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('d-none');
    overlay.innerHTML = renderShowOverlay1(todo, cards) + renderShowOverlay2(todo) + renderShowOverlay3(cards);
    loadOverlay = true;
    generateAssignedTo(todo);
    changeBackgroundOverlay(todo)
}


/**
 * window height is automatically by 0
 * 
 */
function calcScrollTo() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/**
 * Change Background from headline
 * 
 * @param {object} cards 
 */
function changeBackgroundOverlay(cards) {
    let background = document.getElementById(`overlayDepartment${cards['id']}`);
    let color = cards['categoryColor'];
    background.style.backgroundColor = `${color}`;
}


/**
 * selectet informations for generateAssignedToHTML() and  changeBackgroundCircleOverlay()
 * 
 * @param {object} todo 
 */
function generateAssignedTo(todo) {
    let contacts = document.getElementById('assignedTo');
    let user = userAccounts[activeUser]['userContacts'];
    for (let i = 0; i < todo.contact.length; i++) {
        const element = todo.contact[i];
        for (let j = 0; j < user.length; j++) {
            const users = user[j];
            let userLetter = users['letters'];
            let userName = users['name']
            if (userName.includes(element)) {
                contacts.innerHTML += generateAssignedToHTML(j, userLetter, element), changeBackgroundCircleOverlay(users, j)
            }
        }
    }
}


/**
 * Change Backgroundcolor from letters
 * 
 * @param {object} users 
 * @param {number} j 
 */
function changeBackgroundCircleOverlay(users, j) {
    let background = document.getElementById(`changeCircleOverlay${j}`);
    let color = users['color'];
    background.style.background = `${color}`;
}


/**
 * Show overlay for change informations
 * 
 * @param {number} cards 
 */
async function showOverlayChange(cards) {
    let user = userAccounts[activeUser]['userTasks'];
    let todo = user.find((item) => item.id === cards);
    let overlay = document.getElementById('overlay');
    document.getElementById('kanban').classList.add('display-none');
    overlay.innerHTML = showOverlayChangeHTML(todo, cards);
    insertPriority(cards);
    renderSubtasksBoard(cards);
    chanceTextarea(cards);
    renderContactsOverlayChange(todo);
    await updateCalender();
    document.getElementById('kanban').classList.add('display-none');
}


/**
 *  Render showOverlayChangeHTML
 * 
 * @param {object} todo 
 * @param {number} cards 
 * @returns 
 */
function showOverlayChangeHTML(todo, cards) {
    return showOverlayChangeHTML1(todo)+
    showOverlayChangeHTML2(todo)+
    showOverlayChangeHTML3()+
    showOverlayChangeHTML4(cards);
}


/**
 * Style textarea
 * 
 * @param {string} element 
 */
function textAreaAdjust(element) {
    element.style.height = "1px";
    element.style.height = (25 + element.scrollHeight) + "px";
}


