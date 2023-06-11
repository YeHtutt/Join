let activeUser;

async function init(id) {
  await includeHTML();
  highlightSelectedNav(id);
  await loadUserData();
  changeProfileImg();
  //await backend.deleteItem('tasks');
}

async function loadUserData() {
  await loadUserAccountsFromBackend();
  loadActiveUserLocal();
  await loadTasksFromBackend()
}

function changeProfileImg() {
  let userInitials = userAccounts[activeUser]['userInitials'];
  let userColor = userAccounts[activeUser]['userColor'];
  userColor = String(userColor);
  document.getElementById('profile-img').innerHTML = `<div class="log-out">${userInitials}</div>`;
  document.getElementById('profile-img').style.backgroundColor = userColor;
}

function showLogOut(){

  if (window.innerWidth <801) {
    document.getElementById('help').style.display = '';
    document.getElementById('legal-notice-').style.display = '';
    setTimeout(() => {
      document.getElementById('help').style.display = 'none';
      document.getElementById('legal-notice-').style.display = 'none';
  }
      , 3000);
    
  }
  document.getElementById('log-out').style.display = '';

  setTimeout(() => {
    document.getElementById('log-out').style.display = 'none';;
}
    , 3000);
}

function resetT(){
  localStorage.setItem('t', false);
}


let loginCheckedBox;
function loginCheckbox() {
  if (loginCheckedBox) {
    document.getElementById("loginCheckbox").src = "./assets/img/unchecked.png";
    loginCheckedBox = false;
  } else {
    document.getElementById("loginCheckbox").src = "./assets/img/checked.png";
    loginCheckedBox = true;
  }
}

function randomUserColor() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  let rgbColor = `rgb(${r},${g},${b})`;
  return rgbColor;
}


async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}


/**
 * loading user accounts from backend
 */
async function loadUserAccountsFromBackend() {
  await downloadFromServer();
  userAccounts = JSON.parse(backend.getItem('userAccounts')) || [];
}


async function loadTasksFromBackend() {
  await downloadFromServer();
  tasks = JSON.parse(backend.getItem('tasks')) || [];
}

async function saveUserAccountsToBackend() {
  await backend.setItem('userAccounts', JSON.stringify(userAccounts));
}

async function saveTasksToBackend() {
  await backend.setItem('tasks', JSON.stringify(tasks));
}

function loadActiveUserLocal() {
  activeUser = localStorage.getItem('activeUser');
}



function highlightSelectedNav(id) {
  setTimeout(() => {
    document.getElementById(`${id}`).classList.add("selected");
  }, 10);
}

/**
 * get Username initials
 */
function userNameInitial(name) {
  let initials = "";
  let nameSplit = name.split(" ");

  for (let i = 0; i < nameSplit.length; i++) {
    let initial = nameSplit[i].charAt(0);
    initials += initial;
  }
  return initials;
}