import { getUserByUsername, getUserPassByUsername, addUserToDatabase } from "./DatabaseConnector.js";
import jwt from "jsonwebtoken";

export class UserAlreadyExistsError extends Error {}
export class InvalidPasswordError extends Error {}
export class UserDoesNotExistsError extends Error {}

export async function addUser(username, password, displayName, profilePic) {
	const users = await getUserPassByUsername(username);
	if (users.length > 0) {
		throw new UserAlreadyExistsError();
	}
	
	if (password.length < 8) {
		throw new InvalidPasswordError();
	}
	
	await addUserToDatabase(username, password, displayName, profilePic);
	
	return {
		username: username,
		displayName: displayName,
		profilePic: profilePic,
	};
}

export async function getUser(username) {
	const users = await getUserByUsername(username);
	
	if (users.length === 0) {
		throw new UserDoesNotExistsError();
	}
	
	const user = users[0];
	return {
		username: user.username,
		displayName: user.displayName,
		profilePic: user.profilePic,
	}
}
