import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import ErrorHandler from "./controllers/ErrorHandler.js";
import chatsRouter from "./controllers/Chats.js";
import tokensRouter from "./controllers/Tokens.js";
import usersRouter from "./controllers/Users.js";

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");

/**
 * Builds and returns the configured Express application with no side effects:
 * it does not load dotenv, connect to MongoDB or Firebase, or open a listener.
 * All boot logic lives in server.js. Keeping the app a pure factory makes it
 * importable by tests (e.g. supertest) without spinning up the world.
 *
 * @returns {import("express").Express} The configured Express app.
 */
export function createApp() {
	const app = express();

	// Allow cross-origin resource sharing.
	app.use(cors());

	// Use the body parsers.
	app.use(bodyParser.text({ type: "application/json" }));
	app.use(bodyParser.urlencoded({ extended: true }));

	// Parse a JSON body that was read as text by the parser above.
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
	});

	// Serve the React build for the web client routes.
	const site = express.static(publicDir);
	app.use("/", site);
	app.use("/chat", site);
	app.use("/login", site);
	app.use("/register", site);

	// API routes.
	app.use("/api/Chats", chatsRouter);
	app.use("/api/Tokens", tokensRouter);
	app.use("/api/Users", usersRouter);

	// Domain error-handling middleware.
	app.use(ErrorHandler.tokens);
	app.use(ErrorHandler.chats);
	app.use(ErrorHandler.users);

	// Catch-all error handler.
	app.use((err, req, res, next) => {
		res.status(500).send("Internal server error");
		console.log(err);
	});

	return app;
}
