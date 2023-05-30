import { Button } from "../UIElements/Button.js";
import { useState } from "react";
import { useEffect } from "react";

import "./ChatWindow.css";

export function ChatWindow(props) {
	const [inputText, setInputText] = useState("");
	const [sendClicked, setSendClicked] = useState(false);
	const [messages, setMessages] = useState(<div id="chatArea"></div>);
	
	const activeChat = props.activeChat;
	
	useEffect(() => {
		async function sendMessage(message) {
			const url = "http://localhost:5000/api/Chats/" + activeChat["chatId"]+ "/Messages/"
			await fetch(url, {
				'method': 'POST',
				'headers': {
					'Content-Type': 'application/json',
					'Authorization': props.token
				},
				'body': JSON.stringify({"msg": message})
			});
		}
		const text = inputText.trim();
		if (text !== "" && sendClicked === true) {
			sendMessage(text);
			setInputText("")
		}
		setSendClicked(false);
		generateMessages(activeChat, setMessages, props.token);
	}, [sendClicked, setSendClicked, activeChat, inputText, props.token, setInputText]);
	
	if (Object.keys(activeChat).length === 0) {
		return <div id="emptyChatBox"></div>;
	}
	
	const chatImg = activeChat.profilePic;
	return (
	<div id="chatBox">
		<div id="title">
			<img id="profileImg" src={chatImg} alt="Raccoon" />
			<div id="userInfo">
				<span id="name">{activeChat["username"]}</span>
				<span id="status">Online</span>
			</div>
		</div>
		{messages}
		<div id="chatField">
			<input id="chatFieldText" type="text" placeholder="Write your message here..."
				value={inputText}
				onChange={(e) => { setInputText(e.target.value); }}
				onKeyDown={(e) => { if (e.key === "Enter") setSendClicked(true) }} />
			<Button text="Send" borderWidth="1px" borderRadius="0" onClick={(e) => {setSendClicked(true)}} />
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

async function generateMessages(activeChat, setMessages, token) {
	if (Object.keys(activeChat).length === 0) {
		setMessages(<div id="chatArea"></div>);
		return;
	}
	
	const url = "http://localhost:5000/api/Chats/" + activeChat.chatId + "/Messages/";
	const res = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Content-Type': 'application/json',
			'Authorization': token
		},
	});
	const messagesJson = await res.json();
	
	// Convert the JSON into a message array.
	const messages = messagesJson.map(msg => {
		return {
			message: msg.content,
			timestamp: msg.created,
			direction: (msg.sender.username === activeChat.username) ? "left" : "right",
		};
	});
	
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
	
	setMessages(<div id="chatArea">{messageComps}</div>);
	const chatArea = document.getElementById("chatArea");
	chatArea.scrollTo(0, chatArea.scrollHeight);
}
