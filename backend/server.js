import express from "express";

const app = express();
const PORT = 5000;

app.use("/", express.static("../chat-app/build/"));



app.listen(PORT);
