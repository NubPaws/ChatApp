import { describe, it, expect, vi } from "vitest";
import { isEmpty, generateError } from "./Validator.js";

describe("isEmpty", () => {
	it("treats null and undefined as empty", () => {
		expect(isEmpty(null)).toBe(true);
		expect(isEmpty(undefined)).toBe(true);
	});

	it("treats empty and whitespace-only strings as empty", () => {
		expect(isEmpty("")).toBe(true);
		expect(isEmpty("   ")).toBe(true);
	});

	it("treats an object with no own keys as empty", () => {
		expect(isEmpty({})).toBe(true);
	});

	it("treats a non-empty string as non-empty", () => {
		expect(isEmpty("hello")).toBe(false);
	});
});

describe("generateError", () => {
	function mockRes() {
		const res = {};
		res.status = vi.fn(() => res);
		res.json = vi.fn(() => res);
		return res;
	}

	it("returns false and leaves the response untouched when every field is present", () => {
		const res = mockRes();
		expect(generateError({ username: "bob", password: "secret" }, res)).toBe(false);
		expect(res.status).not.toHaveBeenCalled();
		expect(res.json).not.toHaveBeenCalled();
	});

	it("responds 400 with a per-field message and returns true when a field is empty", () => {
		const res = mockRes();
		expect(generateError({ username: "", password: "secret" }, res)).toBe(true);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ username: "The username field is required." });
	});

	it("reports every empty field at once", () => {
		const res = mockRes();
		generateError({ username: "", password: "", displayName: "Bob" }, res);
		expect(res.json).toHaveBeenCalledWith({
			username: "The username field is required.",
			password: "The password field is required.",
		});
	});
});
