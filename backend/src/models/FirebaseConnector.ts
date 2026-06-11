import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { readFileSync } from "fs";

let initialized = false;

/**
 * Loads Firebase service account credentials, in priority order:
 *   1. FIREBASE_SERVICE_ACCOUNT_JSON  - inline JSON string
 *   2. GOOGLE_APPLICATION_CREDENTIALS - path to a JSON key file
 *   3. ./serviceAccountKey.json       - gitignored local file
 * Returns null when no credentials are available.
 */
function loadServiceAccount(): ServiceAccount | null {
	const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
	if (inline) {
		return JSON.parse(inline) as ServiceAccount;
	}

	const file = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "serviceAccountKey.json";
	try {
		return JSON.parse(readFileSync(file, "utf-8")) as ServiceAccount;
	} catch {
		return null;
	}
}

/**
 * Initializes the Firebase Admin SDK when credentials are available. If none are
 * found it logs a warning and skips initialization, so the server (and tests)
 * can run without Firebase Cloud Messaging configured.
 */
export function initFirebase(): void {
	if (initialized) {
		return;
	}

	const serviceAccount = loadServiceAccount();
	if (!serviceAccount) {
		console.warn("Firebase credentials not found; push notifications are disabled.");
		return;
	}

	initializeApp({ credential: cert(serviceAccount) });
	initialized = true;
}
