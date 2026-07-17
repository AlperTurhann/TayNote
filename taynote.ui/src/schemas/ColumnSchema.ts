import { z } from 'zod';

const ColumnFormSchema = z.object({
  name: z.string().trim().min(2, 'You must enter at least 2 characters.')
});

type ColumnFormData = z.infer<typeof ColumnFormSchema>;

export { ColumnFormSchema };
export type { ColumnFormData };
