import { Router } from "express";
import { getUsernameFromToken } from "../models/Tokens.js";
import {
	createChat,
	getChat,
	deleteChat,
	addMessageToChat,
	getLastMessageInChats,
	getAllMessagesInChat,
	getReceiver,
} from "../models/Chats.js";
import { generateError } from "./Validator.js";
import { sendInstantMessage } from "./ServerHandler.js";
import type { CreateChatRequest, SendMessageRequest } from "@chatapp/shared";

const router = Router();

/**
 * Every endpoint in this router requires a valid bearer token. The middleware
 * validates it once and attaches the username to the request.
 */
router.use((req, res, next) => {
	if (!req.headers.authorization) {
		res.status(403).send("Token required");
		return;
	}
	try {
		const token = req.headers.authorization.split(" ")[1];
		req.username = getUsernameFromToken(token);
		next();
	} catch (err) {
		next(err);
	}
});

router.get("/", async (req, res, next) => {
	try {
		const chats = await getLastMessageInChats(req.username!);
		res.json(chats);
	} catch (err) {
		next(err);
	}
});

router.post("/", async (req, res, next) => {
	const { username } = req.body as CreateChatRequest;
	if (generateError({ username }, res)) {
		return;
	}
	try {
		await createChat(req.username!, username);
		res.send();
	} catch (err) {
		next(err);
	}
});

router.get("/:id", async (req, res, next) => {
	try {
		const chat = await getChat(req.username!, req.params.id);
		res.json(chat);
	} catch (err) {
		next(err);
	}
});

router.delete("/:id", async (req, res, next) => {
	try {
		await deleteChat(req.username!, req.params.id);
		res.send();
	} catch (err) {
		next(err);
	}
});

router.post("/:id/Messages", async (req, res, next) => {
	const username = req.username!;
	const { msg } = req.body as SendMessageRequest;
	if (generateError({ message: msg }, res)) {
		return;
	}
	try {
		const message = await addMessageToChat(username, req.params.id, msg);
		// Deliver the message to the receiver in real time.
		const receiver = await getReceiver(username, req.params.id);
		await sendInstantMessage(req.params.id, username, receiver, message.content, message.created);
		// Return the created message to the sender.
		res.json(message);
	} catch (err) {
		next(err);
	}
});

router.get("/:id/Messages", async (req, res, next) => {
	try {
		const messages = await getAllMessagesInChat(req.username!, req.params.id);
		res.json(messages);
	} catch (err) {
		next(err);
	}
});

export default router;
