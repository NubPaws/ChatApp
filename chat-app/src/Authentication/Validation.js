
const MIN_USERNAME_LENGTH = 4;
const MIN_PASSWORD_LENGTH = 8;

function handleUsername() {
    let username = document.getElementById("username");
    let errorMessageSpan = document.getElementById("usernameErrorMessage");
    if (username.value.length < MIN_USERNAME_LENGTH) {
        errorMessageSpan.innerText = "Username needs to have at least 4 characters";
        return false;
    }
    errorMessageSpan.innerText = "";
    return true;
}

function handlePassword() {
    let password = document.getElementById("password");
    let errorMessageSpan = document.getElementById("passwordErrorMessage");
    if (password.value.length < MIN_PASSWORD_LENGTH) {
        errorMessageSpan.innerText = "Password needs have at least " + MIN_PASSWORD_LENGTH + " characters";
        return false;
    }
    errorMessageSpan.innerText = "";
    return true;
}

function confirmPassword() {
    let confirmPassword = document.getElementById("confirmPassword");
    let errorMessageSpan = document.getElementById("confirmPasswordErrorMessage");
    let password = document.getElementById("password");

    if (confirmPassword.value.length < MIN_PASSWORD_LENGTH) {
        errorMessageSpan.innerText = "Password needs have at least " + MIN_PASSWORD_LENGTH + " characters";
        return false;
    }
    if (confirmPassword.value !== password.value) {
        errorMessageSpan.innerText = "Passwords do not match";
        return false;
    }
    errorMessageSpan.innerText = "";
    return true;
}

function handleDisplayName() {
    let displayName = document.getElementById("displayName");
    let errorMessageSpan = document.getElementById("displayNameErrorMessage");
    if (displayName.value.length == 0) {
        errorMessageSpan.innerText = "Display Name can't be empty"
        return false;
    }
    errorMessageSpan.innerText = "";
    return true;
}

function previewProfilePicture(event) {
    var src = URL.createObjectURL(event.target.files[0])
    let preview = document.getElementById('preview');
    preview.src = src;
    preview.style.height = "150px";
    preview.style.width = "150px";
}

function handleRegister(event, props) {
    event.preventDefault();
    // Checking for registration success
    if (handleUsername() && handleUsername() && handlePassword() && confirmPassword() && handleDisplayName()) {
        // registering user
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let displayName = document.getElementById("displayName").value;
        let profilePicture = document.getElementById("preview").src;
        props.setUserCredentials(
            {
                "username": username,
                "password": password,
                "display name": displayName,
                "profilePicture": profilePicture
            });
        alert("Registered successfully");
    }
}

function handleLogin(event, userCredentials) {
    event.preventDefault();
    if (userCredentials["username"] == document.getElementById("username").value
        && userCredentials["username"] == document.getElementById("password").value) {
            alert("Login successfully");
    }
}

export {
    previewProfilePicture,
    handleRegister,
    handleLogin
}