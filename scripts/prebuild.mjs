import fs from 'fs';
import path from 'path';
import { getNoteArticles } from './note.mjs';
import { NOTE_USERNAME } from './consts.mjs';

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
