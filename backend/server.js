import express from "express";
import { config } from "dotenv";
import { startMongoDB } from "./models/DatabaseConnector.js";

import usersRouter from "./controllers/User.js";
import tokensRouter from "./controllers/Tokens.js";

config();

await startMongoDB();
console.log("Connected to the database.");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static("../chat-app/build/"));
app.use("/api/Users", usersRouter);
app.use("/api/Tokens", tokensRouter);

app.listen(PORT);
console.log(`Listening on http://localhost:${PORT}/`);
