import type { Socket } from "socket.io";
import firebase from "firebase-admin";
import { getDisplayName } from "../models/Chats.js";
import type {
	ClientToServerEvents,
	FcmDataPayload,
	ServerToClientEvents,
} from "@chatapp/shared";

type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

const websiteConnections = new Map<string, AppSocket>();
const androidConnections = new Map<string, string>();

/** Registers a freshly connected web client by its handshake username. */
export function onConnect(socket: AppSocket): void {
	const username = socket.handshake.query.username;
	if (typeof username !== "string") {
		return;
	}

	websiteConnections.set(username, socket);

	socket.on("disconnect", () => {
		websiteConnections.delete(username);
	});
}

/** Registers (or, for an empty token, clears) a user's FCM token. */
export function addFcmToken(username: string, fcmToken: string): void {
	if (fcmToken === "") {
		androidConnections.delete(username);
		return;
	}
	androidConnections.set(username, fcmToken);
}

export function removeFcmToken(username: string): void {
	androidConnections.delete(username);
}

/**
 * Delivers a message in real time: over the web socket if the receiver is
 * connected, and/or via Firebase Cloud Messaging if they have a registered
 * Android token.
 */
export async function sendInstantMessage(
	chatId: number | string,
	sender: string,
	receiver: string,
	content: string,
	timestamp: Date,
): Promise<void> {
	const webSocket = websiteConnections.get(receiver);
	if (webSocket) {
		webSocket.emit("receive", { sender, content, timestamp: timestamp.toISOString() });
	}

	const fcmToken = androidConnections.get(receiver);
	if (fcmToken) {
		const data: FcmDataPayload = {
			chatId: chatId.toString(),
			sender,
			displayName: await getDisplayName(sender),
			content,
			timestamp: timestamp.toString(),
		};

		firebase
			.messaging()
			.send({ data, token: fcmToken })
			.catch((error) => {
				console.error("Error:", error);
			});
	}
}
