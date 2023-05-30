import { Router } from "express";
import { addUser, getUser } from "../models/Users.js";
import { getUsernameFromToken } from "../models/Tokens.js";
import { generateError } from "./Validator.js";

const router = new Router();

router.get("/:username", async (req, res, next) => {
	if (!req.headers.authorization) {
		res.status(403).send("Token required");
		return;
	}
	const token = req.headers.authorization.split(" ")[1];
	try {
		const username = await getUsernameFromToken(token);
		
		if (req.params.username === username) {
			res.json(await getUser(username));
		} else {
			res.send();
		}
	} catch (err) {
		next(err);
	}
});

router.post("/", async (req, res, next) => {
	const {username, password, displayName, profilePic} = req.body;
	
	if (generateError({username, password, displayName, profilePic}, res)) {
		return;
	}
	try {
		const data = await addUser(username, password, displayName, profilePic);
		res.json(data);
	} catch (err) {
		next(err);
	}
});

export default router;
