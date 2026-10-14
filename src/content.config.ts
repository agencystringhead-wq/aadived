// Journal content collection. Add posts as Markdown files in src/content/journal/, for example
// src/content/journal/morning-breath.md, with frontmatter matching the schema below.
// There are no posts yet, so /journal/ shows its empty state.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const journal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/journal' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(200),
      date: z.coerce.date(),
      category: z.enum(['Practice', 'Studio', 'Wellbeing']).default('Practice'),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { journal };
