import {
	Chat,
	Message,
	getChatById,
	getChatsByUsername,
	getNextChatId,
	getNextMessageId,
	getUserByUsername,
	type IUser,
} from "./DatabaseConnector.js";
import { InvalidUsernameError, getUser } from "./Users.js";

/** A chat document as returned by the DatabaseConnector query helpers. */
type ChatDoc = Awaited<ReturnType<typeof getChatById>>[number];

export class ChatAlreadyExistsError extends Error {}
export class UserNotPartOfChatError extends Error {}
export class InvalidChatIdError extends Error {}
export class InvalidMessageContentError extends Error {}
export class SameUserChatError extends Error {}

/** Returns the other participant of a chat as a plain public user, or null. */
function getOtherUserInChat(chat: ChatDoc, username: string): IUser | null {
	const users = chat.users;
	if (users.length < 2) {
		return null;
	}
	const other = users[0].username === username ? users[1] : users[0];
	return {
		username: other.username,
		displayName: other.displayName,
		profilePic: other.profilePic,
	};
}

/** Whether the user with `username` is a participant of `chat`. */
function isUserPartOfChat(username: string, chat: ChatDoc): boolean {
	return chat.users.some((user) => user.username === username);
}

/** Returns the username of the other participant in a chat. */
export async function getReceiver(username: string, chatId: number | string): Promise<string> {
	const chats = await getChatById(chatId);
	if (chats.length === 0) {
		throw new InvalidChatIdError();
	}

	const users = chats[0].users;
	if (users[0].username === username) {
		return users[1].username;
	}
	return users[0].username;
}

/** Returns the display name for a username. */
export async function getDisplayName(username: string): Promise<string> {
	const users = await getUserByUsername(username);
	if (users.length === 0) {
		throw new InvalidUsernameError();
	}
	return users[0].displayName;
}

/**
 * Creates a chat between two distinct, existing users.
 * @throws {SameUserChatError} If both usernames are the same.
 * @throws {ChatAlreadyExistsError} If a chat between the two already exists.
 */
export async function createChat(requestingUsername: string, otherUsername: string): Promise<void> {
	if (requestingUsername === otherUsername) {
		throw new SameUserChatError();
	}

	const chats = await getChatsByUsername(requestingUsername);
	for (const chat of chats) {
		const other = getOtherUserInChat(chat, requestingUsername);
		if (other?.username === otherUsername) {
			throw new ChatAlreadyExistsError();
		}
	}

	const requesting = await getUser(requestingUsername);
	const other = await getUser(otherUsername);

	await Chat.create({
		id: getNextChatId(),
		users: [requesting, other],
		messages: null,
	});
}

/**
 * Returns the chat with the given ID, with Mongo metadata stripped, provided the
 * requesting user is a participant.
 * @throws {InvalidChatIdError} If no such chat exists.
 * @throws {UserNotPartOfChatError} If the user is not a participant.
 */
export async function getChat(username: string, id: number | string) {
	const chats = await getChatById(id);
	if (chats.length === 0) {
		throw new InvalidChatIdError();
	}

	const chat = chats[0];
	if (!isUserPartOfChat(username, chat)) {
		throw new UserNotPartOfChatError();
	}

	const users = chat.users.map((user) => ({
		username: user.username,
		displayName: user.displayName,
		profilePic: user.profilePic,
	}));

	const messages =
		chat.messages === null
			? null
			: chat.messages.map((message) => ({
					id: message.id,
					created: message.created,
					content: message.content,
					sender: {
						username: message.sender.username,
						displayName: message.sender.displayName,
						profilePic: message.sender.profilePic,
					},
				}));

	return { id: chat.id, users, messages };
}

/** Deletes a chat the requesting user is a participant of. */
export async function deleteChat(username: string, id: number | string): Promise<void> {
	const chats = await getChatById(id);
	if (chats.length === 0) {
		throw new InvalidChatIdError();
	}

	if (!isUserPartOfChat(username, chats[0])) {
		throw new UserNotPartOfChatError();
	}

	await Chat.deleteOne({ id: Number(id) });
}

/**
 * Appends a message to a chat and returns the created message.
 * @throws {InvalidChatIdError} If the chat does not exist.
 * @throws {UserNotPartOfChatError} If the sender is not a participant.
 * @throws {InvalidMessageContentError} If the content is empty.
 */
export async function addMessageToChat(
	username: string,
	chatId: number | string,
	messageContent: string,
) {
	const chats = await getChatById(chatId);
	if (chats.length === 0) {
		throw new InvalidChatIdError();
	}

	const chat = chats[0];
	if (!isUserPartOfChat(username, chat)) {
		throw new UserNotPartOfChatError();
	}

	const content = messageContent.trim();
	if (content === "") {
		throw new InvalidMessageContentError();
	}

	const users = await getUserByUsername(username);
	const sender = {
		username: users[0].username,
		displayName: users[0].displayName,
		profilePic: users[0].profilePic,
	};

	const message = await Message.create({
		id: getNextMessageId(),
		created: new Date(),
		sender,
		content,
	});

	if (chat.messages === null) {
		await Chat.findOneAndUpdate({ id: Number(chatId) }, { $set: { messages: [message.toObject()] } });
	} else {
		await Chat.findOneAndUpdate({ id: Number(chatId) }, { $push: { messages: message.toObject() } });
	}

	return {
		id: message.id,
		created: message.created,
		content: message.content,
		sender,
	};
}

/** Returns, for every chat the user is in, the other user and the last message. */
export async function getLastMessageInChats(username: string) {
	const chats = await getChatsByUsername(username);
	if (chats.length === 0) {
		return [];
	}

	return chats.map((chat) => {
		const messages = chat.messages;
		const lastMessage =
			messages === null || messages.length === 0 ? null : messages[messages.length - 1];

		return {
			id: chat.id,
			user: getOtherUserInChat(chat, username),
			lastMessage:
				lastMessage === null
					? null
					: { id: lastMessage.id, created: lastMessage.created, content: lastMessage.content },
		};
	});
}

/** Returns every message in a chat with the sender reduced to a username. */
export async function getAllMessagesInChat(username: string, id: number | string) {
	const chats = await getChatById(id);
	if (chats.length === 0) {
		throw new InvalidChatIdError();
	}

	const chat = chats[0];
	if (chat.users[0].username !== username && chat.users[1].username !== username) {
		throw new UserNotPartOfChatError();
	}

	if (chat.messages === null) {
		return [];
	}

	return chat.messages.map((message) => ({
		id: message.id,
		created: message.created,
		content: message.content,
		sender: { username: message.sender.username },
	}));
}
