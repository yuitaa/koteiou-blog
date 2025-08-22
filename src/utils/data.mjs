import noteArticles from '@/data/noteArticles.json';
import { getCollection } from 'astro:content';

export const blogData = (await getCollection('blog')).map((article) => ({
  type: 'blog',
  title: article.data.title,
  pubDate: article.data.pubDate,
  tags: article.data.tags,
  url: `/blog/${article.slug}/`,
  newTab: false,
}));

export const noteData = noteArticles.map((article) => ({
  type: 'note',
  title: article.title,
  pubDate: new Date(article.pubDate),
  tags: article.tags,
  url: article.url,
  newTab: true,
}));
