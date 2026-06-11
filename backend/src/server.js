import http from "http";
import { config } from "dotenv";
import { Server } from "socket.io";
import { createApp } from "./App.js";
import { startMongoDB } from "./models/DatabaseConnector.js";
import { initFirebase } from "./models/FirebaseConnector.js";
import { onConnect } from "./controllers/ServerHandler.js";

config();

// Make sure that the process.env values are set properly if not defined in dotenv.
if (!process.env.JWT_KEY) {
	process.env.JWT_KEY = "default";
}
if (!process.env.PORT) {
	process.env.PORT = 5000;
}

// Setup firebase.
initFirebase();
console.log("Initialized Firebase Connection.");

// Connect to the MongoDB server.
await startMongoDB();
console.log("Connected to the database.");

// Build the express app and wire it to an HTTP server + socket.io.
const app = createApp();
const PORT = process.env.PORT;

const httpServer = http.createServer(app);
const io = new Server(httpServer);
io.on("connection", onConnect);

httpServer.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}/`);
});
