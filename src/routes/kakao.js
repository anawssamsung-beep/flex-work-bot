import express from "express";
import { getNextWeekInfo } from "../services/flexService.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {

  try {

    const week = getNextWeekInfo();

    const response = {
      version: "2.0",

      template: {
        outputs: [
          {
            carousel: {
              type: "basicCard",

              items: [
                createCard(
                  "월요일",
                  week.monday.date,
                  week.monday.available
                ),

                createCard(
                  "수요일",
                  week.wednesday.date,
                  week.wednesday.available
                ),

                createCard(
                  "금요일",
                  week.friday.date,
                  week.friday.available
                )
              ]
            }
          }
        ]
      }
    };

    res.json(response);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: "처리 중 오류가 발생했습니다."
            }
          }
        ]
      }
    });
  }
});

function createCard(dayName, date, available) {

  if (!available) {

    return {
      title: `${dayName} ${date}`,
      description: "신청 마감",
      buttons: []
    };

  }

  return {
    title: `${dayName} ${date}`,
    description: "근무시간을 선택하세요.",

    buttons: [

      {
        action: "message",
        label: "🟢 일찍",
        messageText: `${dayName} 일찍`
      },

      {
        action: "message",
        label: "🔵 늦게",
        messageText: `${dayName} 늦게`
      },

      {
        action: "message",
        label: "❌ 취소",
        messageText: `${dayName} 취소`
      }

    ]
  };
}

export default router;