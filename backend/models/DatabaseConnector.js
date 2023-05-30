import { MongoClient } from "mongodb";
import mongoose, { Schema } from "mongoose";

const IP_ADDRESS = "127.0.0.1";
const PORT = 27017;

const MONGO_DB_ADDRESS = `mongodb://${IP_ADDRESS}:${PORT}/`;

let client = undefined;

let chatCounter = 0;
let messageCounter = 0;

/**
 * @returns The next available chat ID.
 */
export function getNextChatId() {
	chatCounter += 1;
	return chatCounter;
}

/**
 * @returns the next available message ID.
 */
export function getNextMessageId() {
	messageCounter += 1;
	return messageCounter;
}

// Create the schemas for the API.

const userPassNameSchema = new Schema({
	username: { type: String, default: null },
	password: { type: String, default: null },
	displayName: { type: String, default: null },
	profilePic: { type: String, default: null },
});

const userPassSchema = new Schema({
	username: { type: String, default: null },
	password: { type: String, default: null },
});

const userSchema = new Schema({
	username: { type: String, default: null },
	displayName: { type: String, default: null },
	profilePic: { type: String, default: null },
});

const messageSchema = new Schema({
	id: Number,
	created: Date,
	sender: userSchema,
	content: { type: String, default: null },
});

const chatSchema = new Schema({
	id: Number,
	users: { type: [userSchema], default: null },
	messages: { type: [messageSchema], default: null },
});

// Register the schemas as models.
export const UserPassName = mongoose.model("UserPassName", userPassNameSchema);
export const UserPass = mongoose.model("UserPass", userPassSchema);
export const User = mongoose.model("User", userSchema);
export const Message = mongoose.model("Message", messageSchema);
export const Chat = mongoose.model("Chat", chatSchema);

/**
 * @param {string} username The username to get the objects of.
 * @returns {[UserPassName]} Array containing the username specified.
 */
export async function getUserPassNameByUsername(username) {
	return await UserPassName.find({username: username});
}

/**
 * @param {string} username The username to get the objects of.
 * @returns {[UserPass]} Array containing the username specified.
 */
export async function getUserPassByUsername(username) {
	return await UserPass.find({username: username});
}

/**
 * @param {string} username The username to get the objects of.
 * @returns {[User]} Array containing the username specified.
 */
export async function getUserByUsername(username) {
	return await User.find({username: username});
}

/**
 * @param {number} id The id to get the objects of.
 * @returns {[Message]} Array containing the id specified.
 */
export async function getMessageById(id) {
	return await Message.find({id: id});
}

/**
 * @param {number} id The id to get the objects of.
 * @returns {[Chat]} Array containing the id specified.
 */
export async function getChatById(id) {
	return await Chat.find({id: id});
}

/**
 * @param {string} username The username to get the objects of.
 * @returns {[Chat]} Array containing the username specified.
 */
export async function getChatsByUsername(username) {
	return await Chat.find({users: { $elemMatch: { username: username } }});
}

/**
 * Starts the mongoose client, connecting to it.
 * Then makes the chatId and the messageId be valid (assign them
 * to the max chat/message id).
 */
export async function startMongoDB() {
	try {
		await mongoose.connect(MONGO_DB_ADDRESS + "chat");
		
		let maxNumber;
		
		// Load the highest chat ID.
		const chats = await Chat.find();
		maxNumber = 0;
		for (let i = 0; i < chats.length; i++) {
			if (maxNumber < chats[i].id) {
				maxNumber = chats[i].id;
			}
		}
		chatCounter = maxNumber;
		
		// Load the highest message ID.
		const messages = await Message.find();
		maxNumber = 0;
		for (let i = 0; i < messages.length; i++) {
			if (maxNumber < messages[i].id) {
				maxNumber = messages[i].id;
			}
		}
		messageCounter = maxNumber;
		
	} catch (exception) {
		console.log("Failed to connect to mongodb client");
		console.log(exception)
	}
}

export function stopMongoDB() {
	if (client === undefined)
		return;
	client.close();
}
