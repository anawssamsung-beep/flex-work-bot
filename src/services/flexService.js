import {
  addDays,
  formatDate,
  getNextMonday,
  isApplyAvailable,
  getKoreaDateTimeString,
  getNextWeekInfo
} from "../utils/dateUtils.js";

import {
  findApplication,
  appendApplication,
  updateApplication
} from "./googleSheetService.js";


/**
 * 다음 주 정보
 */
export function getNextWeekInfo() {

  const monday =
    getNextMonday();

  const wednesday =
    addDays(monday, 2);

  const friday =
    addDays(monday, 4);

  return {

    weekStart:
      formatDate(monday),

    monday: {
      date: formatDate(monday),
      available:
        isApplyAvailable(monday)
    },

    wednesday: {
      date: formatDate(wednesday),
      available:
        isApplyAvailable(wednesday)
    },

    friday: {
      date: formatDate(friday),
      available:
        isApplyAvailable(friday)
    }

  };

}


/**
 * 다음 주 신청 등록/수정
 *
 * values:
 * {
 *   monday: "EARLY",
 *   wednesday: "LATE",
 *   friday: "EARLY"
 * }
 */
export async function saveApplication({
  userId,
  name,
  monday,
  wednesday,
  friday
}) {

  const week =
    getNextWeekInfo();

  const existing =
    await findApplication(
      userId,
      week.weekStart
    );

  const now =
    getKoreaDateTimeString();


  if (!existing) {

    const applicationId =
      `${Date.now()}`;

    const row = [

      applicationId,

      week.weekStart,

      userId,

      name,

      monday || "",

      wednesday || "",

      friday || "",

      "ACTIVE",

      now,

      "",

      ""

    ];

    await appendApplication(row);

    return {
      type: "INSERT",
      data: row
    };

  }


  /*
   * 기존 신청이 있으면 수정
   */

  const old =
    existing.data;


  const row = [

    old.id,

    old.weekStart,

    old.userId,

    old.name,

    monday ?? old.monday,

    wednesday ?? old.wednesday,

    friday ?? old.friday,

    "ACTIVE",

    old.createdAt,

    now,

    ""

  ];


  await updateApplication(
    existing.rowNumber,
    row
  );


  return {
    type: "UPDATE",
    data: row
  };

}
export async function cancelDay({
  userId,
  day
}) {

  const week =
    getNextWeekInfo();

  const existing =
    await findApplication(
      userId,
      week.weekStart
    );

  if (!existing) {

    throw new Error(
      "신청내역이 없습니다."
    );

  }


  const old =
    existing.data;


  let workDate;

  let field;


  switch (day) {

    case "monday":

      workDate =
        new Date(
          week.monday.date
        );

      field = "monday";

      break;


    case "wednesday":

      workDate =
        new Date(
          week.wednesday.date
        );

      field = "wednesday";

      break;


    case "friday":

      workDate =
        new Date(
          week.friday.date
        );

      field = "friday";

      break;


    default:

      throw new Error(
        "잘못된 요일입니다."
      );

  }


  /*
   * 마감 확인
   */

  if (!isApplyAvailable(workDate)) {

    throw new Error(
      "신청 마감시간이 지났습니다."
    );

  }


  const values = {

    monday: old.monday,

    wednesday: old.wednesday,

    friday: old.friday

  };


  values[field] = "";


  const now =
    getKoreaDateTimeString();


  const row = [

    old.id,

    old.weekStart,

    old.userId,

    old.name,

    values.monday,

    values.wednesday,

    values.friday,

    "ACTIVE",

    old.createdAt,

    now,

    ""

  ];


  await updateApplication(
    existing.rowNumber,
    row
  );


  return row;

}
export async function saveWorkApplication({
  userId,
  day,
  type
}) {

  const week =
    getNextWeekInfo();


  const dayInfo =
    week[day];


  if (!dayInfo) {

    throw new Error(
      "잘못된 근무일입니다."
    );

  }


  if (!dayInfo.available) {

    throw new Error(
      `${dayInfo.date} 신청이 마감되었습니다.`
    );

  }


  const applicationId =
    Date.now().toString();


  const row = [

    applicationId,

    userId,

    "",

    dayInfo.date,

    type,

    week.weekStart,

    new Date().toISOString(),

    "ACTIVE"

  ];


  await appendApplication(row);


  return row;

} 