import express from "express";

const router = express.Router();

router.post("/webhook", async (req, res) => {

  console.log("========== KAKAO ==========");

  console.log(
    JSON.stringify(
      req.body,
      null,
      2
    )
  );


  const response = {

    version: "2.0",

    template: {

      outputs: [

        {
          carousel: {

            type: "basicCard",

            items: [

              createDayCard(
                "월요일",
                "monday"
              ),

              createDayCard(
                "수요일",
                "wednesday"
              ),

              createDayCard(
                "금요일",
                "friday"
              )

            ]

          }

        }

      ],

      quickReplies: [

        {
          action: "message",

          label: "✅ 전체 등록",

          messageText:
            "전체 등록"

        }

      ]

    }

  };


  res.json(response);

});


function createDayCard(
  dayName,
  day
) {

  return {

    title: dayName,

    description:
      "근무시간을 선택하세요.",

    buttons: [

      {

        action: "message",

        label: "🟢 일찍",

        messageText:
          `${day} EARLY`

      },

      {

        action: "message",

        label: "🔵 늦게",

        messageText:
          `${day} LATE`

      },

      {

        action: "message",

        label: "❌ 취소",

        messageText:
          `${day} CANCEL`

      }

    ]

  };

}


export default router;