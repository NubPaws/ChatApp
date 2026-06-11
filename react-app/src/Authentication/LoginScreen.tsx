import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Input } from "./Input.js";
import { loginUser } from "./Login.js";
import { validatePassword, validateUsername } from "./Validation.js";
import { Modal } from "../UIElements/Modal.js";
import { Button } from "../UIElements/Button.js";
import type { UserCredentials } from "../types.js";

import "./Authentication.css";

interface LoginScreenProps {
	userCredentials: UserCredentials | null;
	setUserCredentials: Dispatch<SetStateAction<UserCredentials | null>>;
}

export function LoginScreen({ userCredentials, setUserCredentials }: LoginScreenProps) {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [usernameError, setUsernameError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [showConnectionErrorMessage, setShowConnectionErrorMessage] = useState(false);

	// Redirect to the chat once we have credentials.
	useEffect(() => {
		if (userCredentials !== null) {
			navigate("/chat");
		}
	}, [userCredentials, navigate]);

	function handleSubmit(event: FormEvent) {
		event.preventDefault();
		const uErr = validateUsername(username);
		const pErr = validatePassword(password);
		setUsernameError(uErr ?? "");
		setPasswordError(pErr ?? "");
		if (uErr || pErr) {
			return;
		}
		loginUser(username, password, setShowErrorMessage, setShowConnectionErrorMessage, setUserCredentials);
	}

	return (
		<div className="fieldsContainer">
			<form id="loginForm" onSubmit={handleSubmit}>
				<Input
					id="username"
					className="field"
					type="text"
					name="username"
					placeholder="Username"
					value={username}
					error={usernameError}
					onChange={(e) => setUsername(e.target.value)}
				>
					Username
				</Input>
				<Input
					id="password"
					className="field"
					type="password"
					name="password"
					placeholder="Password"
					value={password}
					error={passwordError}
					onChange={(e) => setPassword(e.target.value)}
				>
					Password
				</Input>
				<Button className="fieldLabel" bgColor="#007bff" textColor="white" borderWidth="1px">
					Login
				</Button>
			</form>
			<div className="bottomText">
				<p>
					Not registered? <Link to="/registration">click here</Link> to register
				</p>
			</div>
			<Modal title="Login Failed" show={showErrorMessage} onClose={() => setShowErrorMessage(false)}>
				<h5>Incorrect username/password</h5>
			</Modal>
			<Modal
				title="Failed to connect to server"
				show={showConnectionErrorMessage}
				onClose={() => setShowConnectionErrorMessage(false)}
			>
				<h5>Unfortunately, we failed to reach our server.</h5>
			</Modal>
		</div>
	);
}
