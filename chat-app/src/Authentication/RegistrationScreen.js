import "./authentication.css"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "./Input.js";
import { handleRegister, previewProfilePicture } from "./Validation.js";
import { Modal } from "../UIElements/Modal.js";

export function RegistrationScreen(props) {
    const navigate = useNavigate();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    
    useEffect(() => {
        if (shouldRedirect === true) {
            setShouldRedirect(false);
            navigate("/login")
        }
      }, [shouldRedirect, setShouldRedirect, navigate]);
    return (
        <div className="pane">
            <form>
                <Input id="username" type="text" name="username" inputText="Username - has to be at least 4 characters long" 
                        placeholder="Username" errorMessageId="usernameErrorMessage"></Input>
                <Input id="password" type="password" name="password" inputText="Password - has to be at least 8 characters long" 
                        placeholder="Password" errorMessageId="passwordErrorMessage"></Input>
                <Input id="confirmPassword" type="password" name="confirmPassword" 
                        inputText="Please validate your password" placeholder="Password" errorMessageId="confirmPasswordErrorMessage"></Input>
                <Input id="displayName" type="text" name="displayName" inputText="Display Name" 
                        placeholder="Display Name" errorMessageId="displayNameErrorMessage"></Input>

                <Input id="profilePicture" type="file" name="profilePicture" inputText="Profile Picture" onChange={previewProfilePicture}></Input>
                <img id="preview" alt=""/>
                <br></br>
                <button className="btn btn-primary" onClick={(event) => handleRegister(event, props.userCredentials, props.setUserCredentials, setShouldRedirect, props.databaseHook, setShowMessage)}>Register</button>
            </form>
            <div className="text-center">
                <p>Already registered? <Link to='/login'>click here</Link> to login</p>
            </div>
            <Modal title="Registered successfully" show={showMessage} onClose={() => {setShowMessage(false); setShouldRedirect(true);}}>
                <h5>You have successfully completed the registration</h5>
            </Modal>
        </div>
    );
}