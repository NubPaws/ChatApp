import express from "express";
import { config } from "dotenv";
import { startMongoDB } from "./models/DatabaseConnector";

config();
await startMongoDB();

const app = express();
const PORT = 5000;

app.use("/", express.static("../chat-app/build/"));

app.listen(PORT);
