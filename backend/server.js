import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { startMongoDB } from "./models/DatabaseConnector.js";

import chatsRouter from "./controllers/Chats.js";
import tokensRouter from "./controllers/Tokens.js";
import usersRouter from "./controllers/Users.js";

config();

// Make sure that the process.env values are set properly if not defined in dotenv.
if (!process.env.JWT_KEY) {
	process.env.JWT_KEY = "default";
}
if (!process.env.PORT) {
	process.env.PORT = 5000;
}

await startMongoDB();
console.log("Connected to the database.");

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.text({type: "application/json"}));
app.use(bodyParser.urlencoded({ extended: true }));

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

app.use("/", express.static("../chat-app/build/"));
app.use("/api/Chats", chatsRouter);
app.use("/api/Tokens", tokensRouter);
app.use("/api/Users", usersRouter);

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}/`);
});
