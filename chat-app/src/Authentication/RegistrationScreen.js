import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { registerUser, previewProfilePicture } from "./Registration.js";
import { Input } from "./Input.js";
import { Modal } from "../UIElements/Modal.js";

import "./Authentication.css";
import { Button } from "../UIElements/Button.js";

export function RegistrationScreen(props) {
    const navigate = useNavigate();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        if (shouldRedirect === true) {
            setShouldRedirect(false);
            navigate("/login")
        }
    }, [shouldRedirect, setShouldRedirect, navigate]);
    return (
        <div className="fieldsContainer">
            <form action="http://localhost:5000/api/Users" id="registrationForm">
                <Input id="username" className="field" type="text" name="username"
                    placeholder="Username" errorMessageId="usernameErrorMessage">
                    Username<br/>
                    <span className="note">At least 4 characters long</span>
                </Input>
                <Input id="password" className="field" type="password" name="password"
                    placeholder="Password" errorMessageId="passwordErrorMessage">
                    Password<br/>
                    <span className="note">At least 8 characters long</span>
                </Input>
                <Input id="confirmPassword" className="field" type="password" name="confirmPassword"
                    placeholder="Password" errorMessageId="confirmPasswordErrorMessage">
                    Please validate your password
                </Input>
                <Input id="displayName" className="field" type="text" name="displayName"
                    placeholder="Display Name" errorMessageId="displayNameErrorMessage">
                    Display Name
                </Input>
                <Input id="profilePicture" type="file" name="profilePicture" onChange={previewProfilePicture}>
                    Profile Picture
                </Input>
                <img id="preview" alt="" />
                <br></br>
                <Button
                    className="fieldLabel"
                    bgColor="#007bff"
                    textColor="white"
                    borderWidth="1px"
                    onClick={(event) => registerUser(event, setShowSuccessMessage, setShowErrorMessage)}>
                    Register
                </Button>
            </form>
            <div className="bottomText">
                <p>Already registered? <Link to='/login'>click here</Link> to login</p>
            </div>
            <Modal title="Registered successfully" show={showSuccessMessage} onClose={() => { setShowSuccessMessage(false); setShouldRedirect(true); }}>
                <h5>You have successfully completed the registration</h5>
            </Modal>
            <Modal title="Registration Failed" show={showErrorMessage} onClose={() => { setShowErrorMessage(false); }}>
                <h5>Error while registering</h5>
            </Modal>

        </div>
    );
}