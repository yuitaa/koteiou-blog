import fs from 'fs';
import path from 'path';
import { getNoteArticles } from './note.mjs';
import { getUnrailedMaps } from './unrailed.mjs';
import { NOTE_USERNAME, UNRAILED_USERID } from './consts.mjs';

const outputDir = path.join(process.cwd(), 'src', 'data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

try {
  const articles = await getNoteArticles(NOTE_USERNAME);
  const outputPath = path.join(outputDir, 'noteArticles.json');
  console.log(`Fetched ${articles.length} note articles.`);

  fs.writeFileSync(outputPath, JSON.stringify(articles));
  console.log(`note articles saved to ${outputPath}`);
} catch (error) {
  console.error('An error occurred:', error);
}

try {
  const maps = await getUnrailedMaps(UNRAILED_USERID);
  const outputPath = path.join(outputDir, 'unrailedMaps.json');
  console.log(`Fetched ${maps.length} unrailed maps.`);

  fs.writeFileSync(outputPath, JSON.stringify(maps));
  console.log(`unrailed maps saved to ${outputPath}`);
} catch (error) {
  console.error('An error occurred:', error);
}
