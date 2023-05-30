import { Router } from "express";
import { InvalidCredentialsError, getToken } from "../models/Tokens.js";
import { generateError } from "./Validator.js";

const router = new Router();

router.post("/", async (req, res) => {
	// Take the information that should be passed from the app.
	const { username, password } = req.body;
	
	// Make sure the information is valid.
	const error = generateError({username, password});
	if (error) {
		res.status(400).json(error);
		return;
	}
	
	try {
		// Get the token.
		const token = await getToken(username, password);
		
		// Send it back to the user.
		res.send(token);
	} catch (err) {
		if (err instanceof InvalidCredentialsError) {
			res.status(401).send(err.message);
		}
	}
});

export default router;
