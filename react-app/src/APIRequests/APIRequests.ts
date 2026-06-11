import { userUrl } from "../config/api.js";
import type { UserPublic } from "@chatapp/shared";

/** Fetches a user's public details, or null if the request was unsuccessful. */
export async function getUserDetails(username: string, token: string): Promise<UserPublic | null> {
	const res = await fetch(userUrl(username), {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
	});
	if (!res.ok) {
		return null;
	}
	return (await res.json()) as UserPublic;
}
