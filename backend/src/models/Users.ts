import { User, UserPass, UserPassName, getUserByUsername, getUserPassByUsername } from "./DatabaseConnector.js";
import type { UserPublic } from "@chatapp/shared";

export class UserAlreadyExistsError extends Error {}
export class InvalidPasswordError extends Error {}
export class UserDoesNotExistsError extends Error {}
export class InvalidUsernameError extends Error {}

async function addUserToDatabase(
	username: string,
	password: string,
	displayName: string,
	profilePic: string,
): Promise<void> {
	await UserPassName.create({ username, password, displayName, profilePic });
	await UserPass.create({ username, password });
	await User.create({ username, displayName, profilePic });
}

/**
 * Registers a new user across the three user collections.
 * @throws {UserAlreadyExistsError} If the username is taken.
 * @throws {InvalidUsernameError} If the username is shorter than 4 characters.
 * @throws {InvalidPasswordError} If the password is shorter than 8 characters.
 */
export async function addUser(
	username: string,
	password: string,
	displayName: string,
	profilePic: string,
): Promise<UserPublic> {
	const users = await getUserPassByUsername(username);
	if (users.length > 0) {
		throw new UserAlreadyExistsError();
	}

	if (username.length < 4) {
		throw new InvalidUsernameError();
	}

	if (password.length < 8) {
		throw new InvalidPasswordError();
	}

	await addUserToDatabase(username, password, displayName, profilePic);

	return { username, displayName, profilePic };
}

/**
 * Returns the public user record (without Mongo metadata).
 * @throws {UserDoesNotExistsError} If no such user exists.
 */
export async function getUser(username: string): Promise<UserPublic> {
	const users = await getUserByUsername(username);
	if (users.length === 0) {
		throw new UserDoesNotExistsError();
	}

	const user = users[0];
	return {
		username: user.username,
		displayName: user.displayName,
		profilePic: user.profilePic,
	};
}
