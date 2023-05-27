import { UserProfile } from "./UserProfile";
import { Contact } from "./Contact";
import { useEffect, useState } from "react";

import "./Contact.css";

export function ContactList(props) {
	const [chats, setChats] = useState({});
	// eslint-disable-next-line
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
			}
			)
			const json = await res.json();
			setChats(json);
		}
		fetchChats();
	})

	if (Object.keys(chats).length === 0) {
		return <div></div>;
	}

	// Generate the contact list.
	// const [database, setDatabase] = props.databaseHook;

	// function addToContactList(name) {
	// 	if (!database.hasOwnProperty(name))
	// 		return;

	// 	if (database[name].messages.hasOwnProperty(props.username))
	// 		return;

	// 	const db = database;
	// 	// Add the user to the contact's chat.
	// 	db[name].messages[props.username] = [];
	// 	// Add the contact to the user's chat.
	// 	db[props.username].messages[name] = [];

	// 	setDatabase(db);
	// }

	function createContact(username, image, time, i) {
		let dateStr;
		if (time !== "") {
			const date = new Date(time);
			const hm = `${date.getHours()}:${date.getMinutes()}`;
			const day = date.getDate().toString().padStart(2, '0');
			const month = (date.getMonth() + 1).toString().padStart(2, '0'); // The  count starts at zero
			const year = date.getFullYear();
			dateStr = `${hm} ${day}/${month}/${year}`;
		} else {
			dateStr = "";
		}

		return <Contact
			username={username}
			image={image}
			lastMessage={dateStr}
			key={i.toString()}
			onClick={() => {
				setSelected(i);
				props.setActiveChat(username);
			}}
			className={selected === i ? "selectedCard" : ""} />
	}

	function generateContacts(props) {
		const contactsList = [];
		let i = 0;

		for (const chat of chats) {
			const contact = createContact(
				chat.user.username, chat.user.profilePic,
				chat.lastMessage.created, i
			);
			contactsList.push(contact);
			i++;
		}
		return contactsList;
	}

	return (
		<div id="contactList">
			<UserProfile
				username={props.displayName}
				image={props.image}
				// addToContactList={addToContactList}
				setContactToAdd={setContactToAdd} />
			<div id="listOfContacts">
				{generateContacts()}
			</div>
		</div>
	);
}
