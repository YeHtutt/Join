function generateHTML1(cards) {
    return /*html*/`
    <div draggable="true" id="dragMe${cards['id']}" ondragstart="startDragging(${cards['id']})" onclick="showOverlay(${cards['id']})" class="card">
        <div class="position-change-category">
        <div id="backgroundColor${cards['id']}" class="background">
            ${cards['category']}   
        </div>
        <div class="change-category">
            <img onclick="changeCategoryUp(${cards['id']}), doNotClose(event)" src="assets/img/arrow-up.ico" alt="">
            <img onclick="changeCategoryDown(${cards['id']}), doNotClose(event)" src="assets/img/arrow-down.ico" alt="">
        </div>
        </div>
        <div><b>${cards['title']}</b></div>
        <div class="text-color" >
        ${cards['description']}
        </div>
        <div class="position-progress">
         <div class="progress" id="progress${cards['id']}">
            <div id="progressBar${cards['id']}" class="progressBar">
            </div>`
}
        


function generateHTML2(cards) {
    return `</div>
    <div class="count" id="countDone${cards['id']}">

    </div>
   </div>
   <div class="position-cards-bottom">
      <div class="flex" id="userInitiales${cards['id']}" >
      </div> 
      <div id="priorityImage${cards['id']}">
      </div>
   </div>  
</div>`;
}


function renderShowOverlay1(todo, cards){
    return /*html*/`        
    <div class="overlay-header">
        <div class="overlay-department" id="overlayDepartment${cards}">
            ${(todo.category)}
        </div>
        <div class="close-icon">
            <img onclick="closeOverlay()" src="assets/img/close-overlay.svg">
        </div>
        <div class="close-icon-small">
            <img onclick="closeOverlay()" src="assets/img/backarrow.svg" alt="">
        </div>
    </div>
    <div class="overlay-title">
        ${(todo.title)}
    </div>`
}


function renderShowOverlay2(todo){
    return `
    <div class="overlay-text">
        ${(todo.description)}
    </div>
    <div class="overlay-date">
        <b>Due date:</b> ${(todo['dueDate'])}
    </div>
    <div class="overlay-date">
        <b>Priority:</b> ${(todo.priority)} <img src="${todo.priorityImg}">
    </div>`
    
}


function renderShowOverlay3(cards){
    return `<div class="overlay-date">
    <b>Assigned to:</b>  <div class="assigned-to-board" id="assignedTo">
                        </div>
</div>
<div class="overlay-edit-task-position">
<div class="overlay-delete-task" onclick=" deleteTaskActiveUser(${cards})">
      <img class="color-change" src="assets/img/delete.svg">
    </div>
    <div class="overlay-edit-task" onclick="showOverlayChange(${cards})">
      <img src="assets/img/edit-task.svg">
    </div>
</div>
`}


function generateAssignedToHTML(j, userLetter, element) {
    return `<div class="position-assigend-to">
    <div id="changeCircleOverlay${j}" class="initiales-Overlay">${userLetter}</div>
    <div>${element}</div>
    </div>`;
}


function showOverlayChangeHTML1(todo){
    return `
    <div class="overlay-header"> 
         <div class="width-chances">
             Title
            <input id="inputTittle" type=text class="input-chances-title" placeholder="${(todo.title)}">
         </div>
         <div class="close-icon-change">
             <img onclick="closeOverlay()" src="assets/img/close-overlay.svg">
         </div>
     </div>
     <div class="width-chances">
         Description <br>
         <textarea id="inputDescription" onkeyup="textAreaAdjust(this)" style="overflow:hidden" class="input-chances-text">${(todo.description)}</textarea>
     </div>`
     
}


function showOverlayChangeHTML2(todo){
    return`<div class="width-chances">
    Due date <br>
    <input class="input-chances-title " type="date" id="date" value="${(todo['dueDate'])}" placeholder="${(todo['dueDate'])}">
 </div>
 <div id="subtasks" class="subtasks-flex">
 <div class="addSubtaskContainer">
                 <input class="subtasksInput" id="subtasksInput" placeholder="Add new Subtask" />
                 <div class="addSubtaskBtn" id="addSubtaskBtn" onclick="createNewSubtask()"><img
                         src="assets/img/plus.png"></div>
                 <div id="subtaskOninput">
                     <img src="assets/img/icon_clear.png" id="clearSubtaskInput" onclick="deleteSubTask()">
                     <div class="line"></div>`
                     
}


function showOverlayChangeHTML3() {
    return `<img src="assets/img/checkmark.png" id="selectedSubtask" onclick="addSubTask()">
    </div>
</div>
</div>
<label for="priority" class="priority">Prio</label>
<div  class="priorityBoxesContainerBoard">
    <div class="prioUrgentBox" id="prioUrgentBox" onclick="insertUrgent()">Urgent <img
            id="prioUrgentImg" src="assets/img/urgent.png"></div>
    <div class="prioMediumBox" id="prioMediumBox" onclick="insertMedium()">Medium <img
            id="prioMediumImg" src="assets/img/medium.png"></div>
    <div class="prioLowBox" id="prioLowBox" onclick="insertLow()">Low <img id="prioLowImg"
            src="assets/img/low.png"></div>
</div>`
;
}


function showOverlayChangeHTML4(cards){
    return `<div class="assignContainerBoard">
    <label for="assignedTo" class="assignedToBoard">Assigned to</label>
    <div class="contactInputContainerBoard" id="contactInputContainer">
    <input class="assign-input" id="assignInput" type="text" placeholder="Select contacts to assign" required>
    <div id="assignDropDown" class="buttonOpenCloseBoard" onclick="dropDownAssignToBoard(${cards})"><img
    src="assets/img/dropdown-arrow.png"></div>
    </div>
    <div id="assignedList" class="assignedList"></div>
    </div>
    <div class="display" id="contactOverlayChange">
    </div>
    <div class="overlay-edit-task-position">
    <div class="overlay-chance-task" onclick="saveInputTask(${cards})">
    OK<img src="assets/img/right.svg">
    </div>
    </div>`
}


function renderAssignToBoardContactsHTML(userName, checkedAttribute, todo){
    return `
    <div class="assignedContact" >
        <div>${userName}</div>
        <label class="filledCheckboxContainer">
            <input type="checkbox" class="checkboxForContacts" value="${userName}" ${checkedAttribute} onclick="chooseContactBoard('${userName}', ${todo['id']})">
                <span class="checkmark"></span>
        </label>
    </div>`;
}


function renderSubtasksBoardHTML(showSubTask, checkedAttribute, j){
    return `<label class="container">
    <input type="checkbox" class="checkedSubTasks" onclick="chooseSubtasks()" value="${showSubTask}" ${checkedAttribute} />
    <span class="checkmark" id="checkmark${j}"></span>
    <div class="subtaskCheck">${showSubTask}</div>
</label>`;
}


function renderUserInitialeHTML1(idStr, user){
    return `
    <div id="circle${idStr}" class="initiales">${user.letters} </div>`;
}


function renderUserInitialeHTML2(idStr, count){
    return  `
    <div id="circle${idStr}" class="initiales background-black">+${count}</div>`;
}

function renderContactsOverlayChangeHTML(idStr, user){
    return `
    <div id="round${idStr}" class="initiales-Overlay">${user.letters} </div>`;
}