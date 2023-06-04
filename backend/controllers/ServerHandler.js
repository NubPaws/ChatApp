import { Socket } from "socket.io";

const userConnections = new Map();

/**
 * @param {Socket} socket 
 */
export function onConnect(socket) {
	const { username } = socket.handshake.query;
	userConnections.set(username, socket);
	
	socket.on("disconnect", () => {
		userConnections.delete(username);
	});
	
	socket.on("send", (payload) => {
		const { sender, receiver, content, timestamp } = payload;
		
		const receiverPayload = {
			sender: sender,
			content: content,
			timestamp: timestamp,
		};
		
		if (userConnections.get(receiver)) {
			userConnections.get(receiver).emit("receive", receiverPayload);
		}
	});
}
