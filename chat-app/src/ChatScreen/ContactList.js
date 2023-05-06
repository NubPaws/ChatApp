import { IconButton } from "../UIElements/Button";
import "./ContactList.css";

import personAdd from "../imgs/personAdd.svg";
import raccoonImage from "../imgs/raccoon.png";
import { useState } from "react";

export function ContactList(props) {
	// Generate the contact list.
	const contacts = props.contactsHook[0];
	
	const [selected, setSelected] = useState(undefined);
	
	function generateContacts() {
		const contactsList = [];
		for (let i = 0; i < contacts.length; i++) {
			contactsList.push(
				<Contact
					username={contacts[i].username}
					image={contacts[i].image}
					lastMessage={contacts[i].lastMessage}
					key={i.toString()}
					onClick={() => {
						setSelected(i);
					}}
					className={selected === i ? "selectedCard" : ""} />
			);
		}
		return contactsList;
	}
	
	return (
		<div id="contactList">
			<UserProfile username={props.username} image={props.image} contactsHook={props.contactsHook} />
			<div id="listOfContacts">
				{generateContacts()}
			</div>
		</div>
	);
}

function UserProfile(props) {
	const [contacts, setContacts] = props.contactsHook;
	
	return (
		<div id="userProfile">
			<img className="profileImg" alt="Profile" src={props.image} />
			<h5 className="username">{props.username}</h5>
			<IconButton
				image={personAdd}
				alt="Add Person"
				onClick={() => {
					setContacts([...contacts, {
						username: "Mr. Raccoon",
						image: raccoonImage,
						lastMessage: "14:20 20/12/2023",
					}]);
				}} />
		</div>
	);
}

function Contact(props) {
	return (
		<div className={`contactCard ${props.className}`}
			onClick={props.onClick}
		>
			<img className="profileImg" alt="Profile" src={props.image} />
			<h5 className="username">{props.username}</h5>
			<span className="lastMessage">{props.lastMessage}</span>
		</div>
	);
}
