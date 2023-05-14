import "./authentication.css"
import { Link } from "react-router-dom";
import { Input } from "./Input";
import { handleLogin } from "./Validation";

export function LoginScreen(props) {
  return (
    <div>
      <title>Login</title>

      <div className="container pane">
        <form>
          <Input id="username" type="text" name="username" inputText="Username"
                placeholder="Username" errorMessageId="usernameErrorMessage"></Input>
          <Input id="password" type="password" name="password" inputText="Password"
                placeholder="Password" errorMessageId="passwordErrorMessage"></Input>
          <button className="btn btn-primary" onClick={(event) => handleLogin(event, props.userCredentials)}>Login</button>
        </form>
        <div className="text-center">
          <p>Not registered? <Link to='/registration'>click here</Link> to register</p>
        </div>
      </div>
    </div>
  );
}