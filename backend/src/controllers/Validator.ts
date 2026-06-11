import type { Response } from "express";
import type { ApiFieldError } from "@chatapp/shared";

/**
 * Whether `thing` is "empty": null/undefined, an empty or whitespace-only
 * string, or an object with no own keys.
 */
export function isEmpty(thing: unknown): boolean {
	return (
		thing == null ||
		(typeof thing === "string" && thing.trim().length === 0) ||
		(typeof thing === "object" && Object.keys(thing).length === 0)
	);
}

/**
 * Checks that every value in `items` is non-empty. If any are empty, responds
 * 400 with a `{ field: message }` map and returns true; otherwise returns false.
 */
export function generateError(items: Record<string, unknown>, res: Response): boolean {
	const error: ApiFieldError = {};
	for (const key in items) {
		if (isEmpty(items[key])) {
			error[key] = `The ${key} field is required.`;
		}
	}
	if (Object.keys(error).length === 0) {
		return false;
	}
	res.status(400).json(error);
	return true;
}
