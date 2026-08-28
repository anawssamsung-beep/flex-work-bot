import {
  appendApplication,
  findApplication,
  updateApplication
} from "./googleSheetService.js";

import {
  getApplicationWeek,
  getKoreaDateTimeString
} from "../utils/dateUtils.js";


const DAY_MAP = {

  monday: "monday",

  wednesday: "wednesday",

  friday: "friday"

};


const TYPE_MAP = {

  EARLY: "EARLY",

  LATE: "LATE"

};


/**
 * 신청
 */
export async function saveWorkApplication({

  userId,

  name,

  day,

  type

}) {

  /*
   * 입력값 검사
   */

  if (!userId) {

    throw new Error(
      "사용자 ID가 없습니다."
    );

  }


  if (!DAY_MAP[day]) {

    throw new Error(
      "잘못된 근무일입니다."
    );

  }


  if (!TYPE_MAP[type]) {

    throw new Error(
      "잘못된 근무형태입니다."
    );

  }


  /*
   * 신청 주차
   */

  const week =
    getApplicationWeek();


  const dayInfo =
    week[day];


  if (!dayInfo) {

    throw new Error(
      "근무일 정보를 찾을 수 없습니다."
    );

  }


  /*
   * 마감 확인
   */

  if (!dayInfo.available) {

    throw new Error(
      `${dayInfo.date} 신청은 마감되었습니다.`
    );

  }


  /*
   * 중복 확인
   */

  const existing =
    await findApplication(

      userId,

      dayInfo.date

    );


  const now =
    getKoreaDateTimeString();


  /*
   * 이미 신청한 경우
   * → 수정
   */

  if (existing) {

    const old =
      existing.row;


    const updatedRow = [

      old[0],

      old[1],

      name || old[2],

      old[3],

      type,

      old[5],

      old[6],

      "ACTIVE"

    ];


    await updateApplication(

      existing.rowNumber,

      updatedRow

    );


    return {

      action: "UPDATE",

      message:
        `${dayInfo.date} 신청을 ${type === "EARLY" ? "일찍" : "늦게"}으로 변경했습니다.`

    };

  }


  /*
   * 신규 신청
   */

  const applicationId =
    `${Date.now()}-${userId}`;


  const row = [

    applicationId,

    userId,

    name || "",

    dayInfo.date,

    type,

    week.weekStart,

    now,

    "ACTIVE"

  ];


  await appendApplication(
    row
  );


  return {

    action: "INSERT",

    message:
      `${dayInfo.date} ${type === "EARLY" ? "일찍" : "늦게"} 신청이 저장되었습니다.`

  };

}
/**
 * 신청 취소
 */
export async function cancelWorkApplication({

  userId,

  day

}) {

  const week =
    getApplicationWeek();


  const dayInfo =
    week[day];


  if (!dayInfo) {

    throw new Error(
      "잘못된 근무일입니다."
    );

  }


  /*
   * 마감 확인
   */

  if (!dayInfo.available) {

    throw new Error(
      `${dayInfo.date} 취소 가능 시간이 지났습니다.`
    );

  }


  /*
   * 기존 신청 조회
   */

  const existing =
    await findApplication(

      userId,

      dayInfo.date

    );


  if (!existing) {

    throw new Error(
      `${dayInfo.date} 신청내역이 없습니다.`
    );

  }


  const old =
    existing.row;


  /*
   * CANCEL 상태로 변경
   */

  const updatedRow = [

    old[0],

    old[1],

    old[2],

    old[3],

    old[4],

    old[5],

    old[6],

    "CANCEL"

  ];


  await updateApplication(

    existing.rowNumber,

    updatedRow

  );


  return {

    action: "CANCEL",

    message:
      `${dayInfo.date} 신청을 취소했습니다.`

  };

}