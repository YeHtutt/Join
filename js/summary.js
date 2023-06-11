let toDoSummary = 0;
let inProgressSummary = 0;
let awaitingFeedbackSummary = 0;
let doneSummary = 0;
let urgents = 0;
let dateSummary = [];
let t=false;


/**
 * This function shows the greet if the Device is smaller than 1316px in width
 * 
 */
function greetingsResponsive() {
    let tFromStorage = localStorage.getItem('t');
    if (tFromStorage !== null) {
        t = JSON.parse(tFromStorage);
      }
    if (window.innerWidth < 1316 && t==false)  {
        document.getElementById('greeting-container').classList.add('responsive-greet');
        t=true;
        localStorage.setItem('t', true);

    }
}



/**
 * This function to set the username
 * 
 */
function setName() {
    let userName = userAccounts[activeUser].userName;
    document.getElementById('name').innerHTML = userName;
}

/**
 * This function displays the number of the certain Tasks
 * 
 */
function setTasks() {
    let tasksSummary = toDoSummary + inProgressSummary + awaitingFeedbackSummary + doneSummary;
    document.getElementById('task-in-board-nr').innerHTML = tasksSummary;
    document.getElementById('task-in-progress-nr').innerHTML = inProgressSummary;
    document.getElementById('awaiting-feedback-nr').innerHTML = awaitingFeedbackSummary;
}

/**
 * This function sets the date of deadline 
 * 
 */
function setUrgencies() {
    document.getElementById('urgent-nr').innerHTML = urgents;

    if (dateSummary.length == 0) {
        document.getElementById('deadline-date').innerHTML = 'no deadlines';
    } else {
        const date = dateSummary[0];
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();
        document.getElementById('deadline-date').innerHTML = `${month} ${day}, ${year}`;
    }
}

/**
 * This function displays the number of the does
 * 
 */
function setDos() {
    document.getElementById('do-nr').innerHTML = toDoSummary;
    document.getElementById('done-nr').innerHTML = doneSummary;
}

/**
 * This function sorts the dates to get the next upcoming date
 * 
 */
function sortDates() {
    dateSummary.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
}

/**
 * This function gets your localtime and changes the greeting accordingly
 * 
 */
function getTime() {
    const date = new Date();
    let t = date.getHours();
    if (t > 4.59 && t < 12) {
        document.getElementById('greeting').innerHTML = 'Good morning,';
    }
    if (t > 11.59 && t < 18) {
        document.getElementById('greeting').innerHTML = 'Good afternoon,';
    }
    if (t > 17.59 || t === 0 || t > 0 && t < 5) {
        document.getElementById('greeting').innerHTML = 'Good evening,';
    }
}

/**
 * This function executes all necessary functions onload
 * 
 */
async function initSummary() {
    await init('summary');
    await loadTasksFromBackend();
    await loadUserAccountsFromBackend();
    greetingsResponsive();
    getTime();
    setName();
    checkingConditions();
    sortDates();
    setTasks();
    setUrgencies();
    setDos();

}


/**
 * This function checks the tasks for their category and pushes them into the specific arrays
 * 
 */
function checkingConditions() {
    let user = userAccounts[activeUser]['userTasks'];
    for (let i = 0; i < user.length; i++) {
        const userTasks = user[i];
        let urgent = userTasks['priority'];
        let date = new Date(userTasks['dueDate']);
        cards = userTasks['progress'];
        if (cards == 'To Do') {
            toDoSummary++;
        }
        if (cards == 'done') {
            doneSummary++
        }
        if (cards == 'In progress') {
            inProgressSummary++;
        }
        if (cards == 'Awaiting Feedback') {
            awaitingFeedbackSummary++;
        }
        if (cards == 'Done') {
            doneSummary++;
        }
        if (urgent == 'Urgent' && cards !== 'Done') {
            dateSummary.push(date);
            urgents++;
        }
    }

}
