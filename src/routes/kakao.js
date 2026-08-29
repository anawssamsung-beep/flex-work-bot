import express from "express";


import {
    saveWorkApplication,
    cancelWorkApplication
} from "../services/flexService.js";


const router =
    express.Router();


/**
 * 카카오 Webhook
 *
 * 일반적으로 "탄력근무 신청"을 입력했을 때
 * 신청 카드를 보여준다.
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


            console.log(
                "userId:",
                userId
            );


            /*
             * 신청 카드
             */
            return res.json(
                createApplicationCard()
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
 * 탄력근무 신청 Skill
 */
router.post(
    "/apply",
    async (req, res) => {

        try {

            console.log(
                "========== KAKAO APPLY =========="
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
             * 버튼에서 전달한 정보
             */
            const clientExtra =
                req.body
                    ?.action
                    ?.clientExtra;


            const day =
                clientExtra
                    ?.day;


            const type =
                clientExtra
                    ?.type;


            console.log(
                "userId:",
                userId
            );

            console.log(
                "day:",
                day
            );

            console.log(
                "type:",
                type
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
             * 신청 정보 확인
             */
            if (!day || !type) {

                return res.json(
                    simpleText(
                        "신청 정보를 확인할 수 없습니다."
                    )
                );

            }


            /*
             * 신청 처리
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

                    day,

                    type

                });


            return res.json(

                simpleText(

                    `✅ ${result.message}`

                )

            );


        } catch (error) {

            console.error(
                "Kakao Apply Error:",
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
 * 탄력근무 취소 Skill
 */
router.post(
    "/cancel",
    async (req, res) => {

        try {

            console.log(
                "========== KAKAO CANCEL =========="
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
             * 버튼에서 전달한 정보
             */
            const clientExtra =
                req.body
                    ?.action
                    ?.clientExtra;


            const day =
                clientExtra
                    ?.day;


            console.log(
                "userId:",
                userId
            );

            console.log(
                "day:",
                day
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
             * 근무일 확인
             */
            if (!day) {

                return res.json(
                    simpleText(
                        "취소할 근무일을 확인할 수 없습니다."
                    )
                );

            }


            /*
             * 취소 처리
             */
            const result =
                await cancelWorkApplication({

                    userId,

                    day

                });


            return res.json(

                simpleText(

                    `❌ ${result.message}`

                )

            );


        } catch (error) {

            console.error(
                "Kakao Cancel Error:",
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
                action: "block",

                label:
                    "🚀 일찍 출근",

                blockId:
                    process.env.KAKAO_APPLY_BLOCK_ID,

                extra: {

                    day:
                        day,

                    type:
                        "EARLY"

                }

            },

            {
                action: "block",

                label:
                    "🛵 늦게 출근",

                blockId:
                    process.env.KAKAO_APPLY_BLOCK_ID,

                extra: {

                    day:
                        day,

                    type:
                        "LATE"

                }

            },

            {
                action: "block",

                label:
                    "❌ 취소",

                blockId:
                    process.env.KAKAO_CANCEL_BLOCK_ID,

                extra: {

                    day:
                        day,

                    type:
                        "CANCEL"

                }

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