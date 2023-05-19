import { Button } from "../UIElements/Button";
import { useState } from "react";

import raccoonImage from "../imgs/raccoon.png";
import "./ChatWindow.css";

export function ChatWindow(props) {
	const [inputText, setInputText] = useState("");
	
	const activeChat = props.activeChat;
	if (activeChat === undefined) {
		return <div id="emptyChatBox"></div>;
	}
	
	const [database, setDatabase] = props.databaseHook;
	
	function sendMessage() {
		const text = inputText.trim();
		setInputText("");
		
		// Make sure there is an actual message to send.
		if (text === "")
			return;
		
		const date = new Date();
		const db = database;
		db[props.username].messages[activeChat].push(
			{
				message: text,
				time: date,
			}
		);
		setDatabase(db);
	}
	
	return (
	<div id="chatBox">
		<div id="title">
			<img id="profileImg" src={raccoonImage} alt="Raccoon" />
			<div id="userInfo">
				<span id="name">{activeChat}</span>
				<span id="status">Online</span>
			</div>
		</div>
		{generateMessages(database, props.username, props.activeChat)}
		<div id="chatField">
			<input id="chatFieldText" type="text" placeholder="Write your message here..."
				value={inputText}
				onChange={(e) => { setInputText(e.target.value); }}
				onKeyDown={(e) => { if (e.key === "Enter") sendMessage() }} />
			<Button text="Send" borderWidth="1px" borderRadius="0" onClick={sendMessage} />
		</div>
	</div>
	);
}

function SpeechBubble(props) {
	return <div className={`speechBubble speechBubble${props.direction === "left" ? "Left" : "Right"}`}>
		{props.text}
		<span className="timestamp">{props.timestamp}</span>
	</div>
}

function generateMessages(database, username, activeChat) {
	const user = database[username];
	const chat = database[activeChat];
	
	const userMessages = user.messages[activeChat];
	const chatMessages = chat.messages[username];
	
	const messages = [];
	
	// Put all the messages from the chat user.
	for (let i = 0; i < chatMessages.length; i++) {
		messages.push({
			message: chatMessages[i].message,
			timestamp: chatMessages[i].time,
			direction: "left",
		});
	}
	
	// Put all the messages from us.
	for (let i = 0; i < userMessages.length; i++) {
		messages.push({
			message: userMessages[i].message,
			timestamp: userMessages[i].time,
			direction: "right",
		});
	}
	
	// Sort messages by the date.
	messages.sort((a, b) => a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0);
	
	// Add the elements to the array.
	const messageComps = [];
	for (let i = 0; i < messages.length; i++) {
		const date = new Date(messages[i].timestamp);
		messageComps.push(<SpeechBubble
			direction={messages[i].direction}
			text={messages[i].message}
			timestamp={`${date.getHours()}:${date.getMinutes()}`}
			key={i.toString()} />);
	}
	
	return <div id="chatArea">
		{messageComps}
	</div>;
}
