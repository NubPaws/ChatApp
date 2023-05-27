import { Router } from "express";
import { InvalidTokenError, getUsernameFromToken } from "../models/Tokens.js";
import { ChatAlreadyExistsError, InvalidChatIdError, UserNotPartOfChatError,
	createChat, getChat, getChats, deleteChat, addMessageToChat, getLastMessageInChat } from "../models/Chats.js";
import { UserDoesNotExistsError } from "../models/Users.js";

const router = new Router();

router.use(async (req, res, next) => {
	if (!req.headers.authorization) {
		res.status(403).send("Token required");
		return;
	}
	try {
		const token = req.headers.authorization.split(" ")[1];
		const username = await getUsernameFromToken(token);
		req.username = username;
	} catch (err) {
		if (err instanceof InvalidTokenError) {
			res.status(401).send("Invalid Token");
			return;
		}
	}
	next();
});

router.get("/", async (req, res) => {
	try {
		const chats = await getChats(req.username);
		res.json(chats);
	} catch (err) {
		if (err instanceof UserNotPartOfChatError) {
			res.status(401).send("User doesn't exists");
		} else {
			res.status(500).send("Internal Server Error");
		}
	}
});

router.post("/", async (req, res) => {
	const username = await getUsername(req, res);
	if (!username)
		return;
	try {
		const otherUsername = req.body;
		
		await createChat(username, otherUsername);
	} catch (err) {
		if (err instanceof ChatAlreadyExistsError) {
			res.status(400).send("Chat already exists");
		} else if (err instanceof UserDoesNotExistsError) {
			res.status(400).send("One of the users doesn't exists");
		}
	}
	res.send();
});

router.get("/:id", async (req, res) => {
	const username = req.username;
	try {
		const id = req.params.id;
		const chat = await getChat(username, id);
		
		res.json(chat);
	} catch (err) {
		if (err instanceof UserNotPartOfChatError) {
			res.status(401).send("User doesn't exists");
		} else if (err instanceof InvalidChatIdError) {
			res.status(401).send("Chat ID doesn't exists");
		} else {
			res.status(500).send("Internal Server Error");
		}
	}
});

router.delete("/:id", async (req, res) => {
	const username = req.username;
	try {
		await deleteChat(username, req.params.id);
		
		res.send();
	} catch (err) {
		if (err instanceof UserNotPartOfChatError) {
			res.status(401).send("User doesn't exists");
		} else {
			res.status(500).send("Internal Server Error");
		}
	}
});

router.post("/:id/Messages", async (req, res) => {
	const username = req.username;
	try {
		const message = await addMessageToChat(username, req.params.id, req.body);
		res.json(message);
	} catch (err) {
		if (err instanceof UserNotPartOfChatError) {
			res.status(401).send("User doesn't exists");
		} else {
			res.status(500).send("Internal Server Error");
		}
	}
});

router.get("/:id/Messages", async (req, res) => {
	const username = req.username;
	try {
		const lastMessage = await getLastMessageInChat(username, req.params.id);
		
		res.json(lastMessage);
	} catch (err) {
		if (err instanceof UserNotPartOfChatError) {
			res.status(401).send("User doesn't exists");
		} else {
			res.status(500).send("Internal Server Error");
		}
	}
});

export default router;
