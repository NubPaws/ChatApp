import { Chat, Message, getChatById, getChatsByUsername, getNextChatId, getNextMessageId, getUserByUsername } from "./DatabaseConnector.js";
import { getUser } from "./Users.js";

export class ChatAlreadyExistsError extends Error {}
export class UserNotPartOfChatError extends Error {}
export class InvalidChatIdError extends Error {}

function cleanUpChatObj(chatObj) {
	delete chatObj._id;
	delete chatObj.__v;
	delete chatObj.users[0]._id;
	delete chatObj.users[0].__v;
	delete chatObj.users[1]._id;
	delete chatObj.users[1].__v;
	
	return chatObj;
}

function cleanUpMessageObj(msgObj) {
	delete msgObj.sender._id;
	delete msgObj.sender.__v;
	delete msgObj._id;
	delete msgObj.__v;
	
	return msgObj;
}

/**
 * Returns an object representing the other user in the chat following
 * the user schema.
 * @param {Chat} chat The chat to get the other user from.
 * @param {string} username The username so we know who is the other person.
 * @returns The other user following the user schema.
 */
function getOtherUserInChat(chat, username) {
	if (chat.users === null)
		return null;
	if (chat.users.length < 2)
		return null;
	if (chat.users[0].username === username)
		return chat.users[1].toObject();
	return chat.users[0].toObject();
}

/**
 * Given a chat, returns all of the messages in the chat sorted by date.
 * @param {Chat} chat The chat schema to get all of the messages from.
 * @returns An array of all chats sorted by their date of creation.
 */
function getMessagesInChat(chat) {
	const chatMessages = chat.messages;
	if (chatMessages === null) {
		return null;
	}
	
	const messages = chatMessages.map(msg => msg.toObject());
	
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

/**
 * Returns all of the chats a given user has.
 * @param {string} username The username to get all of the chats of.
 * @returns A JSON representing all of the chats the user has.
 * @throws {UserNotPartOfChatError} If the user is not part of any chat.
 */
export async function getChats(username) {
	const data = await getChatsByUsername(username);
	
	if (data.length === 0) {
		throw new UserNotPartOfChatError();
	}
	
	const chat = data[0].toObject();
	
	return cleanUpChatObj(chat);
}

/**
 * Creates a chat in the database between the requestingUser and the otherUser.
 * @param {string} requestingUsername The user requesting to create the chat with the other user.
 * @param {string} otherUsername The user that we request to open a chat with.
 */
export async function createChat(requestingUsername, otherUsername) {
	const chats = await getChatsByUsername(requestingUsername);
	
	for (let i = 0; i < chats.length; i++) {
		const data = getOtherUserInChat(chats[i], requestingUsername);
		if (data.username === otherUsername) {
			throw new ChatAlreadyExistsError();
		}
	}
	
	const requesting = await getUser(requestingUsername);
	const other = await getUser(otherUsername);
	
	await Chat.create({
		id: getNextChatId(),
		users: [ requesting, other ],
		messages: null,
	});
}

/**
 * Checks if a user (given by it's username) is part of a given chat.
 * @param {string} username The username to check if it is part of the chat.
 * @param {Chat} chat The chat to check if the username is part.
 * @returns true if username is part of chat, false otherwise.
 */
function isUserPartOfChat(username, chat) {
	let partOf = false;
	const users = chat.users;
	for (let i = 0; i < users.length; i++) {
		const user = users[i];
		partOf = partOf || user.username === username;
	}
	return partOf;
}

/**
 * Returns the chat with the given ID iff the user with the username
 * is part of that chat.
 * @param {string} username The username of the user requesting the chat.
 * @param {number} id The ID of the requested chat.
 * @returns JSON object representing a chat, following the Chat schema.
 */
export async function getChat(username, id) {
	const chat = await getChatById(id);
	
	if (chat.length === 0) {
		return new InvalidChatIdError();
	}
	
	const chatObj = chat[0].toObject();
	
	if (!isUserPartOfChat(username, chatObj)) {
		throw new UserNotPartOfChatError();
	}
	
	if (chatObj.messages !== null) {
		for (let i = 0; i < chatObj.messages.length; i++) {
			chatObj.messages[i] = cleanUpMessageObj(chatObj.messages[i]);
		}
	}
	
	return cleanUpChatObj(chatObj);
}

export async function deleteChat(username, id) {
	const chats = await getChatById(id);
	
	if (chats.length === 0) {
		throw new InvalidChatIdError();
	}
	
	const chat = chats[0];
	if (!isUserPartOfChat(username, chat)) {
		throw new UserNotPartOfChatError();
	}
	
	await Chat.deleteOne({id: id});
}

/**
 * Adds a message to a chat.
 * @param {string} username The username who sends the message.
 * @param {number} chatId The ID of the chat to send the message in.
 * @param {string} messageContent The content of said message.
 * @returns The message that was created.
 */
export async function addMessageToChat(username, chatId, messageContent) {
	const chats = await getChatById(chatId);
	if (chats.length === 0) {
		throw new InvalidChatIdError();
	}
	const chat = chats[0];
	if (!isUserPartOfChat(username, chat)) {
		throw new UserNotPartOfChatError();
	}
	
	const users = await getUserByUsername(username);
	
	const message = await Message.create({
		id: getNextMessageId(),
		created: Date.now(),
		sender: users[0].toObject(),
		content: messageContent,
	});
	
	// Add the message into the chat.
	if (chat.messages === null) {
		await Chat.findOneAndUpdate(
			{id: chatId},
			{$set: {messages: [message.toObject()]}}
		)
	} else {
		await Chat.findOneAndUpdate(
			{ id: chatId },
			{ $push: {messages: message.toObject()} }
		);
	}
	
	const messageObj = message.toObject();
	
	return cleanUpMessageObj(messageObj);
}

/**
 * Returns the last message in a all chats from a given user.
 * @param {string} username The username that requested the last message in the chat.
 * @param {number} chatId The ID of the chat that we are requesting the last message from.
 * @returns The last message in the chat following the message schema.
 */
export async function getLastMessageInChats(username) {
	const chats = await getChatsByUsername(username);
	if (chats.length === 0) {
		return [];
	}
	
	const result = [];
	
	for (let i = 0; i < chats.length; i++) {
		const chat = chats[i];
		const messages = chat.messages;
		const lastMessage = messages === null ? null : messages[messages.length - 1];
		const otherUser = getOtherUserInChat(chat, username);
		delete otherUser._id;
		result.push({
			id: chat.id,
			user: otherUser,
			lastMessage: lastMessage === null ? null : {
				id: lastMessage.id,
				created: lastMessage.created,
				content: lastMessage.content,
			},
		});
	}
	
	return result;
}

export async function getAllMessagesInChat(id) {
	const chats = await getChatById(id);
	if (chats.length === 0) {
		throw new InvalidChatIdError();
	}
	
	const chat = chats[0];
	
	if (chat.messages === null) {
		return [];
	}
	
	const messages = chat.messages.toObject();
	
	for (let i = 0; i < messages.length; i++) {
		delete messages[i].sender.displayName;
		delete messages[i].sender.profilePic;
		delete messages[i].sender._id;
		delete messages[i].sender.__v;
		delete messages[i]._id;
		delete messages[i].__v;
	}
	
	return messages;
}
