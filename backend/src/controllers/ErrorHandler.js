import { InvalidCredentialsError, InvalidTokenError } from "../models/Tokens.js";
import { ChatAlreadyExistsError, InvalidChatIdError,
	InvalidMessageContentError, UserNotPartOfChatError,
	SameUserChatError } from "../models/Chats.js";
import { InvalidPasswordError, InvalidUsernameError,
	UserAlreadyExistsError, UserDoesNotExistsError } from "../models/Users.js";

const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const CONFLICT = 409
const UNACCEPTABLE = 406;

function tokens(err, req, res, next) {
	let statusCode = undefined;
	let message = undefined;
	if (err instanceof InvalidCredentialsError) {
		statusCode = BAD_REQUEST;
		message = "Incorrect username and/or password";
	} else if (err instanceof InvalidTokenError) {
		statusCode = UNAUTHORIZED;
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
		statusCode = BAD_REQUEST;
		message = "Chat already exists";
	} else if (err instanceof UserNotPartOfChatError) {
		statusCode = UNAUTHORIZED;
		message = "User doesn't exists";
	} else if (err instanceof InvalidChatIdError) {
		statusCode = UNAUTHORIZED;
		message = "Chat ID doesn't exists";
	} else if (err instanceof InvalidMessageContentError) {
		statusCode = BAD_REQUEST;
		message = "Message content is invalid.";
	} else if (err instanceof SameUserChatError) {
		statusCode = UNACCEPTABLE;
		message = "Cannot create a chat with yourself.";
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
		statusCode = CONFLICT;
		message = "User already exists";
	} else if (err instanceof InvalidPasswordError) {
		statusCode = BAD_REQUEST;
		message = "Invalid Password";
	} else if (err instanceof UserDoesNotExistsError) {
		statusCode = NOT_FOUND;
		message = "User not found";
	} else if (err instanceof InvalidUsernameError) {
		statusCode = BAD_REQUEST;
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
