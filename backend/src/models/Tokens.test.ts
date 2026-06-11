import { describe, it, expect, vi, beforeEach } from "vitest";

// Keep this a unit test by mocking the database layer Tokens depends on.
vi.mock("./DatabaseConnector.js", () => ({
	getUserPassByUsername: vi.fn(),
}));

import { getUserPassByUsername } from "./DatabaseConnector.js";
import {
	getToken,
	getUsernameFromToken,
	InvalidCredentialsError,
	InvalidTokenError,
} from "./Tokens.js";

beforeEach(() => {
	process.env.JWT_KEY = "test-secret";
	vi.clearAllMocks();
});

describe("getToken / getUsernameFromToken", () => {
	it("round-trips the username through a signed token for valid credentials", async () => {
		getUserPassByUsername.mockResolvedValue([
			{ toObject: () => ({ username: "alice", password: "password123" }) },
		]);

		const token = await getToken("alice", "password123");

		expect(typeof token).toBe("string");
		expect(getUsernameFromToken(token)).toBe("alice");
	});

	it("throws InvalidCredentialsError when the user does not exist", async () => {
		getUserPassByUsername.mockResolvedValue([]);
		await expect(getToken("ghost", "whatever")).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("throws InvalidCredentialsError when the password is wrong", async () => {
		getUserPassByUsername.mockResolvedValue([
			{ toObject: () => ({ username: "alice", password: "right-password" }) },
		]);
		await expect(getToken("alice", "wrong-password")).rejects.toBeInstanceOf(
			InvalidCredentialsError,
		);
	});

	it("throws InvalidTokenError for a malformed token", () => {
		expect(() => getUsernameFromToken("not-a-real-jwt")).toThrow(InvalidTokenError);
	});
});
