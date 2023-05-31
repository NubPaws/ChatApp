import { useState, useEffect } from "react";

import "./ChatWindow.css";
import { ChatTextField } from "./ChatTextField.js";
import { SpeechBubble } from "./SpeechBubble.js";

export function ChatWindow(props) {
	const [inputText, setInputText] = useState("");
	const [sendClicked, setSendClicked] = useState(false);
	const [messages, setMessages] = useState(<div id="chatArea"></div>);
	
	const activeChat = props.activeChat;
	
	// Effect to update the messages in a given chat.
	useEffect(() => {
		const text = inputText;
		const url = "http://localhost:5000/api/Chats/" + activeChat["chatId"] + "/Messages/";
		const request = {
			'method': 'POST',
			'headers': {
				'Content-Type': 'application/json',
				'Authorization': props.token
			},
			'body': JSON.stringify({"msg": text})
		};
		fetch(url, request)
			.catch(() => {})
			.finally(() => {
				setSendClicked(false);
				generateMessages(activeChat, setMessages, props.token);
				setInputText("");
			});
	}, [sendClicked, activeChat, inputText, props.token]);
	
	// Effect to make sure that the scroll bar sticks to the bottom.
	useEffect(() => {
		const chatArea = document.getElementById("chatArea");
		if (chatArea)
			chatArea.scrollTo(0, chatArea.scrollHeight);
	}, [messages]);
	
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
		<ChatTextField
			setInputText={setInputText}
			onSend={() => {
				setSendClicked(true);
			}}
		/>
	</div>
	);
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
		messageComps.push(
			<SpeechBubble
				direction={messages[i].direction}
				timestamp={`${date.getHours()}:${date.getMinutes()}`}
				key={i.toString()}>
					{messages[i].message}
			</SpeechBubble>
		);
	}
	
	setMessages(<div id="chatArea">{messageComps}</div>);
}
