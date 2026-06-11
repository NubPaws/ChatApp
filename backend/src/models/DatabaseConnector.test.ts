import { describe, it, expect } from "vitest";
import { getNextChatId, getNextMessageId } from "./DatabaseConnector.js";

// These counters are pure module-level state and need no database connection.
describe("ID counters", () => {
	it("getNextChatId increments monotonically", () => {
		const first = getNextChatId();
		const second = getNextChatId();
		expect(second).toBe(first + 1);
	});

	it("getNextMessageId increments monotonically", () => {
		const first = getNextMessageId();
		const second = getNextMessageId();
		expect(second).toBe(first + 1);
	});
});
