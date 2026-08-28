import express from "express";


import {
  saveWorkApplication,
  cancelWorkApplication
} from "../services/flexService.js";


const router =
  express.Router();


/**
 * 카카오 Webhook
 */
router.post(
  "/webhook",
  async (req, res) => {

    try {

      console.log(
        "========== KAKAO =========="
      );


      console.log(
        JSON.stringify(
          req.body,
          null,
          2
        )
      );


      /*
       * 카카오 사용자 ID
       */

      const userId =
        req.body
          ?.userRequest
          ?.user
          ?.id;


      /*
       * 사용자가 입력한 메시지
       */

      const utterance =
        req.body
          ?.userRequest
          ?.utterance;


      console.log(
        "userId:",
        userId
      );


      console.log(
        "utterance:",
        utterance
      );


      /*
       * 사용자 ID 확인
       */

      if (!userId) {

        return res.json(

          simpleText(
            "사용자 정보를 확인할 수 없습니다."
          )

        );

      }


      /*
       * 버튼 선택 분석
       */

      const selection =
        parseSelection(
          utterance
        );


      /*
       * 일반 메시지
       *
       * → 신청 카드
       */

      if (!selection) {

        return res.json(

          createApplicationCard()

        );

      }


      /*
       * 취소
       */

      if (
        selection.type ===
        "CANCEL"
      ) {

        const result =
          await cancelWorkApplication({

            userId,

            day:
              selection.day

          });


        return res.json(

          simpleText(

            `❌ ${result.message}`

          )

        );

      }


      /*
       * 신청
       */

      const result =
        await saveWorkApplication({

          userId,

          /*
           * 현재는 테스트용
           *
           * 나중에 직원 Sheet에서
           * userId → 이름 조회
           */

          name:
            "테스트사용자",

          day:
            selection.day,

          type:
            selection.type

        });


      return res.json(

        simpleText(

          `✅ ${result.message}`

        )

      );


    } catch (error) {

      console.error(
        "Kakao Webhook Error:",
        error
      );


      return res.json(

        simpleText(

          `⚠️ ${error.message}`

        )

      );

    }

  }
);


/**
 * 버튼 메시지 분석
 */
function parseSelection(text) {

  if (!text) {

    return null;

  }


  const values = {


    /*
     * 월요일
     */

    "monday EARLY": {

      day:
        "monday",

      dayName:
        "월요일",

      type:
        "EARLY",

      typeName:
        "일찍"

    },


    "monday LATE": {

      day:
        "monday",

      dayName:
        "월요일",

      type:
        "LATE",

      typeName:
        "늦게"

    },


    "monday CANCEL": {

      day:
        "monday",

      dayName:
        "월요일",

      type:
        "CANCEL",

      typeName:
        "취소"

    },


    /*
     * 수요일
     */

    "wednesday EARLY": {

      day:
        "wednesday",

      dayName:
        "수요일",

      type:
        "EARLY",

      typeName:
        "일찍"

    },


    "wednesday LATE": {

      day:
        "wednesday",

      dayName:
        "수요일",

      type:
        "LATE",

      typeName:
        "늦게"

    },


    "wednesday CANCEL": {

      day:
        "wednesday",

      dayName:
        "수요일",

      type:
        "CANCEL",

      typeName:
        "취소"

    },


    /*
     * 금요일
     */

    "friday EARLY": {

      day:
        "friday",

      dayName:
        "금요일",

      type:
        "EARLY",

      typeName:
        "일찍"

    },


    "friday LATE": {

      day:
        "friday",

      dayName:
        "금요일",

      type:
        "LATE",

      typeName:
        "늦게"

    },


    "friday CANCEL": {

      day:
        "friday",

      dayName:
        "금요일",

      type:
        "CANCEL",

      typeName:
        "취소"

    }

  };


  return values[text] || null;

}


/**
 * 신청 카드
 */
function createApplicationCard() {

  return {

    version:
      "2.0",

    template: {

      outputs: [

        {

          carousel: {

            type:
              "basicCard",

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


/**
 * 요일 카드
 */
function createDayCard(
  dayName,
  day
) {

  return {

    title:
      dayName,

    description:
      "근무시간을 선택하세요.",

    buttons: [

      {

        action:
          "message",

        label:
          "🟢 일찍",

        messageText:
          `${day} EARLY`

      },

      {

        action:
          "message",

        label:
          "🔵 늦게",

        messageText:
          `${day} LATE`

      },

      {

        action:
          "message",

        label:
          "❌ 취소",

        messageText:
          `${day} CANCEL`

      }

    ]

  };

}


/**
 * 단순 텍스트 응답
 */
function simpleText(text) {

  return {

    version:
      "2.0",

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


export default router;