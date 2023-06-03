import { Button } from "../UIElements/Button.js";
import { ContactList } from "./ContactList.js";
import { ChatWindow } from "./ChatWindow.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatScreen.css";

export function ChatScreen(props) {
	const navigate = useNavigate();
	const [activeChat, setActiveChat] = useState({});
	if (Object.keys(props.userCredentials).length === 0) {
		props.setUserCredentials({});
		return navigate("/login");
	}
	
	const img = props.userCredentials["profilePic"];


	function logout(setUserCredentials) {
		setUserCredentials({});
		navigate("/login");
	}
	
	return (
		<div id="screen">
			<div id="topBar">
				<Button
					className="logoutBtn"
					bgColor="red"
					textColor="white"
					onClick={() => logout(props.setUserCredentials)}>Logout</Button>
			</div>
			<div id="wrapper">
				<div id="sidePanel">
					<ContactList
						username={props.userCredentials["username"]}
						token={props.userCredentials["token"]}
						image={img}
						databaseHook={props.databaseHook}
						setActiveChat={setActiveChat}
						displayName={props.userCredentials["displayName"]}/>
				</div>
				<div id="chatWindow">
					<ChatWindow
						username={props.userCredentials["username"]}
						activeChat={activeChat}
						token={props.userCredentials["token"]} />
				</div>
			</div>
		</div>
	);
}
