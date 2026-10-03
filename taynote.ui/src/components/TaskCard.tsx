'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, CheckCircle2, Maximize2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/base/Button';
import Input from '@/components/base/Input';
import { LoadingSpinner } from '@/components/base/LoadingSpinner';
import { LabelBadge } from '@/components/Label';
import { TaskDialog } from '@/components/TaskDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { VerificationRequiredButton } from '@/components/VerificationRequiredButton';
import { useAppDispatch } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { Task, TaskWithStatus } from '@/models/Task';
import { TaskFormData, TaskFormSchema } from '@/schemas/TaskSchema';
import { deleteTaskAsync, updateTaskAsync } from '@/services/taskService';

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
      className="absolute inset-y-0 left-0 h-full w-1.5 shrink-0 cursor-pointer appearance-none border-0 bg-transparent p-0 outline-none transition-[width] duration-150 hover:w-2.5 disabled:cursor-not-allowed [&::-webkit-color-swatch]:w-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:h-full [&::-webkit-color-swatch-wrapper]:w-full [&::-webkit-color-swatch-wrapper]:p-0 [&::-moz-color-swatch]:h-full [&::-moz-color-swatch]:w-full [&::-moz-color-swatch]:border-0"
    />
  );
};

const TaskCardSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-y-2 rounded-lg border bg-base-700/60 p-3">
      <div className="flex justify-between gap-x-2">
        <Skeleton className="h-4 w-2/3 bg-base-600/60" />
        <Skeleton className="size-5 rounded-full bg-base-600/60" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="size-5 rounded-full bg-base-600/60" />
      </div>
    </div>
  );
};

const TaskDropPlaceholder = () => {
  return (
    <div className="h-14 w-full shrink-0 rounded-lg border-2 border-dashed border-indigo-500/40 bg-indigo-500/5" />
  );
};

const TaskDragOverlay = (task: Task) => {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-lg border border-l-4 p-3 shadow-2xl',
        task.completed ? 'bg-base-900' : 'bg-base-700'
      )}
      style={{ borderLeftColor: task.color }}
    >
      <p>{task.title}</p>
    </div>
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
        'group/card relative flex min-w-0 flex-1 flex-col gap-y-2 py-2 pr-2 pl-3 transition-colors duration-200',
        task.completed && 'bg-black/20',
        (isUpdating || isDeleting) && 'opacity-50'
      )}
    >
      <TaskColorSwatch task={taskData} disabled={isUpdating || isDeleting} />
      <div className={cn('flex justify-between', isEditingTitle ? 'gap-x-0' : 'gap-x-2')}>
        <Input<TaskFormData>
          errors={errors}
          name="title"
          register={register}
          placeholder="New Task"
          readOnly={!isEditingTitle}
          disabled={task.completed}
          onFocus={startEditingTitle}
          onBlur={cancelEditingTitle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              confirmEditingTitle();
            }
            if (e.key === 'Escape') cancelEditingTitle();
          }}
          iconError
          fieldType="textarea"
          className={cn(
            'w-full field-sizing-content resize-none rounded-md border-transparent bg-transparent px-1.5 py-1 text-sm font-medium text-base-100 shadow-none disabled:cursor-default disabled:opacity-100',
            task.completed && 'text-base-400 line-through',
            isEditingTitle && 'border-indigo-400 bg-base-900/60 ring-2 ring-indigo-500/30'
          )}
        />
        <div className="flex h-fit items-center [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:transition-opacity group-hover/card:opacity-100 group-focus-within/card:opacity-100">
          {isEditingTitle ? (
            <>
              <Button
                colorVariant="green"
                className="size-7 p-0"
                onPointerDown={(e) => e.preventDefault()}
                onClick={confirmEditingTitle}
                disabled={isUpdating}
                title="Save title"
              >
                <Check size={14} />
              </Button>
              <Button
                colorVariant="red"
                className="size-7 p-0"
                onPointerDown={(e) => e.preventDefault()}
                onClick={cancelEditingTitle}
                title="Cancel title edit"
              >
                <X size={14} />
              </Button>
            </>
          ) : (
            <>
              <TaskDialog
                mode="view"
                task={taskData}
                button={
                  <Button colorVariant="ghost" className="p-1.5" title="Task details">
                    <Maximize2 size={14} />
                  </Button>
                }
              />
              <VerificationRequiredButton
                button={
                  <Button
                    colorVariant="ghost"
                    className="p-1.5 hover:bg-red-500/15 hover:text-red-300"
                    disabled={isDeleting}
                    title="Delete task"
                  >
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
        <div className="flex items-center gap-x-1">
          {(isUpdating || isDeleting) && <LoadingSpinner className="size-4" />}
          {task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.labels.map((label) => (
                <LabelBadge key={label.id} label={label} />
              ))}
            </div>
          )}
        </div>
        <Button
          colorVariant="ghost"
          className={cn(
            'rounded-full p-1',
            task.completed && 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
          )}
          onClick={onCompleteTask}
          disabled={isUpdating || isEditingTitle}
          title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <CheckCircle2 size={18} />
        </Button>
      </div>
    </div>
  );
};

export { TaskCardSkeleton, TaskDropPlaceholder, TaskDragOverlay, TaskCard };
