import fs from 'fs/promises';
import path from 'path';
import { getAllAnnictActivitiesSince } from './annict.mjs';
import { ANNICT_USERNAME } from './consts.mjs';

const LAST_SYNC_DATE_FILE = path.join('scripts', '.last_annict_sync_date');
const ANNICT_DATA_DIR = path.join('src', 'content', 'annict');

/**
 * @param {Date} date
 * @returns {string}
 */
function getWeekNumber(date) {
  const d = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}W${String(weekNo).padStart(2, '0')}`;
}

async function sync() {
  let since = new Date(0);
  try {
    const lastSync = await fs.readFile(LAST_SYNC_DATE_FILE, 'utf-8');
    since = new Date(lastSync);
  } catch (e) {
    console.log('No last sync date found, fetching all activities.');
  }

  const activities = await getAllAnnictActivitiesSince(ANNICT_USERNAME, since);

  if (activities.length === 0) {
    console.log('No new activities found.');
    return;
  }

  console.log(`Found ${activities.length} new activities.`);

  const activitiesByWeek = activities.reduce((acc, activity) => {
    const week = getWeekNumber(activity.createdAt);
    if (!acc[week]) {
      acc[week] = [];
    }
    acc[week].push(activity);
    return acc;
  }, {});

  await fs.mkdir(ANNICT_DATA_DIR, { recursive: true });

  for (const week in activitiesByWeek) {
    const filePath = path.join(ANNICT_DATA_DIR, `${week}.json`);
    let existingActivities = [];
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      existingActivities = JSON.parse(content);
    } catch (e) {
      // File doesn't exist, will create a new one.
    }

    const newActivities = activitiesByWeek[week];
    const allActivities = [...existingActivities, ...newActivities].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );

    await fs.writeFile(filePath, JSON.stringify(allActivities, null, 2));
    console.log(`Updated ${filePath}`);
  }

  const latestActivity = activities.reduce((latest, activity) => {
    return activity.createdAt > latest.createdAt ? activity : latest;
  });

  await fs.writeFile(
    LAST_SYNC_DATE_FILE,
    latestActivity.createdAt.toISOString(),
  );
  console.log(
    `Updated last sync date to: ${latestActivity.createdAt.toISOString()}`,
  );
}

sync().catch((e) => console.error(e));
