'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/base/Button';
import Input from '@/components/base/Input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { TASK_DESCRIPTION_MAX_LENGTH } from '@/constants/taskConstants';
import { useAppDispatch } from '@/lib/hooks';
import { Task } from '@/models/Task';
import { TaskDetailFormData, TaskDetailFormSchema } from '@/schemas/TaskSchema';
import { updateTaskAsync } from '@/services/taskService';

interface TaskDetailDialogProps {
  task: Task;
  button: React.ReactNode;
}

const TaskDetailDialog = ({ task, button }: TaskDetailDialogProps) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors }
  } = useForm<TaskDetailFormData>({
    resolver: zodResolver(TaskDetailFormSchema),
    defaultValues: { title: task.title, color: task.color, description: task.description ?? '' }
  });

  useEffect(() => {
    if (open) {
      setIsEditing(false);
      reset({ title: task.title, color: task.color, description: task.description ?? '' });
    }
  }, [open, task.title, task.color, task.description, reset]);

  const startEditing = () => setIsEditing(true);

  const cancelEditing = () => {
    reset({ title: task.title, color: task.color, description: task.description ?? '' });
    setIsEditing(false);
  };

  const onSubmit = handleSubmit(async (data) => {
    setIsSaving(true);
    await dispatch(
      updateTaskAsync({
        ...task,
        title: data.title.trim(),
        color: data.color,
        description: data.description?.trim() ?? ''
      })
    );
    setIsSaving(false);
    setIsEditing(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent className="border-base-600 bg-base-800 text-base-100">
        {!isEditing && (
          <Button
            colorVariant="foreground"
            className="absolute top-4 right-10 rounded-full p-px"
            onClick={startEditing}
            title="Edit task"
          >
            <Pencil size={14} />
          </Button>
        )}
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        {isEditing ? (
          <form onSubmit={onSubmit} className="flex flex-col gap-y-3">
            <Input<TaskDetailFormData>
              errors={errors}
              label="Title"
              name="title"
              register={register}
              required
              placeholder="Task Title"
              autoFocus
            />
            <Input<TaskDetailFormData>
              errors={errors}
              label="Color"
              name="color"
              register={register}
              control={control}
              setValue={setValue}
              fieldType="color"
              required
            />
            <Input<TaskDetailFormData>
              errors={errors}
              label="Description"
              name="description"
              register={register}
              control={control}
              fieldType="textarea"
              placeholder="Add a more detailed description..."
              maxLength={TASK_DESCRIPTION_MAX_LENGTH}
            />
            <DialogFooter>
              <Button
                colorVariant="base"
                onClick={cancelEditing}
                disabled={isSaving}
                className="w-24 rounded"
              >
                Cancel
              </Button>
              <Button
                colorVariant="green"
                type="submit"
                disabled={isSaving}
                className="w-24 rounded"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="flex flex-col gap-y-3">
            <div className="flex min-w-0 items-center gap-x-2">
              <span
                className="size-4 shrink-0 rounded-full"
                style={{ backgroundColor: task.color }}
              />
              <h3 className="font-bold wrap-break-word">{task.title}</h3>
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-sm font-medium text-base-400">Description</p>
              {task.description ? (
                <p className="whitespace-pre-wrap">{task.description}</p>
              ) : (
                <p className="text-base-400 italic">No description</p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { TaskDetailDialog };
