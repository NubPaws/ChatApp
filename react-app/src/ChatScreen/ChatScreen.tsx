import { Button } from "../UIElements/Button.js";
import { ContactList } from "./ContactList.js";
import { ChatWindow } from "./ChatWindow.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WebSocketProvider } from "../Context/WebSocketContext.js";
import type { Dispatch, SetStateAction } from "react";
import type { ActiveChat, UserCredentials } from "../types.js";

import "./ChatScreen.css";

interface ChatScreenProps {
	userCredentials: UserCredentials | null;
	setUserCredentials: Dispatch<SetStateAction<UserCredentials | null>>;
}

export function ChatScreen({ userCredentials, setUserCredentials }: ChatScreenProps) {
	const navigate = useNavigate();
	const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);

	// Redirect to login when there are no credentials (instead of navigating
	// during render, which React forbids).
	useEffect(() => {
		if (userCredentials === null) {
			navigate("/login");
		}
	}, [userCredentials, navigate]);

	if (userCredentials === null) {
		return null;
	}

	function logout() {
		setUserCredentials(null);
		navigate("/login");
	}

	return (
		<div id="screen">
			<div id="topBar">
				<Button className="logoutBtn" bgColor="red" textColor="white" onClick={logout}>
					Logout
				</Button>
			</div>
			<div id="wrapper">
				<WebSocketProvider username={userCredentials.username}>
					<div id="sidePanel">
						<ContactList
							username={userCredentials.username}
							token={userCredentials.token}
							image={userCredentials.profilePic}
							setActiveChat={setActiveChat}
							displayName={userCredentials.displayName}
						/>
					</div>
					<div id="chatWindow">
						<ChatWindow
							username={userCredentials.username}
							activeChat={activeChat}
							token={userCredentials.token}
						/>
					</div>
				</WebSocketProvider>
			</div>
		</div>
	);
}
