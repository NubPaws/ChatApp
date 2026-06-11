import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from "vitest";
import request from "supertest";
import { startTestDb, stopTestDb, clearTestDb } from "./setupDb.js";
import { postJson } from "./http.js";
import { createApp } from "../App.js";

const app = createApp();

beforeAll(startTestDb);
afterAll(stopTestDb);
afterEach(clearTestDb);
beforeEach(() => {
	process.env.JWT_KEY = "test-secret";
});

/** Registers a user and returns their auth token. */
async function registerAndLogin(username) {
	await postJson(app, "/api/Users", {
		username,
		password: "password123",
		displayName: username,
		profilePic: `${username}.png`,
	});
	const res = await postJson(app, "/api/Tokens", { username, password: "password123" });
	return res.text;
}

describe("Chats API authentication", () => {
	it("returns 403 when no Authorization header is present", async () => {
		const res = await request(app).get("/api/Chats");
		expect(res.status).toBe(403);
	});

	it("rejects a raw token without the 'Bearer ' prefix (regression: header is split on space)", async () => {
		const token = await registerAndLogin("alice");
		const res = await request(app).get("/api/Chats").set("Authorization", token);
		expect(res.status).toBe(401);
	});
});

describe("Chats API flow", () => {
	it("creates a chat, lists it, sends a message, and reads it back", async () => {
		const aliceToken = await registerAndLogin("alice");
		await registerAndLogin("bobby");
		const auth = { Authorization: `Bearer ${aliceToken}` };

		// Open a chat with bob.
		let res = await postJson(app, "/api/Chats", { username: "bobby" }, auth);
		expect(res.status).toBe(200);

		// It shows up in alice's chat list.
		res = await request(app).get("/api/Chats").set(auth);
		expect(res.status).toBe(200);
		expect(res.body).toHaveLength(1);
		expect(res.body[0].user.username).toBe("bobby");
		const chatId = res.body[0].id;

		// Send a message.
		res = await postJson(app, `/api/Chats/${chatId}/Messages`, { msg: "hello bob" }, auth);
		expect(res.status).toBe(200);
		expect(res.body.content).toBe("hello bob");

		// Read the message history.
		res = await request(app).get(`/api/Chats/${chatId}/Messages`).set(auth);
		expect(res.status).toBe(200);
		expect(res.body).toHaveLength(1);
		expect(res.body[0].content).toBe("hello bob");
	});

	it("returns 406 when trying to open a chat with yourself", async () => {
		const aliceToken = await registerAndLogin("alice");
		const res = await postJson(
			app,
			"/api/Chats",
			{ username: "alice" },
			{ Authorization: `Bearer ${aliceToken}` },
		);
		expect(res.status).toBe(406);
	});
});
