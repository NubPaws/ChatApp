import { Socket } from "socket.io";
import firebase from "firebase-admin"
import { getDisplayName } from "../models/Chats.js";

const websiteConnections = new Map();
const androidConnections = new Map();

/**
 * @param {Socket} socket 
 */
export function onConnect(socket) {
	const { username } = socket.handshake.query;
	websiteConnections.set(username, socket);
	
	socket.on("disconnect", () => {
		websiteConnections.delete(username);
	});
}

/**
 * Registers the user in the fcmToken map.
 * 
 * @param {string} username The username that connected.
 * @param {string} fcmToken The (F)irebase (C)loud (M)essaing token of that user.
 */
export function addFcmToken(username, fcmToken) {
	if (fcmToken === "") {
		if (androidConnections.has(username))
			androidConnections.delete(username);
		return;
	}
	
	androidConnections.set(username, fcmToken);
	androidConnections[username] = fcmToken;
}

export function removeFcmToken(username) {
	androidConnections.delete(username);
}

/**
 * Sends a message in an instant manner by checking if the receiver is online or if he's
 * connected from the chat application. Then we send the message to the user.
 * 
 * @param {number} chatId The id of the chat that we are in.
 * @param {string} sender The user who sends the message.
 * @param {string} receiver The user that should receive the message.
 * @param {string} content The contents of the message.
 * @param {Date} timestamp The timestamp of the message.
 */
export async function sendInstantMessage(chatId, sender, receiver, content, timestamp) {
	
	// Send to the user on the web.
	if (websiteConnections.has(receiver)) {
		const receiverPayload = {
			sender: sender,
			content: content,
			timestamp: timestamp,
		};
		
		websiteConnections.get(receiver).emit("receive", receiverPayload);
	}
	
	// Send to the android app.
	if (androidConnections.has(receiver)) {
		const message = {
			data: {
				chatId: chatId,
				sender: sender,
				displayName: await getDisplayName(sender),
				content: content,
				timestamp: timestamp.toString(),
			},
			token: androidConnections.get(receiver),
		};
		
		firebase.messaging()
			.send(message)
			.catch(error => {
				console.error("Error:", error);
			});
	}
	
}
