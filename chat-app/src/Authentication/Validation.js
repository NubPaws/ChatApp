
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
    if (displayName.value.length === 0) {
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

function handleRegister(event, userCredentials, setUserCredentials, setShouldRedirect, dbHook) {
    event.preventDefault();
    // Checking for registration success
    if (handleUsername() && handleUsername() && handlePassword() && confirmPassword() && handleDisplayName()) {
        // registering user
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let displayName = document.getElementById("displayName").value;
        let profilePicture = document.getElementById("preview").src;
        let userData = {};
        userData[username] = {
            "password": password,
            "display name": displayName,
            "image": profilePicture,
            "logged in": false
        };
        setUserCredentials({ ...userCredentials, ...userData });
        const [database, setDatabase] = dbHook;
        const db = database;
        db[username] = {
            display: displayName,
            image: profilePicture,
            messages: {}
        }
        setDatabase(db);
        
        alert("Registered successfully");
        setShouldRedirect(true);
    }
}

function handleLogin(event, userCredentials, setCurrentUser) {
    event.preventDefault();
    if (handleUsername() && handlePassword()) {
        let enteredUsername = document.getElementById("username").value;
        let enteredPassword = document.getElementById("password").value;
        if (userCredentials[enteredUsername] !== undefined && userCredentials[enteredUsername]["password"] === enteredPassword) {
            alert("Login successfully");
            setCurrentUser(enteredUsername);
        }
        else {
            alert("Login Failed");
        }
    }
}
export {
    previewProfilePicture,
    handleRegister,
    handleLogin
}
