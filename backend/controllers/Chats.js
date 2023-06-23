import { Router } from "express";
import { getUsernameFromToken } from "../models/Tokens.js";
import { createChat, getChat, deleteChat, addMessageToChat, getLastMessageInChats,
	getAllMessagesInChat, getReceiver} from "../models/Chats.js";
import { generateError } from "./Validator.js";
import { sendInstantMessage } from "./ServerHandler.js";

const router = new Router();

/**
 * This middleware is in charge of validating the token from the user.
 * The idea is that every API end point here requires a token, and if
 * the token is invalid then there is no need to attempt and execute
 * the API point.
 */
router.use(async (req, res, next) => {
	if (!req.headers.authorization) {
		res.status(403).send("Token required");
		return;
	}
	try {
		const token = req.headers.authorization.split(" ")[1];
		const username = getUsernameFromToken(token);
		req.username = username;
		
		next();
	} catch (err) {
		next(err);
	}
});

router.get("/", async (req, res, next) => {
	try {
		const chats = await getLastMessageInChats(req.username);
		res.json(chats);
	} catch (err) {
		next(err);
	}
});

router.post("/", async (req, res, next) => {
	const otherUsername = req.body.username;
	if (generateError({username: otherUsername}, res)) {
		return;
	}
	try {
		await createChat(req.username, otherUsername);
		res.send();
	} catch (err) {
		next(err);
	}
});

router.get("/:id", async (req, res, next) => {
	const username = req.username
	const id = req.params.id;
	try {
		const chat = await getChat(username, id);
		res.json(chat);
	} catch (err) {
		next(err);
	}
});

router.delete("/:id", async (req, res, next) => {
	const username = req.username;
	try {
		await deleteChat(username, req.params.id);
		res.send();
	} catch (err) {
		next(err);
	}
});

router.post("/:id/Messages", async (req, res, next) => {
	const username = req.username;
	if (generateError({message: req.body.msg}, res)) {
		return;
	}
	try {
		const message = await addMessageToChat(username, req.params.id, req.body.msg);
		// Get the information to send the message for the user live.
		const chat = await getChat(username, req.params.id);
		const receiver = await getReceiver(username, req.params.id);
		console.log(receiver);
		sendInstantMessage(username, receiver, message.content, message.created);
		// Return the result to the sender.
		res.json(message);
	} catch (err) {
		next(err);
	}
});

router.get("/:id/Messages", async (req, res, next) => {
	const username = req.username;
	try {
		const lastMessage = await getAllMessagesInChat(username, req.params.id);
		res.json(lastMessage);
	} catch (err) {
		next(err);
	}
});

export default router;
