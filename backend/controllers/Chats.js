import { Router } from "express";
import { getUsernameFromToken } from "../models/Tokens.js";
import { createChat, getChat, deleteChat, addMessageToChat, getLastMessageInChats,
	getAllMessagesInChat } from "../models/Chats.js";

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
	
	const token = req.headers.authorization.split(" ")[1];
	const username = await getUsernameFromToken(token);
	req.username = username;
	
	next();
});

router.get("/", async (req, res) => {
	const chats = await getLastMessageInChats(req.username);
	res.json(chats);
});

router.post("/", async (req, res) => {
	const otherUsername = req.body;
	if (generateError({username: otherUsername}, res)) {
		return;
	}
	
	await createChat(req.username, otherUsername);
	res.send();
});

router.get("/:id", async (req, res) => {
	const username = req.username
	const id = req.params.id;
	const chat = await getChat(username, id);
	
	res.json(chat);
});

router.delete("/:id", async (req, res) => {
	const username = req.username;
	
	await deleteChat(username, req.params.id);
	
	res.send();
});

router.post("/:id/Messages", async (req, res) => {
	const username = req.username;
	
	if (generateError({message: req.body}, res)) {
		return;
	}
	
	const message = await addMessageToChat(username, req.params.id, req.body);
	res.json(message);
});

router.get("/:id/Messages", async (req, res) => {
	const username = req.username;
	const lastMessage = await getAllMessagesInChat(username, req.params.id);
	
	res.json(lastMessage);
});

export default router;
