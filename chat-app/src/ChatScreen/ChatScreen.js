import { Button } from "../UIElements/Button.js";
import { ContactList } from "./ContactList.js";
import { ChatWindow } from "./ChatWindow.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatScreen.css";

export function ChatScreen(props) {
	const navigate = useNavigate();
	useEffect(() => {
		if (Object.keys(props.userCredentials).length === 0) {
			navigate("/login");
		}
	});
	
	const img = props.userCredentials["profilePic"];

	const [activeChat, setActiveChat] = useState({});

	function logout(setUserCredentials) {
		setUserCredentials({});
		navigate("/login");
	}
	
	return (
		<div id="screen">
			<div id="topBar">
				<Button
					className="logoutBtn"
					text="Logout"
					bgColor="red"
					textColor="white"
					onClick={() => logout(props.setUserCredentials)} />
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
