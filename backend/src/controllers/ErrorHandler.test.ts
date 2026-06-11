import { describe, it, expect, vi } from "vitest";
import ErrorHandler from "./ErrorHandler.js";
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

function mockRes() {
	const res = {};
	res.status = vi.fn(() => res);
	res.send = vi.fn(() => res);
	return res;
}

describe("ErrorHandler.tokens", () => {
	it.each([
		[InvalidCredentialsError, 400, "Incorrect username and/or password"],
		[InvalidTokenError, 401, "Invalid token received"],
	])("maps %s to its status and message", (ErrorClass, status, message) => {
		const res = mockRes();
		const next = vi.fn();
		ErrorHandler.tokens(new ErrorClass(), {}, res, next);
		expect(res.status).toHaveBeenCalledWith(status);
		expect(res.send).toHaveBeenCalledWith(message);
		expect(next).not.toHaveBeenCalled();
	});

	it("passes unrelated errors to next", () => {
		const res = mockRes();
		const next = vi.fn();
		const err = new Error("not a token error");
		ErrorHandler.tokens(err, {}, res, next);
		expect(next).toHaveBeenCalledWith(err);
		expect(res.status).not.toHaveBeenCalled();
	});
});

describe("ErrorHandler.chats", () => {
	it.each([
		[ChatAlreadyExistsError, 400, "Chat already exists"],
		[UserNotPartOfChatError, 401, "User doesn't exists"],
		[InvalidChatIdError, 401, "Chat ID doesn't exists"],
		[InvalidMessageContentError, 400, "Message content is invalid."],
		[SameUserChatError, 406, "Cannot create a chat with yourself."],
	])("maps %s to its status and message", (ErrorClass, status, message) => {
		const res = mockRes();
		const next = vi.fn();
		ErrorHandler.chats(new ErrorClass(), {}, res, next);
		expect(res.status).toHaveBeenCalledWith(status);
		expect(res.send).toHaveBeenCalledWith(message);
		expect(next).not.toHaveBeenCalled();
	});

	it("passes unrelated errors to next", () => {
		const res = mockRes();
		const next = vi.fn();
		const err = new Error("not a chat error");
		ErrorHandler.chats(err, {}, res, next);
		expect(next).toHaveBeenCalledWith(err);
	});
});

describe("ErrorHandler.users", () => {
	it.each([
		[UserAlreadyExistsError, 409, "User already exists"],
		[InvalidPasswordError, 400, "Invalid Password"],
		[UserDoesNotExistsError, 404, "User not found"],
		[InvalidUsernameError, 400, "Invalid Username"],
	])("maps %s to its status and message", (ErrorClass, status, message) => {
		const res = mockRes();
		const next = vi.fn();
		ErrorHandler.users(new ErrorClass(), {}, res, next);
		expect(res.status).toHaveBeenCalledWith(status);
		expect(res.send).toHaveBeenCalledWith(message);
		expect(next).not.toHaveBeenCalled();
	});

	it("passes unrelated errors to next", () => {
		const res = mockRes();
		const next = vi.fn();
		const err = new Error("not a user error");
		ErrorHandler.users(err, {}, res, next);
		expect(next).toHaveBeenCalledWith(err);
	});
});
