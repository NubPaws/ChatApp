import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { startTestDb, stopTestDb, clearTestDb } from "../test/setupDb.js";
import {
	addUser,
	getUser,
	UserAlreadyExistsError,
	InvalidUsernameError,
	InvalidPasswordError,
	UserDoesNotExistsError,
} from "./Users.js";

beforeAll(startTestDb);
afterAll(stopTestDb);
afterEach(clearTestDb);

describe("addUser", () => {
	it("creates a user and returns the public shape", async () => {
		const result = await addUser("alice", "password123", "Alice", "alice.png");
		expect(result).toEqual({
			username: "alice",
			displayName: "Alice",
			profilePic: "alice.png",
		});
	});

	it("throws UserAlreadyExistsError for a duplicate username", async () => {
		await addUser("alice", "password123", "Alice", "alice.png");
		await expect(addUser("alice", "password123", "Alice", "alice.png")).rejects.toBeInstanceOf(
			UserAlreadyExistsError,
		);
	});

	it("rejects a username shorter than 4 characters", async () => {
		await expect(addUser("abc", "password123", "A", "p.png")).rejects.toBeInstanceOf(
			InvalidUsernameError,
		);
	});

	it("rejects a password shorter than 8 characters", async () => {
		await expect(addUser("alice", "short", "Alice", "p.png")).rejects.toBeInstanceOf(
			InvalidPasswordError,
		);
	});
});

describe("getUser", () => {
	it("returns the public user without Mongo metadata", async () => {
		await addUser("bobby", "password123", "Bob", "bob.png");
		const user = await getUser("bobby");
		expect(user).toEqual({ username: "bobby", displayName: "Bob", profilePic: "bob.png" });
		expect(user._id).toBeUndefined();
		expect(user.__v).toBeUndefined();
	});

	it("throws UserDoesNotExistsError for an unknown user", async () => {
		await expect(getUser("ghost")).rejects.toBeInstanceOf(UserDoesNotExistsError);
	});
});
