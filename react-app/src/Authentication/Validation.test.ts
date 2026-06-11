import {
	validateUsername,
	validatePassword,
	validateConfirmPassword,
	validateDisplayName,
} from "./Validation.js";

describe("validateUsername", () => {
	it("rejects usernames shorter than 4 characters", () => {
		expect(validateUsername("abc")).toBeTruthy();
	});
	it("accepts usernames of 4+ characters", () => {
		expect(validateUsername("abcd")).toBeNull();
	});
});

describe("validatePassword", () => {
	it("rejects passwords shorter than 8 characters", () => {
		expect(validatePassword("short")).toBeTruthy();
	});
	it("accepts passwords of 8+ characters", () => {
		expect(validatePassword("password123")).toBeNull();
	});
});

describe("validateConfirmPassword", () => {
	it("rejects mismatched passwords", () => {
		expect(validateConfirmPassword("password123", "different123")).toBe("Passwords do not match");
	});
	it("rejects a confirmation shorter than 8 characters", () => {
		expect(validateConfirmPassword("short", "short")).toBeTruthy();
	});
	it("accepts a matching, long-enough confirmation", () => {
		expect(validateConfirmPassword("password123", "password123")).toBeNull();
	});
});

describe("validateDisplayName", () => {
	it("rejects an empty display name", () => {
		expect(validateDisplayName("")).toBeTruthy();
	});
	it("accepts a non-empty display name", () => {
		expect(validateDisplayName("Alice")).toBeNull();
	});
});
