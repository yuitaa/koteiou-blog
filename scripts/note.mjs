import fs from 'fs';
import path from 'path';

/**
 * 指定されたnoteユーザーの記事一覧を取得する非同期関数
 * @param {string} username - 記事を取得したいnoteユーザーのユーザー名
 * @returns {Promise<Array<Object>>} - 記事情報の配列
 */
export async function getNoteArticles(username) {
  let page = 1;
  let hasNext = true;
  let allArticles = [];

  while (hasNext) {
    const API_URL = `https://note.com/api/v2/creators/${username}/contents?kind=note&page=${page}`;

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      if (data?.data?.contents) {
        allArticles.push(...data.data.contents);
        hasNext = !data.data.isLastPage;

        if (hasNext) {
          page++;
        }
      } else {
        hasNext = false;
      }
    } catch (error) {
      console.error(`Error fetching articles for ${username}:`, error);
      hasNext = false;
      return [];
    }
  }

  const formattedArticles = allArticles.map((article) => {
    const hashtags = article.hashtags.map((tag) =>
      tag.hashtag.name.substring(1),
    );

    return {
      title: article.name,
      url: article.noteUrl,
      tags: hashtags,
      pubDate: article.publishAt.toString(),
    };
  });

  return formattedArticles;
}

(async () => {
  try {
    const articles = await getNoteArticles('yuita');
    console.log(`Fetched ${articles.length} articles.`);

    const outputPath = path.join(
      process.cwd(),
      'src',
      'data',
      'noteArticles.json',
    );
    const outputDir = path.dirname(outputPath);

    // ディレクトリが存在しない場合は作成
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(articles));
    console.log(`note articles saved to ${outputPath}`);
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
