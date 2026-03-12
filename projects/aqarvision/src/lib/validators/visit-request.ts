import { z } from 'zod';

export const visitRequestSchema = z.object({
  property_id: z.string().uuid(),
  agency_id: z.string().uuid(),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
  phone: z.string().min(9, 'Numéro de téléphone invalide').max(20),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  message: z.string().max(500, 'Le message est trop long (500 caractères max)').optional().or(z.literal('')),
});

export type VisitRequestInput = z.infer<typeof visitRequestSchema>;
