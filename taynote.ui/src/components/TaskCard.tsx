'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, CheckCircle2, Maximize2, Pencil, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/base/Button';
import Input from '@/components/base/Input';
import { LoadingSpinner } from '@/components/base/LoadingSpinner';
import { TaskDetailDialog } from '@/components/TaskDetailDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { VerificationRequiredButton } from '@/components/VerificationRequiredButton';
import { useAppDispatch } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { Task, TaskWithStatus } from '@/models/Task';
import { TaskFormData, TaskFormSchema } from '@/schemas/TaskSchema';
import { addTaskAsync, deleteTaskAsync, updateTaskAsync } from '@/services/taskService';

interface NewTaskCardProps {
  columnId: string;
  onCancel: () => void;
}

interface TaskCardProps {
  task: TaskWithStatus;
}

interface TaskColorSwatchProps {
  task: Task;
  disabled?: boolean;
}

const TaskColorSwatch = ({ task, disabled }: TaskColorSwatchProps) => {
  const dispatch = useAppDispatch();
  const [color, setColor] = useState<string>(task.color);

  useEffect(() => {
    setColor(task.color);
  }, [task.color]);

  const commitColor = () => {
    if (color !== task.color) {
      dispatch(updateTaskAsync({ ...task, color }));
    }
  };

  return (
    <input
      type="color"
      value={color}
      disabled={disabled}
      onChange={(e) => setColor(e.target.value)}
      onBlur={commitColor}
      aria-label="Task color"
      title="Change task color"
      className="absolute inset-y-0 left-0 w-2 h-full shrink-0 cursor-pointer appearance-none border-0 bg-transparent p-0 outline-none transition-[width] duration-150 hover:w-3 disabled:cursor-not-allowed [&::-webkit-color-swatch]:w-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:h-full [&::-webkit-color-swatch-wrapper]:w-full [&::-webkit-color-swatch-wrapper]:p-0 [&::-moz-color-swatch]:h-full [&::-moz-color-swatch]:w-full [&::-moz-color-swatch]:border-0"
    />
  );
};

const NewTaskPlaceholder = () => {
  return (
    <div className="w-full h-56 flex items-center justify-center animate-pulse bg-base-700/10">
      <p className="text-base-300/50">New Task</p>
    </div>
  );
};

const TaskCardSkeleton = () => {
  return (
    <div className="w-full flex flex-col p-2 gap-y-2 border-l-4 border-base-600 bg-base-700">
      <div className="flex justify-between gap-x-2">
        <Skeleton className="h-4 w-2/3 bg-base-600" />
        <Skeleton className="size-6 rounded-full bg-base-600" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="size-6 rounded-full bg-base-600" />
      </div>
    </div>
  );
};

const TaskDropPlaceholder = () => {
  return (
    <div className="w-full h-14 shrink-0 rounded-l-lg border-2 border-dashed border-indigo-500/50" />
  );
};

const TaskDragOverlay = (task: Task) => {
  return (
    <div
      className={cn(
        'w-full relative flex flex-col transition-colors duration-200 p-2 gap-y-2 border-l-4',
        task.completed ? 'bg-base-950' : 'bg-base-700'
      )}
      style={{ borderLeftColor: task.color }}
    >
      <p>{task.title}</p>
    </div>
  );
};

