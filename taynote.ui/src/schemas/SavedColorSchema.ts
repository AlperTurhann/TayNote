import { z } from 'zod';

const SavedColorFormSchema = z.object({
  name: z.string().trim().min(2, 'You must enter at least 2 characters.')
});

type SavedColorFormData = z.infer<typeof SavedColorFormSchema>;

export { SavedColorFormSchema };
export type { SavedColorFormData };
