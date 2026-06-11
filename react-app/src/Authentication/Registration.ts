import { usersUrl } from "../config/api.js";
import type { Dispatch, SetStateAction } from "react";

/** Reads a File into a base64 data URL. */
export function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

/**
 * Registers a new user. Validation of the inputs happens in the calling
 * component; this only encodes the picture and performs the request.
 */
export async function registerUser(
	username: string,
	password: string,
	displayName: string,
	profilePicture: File | null,
	setShowSuccessMessage: Dispatch<SetStateAction<boolean>>,
	setShowErrorMessage: Dispatch<SetStateAction<boolean>>,
	setShowConnectionErrorMessage: Dispatch<SetStateAction<boolean>>,
): Promise<void> {
	const base64ProfileImage = profilePicture ? await convertImageToBase64(profilePicture) : "";

	let res: Response;
	try {
		res = await fetch(usersUrl(), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password, displayName, profilePic: base64ProfileImage }),
		});
	} catch (error) {
		if (error instanceof TypeError) {
			setShowConnectionErrorMessage(true);
		}
		return;
	}

	if (res.status !== 200) {
		setShowErrorMessage(true);
	} else {
		setShowSuccessMessage(true);
	}
}
