import { z } from 'zod';

const LabelFormSchema = z.object({
  name: z.string().trim().min(2, 'You must enter at least 2 characters.'),
  color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid color')
});

type LabelFormData = z.infer<typeof LabelFormSchema>;

export { LabelFormSchema };
export type { LabelFormData };
