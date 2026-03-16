import { z } from 'zod';

export const noticeSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  deadline: z.string().min(1, 'A data final de inscrição é obrigatória'),
  pdfBase64: z.string().optional(),
  organizationName: z.string().min(1, 'A instituição é obrigatória'),
  organizationId: z.string().optional(),
});

export type NoticeFormData = z.infer<typeof noticeSchema>;
