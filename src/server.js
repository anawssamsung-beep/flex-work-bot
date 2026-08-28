import express from "express";
import dotenv from "dotenv";

import kakaoRouter from "./routes/kakao.js";
import flexRouter from "./routes/flex.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "flex-work-bot",
    message: "server is running"
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString()
  });
});

app.use("/api/kakao", kakaoRouter);
app.use("/api/flex", flexRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});