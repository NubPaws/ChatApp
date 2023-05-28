import { Router } from "express";
import { InvalidCredentialsError, getToken } from "../models/Tokens.js";

const router = new Router();

router.post("/", async (req, res) => {
	const { username, password } = req.body;
	
	try {
		const token = await getToken(username, password);
		
		res.send(token);
	} catch (err) {
		if (err instanceof InvalidCredentialsError) {
			res.status(401).send("Invalid username and/or password");
		}
	}
});

export default router;
