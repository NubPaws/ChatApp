import mongoose, { Schema, model } from "mongoose";
import { config } from "../config.js";

let chatCounter = 0;
let messageCounter = 0;

/** @returns The next available chat ID. */
export function getNextChatId(): number {
	chatCounter += 1;
	return chatCounter;
}

/** @returns The next available message ID. */
export function getNextMessageId(): number {
	messageCounter += 1;
	return messageCounter;
}

export interface IUserPassName {
	username: string;
	password: string;
	displayName: string;
	profilePic: string;
}

export interface IUserPass {
	username: string;
	password: string;
}

export interface IUser {
	username: string;
	displayName: string;
	profilePic: string;
}

export interface IMessage {
	id: number;
	created: Date;
	sender: IUser;
	content: string;
}

export interface IChat {
	id: number;
	users: IUser[];
	messages: IMessage[] | null;
}

// Schemas are intentionally left untyped; the generic is applied on the models
// below, which is what drives query result types.
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

export const UserPassName = model<IUserPassName>("UserPassName", userPassNameSchema);
export const UserPass = model<IUserPass>("UserPass", userPassSchema);
export const User = model<IUser>("User", userSchema);
export const Message = model<IMessage>("Message", messageSchema);
export const Chat = model<IChat>("Chat", chatSchema);

export async function getUserPassNameByUsername(username: string) {
	return UserPassName.find({ username });
}

export async function getUserPassByUsername(username: string) {
	return UserPass.find({ username });
}

export async function getUserByUsername(username: string) {
	return User.find({ username });
}

export async function getMessageById(id: number) {
	return Message.find({ id });
}

export async function getChatById(id: number | string) {
	return Chat.find({ id });
}

export async function getChatsByUsername(username: string) {
	return Chat.find({ users: { $elemMatch: { username } } });
}

/**
 * Connects mongoose to MongoDB and seeds the chat/message ID counters from the
 * highest IDs currently stored.
 */
export async function startMongoDB(): Promise<void> {
	try {
		await mongoose.connect(config.mongoUri, { dbName: config.mongoDbName });

		const chats = await Chat.find();
		chatCounter = chats.reduce((max, chat) => Math.max(max, chat.id), 0);

		const messages = await Message.find();
		messageCounter = messages.reduce((max, message) => Math.max(max, message.id), 0);
	} catch (exception) {
		console.log("Failed to connect to mongodb client");
		console.log(exception);
	}
}

/** Disconnects mongoose from MongoDB. */
export async function stopMongoDB(): Promise<void> {
	await mongoose.disconnect();
}
