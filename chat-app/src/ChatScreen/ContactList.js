import { UserProfile } from "./UserProfile.js";
import { Contact } from "./Contact.js";
import { useContext, useEffect, useState } from "react";

import "./Contact.css";

export function ContactList(props) {
	const [chats, setChats] = useState({});
	const [contactToAdd, setContactToAdd] = useState("");
	const [selected, setSelected] = useState(undefined);
	useEffect(() => {
		async function fetchChats() {
			const url = "http://localhost:5000/api/Chats"
			const res = await fetch(url, {
				'method': 'GET',
				'headers': {
					'Content-Type': 'application/json',
					'Authorization': props.token
				}
			});
			const json = await res.json();
			setChats(json);
		}
		fetchChats();
	}, [contactToAdd, props.token]);

	useEffect(() => {
		async function addChat(username) {
			const url = "http://localhost:5000/api/Chats"
			await fetch(url, {
				'method': 'POST',
				'headers': {
					'Content-Type': 'application/json',
					'Authorization': props.token
				},
				'body': JSON.stringify({ username })
			});
		}
		if (contactToAdd !== "") {
			addChat(contactToAdd);
		}
	}, [contactToAdd, props.token]);
	
	function createContact(username, displayName, image, time, i, chatId) {
		let dateStr;
		if (time !== "") {
			const date = new Date(time);
			const hm = `${date.getHours()}:${date.getMinutes()}`;
			const day = date.getDate().toString().padStart(2, '0');
			// The count starts at zero
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
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
		let i = 0;

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
				time, i, chat.id
			);
			contactsList.push(contact);
			i++;
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
