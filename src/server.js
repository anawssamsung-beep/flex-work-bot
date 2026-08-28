import express from "express";

import dotenv from "dotenv";

import kakaoRouter
  from "./routes/kakao.js";


dotenv.config();


const app =
  express();


app.use(
  express.json()
);


app.use(
  "/kakao",
  kakaoRouter
);


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