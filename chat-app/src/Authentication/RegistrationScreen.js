import { Link } from "react-router-dom";
import "./authentication.css"
import { Input } from "./Input";
import { handleRegister, previewProfilePicture } from "./Validation";


export function RegistrationScreen() {
    return (
        <div className="container pane">
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
                <img id="preview"/>
                <br></br>
                <button className="btn btn-primary" onClick={handleRegister}>Register</button>
            </form>
            <div className="text-center">
                <p>Already registered? <Link to='/login'>click here</Link> to login</p>
            </div>
        </div>
    );
}