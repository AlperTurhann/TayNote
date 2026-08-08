import { z } from 'zod';

import { TASK_DESCRIPTION_MAX_LENGTH } from '@/constants/taskConstants';

const TaskFormSchema = z.object({
  title: z.string().trim().min(2, 'You must enter at least 2 characters.'),
  color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid color')
});

const TaskDetailFormSchema = TaskFormSchema.extend({
  description: z
    .string()
    .trim()
    .max(
      TASK_DESCRIPTION_MAX_LENGTH,
      `You must enter at most ${TASK_DESCRIPTION_MAX_LENGTH} characters.`
    )
    .optional()
});

type TaskFormData = z.infer<typeof TaskFormSchema>;
type TaskDetailFormData = z.infer<typeof TaskDetailFormSchema>;

export { TaskFormSchema, TaskDetailFormSchema };
export type { TaskFormData, TaskDetailFormData };
