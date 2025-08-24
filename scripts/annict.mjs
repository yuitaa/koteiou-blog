import { ANNICT_ACCESS_TOKEN } from './consts.mjs';
const API_URL = 'https://api.annict.com/v1/activities';

/**
 * 指定されたユーザー名とページ番号に基づいてAnnictのアクティビティを取得
 * @param {string} username - Annictのユーザー名
 * @param {number} page - 取得するページ番号
 * @returns {Promise<Array<Object>>} アクティビティオブジェクトの配列を解決するPromise。
 */
async function getAnnictActivities(username, page) {
  const url = new URL(API_URL);
  url.searchParams.append('access_token', ANNICT_ACCESS_TOKEN);
  url.searchParams.append('per_page', 50);
  url.searchParams.append('page', page);
  url.searchParams.append('filter_username', username);
  url.searchParams.append('sort_id', 'desc');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.activities
    .filter(
      (activity) =>
        activity.action === 'create_record' ||
        activity.action === 'create_review',
    )
    .map((activity) => ({
      action: activity.action,
      title: activity.work.title,
      createdAt: activity.created_at,
      episodeNumber: activity?.episode?.number_text,
      subtitle: activity?.episode?.title,
    }))
    .map((activity) => ({
      title: activity.title,
      subtitle:
        `${activity.episodeNumber || ''}${activity.subtitle ? `「${activity.subtitle}」` : ''}` ||
        null,
      createdAt: new Date(activity.createdAt),
    }));
}

export async function getAllAnnictActivitiesSince(username, since) {
  let page = 1;
  let allActivities = [];
  let shouldContinue = true;

  while (shouldContinue) {
    try {
      const activities = await getAnnictActivities(username, page);
      if (activities.length === 0) {
        shouldContinue = false;
        continue;
      }

      const newActivities = [];
      for (const activity of activities) {
        if (activity.createdAt > since) {
          newActivities.push(activity);
        } else {
          shouldContinue = false;
          break;
        }
      }
      allActivities = allActivities.concat(newActivities);

      if (shouldContinue) {
        page++;
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      shouldContinue = false;
    }
  }
  return allActivities;
}
