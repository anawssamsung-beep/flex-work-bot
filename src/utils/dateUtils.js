const TZ = "Asia/Seoul";

export function getKoreaNow() {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: TZ
    })
  );
}

/**
 * 다음 월요일
 */
export function getNextMonday() {
  const now = getKoreaNow();

  const day = now.getDay();

  const diff = day === 0 ? 1 : 8 - day;

  const monday = new Date(now);

  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  return monday;
}

export function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

export function addDays(date, days) {
  const result = new Date(date);

  result.setDate(result.getDate() + days);

  return result;
}

/**
 * 해당 근무일의 신청 마감시간
 *
 * 근무일 전날 17:00
 */
export function getDeadline(workDate) {
  const deadline = new Date(workDate);

  deadline.setDate(workDate.getDate() - 1);
  deadline.setHours(17, 0, 0, 0);

  return deadline;
}

export function isApplyAvailable(workDate) {
  const now = getKoreaNow();

  return now < getDeadline(workDate);
}
