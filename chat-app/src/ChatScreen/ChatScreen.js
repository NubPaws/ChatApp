import { Button } from "../UIElements/Button.js";
import { ContactList } from "./ContactList.js";
import { ChatWindow } from "./ChatWindow.js";
import { useState } from "react";
import "./ChatScreen.css";

import catImage from "../imgs/cat.png";

export function ChatScreen(props) {
	const database = props.databaseHook[0];
	const img = database.hasOwnProperty(props.username) ? database[props.username].image : catImage;
	
	const [activeChat, setActiveChat] = useState(undefined);
	
	return (
		<div id="screen">
			<div id="topBar">
				<Button className="logoutBtn" text="Logout" bgColor="red" textColor="white" />
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
