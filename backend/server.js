import express from "express";
import { config } from "dotenv";
import { startMongoDB } from "./models/DatabaseConnector.js";

import usersRouter from "./controllers/Users.js";
import tokensRouter from "./controllers/Tokens.js";
import chatsRouter from "./controllers/Chats.js";

config();

await startMongoDB();
console.log("Connected to the database.");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static("../chat-app/build/"));
app.use("/api/Chats", chatsRouter);
app.use("/api/Tokens", tokensRouter);
app.use("/api/Users", usersRouter);

app.listen(PORT);
console.log(`Listening on http://localhost:${PORT}/`);
