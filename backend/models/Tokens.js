import { getUserPassByUsername } from "./DatabaseConnector.js";
import jwt from "jsonwebtoken";

export class InvalidCredentialsError extends Error {}
export class InvalidTokenError extends Error {}

const key = process.env.JWT_KEY;

export async function getToken(username, password) {
	const users = await getUserPassByUsername(username);
	if (users.length === 0) {
		throw new InvalidCredentialsError();
	}
	const user = users[0];
	if (user.password !== password) {
		throw new InvalidCredentialsError();
	}
	
	const token = jwt.sign({username: username}, key);
	
	return token;
}

export async function getUsernameFromToken(token) {
	try {
		const data = jwt.verify(token, key);
		
		return data.username;
	} catch (err) {
		throw new InvalidTokenError();
	}
}
