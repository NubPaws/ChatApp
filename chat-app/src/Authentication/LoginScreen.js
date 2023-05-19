import "./authentication.css"
import { Link } from "react-router-dom";
import { Input } from "./Input";
import { handleLogin } from "./Validation";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Modal } from "../UIElements/Modal";


export function LoginScreen(props) {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  const {currentUser, setAllowChatScreen, setCurrentUser} = props;
  
  useEffect(() => {
    if (currentUser !== "") {
      setAllowChatScreen(true);
      navigate("/chat")
    }
  }, [currentUser, setCurrentUser, navigate, setAllowChatScreen]);
  return (
    <div className="pane">
      <form>
        <Input id="username" type="text" name="username" inputText="Username"
          placeholder="Username" errorMessageId="usernameErrorMessage"></Input>
        <Input id="password" type="password" name="password" inputText="Password"
          placeholder="Password" errorMessageId="passwordErrorMessage"></Input>
        <button className="btn btn-primary" onClick={(event) => handleLogin(event, props.userCredentials, props.setCurrentUser, setShowMessage)}>Login</button>
      </form>
      <div className="text-center">
        <p>Not registered? <Link to='/registration'>click here</Link> to register</p>
      </div>
      <Modal title="Login Failed" show={showMessage} onClose={() => {setShowMessage(false)}}>
                <h5>Incorrect username/password</h5>
            </Modal>
    </div>
  );
}