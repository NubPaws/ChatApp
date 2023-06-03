import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Input } from "./Input.js";
import { loginUser } from "./Login.js";
import { Modal } from "../UIElements/Modal.js";

import "./Authentication.css";
import { Button } from "../UIElements/Button.js";

export function LoginScreen(props) {
    const navigate = useNavigate();
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    // Will change after successful login attempt
    useEffect(() => {
        if (Object.keys(props.userCredentials).length !== 0) {
            navigate("/chat");
        }
    }, [props.userCredentials, props.setUserCredentials, navigate]);

    return (
        <div className="fieldsContainer">
            <form action="http://localhost:5000/api/Tokens" id="loginForm">
                <Input id="username" className="field" type="text" name="username"
                    placeholder="Username" errorMessageId="usernameErrorMessage">
                        Username
                </Input>
                <Input id="password" className="field" type="password" name="password"
                    placeholder="Password" errorMessageId="passwordErrorMessage">
                        Password
                </Input>
                <Button
                    className="fieldLabel"
                    bgColor="#007bff"
                    textColor="white"
                    borderWidth="1px"
                    onClick={(event) => loginUser(event, setShowErrorMessage, props.setUserCredentials)}>
                    Login
                </Button>
            </form>
            <div className="bottomText">
                <p>Not registered? <Link to='/registration'>click here</Link> to register</p>
            </div>
            <Modal title="Login Failed" show={showErrorMessage} onClose={() => { setShowErrorMessage(false) }}>
                <h5>Incorrect username/password</h5>
            </Modal>
        </div>
    );
}