import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('隐形人技术团队'),
    tags: z.array(z.string()).default([]),
    keywords: z.union([z.string(), z.array(z.string())]).optional(),
    featured: z.boolean().default(false),
    heroImage: z.string().default('/logo.png'),
    badge: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
