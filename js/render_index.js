async function renderIndex() {
  await loadUserAccountsFromBackend();
  renderLogin();
}

function renderLogin() {
  document.getElementById("login-container").innerHTML = `
    <form onsubmit="login(); return false" class="login-container" >
        <h1>Log in</h1>
        <div class="line-login"></div>
        <div class="input-container">
            <div class="input-field">
                <input required class="input" type="email" name="email" id="login-email-input" placeholder="Email">
                <img src="./assets/img/email-icon.png">
            </div>
            <div id="wrongEmail">
            </div>
            <div class="input-field">
                <input required class="input togglePassword" type="password" name="password" id="login-password-input" placeholder="Password">
                <img class="toogleImage" onclick="togglePassword()" src="./assets/img/password-icon.png">
            </div>
            <div id="wrongPassword">
            </div>
        </div>
        <div class="remember-check">
            <div  class="check" onclick="loginCheckbox()"><img id="loginCheckbox" src="./assets/img/unchecked.png">Remember me</div>
            <a onclick="renderForgotPassword()" href="#">Forgot my password</a>
        </div>
        <div class="login-buttons">
            <button class="btn-dark login-btn">Log in</button>
            <div onclick='guestLogin()' class="btn-bright guest-login">Guest Log in</div>
        </div>
    </form>
    `;
}

function renderSignUp() {
  document.getElementById("not-a-join").classList.toggle("display-none");
  document.getElementById("login-container").innerHTML = ``;
  document.getElementById("login-container").innerHTML = `
    <form onsubmit="signUpUser(); return false" class="login-container" >
        <h1>Sign up</h1>
        <img class="arrow-left-back" src="./assets/img/arrow-left.png" onclick="backToLogin()">
            <div class="line-login"></div>
            <div class="input-container">
                <div class="input-field">
                    <input required class="input" type="" name="name" id="sign-up-name-input" placeholder="Name">
                    <img src="./assets/img/user-icon.png">
                </div>

                <div class="input-field">
                    <input required class="input" type="email" name="email" id="sign-up-email-input" placeholder="Email">
                    <img src="./assets/img/email-icon.png">
                </div>

                <div class="input-field">
                    <input required minlength="5" class="input togglePassword" type="password" name="password" id="sign-up-password-input" placeholder="Password">
                    <img class="toogleImage" onclick="togglePassword()" src="./assets/img/password-icon.png">
                </div>
            </div>
            <button class="btn-dark">Sign up</button>
            <div class="display-none" id="registerBox">Du hast dich erfolgreich registriert!</div>
    </form>  
    `;
}

function backToLogin() {
  document.getElementById("not-a-join").classList.toggle("display-none");
  renderIndex();
}

function renderForgotPassword() {
  document.getElementById("not-a-join").classList.toggle("display-none");
  document.getElementById("login-container").innerHTML = ``;
  document.getElementById("login-container").innerHTML = `
    <form onsubmit="sendMeMail(); return false" class="login-container">
        <h1>I forgot my password</h1>
        <img class="arrow-left-back" src="./assets/img/arrow-left.png" onclick="backToLogin()">
        <div class="line-login"></div>
        <div class="input-container">
        <div class="textbox">
            <span>Don't worry! We will send you an email with the instructions to reset your password.</span>
        </div>
        <div class="input-container">
            <div class="input-field">
                <input required class="input" type="email" name="email" id="forgot-email-input" placeholder="Email">
                <img src="./assets/img/email-icon.png">
            </div>
            <div id="newPassword">
            </div>
            <button class="btn-dark">Send me the email</button>
        </div>
    </form>
`;
}

function renderResetYourPassword(user) {
  document.getElementById("login-container").innerHTML = `
    <form onsubmit ="changePassword(${user}); return false" class="login-container" >
        <h1>Reset your password</h1>
        <div class="line-login"></div>
        <div class="textbox"><span>Change your account password.</span>
        </div>
        <div class="input-container">
            <div class="input-field">
                <input required class="input togglePassword" type="password" name="password" id="new-password-input" placeholder="New password">
                <img class="toogleImage" onclick="togglePassword()" src="./assets/img/password-icon.png">
            </div>
            <div class="input-field">
                <input required class="input togglePassword" type="password" name="password" id="confirm-password-input" placeholder="Confirm password">
                <img class="toogleImage" onclick="togglePassword()" src="./assets/img/password-icon.png">
            </div>
            <div id="confirmPassword">
            </div>
        </div>
        <button class="btn-dark login-btn">Continue</button>
    </form>
    `;
}
