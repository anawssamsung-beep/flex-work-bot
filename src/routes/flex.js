import express from "express";

import { getNextWeekInfo } from "../services/flexService.js";

const router = express.Router();

router.get("/next-week", (req, res) => {

  res.json({
    success: true,
    data: getNextWeekInfo()
  });

});

export default router;