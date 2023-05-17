import { UserProfile } from "./UserProfile";
import { Contact } from  "./Contact";
import { useState } from "react";

import "./Contact.css";

export function ContactList(props) {
	// Generate the contact list.
	const [database, setDatabase] = props.databaseHook;
	// eslint-disable-next-line
	const [contactToAdd, setContactToAdd] = useState("");
	const [selected, setSelected] = useState(undefined);
	
	function addToContactList(name) {
		if (!database.hasOwnProperty(name))
			return;
		
		if (database[name].messages.hasOwnProperty(props.username))
			return;
		
		const db = database;
		// Add the user to the contact's chat.
		db[name].messages[props.username] = [];
		// Add the contact to the user's chat.
		db[props.username].messages[name] = [];
		
		setDatabase(db);
	}
	
	function createContact(username, image, time, i) {
		let dateStr;
		if (time !== "") {
			const date = new Date(time);
			const hm = `${date.getHours()}:${date.getMinutes()}`;
			const day = date.getDay().toString().padStart(2, '0');
			const month = date.getMonth().toString().padStart(2, '0');
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
	
	function generateContacts() {
		const username = props.username;
		
		const contactsList = [];
		
		if (!database.hasOwnProperty(username))
			return <div></div>;
		
		let i = 0;
		const messages = database[username].messages;
		for (const key in messages) {
			if (!database.hasOwnProperty(key))
				continue;
			
			let time;
			if (messages[key].length !== 0)
				time = messages[key][messages[key].length - 1].time;
			else time = "";
			const contact = createContact(
				key, database[key].image,
				time, i
			);
			
			contactsList.push(contact);
			
			i++;
		}
		return contactsList;
	}
	
	return (
		<div id="contactList">
			<UserProfile
				username={props.username}
				image={props.image}
				addToContactList={addToContactList}
				setContactToAdd={setContactToAdd} />
			<div id="listOfContacts">
				{generateContacts()}
			</div>
		</div>
	);
}
