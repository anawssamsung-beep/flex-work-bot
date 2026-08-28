const TIMEZONE = "Asia/Seoul";


/**
 * 한국 현재시간
 */
export function getKoreaNow() {

  return new Date(
    new Date().toLocaleString(
      "en-US",
      {
        timeZone: TIMEZONE
      }
    )
  );

}


/**
 * 날짜를 YYYY-MM-DD로 변환
 */
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
 * 날짜에 일수 더하기
 */
export function addDays(
  date,
  days
) {

  const result =
    new Date(date);

  result.setDate(
    result.getDate() + days
  );

  return result;

}


/**
 * 이번 주 월요일
 */
export function getThisMonday() {

  const now =
    getKoreaNow();

  const day =
    now.getDay();

  const diff =
    day === 0
      ? -6
      : 1 - day;

  const monday =
    new Date(now);

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


/**
 * 다음 주 월요일
 */
export function getNextMonday() {

  return addDays(
    getThisMonday(),
    7
  );

}


/**
 * 근무일 전날 17:00
 */
export function getDeadline(
  workDate
) {

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
 * 특정 근무일 신청 가능 여부
 */
export function isApplyAvailable(
  workDate
) {

  const now =
    getKoreaNow();

  const deadline =
    getDeadline(workDate);

  return now < deadline;

}


/**
 * 다음 신청 가능한 월/수/금 계산
 */
export function getApplicationWeek() {

  const now =
    getKoreaNow();

  const day =
    now.getDay();


  /*
   * 금/토/일
   * → 다음 주 월/수/금
   */
  if (
    day === 5 ||
    day === 6 ||
    day === 0
  ) {

    const monday =
      getNextMonday();

    return createWeekInfo(
      monday
    );

  }


  /*
   * 월/화/수/목
   *
   * 현재 주의 아직 신청 가능한
   * 근무일을 사용
   */

  const monday =
    getThisMonday();

  return createWeekInfo(
    monday
  );

}


/**
 * 월/수/금 정보 생성
 */
function createWeekInfo(
  monday
) {

  const wednesday =
    addDays(
      monday,
      2
    );

  const friday =
    addDays(
      monday,
      4
    );


  return {

    weekStart:
      formatDate(monday),

    monday: createDayInfo(
      monday
    ),

    wednesday:
      createDayInfo(
        wednesday
      ),

    friday:
      createDayInfo(
        friday
      )

  };

}


/**
 * 근무일 정보
 */
function createDayInfo(
  date
) {

  return {

    date:
      formatDate(date),

    deadline:
      getDeadline(date),

    available:
      isApplyAvailable(date)

  };

}


/**
 * 한국 시간 문자열
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