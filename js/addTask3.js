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
    setTimeout(()=> {
        closeDropDownAssignTo()
    }, 100);
    
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
    isAssignDropdownOpen = false;
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
    isAssignDropdownOpen = true;
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