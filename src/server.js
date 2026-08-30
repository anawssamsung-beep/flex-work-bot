import "dotenv/config";
import express from "express";
import kakaoRouter from "./routes/kakao.js";

const app = express();

app.use(
    express.json()
);


app.use(
    "/kakao",
    kakaoRouter
);
app.get("/check", (req, res) => {
  res.json({
    success: true,
    service: "flex-work-bot",
    message: "server is running"
  });
});

const PORT =
    process.env.PORT || 3000;


app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);