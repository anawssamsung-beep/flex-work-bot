import express from "express";

import {
  saveWorkApplication,
  cancelWorkApplication
} from "../services/flexService.js";

const router = express.Router();


router.post("/webhook", async (req, res) => {

  try {

    console.log(
      JSON.stringify(
        req.body,
        null,
        2
      )
    );


    // =========================
    // 1. 카카오 사용자 ID
    // =========================

    const userId =
      req.body?.userRequest?.user?.id;


    if (!userId) {

      return res.json(
        simpleText(
          "사용자 정보를 확인할 수 없습니다."
        )
      );

    }


    // =========================
    // 2. 사용자가 누른 메시지
    // =========================

    const utterance =
      req.body?.userRequest?.utterance;


    console.log("userId:", userId);
    console.log("utterance:", utterance);


    // =========================
    // 3. 버튼 분석
    // =========================

    const selection =
      parseSelection(utterance);


    // 버튼이 아니라 일반 메시지
    if (!selection) {

      return res.json(
        createApplicationCard()
      );

    }


    // =========================
    // 4. 취소
    // =========================

    if (selection.type === "CANCEL") {

      await cancelWorkApplication({

        userId,

        day:
          selection.day

      });


      return res.json(
        simpleText(
          `${selection.dayName} 신청을 취소했습니다.`
        )
      );

    }


    // =========================
    // 5. 신청 저장
    // =========================

    await saveWorkApplication({

      userId,

      day:
        selection.day,

      type:
        selection.type

    });


    return res.json(

      simpleText(

        `${selection.dayName} ${selection.typeName} 신청이 저장되었습니다.`

      )

    );


  } catch (error) {

    console.error(error);


    return res.json(

      simpleText(

        `처리 중 오류가 발생했습니다.\n${error.message}`

      )

    );

  }

});


function parseSelection(text) {

  if (!text) {
    return null;
  }


  const values = {

    "monday EARLY": {
      day: "monday",
      dayName: "월요일",
      type: "EARLY",
      typeName: "일찍"
    },

    "monday LATE": {
      day: "monday",
      dayName: "월요일",
      type: "LATE",
      typeName: "늦게"
    },

    "monday CANCEL": {
      day: "monday",
      dayName: "월요일",
      type: "CANCEL",
      typeName: "취소"
    },


    "wednesday EARLY": {
      day: "wednesday",
      dayName: "수요일",
      type: "EARLY",
      typeName: "일찍"
    },

    "wednesday LATE": {
      day: "wednesday",
      dayName: "수요일",
      type: "LATE",
      typeName: "늦게"
    },

    "wednesday CANCEL": {
      day: "wednesday",
      dayName: "수요일",
      type: "CANCEL",
      typeName: "취소"
    },


    "friday EARLY": {
      day: "friday",
      dayName: "금요일",
      type: "EARLY",
      typeName: "일찍"
    },

    "friday LATE": {
      day: "friday",
      dayName: "금요일",
      type: "LATE",
      typeName: "늦게"
    },

    "friday CANCEL": {
      day: "friday",
      dayName: "금요일",
      type: "CANCEL",
      typeName: "취소"
    }

  };


  return values[text] || null;

}


function simpleText(text) {

  return {

    version: "2.0",

    template: {

      outputs: [

        {

          simpleText: {
            text
          }

        }

      ]

    }

  };

}


function createApplicationCard() {

  return {

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

      ]

    }

  };

}


function createDayCard(dayName, day) {

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