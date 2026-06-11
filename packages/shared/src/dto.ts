/**
 * Data Transfer Objects describing the REST API contract between the ChatApp
 * backend and its clients (web + Android). These mirror exactly what the
 * Express controllers send and receive, so changing a shape here surfaces as a
 * compile error on whichever side falls out of sync.
 */

/** Public-facing user shape (no password, no Mongo metadata). */
export interface UserPublic {
  username: string;
  displayName: string;
  profilePic: string;
}

/** Body of `POST /api/Users` (registration). */
export interface RegisterRequest {
  username: string;
  password: string;
  displayName: string;
  profilePic: string;
}

/** Response of `POST /api/Users`. */
export type RegisterResponse = UserPublic;

/** Body of `POST /api/Tokens` (login). */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Response of `POST /api/Tokens`: the raw JWT, sent as a plain string via
 * `res.send(token)` — it is NOT wrapped in a JSON object.
 */
export type LoginResponse = string;

/**
 * A chat message. `created` is an ISO date string once serialized to JSON
 * (it is a `Date` on the server prior to serialization).
 */
export interface Message {
  id: number;
  created: string;
  content: string;
}

/**
 * A message including its full sender. Returned by `POST /api/Chats/:id/Messages`
 * and embedded in the `messages` array of `GET /api/Chats/:id`.
 */
export interface MessageWithSender extends Message {
  sender: UserPublic;
}

/**
 * A message whose sender has been reduced to just the username. This is the
 * shape returned by `GET /api/Chats/:id/Messages`.
 */
export interface MessageWithSenderUsername extends Message {
  sender: Pick<UserPublic, "username">;
}

/** An item of `GET /api/Chats`: the other user plus the chat's last message. */
export interface ChatSummary {
  id: number;
  user: UserPublic;
  lastMessage: Message | null;
}

/** Response of `GET /api/Chats/:id`: both users and the full message history. */
export interface ChatDetail {
  id: number;
  users: UserPublic[];
  messages: MessageWithSender[] | null;
}

/** Body of `POST /api/Chats` (open a chat with another user). */
export interface CreateChatRequest {
  username: string;
}

/** Body of `POST /api/Chats/:id/Messages`. */
export interface SendMessageRequest {
  msg: string;
}

/**
 * 400 response body produced by the request validator: a map from each missing
 * field name to a human-readable message.
 */
export type ApiFieldError = Record<string, string>;
