import { UserProfile } from "./UserProfile";
import { Contact } from  "./Contact";
import { useState } from "react";

import "./Contact.css";

export function ContactList(props) {
	// Generate the contact list.
	const database = props.databaseHook[0];
	
	const [selected, setSelected] = useState(undefined);
	
	function createContact(username, image, time, i) {
		const date = new Date(time);
		const hm = `${date.getHours()}:${date.getMinutes()}`;
		const day = date.getDay().toString().padStart(2, '0');
		const month = date.getMonth().toString().padStart(2, '0');
		const year = date.getFullYear();
		return <Contact
			username={username}
			image={image}
			lastMessage={`${hm} ${day}/${month}/${year}`}
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
			
			const contact = createContact(
				key, database[key].image,
				messages[key][messages[key].length - 1].time, i
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
				databaseHook={props.databaseHook} />
			<div id="listOfContacts">
				{generateContacts()}
			</div>
		</div>
	);
}
