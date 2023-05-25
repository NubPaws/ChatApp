import { Button } from "../UIElements/Button.js";
import { ContactList } from "./ContactList.js";
import { ChatWindow } from "./ChatWindow.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatScreen.css";

export function ChatScreen(props) {
	const navigate = useNavigate();

	if (!props.token) {
		navigate("/login");
	}

	const database = props.databaseHook[0];
	const img = database.hasOwnProperty(props.username) ? database[props.username].image : "";
	
	const [activeChat, setActiveChat] = useState(undefined);
	
	
	function logout(setToken) {
		setToken("");
		navigate("/login");
	}
	useEffect(() => {
		if (!props.token) {
			navigate("/login");
		}		
	});

	return (
		<div id="screen">
		<div id="topBar">
			<Button className="logoutBtn" text="Logout" bgColor="red" textColor="white" onClick={() => logout(props.setToken)} />
		</div>
		<div id="wrapper">
			<div id="sidePanel">
			<ContactList username={props.username} image={img} databaseHook={props.databaseHook}
				setActiveChat={setActiveChat} />
			</div>
			<div id="chatWindow">
			<ChatWindow username={props.username} activeChat={activeChat} databaseHook={props.databaseHook} />
			</div>
		</div>
		</div>
	);
}
