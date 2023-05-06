import { Button } from "../UIElements/Button.js";
import { ContactList } from "./ContactList.js";
import { ChatWindow } from "./ChatWindow.js";
import "./ChatScreen.css";

export function ChatScreen(props) {
	return (
		<div id="screen">
			<div id="topBar">
				<Button className="logoutBtn" text="Logout" bgColor="red" textColor="white" />
			</div>
			<div id="wrapper">
				<div id="sidePanel">
					<ContactList username="Sir Cat" image={props.profileImage} contacts={props.contacts} />
				</div>
				<div id="chatWindow">
					<ChatWindow openChat="Mr. Raccoon" />
				</div>
			</div>
		</div>
	);
}
