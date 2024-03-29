import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { config } from "dotenv";
import { startMongoDB } from "./models/DatabaseConnector.js";
import ErrorHandler from "./controllers/ErrorHandler.js";
import chatsRouter from "./controllers/Chats.js";
import tokensRouter from "./controllers/Tokens.js";
import usersRouter from "./controllers/Users.js";
import { onConnect } from "./controllers/ServerHandler.js";
import { initFirebase } from "./models/FirebaseConnector.js";

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
console.log("Initizlied Firebase Connection.")

// Connect to the MongoDB server.
await startMongoDB();
console.log("Connected to the database.");

// Create the express app.
const app = express();
const PORT = process.env.PORT;

// Allow cross-origin resource sharing.
app.use(cors());

// Use the body parsers.
app.use(bodyParser.text({type: "application/json"}));
app.use(bodyParser.urlencoded({ extended: true }));

// Create middleware to handle loading data from the body.
app.use((req, res, next) => {
	if (req.headers["content-type"] !== "application/json") {
		next();
		return;
	}
	try {
		req.body = JSON.parse(req.body);
	} catch (err) {
		req.body = {};
	}
	next();
})

// Load the routes.
const site = express.static("public/");
app.use("/", site);
app.use("/chat", site);
app.use("/login", site);
app.use("/register", site);
app.use("/api/Chats", chatsRouter);
app.use("/api/Tokens", tokensRouter);
app.use("/api/Users", usersRouter);

// Error handling middleware.
app.use(ErrorHandler.tokens);
app.use(ErrorHandler.chats);
app.use(ErrorHandler.users);

// Define a catch-all error handler.
app.use((err, req, res, next) => {
	res.status(500).send("Internal server error");
	console.log(err);
});

// Start listening.
const httpServer = http.createServer(app);
const io = new Server(httpServer);
io.on("connection", onConnect);

httpServer.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}/`);
});
