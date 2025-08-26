import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).optional(),
  }),
});

const annictCollection = defineCollection({
  type: 'data',
  schema: z.array(
    z.object({
      title: z.string(),
      subtitle: z.string().nullable(),
      createdAt: z.string().transform((str) => new Date(str)),
      sortNumber: z.number().nullable(),
    }),
  ),
});

export const collections = {
  blog: blogCollection,
  annict: annictCollection,
};
