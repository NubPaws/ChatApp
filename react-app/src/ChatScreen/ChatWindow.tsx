import { useState, useEffect, useContext, useRef } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import "./ChatWindow.css";
import { ChatTextField } from "./ChatTextField.js";
import { SpeechBubble } from "./SpeechBubble.js";
import { WebSocketContext } from "../Context/WebSocketContext.js";
import { createTimeString } from "../Utilities/DatesHandler.js";
import { messagesUrl } from "../config/api.js";
import type { ActiveChat } from "../types.js";
import type { MessageWithSenderUsername } from "@chatapp/shared";

interface ChatWindowProps {
	username: string;
	activeChat: ActiveChat | null;
	token: string;
}

export function ChatWindow({ activeChat, token }: ChatWindowProps) {
	const [inputText, setInputText] = useState("");
	const [sendClicked, setSendClicked] = useState(false);
	const [messages, setMessages] = useState<ReactNode[]>([]);
	const chatAreaRef = useRef<HTMLDivElement>(null);

	const webSocket = useContext(WebSocketContext);

	// Load the messages whenever the active chat changes.
	useEffect(() => {
		generateMessages(activeChat, setMessages, token);
	}, [activeChat, token]);

	// Send a message when the send button is clicked.
	useEffect(() => {
		const setMessage = async () => {
			if (!activeChat || !activeChat.chatId || inputText === "") {
				return;
			}
			try {
				const res = await fetch(messagesUrl(activeChat.chatId), generateMessageRequest(inputText, token));
				const response = (await res.json()) as { content: string; created: string };
				appendMessage("right", response.content, response.created, messages, setMessages);
				webSocket.setLastSent(response.created);
			} catch {
				/* ignore send errors */
			}
		};
		setMessage();
		setSendClicked(false);
		setInputText("");
	}, [messages, sendClicked, activeChat, inputText, token, webSocket]);

	// Receive messages from the other user and update the chat if it is open.
	useEffect(() => {
		if (!webSocket.value) {
			return;
		}
		const { content, timestamp, sender } = webSocket.value;
		webSocket.clearValue();
		if (activeChat && sender === activeChat.username) {
			appendMessage("left", content, timestamp, messages, setMessages);
		}
		webSocket.setLastSent(timestamp);
	}, [webSocket, webSocket.value, messages, activeChat]);

	// Keep the scroll pinned to the bottom as messages arrive.
	useEffect(() => {
		const chatArea = chatAreaRef.current;
		if (chatArea) {
			chatArea.scrollTo(0, chatArea.scrollHeight);
		}
	}, [messages]);

	if (activeChat === null) {
		return <div id="emptyChatBox"></div>;
	}

	return (
		<div id="chatBox">
			<div id="title">
				<img id="profileImg" src={activeChat.profilePic} alt="Profile" />
				<div id="userInfo">
					<span id="name">{activeChat.displayName}</span>
					<span id="status">Online</span>
				</div>
			</div>
			<div id="chatArea" ref={chatAreaRef}>
				{messages}
			</div>
			<ChatTextField setInputText={setInputText} onSend={() => setSendClicked(true)} />
		</div>
	);
}

function generateMessageRequest(text: string, token: string): RequestInit {
	return {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
		body: JSON.stringify({ msg: text }),
	};
}

async function generateMessages(
	activeChat: ActiveChat | null,
	setMessages: Dispatch<SetStateAction<ReactNode[]>>,
	token: string,
): Promise<void> {
	if (activeChat === null) {
		setMessages([]);
		return;
	}

	let res: Response;
	try {
		res = await fetch(messagesUrl(activeChat.chatId), {
			method: "GET",
			headers: { "Content-Type": "application/json", Authorization: token },
		});
	} catch {
		return;
	}

	const messagesJson = (await res.json()) as MessageWithSenderUsername[];

	const parsed = messagesJson.map((msg) => ({
		message: msg.content,
		timestamp: msg.created,
		direction: msg.sender.username === activeChat.username ? ("left" as const) : ("right" as const),
	}));

	parsed.sort((a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0));

	setMessages(
		parsed.map((m, i) => (
			<SpeechBubble direction={m.direction} timestamp={createTimeString(m.timestamp)} key={i.toString()}>
				{m.message}
			</SpeechBubble>
		)),
	);
}

/** Appends a single bubble (left = received, right = sent) to the message list. */
function appendMessage(
	direction: "left" | "right",
	content: string,
	timestamp: string,
	messages: ReactNode[],
	setMessages: Dispatch<SetStateAction<ReactNode[]>>,
): void {
	const date = new Date(timestamp);
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	setMessages([
		...messages,
		<SpeechBubble direction={direction} timestamp={`${hours}:${minutes}`} key={messages.length.toString()}>
			{content}
		</SpeechBubble>,
	]);
}
