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


  // 카카오 사용자 ID
  const userId =
    req.body?.userRequest?.user?.id;


  // 사용자가 입력한 메시지
  const utterance =
    req.body?.userRequest?.utterance;


  console.log("userId =", userId);
  console.log("utterance =", utterance);


  const selection =
    parseSelection(utterance);


  if (selection) {

    console.log(
      "선택:",
      selection
    );

  }


  res.json({

    version: "2.0",

    template: {

      outputs: [

        {
          simpleText: {

            text:
              selection
                ? `${selection.dayName} ${selection.typeName} 선택`
                : "탄력근무 신청"

          }

        }

      ]

    }

  });

});


function parseSelection(text) {

  if (!text) {
    return null;
  }


  const values = {

    "월요일 일찍": {
      day: "monday",
      dayName: "월요일",
      type: "EARLY",
      typeName: "일찍"
    },

    "월요일 늦게": {
      day: "monday",
      dayName: "월요일",
      type: "LATE",
      typeName: "늦게"
    },

    "월요일 취소": {
      day: "monday",
      dayName: "월요일",
      type: "CANCEL",
      typeName: "취소"
    },


    "수요일 일찍": {
      day: "wednesday",
      dayName: "수요일",
      type: "EARLY",
      typeName: "일찍"
    },

    "수요일 늦게": {
      day: "wednesday",
      dayName: "수요일",
      type: "LATE",
      typeName: "늦게"
    },

    "수요일 취소": {
      day: "wednesday",
      dayName: "수요일",
      type: "CANCEL",
      typeName: "취소"
    },


    "금요일 일찍": {
      day: "friday",
      dayName: "금요일",
      type: "EARLY",
      typeName: "일찍"
    },

    "금요일 늦게": {
      day: "friday",
      dayName: "금요일",
      type: "LATE",
      typeName: "늦게"
    },

    "금요일 취소": {
      day: "friday",
      dayName: "금요일",
      type: "CANCEL",
      typeName: "취소"
    }

  };


  return values[text] || null;

}


export default router;