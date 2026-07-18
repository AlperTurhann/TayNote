import { z } from 'zod';

const BoardFormSchema = z.object({
  name: z.string().trim().min(2, 'You must enter at least 2 characters.')
});

type BoardFormData = z.infer<typeof BoardFormSchema>;

export { BoardFormSchema };
export type { BoardFormData };
