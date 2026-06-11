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

describe("POST /api/Users", () => {
	it("registers a user and returns the public shape", async () => {
		const res = await postJson(app, "/api/Users", {
			username: "alice",
			password: "password123",
			displayName: "Alice",
			profilePic: "a.png",
		});
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ username: "alice", displayName: "Alice", profilePic: "a.png" });
	});

	it("returns 400 with field errors when a field is missing", async () => {
		const res = await postJson(app, "/api/Users", { username: "alice" });
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("password");
	});

	it("returns 409 when the user already exists", async () => {
		const body = {
			username: "alice",
			password: "password123",
			displayName: "Alice",
			profilePic: "a.png",
		};
		await postJson(app, "/api/Users", body);
		const res = await postJson(app, "/api/Users", body);
		expect(res.status).toBe(409);
	});
});

describe("GET /api/Users/:username", () => {
	it("returns 403 without an Authorization header", async () => {
		const res = await request(app).get("/api/Users/alice");
		expect(res.status).toBe(403);
	});

	it("returns the user for a token whose username matches the path", async () => {
		await postJson(app, "/api/Users", {
			username: "alice",
			password: "password123",
			displayName: "Alice",
			profilePic: "a.png",
		});
		const tokenRes = await postJson(app, "/api/Tokens", {
			username: "alice",
			password: "password123",
		});
		const token = tokenRes.text;

		const res = await request(app)
			.get("/api/Users/alice")
			.set("Authorization", `Bearer ${token}`);
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ username: "alice", displayName: "Alice", profilePic: "a.png" });
	});
});
