import { getCollection } from 'astro:content';

const posts = (await getCollection('blog')).filter((post) => !post.data.draft);

export async function getStaticPaths() {
  return posts.map((post, i) => ({
    params: { slug: post.slug },
  }));
}

export async function GET({ params, request }) {
  const post = posts.find((p) => p.slug === params.slug);

  return new Response(post.body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
