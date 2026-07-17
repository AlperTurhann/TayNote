'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, X } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

import Input from '@/components/Input';
import { useAppDispatch } from '@/lib/hooks';
import { Task } from '@/models/Task';
import { TaskFormData, TaskFormSchema } from '@/schemas/TaskSchema';
import { addTaskAsync, deleteTaskAsync } from '@/services/taskService';

interface NewTaskCardProps {
  columnId: string;
  onCancel: () => void;
}

interface TaskCardProps {
  task: Task;
}

const SkeletonTaskCard = () => {
  return (
    <div className="w-full h-24 flex items-center justify-center animate-pulse bg-base-700/10">
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
      <div className="flex gap-x-2">
        <button type="submit" className="flex-1 rounded bg-indigo-700 p-1 text-base-100">
          Add
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded bg-base-600 p-1 text-base-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const TaskCard = ({ task }: TaskCardProps) => {
  const dispatch = useAppDispatch();

  const onDeleteTask = async () => {
    await dispatch(deleteTaskAsync(task.id));
  };

  return (
    <div className="w-full p-2 bg-base-700 border-l-4" style={{ borderLeftColor: task.color }}>
      <div className="flex justify-between gap-x-2">
        {task.title}
        <div className="h-fit flex items-center">
          <button
            className="size-6 rounded-full place-items-center hover:bg-white/10 disabled:text-gray-500/50 disabled:pointer-events-none"
            onClick={() => {}}
            disabled
          >
            <Pencil size={14} />
          </button>
          <button
            className="size-6 rounded-full place-items-center hover:bg-white/10"
            onClick={onDeleteTask}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export { SkeletonTaskCard, NewTaskCard, TaskCard };
