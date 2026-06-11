// Central place for the backend base URLs and endpoint builders. The URLs come
// from Vite env vars (VITE_API_URL / VITE_SOCKET_URL) and fall back to the local
// dev server.

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

/** Base URL for the socket.io connection. */
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:5000";

export const tokensUrl = (): string => `${API_URL}/api/Tokens`;
export const usersUrl = (): string => `${API_URL}/api/Users`;
export const userUrl = (username: string): string => `${API_URL}/api/Users/${username}`;
export const chatsUrl = (): string => `${API_URL}/api/Chats`;
export const messagesUrl = (chatId: number | string): string =>
	`${API_URL}/api/Chats/${chatId}/Messages/`;
