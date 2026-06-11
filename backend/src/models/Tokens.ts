import jwt from "jsonwebtoken";
import { getUserPassByUsername } from "./DatabaseConnector.js";
import { config } from "../config.js";

export class InvalidCredentialsError extends Error {}
export class InvalidTokenError extends Error {}

function getJwtToken(username: string): string {
	return jwt.sign({ username }, config.jwtKey);
}

/**
 * Validates a username/password pair and returns a signed JWT for that user.
 * @throws {InvalidCredentialsError} If the username or password is not valid.
 */
export async function getToken(username: string, password: string): Promise<string> {
	const users = await getUserPassByUsername(username);
	if (users.length === 0) {
		throw new InvalidCredentialsError();
	}

	const user = users[0].toObject();
	if (user.password !== password) {
		throw new InvalidCredentialsError();
	}

	return getJwtToken(username);
}

/**
 * Extracts the username encoded in a token signed with the application key.
 * @throws {InvalidTokenError} If the token is missing, malformed or untrusted.
 */
export function getUsernameFromToken(token: string): string {
	try {
		const data = jwt.verify(token, config.jwtKey) as { username: string };
		return data.username;
	} catch {
		throw new InvalidTokenError();
	}
}
