import type { ErrorRequestHandler } from "express";
import { InvalidCredentialsError, InvalidTokenError } from "../models/Tokens.js";
import {
	ChatAlreadyExistsError,
	InvalidChatIdError,
	InvalidMessageContentError,
	UserNotPartOfChatError,
	SameUserChatError,
} from "../models/Chats.js";
import {
	InvalidPasswordError,
	InvalidUsernameError,
	UserAlreadyExistsError,
	UserDoesNotExistsError,
} from "../models/Users.js";

const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const CONFLICT = 409;
const UNACCEPTABLE = 406;

const tokens: ErrorRequestHandler = (err, _req, res, next) => {
	if (err instanceof InvalidCredentialsError) {
		res.status(BAD_REQUEST).send("Incorrect username and/or password");
	} else if (err instanceof InvalidTokenError) {
		res.status(UNAUTHORIZED).send("Invalid token received");
	} else {
		next(err);
	}
};

const chats: ErrorRequestHandler = (err, _req, res, next) => {
	if (err instanceof ChatAlreadyExistsError) {
		res.status(BAD_REQUEST).send("Chat already exists");
	} else if (err instanceof UserNotPartOfChatError) {
		res.status(UNAUTHORIZED).send("User doesn't exists");
	} else if (err instanceof InvalidChatIdError) {
		res.status(UNAUTHORIZED).send("Chat ID doesn't exists");
	} else if (err instanceof InvalidMessageContentError) {
		res.status(BAD_REQUEST).send("Message content is invalid.");
	} else if (err instanceof SameUserChatError) {
		res.status(UNACCEPTABLE).send("Cannot create a chat with yourself.");
	} else {
		next(err);
	}
};

const users: ErrorRequestHandler = (err, _req, res, next) => {
	if (err instanceof UserAlreadyExistsError) {
		res.status(CONFLICT).send("User already exists");
	} else if (err instanceof InvalidPasswordError) {
		res.status(BAD_REQUEST).send("Invalid Password");
	} else if (err instanceof UserDoesNotExistsError) {
		res.status(NOT_FOUND).send("User not found");
	} else if (err instanceof InvalidUsernameError) {
		res.status(BAD_REQUEST).send("Invalid Username");
	} else {
		next(err);
	}
};

export default { tokens, chats, users };
