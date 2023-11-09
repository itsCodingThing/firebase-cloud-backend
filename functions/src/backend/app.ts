import express from "express";
import cors from "cors";
import morgan from "morgan";

import questionRouter from "./routes/question";
import convertRouter from "./routes/convert";
import libraryRouter from "./routes/library";
import { errorHandler } from "./utils/errorHandlers";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/api/question", questionRouter);
app.use("/api/convert", convertRouter);
app.use("/api/library", libraryRouter);

app.get("/", (req, res) => {
    res.send("ClassInPocket Backend");
});

app.use(errorHandler);

export default app;
