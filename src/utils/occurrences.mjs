const occurrencesColorMap = [
  'bg-background-surface',
  'bg-rose-100',
  'bg-rose-200',
  'bg-rose-300',
  'bg-rose-400',
  'bg-rose-500',
  'bg-rose-600',
  'bg-rose-700',
  'bg-rose-800',
  'bg-rose-900',
];

export function getOccurrencesBgColor(occurrences) {
  if (occurrences === 0) {
    return occurrencesColorMap[0];
  }

  const index = Math.min(
    Math.floor((occurrences - 1) / 2) + 1,
    occurrencesColorMap.length - 1,
  );

  return occurrencesColorMap[index];
}

export function countDayOccurrences(arr) {
  const counts = new Array(7).fill(0);

  for (const num of arr) {
    counts[num]++;
  }

  return counts;
}
