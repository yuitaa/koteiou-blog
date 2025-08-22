export async function getUnrailedMaps(userid) {
  const API_URL = `https://u2.unrailed-online.com/CustomMap/List?limit=100&sort=recent&showFromUser=${userid}&offset=0`;
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching Unrailed maps:', error);
    return [];
  }
}
