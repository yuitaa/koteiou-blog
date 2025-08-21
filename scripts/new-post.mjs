import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args = process.argv.slice(2);
let title = args[0];
const customDir = args[1];

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const pubDate = `${year}-${month}-${day}`;

let slug = `${pubDate}-${crypto.randomBytes(4).toString('hex')}`;

if (!title) {
  title = `${year}年${month}月${day}日`;
}

const baseDir = path.join(process.cwd(), 'src', 'content', 'blog');
const targetDir = customDir ? path.join(baseDir, customDir) : baseDir;

// Create the directory if it doesn't exist
fs.mkdirSync(targetDir, { recursive: true });

const filePath = path.join(targetDir, `${slug}.md`);

const content = `---
title: "${title}"
pubDate: ${pubDate}
tags: []
---

`;

fs.writeFileSync(filePath, content);

console.log(`New post created at: ${filePath}`);
