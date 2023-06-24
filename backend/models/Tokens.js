import { getUserPassByUsername } from "./DatabaseConnector.js";
import jwt from "jsonwebtoken";

export class InvalidCredentialsError extends Error {}
export class InvalidTokenError extends Error {}

function getJwtToken(username) {
	const key = process.env.JWT_KEY;
	try {
		return jwt.sign({username: username}, key);
	} catch (err) {
		console.log(err);
	}
	return undefined;
}

/**
 * Validates the log in of the username and password, doing so by returning
 * the token relating to that user.
 * @param {string | null} username The username that attemps to get the token.
 * @param {string | null} password The password of the username.
 * @returns The token of said username.
 * @throws {InvalidCredentialsError} If the username or password are not valid.
 */
export async function getToken(username, password) {
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
 * Given a token, this functions returns the username cached inside that token.
 * This function assumes that the data was made using the special key that is
 * stored in the .env file (or the default one).
 * @param {string} token The token of the user that attemps to make a request.
 * @returns The username hashed inside the token.
 */
export function getUsernameFromToken(token) {
	const key = process.env.JWT_KEY;
	
	try {
		const data = jwt.verify(token, key);
		
		return data.username;
	} catch (err) {
		throw new InvalidTokenError();
	}
}
