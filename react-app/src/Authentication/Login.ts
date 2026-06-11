import { getUserDetails } from "../APIRequests/APIRequests.js";
import { tokensUrl } from "../config/api.js";
import type { Dispatch, SetStateAction } from "react";
import type { UserCredentials } from "../types.js";

/**
 * Logs a user in: requests a token, then fetches the user's details and stores
 * the credentials. Validation of the inputs happens in the calling component.
 */
export async function loginUser(
	username: string,
	password: string,
	setShowErrorMessage: Dispatch<SetStateAction<boolean>>,
	setShowConnectionErrorMessage: Dispatch<SetStateAction<boolean>>,
	setUserCredentials: Dispatch<SetStateAction<UserCredentials | null>>,
): Promise<void> {
	let res: Response;
	try {
		res = await fetch(tokensUrl(), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});
	} catch (error) {
		if (error instanceof TypeError) {
			setShowConnectionErrorMessage(true);
		}
		return;
	}

	if (res.status !== 200) {
		setShowErrorMessage(true);
		return;
	}

	const token = await res.text();
	const userDetails = await getUserDetails(username, "Bearer " + token);
	if (userDetails !== null) {
		setUserCredentials({ token: "Bearer " + token, ...userDetails });
	}
}
