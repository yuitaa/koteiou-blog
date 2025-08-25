/**
 * @param {Date} date
 * @returns {number}
 */
export function getDayOfWeek(date) {
  const JST_OFFSET_HOURS = 9;
  const jstDate = new Date(date.getTime() + JST_OFFSET_HOURS * 60 * 60 * 1000);

  return (((jstDate.getUTCDay() - 1) % 7) + 7) % 7;
}
