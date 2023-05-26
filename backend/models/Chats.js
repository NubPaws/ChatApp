import { getChatsByUsername } from "./DatabaseConnector.js";

function getOtherUserInChat(chat, username) {
	if (chat.users === null)
		return null;
	if (chat.users.length < 2)
		return null;
	if (chat.users[0].username === username)
		return chat.users[1];
	return chat.users[0];
}

function getMessagesInChat(chat) {
	const chatMessages = chat.messsages;
	if (chatMessages === null) {
		return null;
	}
	const messages = [];
	
	for (let i = 0; i < chatMessages.length; i++) {
		const msg = chatMessages[i];
		messages.push({
			id: msg.id,
			created: msg.created,
			sender: msg.sender,
			content: msg.content,
		});
	}
	
	messages.sort((a, b) => {
		if (a.created < b.created) {
			return -1;
		}
		if (a.created > b.created) {
			return 1;
		}
		return 0;
	});
	
	return messages;
}

export async function getChats(username) {
	const data = await getChatsByUsername(username);
	
	const chats = [];
	
	for (let i = 0; i < data.length; i++) {
		const entry = data[i];
		const user = getOtherUserInChat(entry, username);
		const messages = getMessagesInChat(entry);
		const lastMessage = messages === null ? null : messages[messages.length - 1];
		chats.push({
			id: entry.id,
			user: {
				username: user.username,
				displayName: user.displayname,
				profilePic: user.profilePic,
			},
			lastMessage: lastMessage,
		});
	}
	
	return chats;
}
