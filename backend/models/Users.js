import { User, UserPass, UserPassName, getUserByUsername, getUserPassByUsername } from "./DatabaseConnector.js";

export class UserAlreadyExistsError extends Error {}
export class InvalidPasswordError extends Error {}
export class UserDoesNotExistsError extends Error {}
export class InvalidUsernameError extends Error {}

async function addUserToDatabase(username, password, displayName, profilePic) {
	await UserPassName.create({
		username: username,
		password: password,
		displayName: displayName,
		profilePic: profilePic,
	});
	
	await UserPass.create({
		username: username,
		password: password,
	});
	
	await User.create({
		username: username,
		displayName: displayName,
		profilePic: profilePic,
	});
}

export async function addUser(username, password, displayName, profilePic) {
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
	
	const user = users[0].toObject();
	delete user._id;
	delete user.__v;
	return user;
}
