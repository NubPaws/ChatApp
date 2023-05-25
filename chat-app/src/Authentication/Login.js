import { handleUsername, handlePassword } from "./Validation";

async function loginUser(event, setShowErrorMessage, setToken) {
    event.preventDefault();
    if (handleUsername() && handlePassword()) {
        let enteredUsername = document.getElementById("username").value;
        let enteredPassword = document.getElementById("password").value;
        let userData = {
            "username": enteredUsername,
            "password": enteredPassword,
        };
        const res = await fetch(document.getElementById("loginForm").action, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify(userData)
        })
        if (res.status !== 200) {
            setShowErrorMessage(true);
        }
        else {
            const token = await res.text();
            setToken(token);
        }
    }
}

export { loginUser };