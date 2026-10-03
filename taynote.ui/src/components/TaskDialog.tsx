'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/base/Button';
import Input from '@/components/base/Input';
import { LoadingSpinner } from '@/components/base/LoadingSpinner';
import { RichTextContent } from '@/components/base/RichTextContent';
import { RichTextEditor } from '@/components/base/RichTextEditor';
import { LabelBadge, LabelToggleList } from '@/components/Label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
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
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[calc(100dvh-1.5rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl max-sm:top-auto max-sm:bottom-0 max-sm:left-0 max-sm:max-w-full max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-t-2xl max-sm:rounded-b-none"
      >
        <DialogHeader className="flex-row items-center justify-between gap-x-3 border-b py-2.5 pr-3 pl-5">
          <DialogTitle className="text-base font-semibold text-base-100">{dialogTitle}</DialogTitle>
          <div className="flex items-center gap-x-1">
            {!isCreate && !isEditing && (
              <Button colorVariant="ghost" className="h-8 px-2.5 text-sm" onClick={startEditing}>
                <Pencil size={14} />
                Edit
              </Button>
            )}
            <DialogClose
              title="Close"
              className="flex size-8 items-center justify-center rounded-md text-base-300 transition-colors outline-none hover:bg-white/10 hover:text-base-100 focus-visible:ring-2 focus-visible:ring-indigo-400/70"
            >
              <X size={16} />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </DialogHeader>
        <DialogDescription className="sr-only">
          {isCreate ? 'Create a new task' : 'View or edit task details'}
        </DialogDescription>
        {isEditing ? (
          <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <div className="grid gap-x-6 gap-y-2 md:grid-cols-[minmax(0,1fr)_15rem]">
                <div className="flex min-w-0 flex-col gap-y-2">
                  <Input<TaskDetailFormData>
                    errors={errors}
                    label="Title"
                    name="title"
                    register={register}
                    required
                    placeholder="Task title"
                    autoFocus
                  />
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <RichTextEditor
                        label="Description"
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        placeholder="Add a more detailed description..."
                        maxLength={TASK_DESCRIPTION_MAX_LENGTH}
                        error={errors.description?.message}
                      />
                    )}
                  />
                </div>
                <div className="relative min-w-0">
                  <div className="flex min-w-0 flex-col gap-y-4 md:absolute md:inset-0">
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
                    <div className="flex flex-col md:min-h-0 md:flex-1">
                      <p className="mb-1.5 text-sm font-medium text-base-200">Labels</p>
                      <LabelToggleList
                        labels={availableLabels}
                        selectedLabelIds={selectedLabelIds}
                        onToggle={toggleLabel}
                        emptyMessage="No labels yet. Create one from the labels panel."
                        fill
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex-row justify-end border-t bg-base-900/40 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <Button
                colorVariant="base"
                onClick={cancelEditing}
                disabled={isSaving}
                className="flex-1 px-4 sm:min-w-24 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                colorVariant="default"
                type="submit"
                disabled={isSaving}
                className="flex-1 px-4 sm:min-w-24 sm:flex-none"
              >
                {isSaving && <LoadingSpinner className="size-4" />}
                {isCreate ? 'Add task' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          task && (
            <div className="flex min-h-0 flex-1 flex-col gap-y-5 overflow-y-auto px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="flex min-w-0 items-start gap-x-3">
                <span
                  className="mt-1.5 size-3.5 shrink-0 rounded-full ring-4 ring-white/5"
                  style={{ backgroundColor: task.color }}
                />
                <h3 className="text-xl leading-snug font-semibold wrap-break-word text-base-100">
                  {task.title}
                </h3>
              </div>
              <section className="flex flex-col gap-y-2">
                <h4 className="text-xs font-semibold tracking-wider text-base-400 uppercase">
                  Description
                </h4>
                {task.description ? (
                  <RichTextContent value={task.description} />
                ) : (
                  <p className="text-base-500 italic">No description</p>
                )}
              </section>
              <section className="flex flex-col gap-y-2">
                <h4 className="text-xs font-semibold tracking-wider text-base-400 uppercase">
                  Labels
                </h4>
                {task.labels.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {task.labels.map((label) => (
                      <LabelBadge key={label.id} label={label} className="px-2 py-1 text-sm" />
                    ))}
                  </div>
                ) : (
                  <p className="text-base-500 italic">No labels</p>
                )}
              </section>
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export { TaskDialog };
