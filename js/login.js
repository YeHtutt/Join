
function login() {
  let email = document.getElementById("login-email-input");
  let password = document.getElementById("login-password-input");

  checkCorrectLogin(email, password)
}

  function togglePassword() {
    var passwordInputs = document.querySelectorAll(".togglePassword");
    passwordInputs.forEach(function(input) {
      if (input.type === "password") {
        input.type = "text";
      } else {
        input.type = "password";
      }
    });
  }

 function checkCorrectLogin(email, password){
  let user = userAccounts.find((u) => u.userEmail == email.value);
  if (user) {
    document.getElementById('wrongEmail').innerHTML ='';
    if(user.userPassword == password.value){
      saveActiveUserLocal(user);
     window.location.href = './summary.html';
     document.getElementById('wrongPassword').innerHTML =''; 
    }
    else{
      document.getElementById('wrongPassword').innerHTML = 'The password is incorrect, please try again';
    }
  } else {
    document.getElementById('wrongEmail').innerHTML = 'The email is incorrect, please try again';
  }
}

function saveActiveUserLocal(user) {
  let activeUser = user.userId;
  localStorage.setItem("activeUser", activeUser);
 
}

function guestLogin(){
  let activeUser = userAccounts[0].userId;
  localStorage.setItem("activeUser", activeUser);
  window.location.href = './summary.html';  
}

function sendMeMail(){
  let email = document.getElementById('forgot-email-input');
  let user = userAccounts.find((u) => u.userEmail == email.value);

  if(user){
    renderResetYourPassword(user.userId);
  } else{
    document.getElementById('newPassword').innerHTML = 'This Email is not signed up yet';
  }
  
}

async function changePassword(user){
  let newPassword = document.getElementById('new-password-input').value;
  let confirmPassword = document.getElementById('confirm-password-input').value;
  if(newPassword == confirmPassword){
    userAccounts[user].userPassword = newPassword;
    await saveUserAccountsToBackend();
    setTimeout(backToLogin, 1000);
  } else {
    document.getElementById('confirmPassword').innerHTML = 'Make sure the second password you typed matches the first';
  }
}
