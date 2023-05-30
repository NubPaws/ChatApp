import { Router } from "express";
import { addUser, UserAlreadyExistsError, InvalidPasswordError, getUser,
	UserDoesNotExistsError } from "../models/Users.js";
import { InvalidTokenError, getUsernameFromToken } from "../models/Tokens.js";

const router = new Router();

router.get("/:username", async (req, res) => {
	if (!req.headers.authorization) {
		res.status(403).send("Token required");
		return;
	}
	const token = req.headers.authorization.split(" ")[1];
	const username = await getUsernameFromToken(token);
	
	if (req.params.username === username) {
		res.json(await getUser(username));
	} else {
		res.send();
	}
});

router.post("/", async (req, res) => {
	const {username, password, displayName, profilePic} = req.body;
	const data = await addUser(username, password, displayName, profilePic);
	res.json(data);
});

export default router;
