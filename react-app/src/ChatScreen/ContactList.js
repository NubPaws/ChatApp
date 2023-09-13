import { UserProfile } from "./UserProfile.js";
import { Contact } from "./Contact.js";
import { useContext, useEffect, useState } from "react";

import "./Contact.css";
import { WebSocketContext } from "../Context/WebSocketContext.js";
import { compareDates, createDateString } from "../Utilities/DatesHandler.js";

export function ContactList(props) {
	const [chats, setChats] = useState([]);
	const [unreadChats, setUnreadChats] = useState([]);
	const [contactToAdd, setContactToAdd] = useState("");
	const [selected, setSelected] = useState(undefined);
	const { setActiveChat } = props;
	
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
				
				const contacts = generateContacts(
					json, [selected, setSelected], setActiveChat, [unreadChats, setUnreadChats]
				);
				
				setChats(contacts);
			}
		}
		fetchChats();
	}, [contactToAdd, props.token, selected, setSelected, setActiveChat, unreadChats, setUnreadChats]);

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
	
	useEffect(() => {
		if (!webSocket.value) {
			return;
		}
		const { sender, timestamp } = webSocket.value;
		
		// Update the timestamp.
		const contacts = [...chats];
		const index = contacts.findIndex(obj => obj.username === sender);
		contacts[index].time = timestamp;
		setChats(contacts);
		
		// Update the unread chats set.
		if (sender !== selected && !unreadChats.includes(sender)) {
			setUnreadChats([...unreadChats, sender]);
		}
	}, [webSocket.value, chats, selected, unreadChats, setUnreadChats]);
	
	return (
		<div id="contactList">
			<UserProfile
				displayName={props.displayName}
				image={props.image}
				setContactToAdd={setContactToAdd}
				token={props.token} />
			<div id="listOfContacts">
				{chats.map(contact => <Contact
					username={contact.username}
					displayName={contact.displayName + (unreadChats.includes(contact.username) ? " 🟢" : "")}
					image={contact.image}
					lastMessage={createDateString(contact.time)}
					key={contact.key}
					onClick={contact.onClick}
					className={contact.className}
				/>)}
			</div>
		</div>
	);
}

function generateContacts(chatsJson, selectedHook, setActiveChat, unreadChatsHook) {
	const contactsList = [];
	
	for (const index in chatsJson) {
		const chat = chatsJson[index];
		const time = (chat.lastMessage != null) ? chat.lastMessage.created : "";
		contactsList.push(
			createContact(chat.user, time, chat.id, selectedHook, setActiveChat, unreadChatsHook)
		);
	}
	
	contactsList.sort((a, b) => compareDates(a.time, b.time));
	
	return contactsList;
}

function createContact(user, time, chatId, selectedHook, setActiveChat, unreadChatsHook) {
	const { username, displayName, profilePic } = user;
	const [ selected, setSelected ] = selectedHook;
	const [ unreadChats, setUnreadChats ] = unreadChatsHook;
	return {
		username: username,
		displayName: displayName,
		image: profilePic,
		time: time,
		key: username,
		onClick: () => {
			setSelected(username);
			setActiveChat({
				"username": username,
				"displayName": displayName,
				"profilePic": profilePic,
				"chatId": chatId
			});
			if (unreadChats.includes(username)) {
				const unread = [...unreadChats];
				const index = unread.indexOf(username);
				unread.splice(index, 1);
				setUnreadChats(unread);
			}
		},
		className: selected === username ? "selectedCard" : "",
	};
}
