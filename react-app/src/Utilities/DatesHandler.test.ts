import { createDateString, createTimeString, compareDates } from "./DatesHandler.js";

// Date strings without a timezone are parsed as local time, so getHours()/etc.
// are deterministic regardless of the machine's timezone.
describe("createTimeString", () => {
	it("returns an empty string for empty input", () => {
		expect(createTimeString("")).toBe("");
	});

	it("formats HH:MM zero-padded", () => {
		expect(createTimeString("2024-01-15T09:05:00")).toBe("09:05");
		expect(createTimeString("2024-01-15T13:30:00")).toBe("13:30");
	});
});

describe("createDateString", () => {
	it("returns an empty string for empty input", () => {
		expect(createDateString("")).toBe("");
	});

	it("formats time plus zero-padded DD/MM/YYYY", () => {
		expect(createDateString("2024-01-05T09:05:00")).toBe("09:05 05/01/2024");
	});
});

describe("compareDates", () => {
	it("sorts the more recent date first", () => {
		expect(compareDates("2024-01-02T00:00:00", "2024-01-01T00:00:00")).toBe(-1);
		expect(compareDates("2024-01-01T00:00:00", "2024-01-02T00:00:00")).toBe(1);
	});

	it("treats equal dates as 0", () => {
		expect(compareDates("2024-01-01T00:00:00", "2024-01-01T00:00:00")).toBe(0);
	});

	it("treats empty as the epoch (sorts last)", () => {
		expect(compareDates("", "2024-01-01T00:00:00")).toBe(1);
	});
});
