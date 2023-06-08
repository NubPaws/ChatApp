import { handleUsername, handlePassword } from "./Validation.js";
import { getUserDetails } from "../APIRequests/APIRequests.js";

async function loginUser(event, setShowErrorMessage, setShowConnectionErrorMessage, setUserCredentials) {
    event.preventDefault();
    if (handleUsername() && handlePassword()) {
        let enteredUsername = document.getElementById("username").value;
        let enteredPassword = document.getElementById("password").value;
        let userData = {
            "username": enteredUsername,
            "password": enteredPassword,
        };

        let res = null;
        try {
            res = await fetch(document.getElementById("loginForm").action, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                },
                'body': JSON.stringify(userData)
            });
        } catch (error) {
            if (error instanceof TypeError) {
                setShowConnectionErrorMessage(true);
                return;
            }
        }

        if (res.status !== 200) {
            setShowErrorMessage(true);
        }
        else {
            const token = await res.text();
            const userDetails = await getUserDetails(enteredUsername, "Bearer " + token,);
            if (token !== null && userDetails !== null) {
                setUserCredentials({
                    "token": "Bearer " + token,
                    ...userDetails
                })
            }
        }
    }
}

export { loginUser };