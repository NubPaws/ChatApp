import { getUserPassByUsername } from "./DatabaseConnector.js";
import jwt from "jsonwebtoken";

export class InvalidCredentialsError extends Error {}
export class InvalidTokenError extends Error {}

export async function getToken(username, password) {
	const users = await getUserPassByUsername(username);
	if (users.length === 0) {
		throw new InvalidCredentialsError();
	}
	const user = users[0].toObject();
	if (user.password !== password) {
		throw new InvalidCredentialsError();
	}
	
	const key = process.env.JWT_KEY;
	let token;
	try {
		token = jwt.sign({username: username}, key);
	} catch (err) {
		console.log(err);
	}
	
	return token;
}

export async function getUsernameFromToken(token) {
	const key = process.env.JWT_KEY;
	
	try {
		const data = jwt.verify(token, key);
		
		return data.username;
	} catch (err) {
		throw new InvalidTokenError();
	}
}
