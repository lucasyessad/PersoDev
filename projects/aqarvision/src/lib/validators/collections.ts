import { z } from 'zod';

export const collectionSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long (100 caractères max)'),
});

export type CollectionInput = z.infer<typeof collectionSchema>;
