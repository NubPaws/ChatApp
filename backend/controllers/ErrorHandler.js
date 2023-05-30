import { InvalidCredentialsError, InvalidTokenError } from "../models/Tokens.js";
import { ChatAlreadyExistsError, InvalidChatIdError,
	InvalidMessageContentError, UserNotPartOfChatError } from "../models/Chats.js";
import { InvalidPasswordError, InvalidUsernameError,
	UserAlreadyExistsError, UserDoesNotExistsError } from "../models/Users.js";

function tokens(err, req, res, next) {
	let statusCode = undefined;
	let message = undefined;
	if (err instanceof InvalidCredentialsError) {
		statusCode = 400;
		message = "Incorrect username and/or password";
	} else if (err instanceof InvalidTokenError) {
		statusCode = 401;
		message = "Invalid token received";
	} else {
		next(err);
		return;
	}
	res.status(statusCode).send(message);
}

function chats(err, req, res, next) {
	let statusCode = undefined;
	let message = undefined;
	if (err instanceof ChatAlreadyExistsError) {
		statusCode = 400;
		message = "Chat already exists";
	} else if (err instanceof UserNotPartOfChatError) {
		statusCode = 401;
		message = "User doesn't exists";
	} else if (err instanceof InvalidChatIdError) {
		statusCode = 401;
		message = "Chat ID doesn't exists";
	} else if (err instanceof InvalidMessageContentError) {
		statusCode = 400;
		message = "Message content is invalid.";
	} else {
		next(err);
		return;
	}
	res.status(statusCode).send(message);
}

function users(err, req, res, next) {
	let statusCode = undefined;
	let message = undefined;
	if (err instanceof UserAlreadyExistsError) {
		statusCode = 409;
		message = "User already exists";
	} else if (err instanceof InvalidPasswordError) {
		statusCode = 400;
		message = "Invalid Password";
	} else if (err instanceof UserDoesNotExistsError) {
		statusCode = 404;
		message = "User not found";
	} else if (err instanceof InvalidUsernameError) {
		statusCode = 400;
		message = "Invalid Username";
	} else {
		next(err);
		return;
	}
	res.status(statusCode).send(message);
}

export default {
	tokens,
	chats,
	users,
}