const NewTaskCard = ({ columnId, onCancel }: NewTaskCardProps) => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormData>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: { color: '#4f46e5' }
  });

  const onSubmit = async (data: TaskFormData) => {
    await dispatch(addTaskAsync({ ...data, columnId }));
    onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-y-1 p-2 bg-base-700"
    >
      <Input<TaskFormData>
        errors={errors}
        label="Title"
        name="title"
        register={register}
        required
        placeholder="Task Title"
        autoFocus
      />
      <Input<TaskFormData>
        errors={errors}
        label="Color"
        name="color"
        register={register}
        control={control}
        setValue={setValue}
        fieldType="color"
        required
        className="w-full"
      />
      <div className="grid grid-cols-2 gap-x-2">
        <Button colorVariant="green" type="submit" className="rounded" disabled={isSubmitting}>
          Add
        </Button>
        <Button colorVariant="base" className="rounded" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const TaskCard = ({ task }: TaskCardProps) => {
  const dispatch = useAppDispatch();
  const { isUpdating, isDeleting, ...taskData } = task;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskFormData>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: { title: task.title, color: task.color }
  });

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const isEditingTitleRef = useRef<boolean>(false);

  const onDeleteTask = async () => {
    await dispatch(deleteTaskAsync({ taskId: task.id, columnId: task.columnId }));
  };

  const onCompleteTask = async () => {
    await dispatch(updateTaskAsync({ ...taskData, completed: !task.completed }));
  };

  const closeEditingTitle = () => {
    isEditingTitleRef.current = false;
    setIsEditingTitle(false);
  };

  const startEditingTitle = () => {
    isEditingTitleRef.current = true;
    setIsEditingTitle(true);
  };

  const confirmEditingTitle = handleSubmit(async ({ title }) => {
    if (!isEditingTitleRef.current) return;
    const trimmed = title.trim();
    if (trimmed && trimmed !== task.title) {
      await dispatch(updateTaskAsync({ ...taskData, title: trimmed }));
    }
    closeEditingTitle();
  });

  const cancelEditingTitle = () => {
    if (!isEditingTitleRef.current) return;
    reset({ title: task.title, color: task.color });
    closeEditingTitle();
  };

  return (
    <div
      className={cn(
        'w-full relative flex flex-col transition-colors duration-200 p-2 pl-4 gap-y-2',
        task.completed ? 'bg-base-900/50' : 'bg-base-700',
        (isUpdating || isDeleting) && 'opacity-50'
      )}
    >
      <TaskColorSwatch task={taskData} disabled={isUpdating || isDeleting} />
      <div className={cn('flex justify-between gap-x-2', isEditingTitle && 'flex-col')}>
        {isEditingTitle ? (
          <Input<TaskFormData>
            autoFocus
            errors={errors}
            name="title"
            register={register}
            placeholder="New Task"
            readOnly={!isEditingTitle}
            onBlur={cancelEditingTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') confirmEditingTitle();
              if (e.key === 'Escape') cancelEditingTitle();
            }}
            iconError
            className="w-full rounded-none font-bold p-0 bg-base-700 text-base-100"
          />
        ) : (
          <p>{task.title}</p>
        )}
        <div className={cn('h-fit flex items-center', isEditingTitle && 'justify-end')}>
          {isEditingTitle ? (
            <>
              <Button
                colorVariant="green"
                className="border"
                onPointerDown={(e) => e.preventDefault()}
                onClick={confirmEditingTitle}
                disabled={isUpdating}
              >
                <Check size={14} />
              </Button>
              <Button
                colorVariant="red"
                className="border"
                onPointerDown={(e) => e.preventDefault()}
                onClick={cancelEditingTitle}
              >
                <X size={14} />
              </Button>
            </>
          ) : (
            <>
              {!task.completed && (
                <Button
                  colorVariant="ghost"
                  className="rounded-full p-1"
                  onClick={startEditingTitle}
                >
                  <Pencil size={14} />
                </Button>
              )}
              <TaskDetailDialog
                task={taskData}
                button={
                  <Button colorVariant="ghost" className="rounded-full p-1" title="Task details">
                    <Maximize2 size={14} />
                  </Button>
                }
              />
              <VerificationRequiredButton
                button={
                  <Button colorVariant="ghost" className="rounded-full p-1" disabled={isDeleting}>
                    <X size={16} />
                  </Button>
                }
                description="This action cannot be undone. This will permanently delete your task."
                handleAccept={onDeleteTask}
              />
            </>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>{(isUpdating || isDeleting) && <LoadingSpinner className="size-4" />}</div>
        {!isEditingTitle && (
          <Button
            colorVariant="ghost"
            className={cn('rounded-full p-0', task.completed && 'bg-green-900')}
            onClick={onCompleteTask}
            disabled={isUpdating}
          >
            <CheckCircle2 />
          </Button>
        )}
      </div>
    </div>
  );
};

export {
  NewTaskPlaceholder,
  TaskCardSkeleton,
  TaskDropPlaceholder,
  TaskDragOverlay,
  NewTaskCard,
  TaskCard
};
