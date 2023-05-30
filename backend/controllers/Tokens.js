import { Router } from "express";
import { getToken } from "../models/Tokens.js";
import { generateError } from "./Validator.js";

const router = new Router();

router.post("/", async (req, res, next) => {
	// Take the information that should be passed from the app.
	const { username, password } = req.body;
	
	// Make sure the information is valid.
	if (generateError({username, password}, res)) {
		return;
	}
	try {
		// Get the token.
		const token = await getToken(username, password);
		
		// Send it back to the user.
		res.send(token);
	} catch (err) {
		next(err);
	}
});

export default router;
