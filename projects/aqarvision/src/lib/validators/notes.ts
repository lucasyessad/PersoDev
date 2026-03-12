import { z } from 'zod';

export const propertyNoteSchema = z.object({
  property_id: z.string().uuid(),
  content: z.string().min(1, 'La note ne peut pas être vide').max(1000, 'La note est trop longue (1000 caractères max)'),
});

export type PropertyNoteInput = z.infer<typeof propertyNoteSchema>;
