/**
 * @param {Date} date
 * @returns {number}
 */
export function getDayOfWeek(date) {
  const JST_OFFSET_HOURS = 9;
  const jstDate = new Date(date.getTime() + JST_OFFSET_HOURS * 60 * 60 * 1000);

  return (((jstDate.getUTCDay() - 1) % 7) + 7) % 7;
}

/**
 * 指定された年の週の最初の日の日付を返します。
 * @param {string} yearWeek "YYYYwWW"
 * @returns {number[]} [年, 月, 日]
 */
export function getFirstDayOfWeek(yearWeek) {
  const [year, week] = yearWeek
    .match(/(\d{4})w(\d{2})/)
    .slice(1)
    .map(Number);
  const date = new Date(year, 0, 1 + (week - 1) * 7);
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  date.setDate(date.getDate() - diff);
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
}

export function padZero(number) {
  return String(number).padStart(2, '0');
}

export function getDisplayDate(weekFirstDay, day) {
  const date = new Date(weekFirstDay[0], weekFirstDay[1] - 1, weekFirstDay[2]);
  date.setDate(date.getDate() + day);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}
