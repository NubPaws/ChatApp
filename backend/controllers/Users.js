import { Router } from "express";
import { addUser, UserAlreadyExistsError, InvalidPasswordError, getUser } from "../models/Users.js";
import { InvalidTokenError, getUsernameFromToken } from "../models/Tokens.js";

const router = new Router();

router.get("/:username", async (req, res) => {
	if (!req.headers.authorization) {
		res.status(403).send("Token required");
		return;
	}
	const token = req.headers.authorization.split(" ")[1];
	try {
		const username = await getUsernameFromToken(token);
		
		if (req.params.username === username) {
			return await getUser(username);
		}
	} catch (err) {
		if (err instanceof InvalidTokenError) {
			res.status(401).send("Invalid Token");
		} else if (err instanceof UserDoesNotExistsError) {
			res.status(404).send("User not found");
		}
	}
});

router.post("/", async (req, res) => {
	const {username, password, displayName, profilePic} = req.body;
	try {
		const data = await addUser(username, password, displayName, profilePic);
		res.json(data);
	} catch (err) {
		if (err instanceof UserAlreadyExistsError) {
			res.status(409).send("User already exists");
		} else if (err instanceof InvalidPasswordError) {
			res.status(400).send("Invalid Password");
		}
	}
});

export default router;
