import express, { type Express, type ErrorRequestHandler } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import ErrorHandler from "./controllers/ErrorHandler.js";
import chatsRouter from "./controllers/Chats.js";
import tokensRouter from "./controllers/Tokens.js";
import usersRouter from "./controllers/Users.js";

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");

const internalError: ErrorRequestHandler = (err, _req, res, _next) => {
	res.status(500).send("Internal server error");
	console.log(err);
};

/**
 * Builds and returns the configured Express application with no side effects:
 * it does not load configuration, connect to MongoDB or Firebase, or open a
 * listener. All boot logic lives in server.ts. Keeping the app a pure factory
 * makes it importable by tests (e.g. supertest) without spinning up the world.
 */
export function createApp(): Express {
	const app = express();

	// Allow cross-origin resource sharing.
	app.use(cors());

	// Parse JSON and url-encoded bodies (Express's built-in parsers).
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

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
	app.use(internalError);

	return app;
}
