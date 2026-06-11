import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { registerUser } from "./Registration.js";
import {
	validateConfirmPassword,
	validateDisplayName,
	validatePassword,
	validateUsername,
} from "./Validation.js";
import { Input } from "./Input.js";
import { Modal } from "../UIElements/Modal.js";
import { Button } from "../UIElements/Button.js";

import "./Authentication.css";

interface FieldErrors {
	username?: string;
	password?: string;
	confirmPassword?: string;
	displayName?: string;
}

export function RegistrationScreen() {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [profilePicture, setProfilePicture] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState("");
	const [errors, setErrors] = useState<FieldErrors>({});
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [showConnectionErrorMessage, setShowConnectionErrorMessage] = useState(false);

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0] ?? null;
		setProfilePicture(file);
		setPreviewUrl(file ? URL.createObjectURL(file) : "");
	}

	function handleSubmit(event: FormEvent) {
		event.preventDefault();
		const nextErrors: FieldErrors = {
			username: validateUsername(username) ?? "",
			password: validatePassword(password) ?? "",
			confirmPassword: validateConfirmPassword(confirmPassword, password) ?? "",
			displayName: validateDisplayName(displayName) ?? "",
		};
		setErrors(nextErrors);
		if (nextErrors.username || nextErrors.password || nextErrors.confirmPassword || nextErrors.displayName) {
			return;
		}
		registerUser(
			username,
			password,
			displayName,
			profilePicture,
			setShowSuccessMessage,
			setShowErrorMessage,
			setShowConnectionErrorMessage,
		);
	}

	return (
		<div className="fieldsContainer">
			<form id="registrationForm" onSubmit={handleSubmit}>
				<Input
					id="username"
					className="field"
					type="text"
					name="username"
					placeholder="Username"
					value={username}
					error={errors.username}
					onChange={(e) => setUsername(e.target.value)}
				>
					Username
					<br />
					<span className="note">At least 4 characters long</span>
				</Input>
				<Input
					id="password"
					className="field"
					type="password"
					name="password"
					placeholder="Password"
					value={password}
					error={errors.password}
					onChange={(e) => setPassword(e.target.value)}
				>
					Password
					<br />
					<span className="note">At least 8 characters long</span>
				</Input>
				<Input
					id="confirmPassword"
					className="field"
					type="password"
					name="confirmPassword"
					placeholder="Password"
					value={confirmPassword}
					error={errors.confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				>
					Please validate your password
				</Input>
				<Input
					id="displayName"
					className="field"
					type="text"
					name="displayName"
					placeholder="Display Name"
					value={displayName}
					error={errors.displayName}
					onChange={(e) => setDisplayName(e.target.value)}
				>
					Display Name
				</Input>
				<Input id="profilePicture" type="file" name="profilePicture" onChange={handleFileChange}>
					Profile Picture
				</Input>
				{previewUrl ? (
					<img id="preview" src={previewUrl} alt="Preview" style={{ height: 150, width: 150 }} />
				) : null}
				<br />
				<Button className="fieldLabel" bgColor="#007bff" textColor="white" borderWidth="1px">
					Register
				</Button>
			</form>
			<div className="bottomText">
				<p>
					Already registered? <Link to="/login">click here</Link> to login
				</p>
			</div>
			<Modal
				title="Registered successfully"
				show={showSuccessMessage}
				onClose={() => {
					setShowSuccessMessage(false);
					navigate("/login");
				}}
			>
				<h5>You have successfully completed the registration</h5>
			</Modal>
			<Modal title="Registration Failed" show={showErrorMessage} onClose={() => setShowErrorMessage(false)}>
				<h5>Error while registering</h5>
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
