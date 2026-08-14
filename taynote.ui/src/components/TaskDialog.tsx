'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/base/Button';
import Input from '@/components/base/Input';
import { LabelBadge, LabelToggleList } from '@/components/Label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TASK_DESCRIPTION_MAX_LENGTH } from '@/constants/taskConstants';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Task } from '@/models/Task';
import { TaskDetailFormData, TaskDetailFormSchema } from '@/schemas/TaskSchema';
import { getBoardLabelsAsync, getGlobalLabelsAsync } from '@/services/labelService';
import { addTaskAsync, updateTaskAsync } from '@/services/taskService';
import { selectBoardLabels, selectGlobalLabels } from '@/slices/labelSlice';

type TaskDialogProps =
  | { mode: 'view'; task: Task; button: React.ReactNode }
  | { mode: 'create'; columnId: string; open: boolean; onOpenChange: (open: boolean) => void };

const TaskDialog = (props: TaskDialogProps) => {
  const dispatch = useAppDispatch();
  const { boardId } = useParams<{ boardId?: string }>();
  const globalLabels = useAppSelector(selectGlobalLabels);
  const boardLabels = useAppSelector(selectBoardLabels);
  const availableLabels = [...globalLabels, ...boardLabels];

  const [internalOpen, setInternalOpen] = useState<boolean>(false);

  const isCreate = props.mode === 'create';
  const task = props.mode === 'view' ? props.task : undefined;
  const columnId = props.mode === 'create' ? props.columnId : undefined;
  const triggerButton = props.mode === 'view' ? props.button : null;
  const open = props.mode === 'create' ? props.open : internalOpen;
  const setOpen = (value: boolean) => {
    if (props.mode === 'create') props.onOpenChange(value);
    else setInternalOpen(value);
  };

  const [isEditing, setIsEditing] = useState<boolean>(isCreate);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(
    task?.labels.map((label) => label.id) ?? []
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors }
  } = useForm<TaskDetailFormData>({
    resolver: zodResolver(TaskDetailFormSchema),
    defaultValues: {
      title: task?.title ?? '',
      color: task?.color ?? '#4f46e5',
      description: task?.description ?? ''
    }
  });

  useEffect(() => {
    if (!open) return;
    setIsEditing(isCreate);
    reset({
      title: task?.title ?? '',
      color: task?.color ?? '#4f46e5',
      description: task?.description ?? ''
    });
    setSelectedLabelIds(task?.labels.map((label) => label.id) ?? []);
  }, [open, isCreate, task?.title, task?.color, task?.description, task?.labels, reset]);

  useEffect(() => {
    if (open) {
      dispatch(getGlobalLabelsAsync());
      if (boardId) dispatch(getBoardLabelsAsync(boardId));
    }
  }, [open, boardId, dispatch]);

  const startEditing = () => setIsEditing(true);

  const toggleLabel = (labelId: string) => {
    setSelectedLabelIds((current) =>
      current.includes(labelId) ? current.filter((id) => id !== labelId) : [...current, labelId]
    );
  };

  const cancelEditing = () => {
    if (isCreate) {
      setOpen(false);
      return;
    }
    if (task) {
      reset({ title: task.title, color: task.color, description: task.description ?? '' });
      setSelectedLabelIds(task.labels.map((label) => label.id));
    }
    setIsEditing(false);
  };

  const onSubmit = handleSubmit(async (data) => {
    setIsSaving(true);
    if (isCreate && columnId) {
      await dispatch(
        addTaskAsync({
          title: data.title.trim(),
          color: data.color,
          description: data.description?.trim() ?? '',
          columnId,
          labelIds: selectedLabelIds
        })
      );
      setIsSaving(false);
      setOpen(false);
      return;
    }
    if (task) {
      await dispatch(
        updateTaskAsync({
          ...task,
          title: data.title.trim(),
          color: data.color,
          description: data.description?.trim() ?? '',
          labelIds: selectedLabelIds
        })
      );
    }
    setIsSaving(false);
    setIsEditing(false);
  });

  const dialogTitle = (() => {
    if (isCreate) return 'New Task';
    if (isEditing) return 'Edit Task';
    return 'Task Details';
  })();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent className="min-w-2/4 border-base-600 bg-base-800 text-base-100">
        {!isCreate && !isEditing && (
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
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        {isEditing ? (
          <form onSubmit={onSubmit} className="flex flex-col gap-y-3">
            <div className="flex gap-x-4">
              <div className="w-2/3 flex flex-col gap-y-2">
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
                  label="Description"
                  name="description"
                  register={register}
                  control={control}
                  fieldType="textarea"
                  placeholder="Add a more detailed description..."
                  maxLength={TASK_DESCRIPTION_MAX_LENGTH}
                />
              </div>
              <div className="w-1/3 flex flex-col gap-y-2">
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
                <div className="flex flex-col gap-y-1">
                  <p className="font-medium">Labels</p>
                  <LabelToggleList
                    labels={availableLabels}
                    selectedLabelIds={selectedLabelIds}
                    onToggle={toggleLabel}
                    emptyMessage="No labels yet. Create one from the labels panel."
                  />
                </div>
              </div>
            </div>
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
                {isCreate ? 'Add' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          task && (
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
              <div className="flex flex-col gap-y-1">
                <p className="text-sm font-medium text-base-400">Labels</p>
                {task.labels.length > 0 ? (
                  <ScrollArea
                    className="max-h-24 w-[calc(100%+8px)] -ml-2"
                    viewportClassName="pl-2"
                  >
                    <div className="flex flex-wrap gap-1 pr-2">
                      {task.labels.map((label) => (
                        <LabelBadge key={label.id} label={label} />
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <p className="text-base-400 italic">No labels</p>
                )}
              </div>
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export { TaskDialog };
