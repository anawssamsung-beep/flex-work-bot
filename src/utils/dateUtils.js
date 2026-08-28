const TZ = "Asia/Seoul";


export function getKoreaNow() {

  return new Date(
    new Date().toLocaleString(
      "en-US",
      {
        timeZone: TZ
      }
    )
  );

}


export function getNextMonday() {

  const now = getKoreaNow();

  const day = now.getDay();

  const diff =
    day === 0
      ? 1
      : 8 - day;

  const monday = new Date(now);

  monday.setDate(
    now.getDate() + diff
  );

  monday.setHours(
    0,
    0,
    0,
    0
  );

  return monday;

}


export function addDays(date, days) {

  const result = new Date(date);

  result.setDate(
    result.getDate() + days
  );

  return result;

}


export function formatDate(date) {

  const yyyy =
    date.getFullYear();

  const mm =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const dd =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;

}


/**
 * 근무일 전날 17:00
 */
export function getDeadline(workDate) {

  const deadline =
    new Date(workDate);

  deadline.setDate(
    workDate.getDate() - 1
  );

  deadline.setHours(
    17,
    0,
    0,
    0
  );

  return deadline;

}


/**
 * 현재 신청 가능 여부
 */
export function isApplyAvailable(workDate) {

  const now =
    getKoreaNow();

  return now < getDeadline(workDate);

}


/**
 * 현재 한국시간
 */
export function getKoreaDateTimeString() {

  const now =
    getKoreaNow();

  const yyyy =
    now.getFullYear();

  const mm =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  const dd =
    String(
      now.getDate()
    ).padStart(2, "0");

  const hh =
    String(
      now.getHours()
    ).padStart(2, "0");

  const mi =
    String(
      now.getMinutes()
    ).padStart(2, "0");

  const ss =
    String(
      now.getSeconds()
    ).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;

}