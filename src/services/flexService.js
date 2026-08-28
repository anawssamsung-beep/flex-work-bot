import {
  addDays,
  formatDate,
  getNextMonday,
  isApplyAvailable
} from "../utils/dateUtils.js";

export function getNextWeekInfo() {
  const monday = getNextMonday();

  return {
    weekStart: formatDate(monday),

    monday: {
      date: formatDate(monday),
      available: isApplyAvailable(monday)
    },

    wednesday: {
      date: formatDate(addDays(monday, 2)),
      available: isApplyAvailable(addDays(monday, 2))
    },

    friday: {
      date: formatDate(addDays(monday, 4)),
      available: isApplyAvailable(addDays(monday, 4))
    }
  };
}