// Journal content collection. Posts are MDX files in src/content/journal/, one per article, named after the slug.
// Scheduling: a post is published when `draft` is false AND `pubDate` has passed (see getPublishedPosts in
// src/data/journal.ts). Write pubDate with the IST offset, for example 2026-10-15T07:00:00+05:30.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const journalCategories = ['Yoga', 'Mind & Sound', 'Wellness Programs', 'Practice Tips'] as const;

const journal = defineCollection({
  // Files that start with an underscore are ignored, so they can be used as drafts or templates
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/journal' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Meta title (50 to 60 characters, brand last). Falls back to the title plus the brand. */
      metaTitle: z.string().max(60).optional(),
      description: z.string().min(140).max(160),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(journalCategories),
      tags: z.array(z.string()).default([]),
      heroImage: image(),
      heroAlt: z.string().min(20),
      /** Slug of the service this post leads to, for example yoga/beginners */
      relatedService: z.string(),
      author: z.string().default('AadiVed Team'),
      /** Leave empty until a named reviewer signs the article off */
      reviewedBy: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { journal };
