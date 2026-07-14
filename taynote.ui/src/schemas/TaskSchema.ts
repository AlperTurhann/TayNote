import { z } from 'zod';

const TaskFormSchema = z.object({
  title: z.string().trim().min(2, 'You must enter at least 2 characters.'),
  color: z.string().regex(/^#([0-9a-fA-F]{6})$/, 'Invalid color')
});

type TaskFormData = z.infer<typeof TaskFormSchema>;

export { TaskFormSchema };
export type { TaskFormData };
