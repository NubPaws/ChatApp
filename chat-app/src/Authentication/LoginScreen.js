import "./authentication.css"
import { Link } from "react-router-dom";
import { Input } from "./Input";
import { loginUser } from "./Login";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Modal } from "../UIElements/Modal";


export function LoginScreen(props) {
    const navigate = useNavigate();
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    // Will change after successful login attempt
    useEffect(() => {
        if (props.token !== "") {
            navigate("/chat")
        }
    }, [props.token, props.setToken, navigate]);

    return (
        <div className="pane">
            <form action="http://localhost:5000/api/Tokens" id="loginForm">
                <Input id="username" type="text" name="username" inputText="Username"
                    placeholder="Username" errorMessageId="usernameErrorMessage"></Input>
                <Input id="password" type="password" name="password" inputText="Password"
                    placeholder="Password" errorMessageId="passwordErrorMessage"></Input>
                <button className="btn btn-primary" onClick={(event) => loginUser(event, setShowErrorMessage, props.setToken)}>Login</button>
            </form>
            <div className="text-center">
                <p>Not registered? <Link to='/registration'>click here</Link> to register</p>
            </div>
            <Modal title="Login Failed" show={showErrorMessage} onClose={() => { setShowErrorMessage(false) }}>
                <h5>Incorrect username/password</h5>
            </Modal>
        </div>
    );
}