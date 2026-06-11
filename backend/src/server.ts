import http from "http";
import { Server } from "socket.io";
import { config } from "./config.js";
import { createApp } from "./App.js";
import { startMongoDB } from "./models/DatabaseConnector.js";
import { initFirebase } from "./models/FirebaseConnector.js";
import { onConnect } from "./controllers/ServerHandler.js";
import type { ClientToServerEvents, ServerToClientEvents } from "@chatapp/shared";

// Set up Firebase (no-op with a warning if no credentials are configured).
initFirebase();
console.log("Initialized Firebase Connection.");

// Connect to the MongoDB server.
await startMongoDB();
console.log("Connected to the database.");

// Build the express app and wire it to an HTTP server + socket.io.
const app = createApp();

const httpServer = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);
io.on("connection", onConnect);

httpServer.listen(config.port, () => {
	console.log(`Listening on http://localhost:${config.port}/`);
});
