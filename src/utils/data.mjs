import noteArticles from '@/data/noteArticles.json';
import unrailedMaps from '@/data/unrailedMaps.json';
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

export const unrailedMapData = unrailedMaps.map((map) => ({
  type: 'custommap',
  title: map.name,
  pubDate: new Date(map.lastUploadDate),
  tags: map.tags,
  url: `https://u2.unrailed-online.com/#/map/${map.shareId}`,
  newTab: true,
}));

export const allPostData = [...blogData, ...noteData, ...unrailedMapData].sort(
  (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf(),
);

export const allPostTags = [
  ...new Set(allPostData.flatMap((post) => post.tags)),
]
  .map((tag) => ({
    tag,
    count: allPostData.filter((post) => post.tags.includes(tag)).length,
  }))
  .sort((a, b) => {
    return a.tag.localeCompare(b.tag);
  });
