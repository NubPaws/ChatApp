import { IconButton } from "../UIElements/Button";
import "./ContactList.css";

import personAdd from "../imgs/personAdd.svg";

export function ContactList(props) {
	// Generate the contact list.
	function generateContacts() {
		const contacts = [];
		for (let i = 0; i < props.contacts.length; i++) {
			contacts.push(
				<Contact
					username={props.contacts[i].username}
					image={props.contacts[i].image}
					lastMessage={props.contacts[i].lastMessage} />
			);
		}
		return contacts;
	}
	
	return (
		<div id="contactList">
			<UserProfile username={props.username} image={props.image} />
			<div id="listOfContacts">
				{generateContacts()}
			</div>
		</div>
	);
}

function UserProfile(props) {
	return (
		<div id="userProfile">
			<img className="profileImg" alt="Profile" src={props.image} />
			<h5 className="username">{props.username}</h5>
			<IconButton
				image={personAdd}
				alt="Add Person" />
		</div>
	);
}

function Contact(props) {
	/* username, image, lastMessage */
	return (
		<div className="contactCard">
			<img className="profileImg" alt="Profile" src={props.image} />
			<h5 className="username">{props.username}</h5>
			<span className="lastMessage">{props.lastMessage}</span>
		</div>
	);
}
