import { Router } from "express";
import { getToken } from "../models/Tokens.js";
import { generateError } from "./Validator.js";
import { addFcmToken } from "./ServerHandler.js";
import type { LoginRequest } from "@chatapp/shared";

const router = Router();

router.post("/", async (req, res, next) => {
	const { username, password } = req.body as LoginRequest;
	const fcmToken = req.headers.fcmtoken;

	if (generateError({ username, password }, res)) {
		return;
	}
	try {
		const token = await getToken(username, password);
		res.send(token);
	} catch (err) {
		next(err);
	}

	// Register the Android push token if one was supplied with the login.
	if (typeof fcmToken === "string" && fcmToken) {
		addFcmToken(username, fcmToken);
	}
});

export default router;
