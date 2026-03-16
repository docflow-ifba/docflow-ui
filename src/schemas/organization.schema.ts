import { z } from 'zod';

export const organizationSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome da instituição é obrigatório')
    .min(2, 'O nome deve ter pelo menos 2 caracteres'),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;
