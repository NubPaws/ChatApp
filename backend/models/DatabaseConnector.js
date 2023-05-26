import { MongoClient } from "mongodb";
import mongoose, { Schema, SchemaType } from "mongoose";

const IP_ADDRESS = "127.0.0.1";
const PORT = 27017;

const MONGO_DB_ADDRESS = `mongodb://${IP_ADDRESS}:${PORT}/`;

let client = undefined;

export async function startMongoDB() {
	try {
		client = await MongoClient.connect(MONGO_DB_ADDRESS);
		await mongoose.connect(MONGO_DB_ADDRESS);
		
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

const userPassNameSchema = new Schema({
	username: { type: [String, null] },
	password: { type: [String, null] },
	displayName: { type: [String, null] },
	profilePic: { type: [String, null] },
});

export const UserPassName = mongoose.model("UserPassName", userPassNameSchema);

const userPassSchema = new Schema({
	username: { type: [String, null] },
	password: { type: [String, null] },
});

export const UserPass = mongoose.model("UserPass", userPassSchema);

const userSchema = new Schema({
	username: { type: [String, null] },
	displayName: { type: [String, null] },
	profilePic: { type: [String, null] },
});

export const User = mongoose.model("User", userSchema);

const messageSchema = new Schema({
	id: Number,
	created: Date,
	sender: userSchema,
	content: { type: [String, null] },
});

export const Message = mongoose.model("Message", messageSchema);

const chatSchema = new Schema({
	id: Number,
	users: { type: [[userSchema], null] },
	messages: { type: [[messageSchema], null] },
});

export const Chat = mongoose.model("Chat", chatSchema);

export async function getUserPassNameByUsername(username) {
	return await UserPassName.find({username: username});
}

export async function getUserPassByUsername(username) {
	return await UserPass.find({username: username});
}

export async function getUserByUsername(username) {
	return await User.find({username: username});
}

export async function getMessageById(id) {
	return await Message.find({id: id});
}

export async function getChatById(id) {
	return await Chat.find({id: id});
}

export async function getChatsByUsername(username) {
	return await Chat.find({users: { $elemMatch: { username: username } }});
}

export async function addUserToDatabase(username, password, displayName, profilePic) {
	await new UserPassName({
		username: username,
		password: password,
		displayName: displayName,
		profilePic: profilePic,
	}).save();
	
	await new UserPass({
		username: username,
		password: password,
	}).save();
	
	await new User({
		username: username,
		displayName: displayName,
		profilePic: profilePic,
	}).save();
}
