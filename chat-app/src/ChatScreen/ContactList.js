import { UserProfile } from "./UserProfile.js";
import { Contact } from "./Contact.js";
import { useContext, useEffect, useState } from "react";

import "./Contact.css";
import { WebSocketContext } from "../Context/WebSocketContext.js";

export function ContactList(props) {
	const [chats, setChats] = useState({});
	const [contactToAdd, setContactToAdd] = useState("");
	const [selected, setSelected] = useState(undefined);
	
	const webSocket = useContext(WebSocketContext);
	
	useEffect(() => {
		async function fetchChats() {
			const url = "http://localhost:5000/api/Chats"
			let res = null;
			try {
				res = await fetch(url, {
					'method': 'GET',
					'headers': {
						'Content-Type': 'application/json',
						'Authorization': props.token
					}
				});
			} catch (error) {}

			if (res !== null) {
				const json = await res.json();
				setChats(json);
			}
		}
		fetchChats();
	}, [contactToAdd, props.token, webSocket.lastSent]);

	useEffect(() => {
		async function addChat(username) {
			try {
				const url = "http://localhost:5000/api/Chats"
				await fetch(url, {
					'method': 'POST',
					'headers': {
						'Content-Type': 'application/json',
						'Authorization': props.token
					},
					'body': JSON.stringify({ username })
				});
			} catch (error) {}
		}
		if (contactToAdd !== "") {
			addChat(contactToAdd);
		}
		setContactToAdd("");
	}, [contactToAdd, props.token]);
	
	function createContact(username, displayName, image, time, i, chatId) {
		let dateStr;
		if (time !== "") {
			const padder = (n) => n.toString().padStart(2, '0');
			const date = new Date(time);
			const hm = `${padder(date.getHours())}:${padder(date.getMinutes())}`;
			const day = padder(date.getDate());
			// The count starts at zero
			const month = padder(date.getMonth() + 1);
			const year = date.getFullYear();
			dateStr = `${hm} ${day}/${month}/${year}`;
		} else {
			dateStr = "";
		}

		return <Contact
			username={username}
			displayName={displayName}
			image={image}
			lastMessage={dateStr}
			key={i.toString()}
			onClick={() => {
				setSelected(i);
				props.setActiveChat({
					"username": username,
					"displayName": displayName,
					"profilePic": image,
					"chatId": chatId
				});
			}}
			className={selected === i ? "selectedCard" : ""} />
	}

	function generateContacts(props) {
		const contactsList = [];

		for (const index in chats) {
			let chat = chats[index];
			let time;
			if (chat.lastMessage !== undefined && chat.lastMessage !== null) {
				time = chat.lastMessage.created;
			} else {
				time = "";
			}
			const contact = createContact(
				chat.user.username, chat.user.displayName, chat.user.profilePic,
				time, Math.floor(Math.random() * 500), chat.id
			);
			contactsList.push(contact);
		}
		return contactsList;
	}

	return (
		<div id="contactList">
			<UserProfile
				displayName={props.displayName}
				image={props.image}
				setContactToAdd={setContactToAdd}
				token={props.token} />
			<div id="listOfContacts">
				{generateContacts()}
			</div>
		</div>
	);
}
