import type { UserPublic } from "@chatapp/shared";

/** The logged-in user plus their bearer token (token is `"Bearer <jwt>"`). */
export type UserCredentials = UserPublic & { token: string };

/** The chat currently open in the chat window. */
export interface ActiveChat {
	username: string;
	displayName: string;
	profilePic: string;
	chatId: number;
}
