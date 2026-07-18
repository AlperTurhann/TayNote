'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, CheckCircle2, Pencil, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/base/Button';
import Input from '@/components/base/Input';
import { VerificationRequiredButton } from '@/components/VerificationRequiredButton';
import { useAppDispatch } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { Task } from '@/models/Task';
import { TaskFormData, TaskFormSchema } from '@/schemas/TaskSchema';
import { addTaskAsync, deleteTaskAsync, updateTaskAsync } from '@/services/taskService';

interface NewTaskCardProps {
  columnId: string;
  onCancel: () => void;
}

interface TaskCardProps {
  task: Task;
}

const SkeletonTaskCard = () => {
  return (
    <div className="w-full h-56 flex items-center justify-center animate-pulse bg-base-700/10">
      <p className="text-base-300/50">New Task</p>
    </div>
  );
};

const NewTaskCard = ({ columnId, onCancel }: NewTaskCardProps) => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
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
        watch={watch}
        setValue={setValue}
        fieldType="color"
        required
        className="w-full"
      />
      <div className="grid grid-cols-2 gap-x-2">
        <Button colorVariant="green" type="submit" className="rounded">
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
    await dispatch(updateTaskAsync({ ...task, completed: !task.completed }));
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
      await dispatch(updateTaskAsync({ ...task, title: trimmed }));
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
        'w-full relative flex flex-col p-2 gap-y-2 border-l-4',
        task.completed ? 'bg-base-900/50' : 'bg-base-700'
      )}
      style={{ borderLeftColor: task.color }}
    >
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
              <VerificationRequiredButton
                button={
                  <Button colorVariant="ghost" className="rounded-full p-1">
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
      <div className="flex justify-end">
        {!isEditingTitle && (
          <Button
            colorVariant="ghost"
            className={cn('rounded-full p-0', task.completed && 'bg-green-900')}
            onClick={onCompleteTask}
          >
            <CheckCircle2 />
          </Button>
        )}
      </div>
    </div>
  );
};

export { SkeletonTaskCard, NewTaskCard, TaskCard };
