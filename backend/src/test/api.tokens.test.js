import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from "vitest";
import { startTestDb, stopTestDb, clearTestDb } from "./setupDb.js";
import { postJson } from "./http.js";
import { createApp } from "../App.js";

const app = createApp();

beforeAll(startTestDb);
afterAll(stopTestDb);
afterEach(clearTestDb);
beforeEach(async () => {
	process.env.JWT_KEY = "test-secret";
	await postJson(app, "/api/Users", {
		username: "alice",
		password: "password123",
		displayName: "Alice",
		profilePic: "a.png",
	});
});

describe("POST /api/Tokens", () => {
	it("returns a JWT for valid credentials", async () => {
		const res = await postJson(app, "/api/Tokens", {
			username: "alice",
			password: "password123",
		});
		expect(res.status).toBe(200);
		// A JWT is three dot-separated base64url segments.
		expect(res.text.split(".")).toHaveLength(3);
	});

	it("returns 400 for an incorrect password", async () => {
		const res = await postJson(app, "/api/Tokens", {
			username: "alice",
			password: "wrong-password",
		});
		expect(res.status).toBe(400);
		expect(res.text).toBe("Incorrect username and/or password");
	});

	it("returns 400 with field errors for a missing field", async () => {
		const res = await postJson(app, "/api/Tokens", { username: "alice" });
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("password");
	});
});
