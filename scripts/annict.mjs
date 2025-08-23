import { ANNICT_ACCESS_TOKEN } from './consts.mjs';
const API_URL = 'https://api.annict.com/v1/activities';

export async function getAnnictActivities(username, page) {
  const url = new URL(API_URL);
  url.searchParams.append('access_token', ANNICT_ACCESS_TOKEN);
  url.searchParams.append('per_page', 50);
  url.searchParams.append('page', page);
  url.searchParams.append('filter_username', username);
  url.searchParams.append('sort_id', 'desc');

  try {
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
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
}
