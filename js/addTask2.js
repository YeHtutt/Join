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
    document.getElementById('addTaskPopOutContainer').style.zIndex = 15;
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
    document.getElementById('addTaskPopOutContainer').style.zIndex = -1;
    setAllFieldsToDefault();
    closeDropdownCategory();
    closeDropDownAssignTo();
    choseContacts = [];
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