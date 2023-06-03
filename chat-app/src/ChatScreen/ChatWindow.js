import { useState, useEffect, useContext } from "react";

import "./ChatWindow.css";
import { ChatTextField } from "./ChatTextField.js";
import { SpeechBubble } from "./SpeechBubble.js";
import { WebSocketContext } from "../Context/WebSocketContext.js";

export function ChatWindow(props) {
	const [inputText, setInputText] = useState("");
	const [sendClicked, setSendClicked] = useState(false);
	const [messages, setMessages] = useState([]);
	
	const webSocket = useContext(WebSocketContext);
	
	const {activeChat, token} = props;
	
	useEffect(() => {
		generateMessages(activeChat, setMessages, token);
	}, [activeChat, token]);
	
	// Effect to update the messages in a given chat.
	useEffect(() => {
		const text = inputText;
		const url = "http://localhost:5000/api/Chats/" + activeChat["chatId"] + "/Messages/";
		const request = {
			'method': 'POST',
			'headers': {
				'Content-Type': 'application/json',
				'Authorization': token
			},
			'body': JSON.stringify({"msg": text})
		};
		
		fetch(url, request)
			.then((response) => {
				if (response.ok)
					return response.json();
				throw new Error("Something when wrong.");
			})
			.then((response) => {
				const {sender, content, created} = response;
				webSocket.send({
					sender: sender.username,
					receiver: activeChat.username,
					content: content,
					timestamp: created,
				});
				sendMessage(content, created, messages, setMessages);
			})
			.catch((error) => {})
			.finally(() => {
				setSendClicked(false);
				// generateMessages(activeChat, setMessages, token);
				setInputText("");
			});
	}, [messages, sendClicked, activeChat, inputText, token, webSocket]);
	
	useEffect(() => {
		if (!webSocket.value || webSocket.value.sender !== activeChat.username)
			return;
		const { content, timestamp } = webSocket.value;
		webSocket.clearValue()
		receiveMessage(content, timestamp, messages, setMessages);
	}, [webSocket, webSocket.value, messages, activeChat]);
	
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
		<div id="chatArea">{messages}</div>
		<ChatTextField
			setInputText={setInputText}
			onSend={() => setSendClicked(true)}
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
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		messageComps.push(
			<SpeechBubble
				direction={messages[i].direction}
				timestamp={`${hours}:${minutes}`}
				key={i.toString()}>
					{messages[i].message}
			</SpeechBubble>
		);
	}
	
	setMessages(messageComps);
}

function sendMessage(content, timestamp, messages, setMessages) {
	const date = new Date(timestamp);
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	setMessages([...messages,
		<SpeechBubble
			direction="right"
			timestamp={`${hours}:${minutes}`}
			key={(messages.length - 1).toString()}>
				{content}
		</SpeechBubble>
	]);
}

function receiveMessage(content, timestamp, messages, setMessages) {
	const date = new Date(timestamp);
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	setMessages([...messages,
		<SpeechBubble
			direction="left"
			timestamp={`${hours}:${minutes}`}
			key={(messages.length - 1).toString()}>
				{content}
		</SpeechBubble>
	]);
}
