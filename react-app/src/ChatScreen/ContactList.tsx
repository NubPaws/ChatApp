import { UserProfile } from "./UserProfile.js";
import { Contact } from "./Contact.js";
import { useContext, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import "./Contact.css";
import { WebSocketContext } from "../Context/WebSocketContext.js";
import { compareDates, createDateString } from "../Utilities/DatesHandler.js";
import { chatsUrl } from "../config/api.js";
import type { ActiveChat } from "../types.js";
import type { ChatSummary, UserPublic } from "@chatapp/shared";

interface ContactData {
	username: string;
	displayName: string;
	image: string;
	time: string;
	key: string;
	onClick: () => void;
	className: string;
}

type SelectedHook = [string | undefined, Dispatch<SetStateAction<string | undefined>>];
type UnreadChatsHook = [string[], Dispatch<SetStateAction<string[]>>];

interface ContactListProps {
	username: string;
	token: string;
	image?: string;
	displayName: string;
	setActiveChat: Dispatch<SetStateAction<ActiveChat | null>>;
}

export function ContactList({ token, image, displayName, setActiveChat }: ContactListProps) {
	const [chats, setChats] = useState<ContactData[]>([]);
	const [unreadChats, setUnreadChats] = useState<string[]>([]);
	const [contactToAdd, setContactToAdd] = useState("");
	const [selected, setSelected] = useState<string | undefined>(undefined);

	const webSocket = useContext(WebSocketContext);

	useEffect(() => {
		async function fetchChats() {
			let res: Response;
			try {
				res = await fetch(chatsUrl(), {
					method: "GET",
					headers: { "Content-Type": "application/json", Authorization: token },
				});
			} catch {
				return;
			}
			const json = (await res.json()) as ChatSummary[];
			setChats(generateContacts(json, [selected, setSelected], setActiveChat, [unreadChats, setUnreadChats]));
		}
		fetchChats();
	}, [contactToAdd, token, selected, setActiveChat, unreadChats]);

	useEffect(() => {
		async function addChat(username: string) {
			try {
				await fetch(chatsUrl(), {
					method: "POST",
					headers: { "Content-Type": "application/json", Authorization: token },
					body: JSON.stringify({ username }),
				});
			} catch {
				/* ignore network errors */
			}
		}
		if (contactToAdd !== "") {
			addChat(contactToAdd);
		}
		setContactToAdd("");
	}, [contactToAdd, token]);

	useEffect(() => {
		if (!webSocket.value) {
			return;
		}
		const { sender, timestamp } = webSocket.value;

		// Update the timestamp of the chat the message came from.
		const index = chats.findIndex((contact) => contact.username === sender);
		if (index !== -1) {
			const contacts = [...chats];
			contacts[index] = { ...contacts[index], time: timestamp };
			setChats(contacts);
		}

		// Mark the chat as unread if it is not the selected one.
		if (sender !== selected && !unreadChats.includes(sender)) {
			setUnreadChats([...unreadChats, sender]);
		}
	}, [webSocket.value, chats, selected, unreadChats]);

	return (
		<div id="contactList">
			<UserProfile
				displayName={displayName}
				image={image}
				setContactToAdd={setContactToAdd}
				token={token}
			/>
			<div id="listOfContacts">
				{chats.map((contact) => (
					<Contact
						displayName={contact.displayName + (unreadChats.includes(contact.username) ? " 🟢" : "")}
						image={contact.image}
						lastMessage={createDateString(contact.time)}
						key={contact.key}
						onClick={contact.onClick}
						className={contact.className}
					/>
				))}
			</div>
		</div>
	);
}

function generateContacts(
	chatsJson: ChatSummary[],
	selectedHook: SelectedHook,
	setActiveChat: Dispatch<SetStateAction<ActiveChat | null>>,
	unreadChatsHook: UnreadChatsHook,
): ContactData[] {
	const contactsList = chatsJson.map((chat) => {
		const time = chat.lastMessage != null ? chat.lastMessage.created : "";
		return createContact(chat.user, time, chat.id, selectedHook, setActiveChat, unreadChatsHook);
	});

	contactsList.sort((a, b) => compareDates(a.time, b.time));
	return contactsList;
}

function createContact(
	user: UserPublic,
	time: string,
	chatId: number,
	selectedHook: SelectedHook,
	setActiveChat: Dispatch<SetStateAction<ActiveChat | null>>,
	unreadChatsHook: UnreadChatsHook,
): ContactData {
	const { username, displayName, profilePic } = user;
	const [selected, setSelected] = selectedHook;
	const [unreadChats, setUnreadChats] = unreadChatsHook;

	return {
		username,
		displayName,
		image: profilePic,
		time,
		key: username,
		onClick: () => {
			setSelected(username);
			setActiveChat({ username, displayName, profilePic, chatId });
			if (unreadChats.includes(username)) {
				const unread = [...unreadChats];
				unread.splice(unread.indexOf(username), 1);
				setUnreadChats(unread);
			}
		},
		className: selected === username ? "selectedCard" : "",
	};
}
