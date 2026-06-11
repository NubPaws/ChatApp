/**
 * socket.io event contract shared by the backend (socket.io server) and the
 * web client (socket.io-client), plus the Firebase Cloud Messaging payload
 * shape used for Android push delivery.
 */

/**
 * Payload broadcast by the server on the `"receive"` event. `timestamp` is an
 * ISO date string on the wire (socket.io serializes the server's `Date` via
 * JSON). `sender` is the sender's username.
 */
export interface ReceivePayload {
  sender: string;
  content: string;
  timestamp: string;
}

/** Events the server emits to connected clients. */
export interface ServerToClientEvents {
  receive: (payload: ReceivePayload) => void;
}

/** Events the client emits to the server. The client currently sends none. */
export interface ClientToServerEvents {
  // No client -> server events are defined.
}

/** Query string supplied by the client on the socket handshake. */
export interface SocketHandshakeQuery {
  username: string;
}

/**
 * Data payload of the Firebase Cloud Messaging push sent to Android clients.
 * FCM requires every value to be a string. Defined as a type alias (rather than
 * an interface) so it carries an implicit index signature and is assignable to
 * firebase-admin's `{ [key: string]: string }` message data type.
 */
export type FcmDataPayload = {
  chatId: string;
  sender: string;
  displayName: string;
  content: string;
  timestamp: string;
};
