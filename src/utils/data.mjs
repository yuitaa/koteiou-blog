//import noteArticles from '@/data/noteArticles.json';
import unrailedMaps from '@/data/unrailedMaps.json';
import { getCollection } from 'astro:content';

export const blogData = (await getCollection('blog'))
  .filter((post) => !post.data.draft)
  .map((article) => ({
    type: 'blog',
    title: article.data.title,
    pubDate: article.data.pubDate,
    tags: article.data.tags,
    url: `/blog/${article.slug}/`,
    image: article.data.image,
    newTab: false,
  }))
  .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

export const unrailedMapData = unrailedMaps
  .map((map) => ({
    type: 'custommap',
    title: map.name,
    pubDate: new Date(map.lastUploadDate),
    tags: map.tags,
    url: `https://u2.unrailed-online.com/#/map/${map.shareId}`,
    image: `/api/u2-image/${map.customMapId}.webp`,
    newTab: true,
  }))
  .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

export const allPostData = [...blogData, ...unrailedMapData].sort(
  (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf(),
);

export const allPostTags = [
  ...new Set(
    allPostData.flatMap((post) => post.tags.map((t) => t.toLowerCase())),
  ),
]
  .map((tag) => ({
    tag: tag,
    count: allPostData.filter((post) =>
      post.tags.map((t) => t.toLowerCase()).includes(tag),
    ).length,
  }))
  .sort((a, b) => {
    if (a.count !== b.count) {
      return b.count - a.count;
    }
    return a.tag.localeCompare(b.tag);
  });

export const annictData = (await getCollection('annict')).sort((a, b) =>
  a.id.localeCompare(b.id),
);

export const timelinePaths = [
  {
    params: { path: undefined },
    props: { title: '全ての投稿', data: allPostData },
  },
  { params: { path: 'blog' }, props: { title: 'ブログ', data: blogData } },
  {
    params: { path: 'custommap' },
    props: { title: 'カスタムマップ', data: unrailedMapData },
  },
];
