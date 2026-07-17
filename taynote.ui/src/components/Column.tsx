'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import Input from './Input';
import { NewTaskCard, SkeletonTaskCard, TaskCard } from '@/components/TaskCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DEFAULT_TABLE_OPERATIONS } from '@/constants/generalConstants';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Column as ColumnType } from '@/models/Column';
import { ColumnFormData, ColumnFormSchema } from '@/schemas/ColumnSchema';
import { deleteColumnAsync, updateColumnAsync } from '@/services/columnService';
import { getTasksAsync } from '@/services/taskService';
import { selectColumnTasks } from '@/slices/taskSlice';

interface ColumnHeaderProps {
  column: ColumnType;
  setAddTaskIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
  onAddTaskClick: () => void;
}

interface ColumnProps {
  column: ColumnType;
}

const ColumnHeader = ({ column, setAddTaskIsHovered, onAddTaskClick }: ColumnHeaderProps) => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ColumnFormData>({
    resolver: zodResolver(ColumnFormSchema),
    defaultValues: { name: column.name }
  });

  const [isEditingName, setIsEditingName] = useState(false);

  const onDeleteColumn = async () => {
    await dispatch(deleteColumnAsync(column.id));
  };

  const startEditing = () => {
    reset({ name: column.name });
    setIsEditingName(true);
  };

  const confirmEditing = handleSubmit(async ({ name }) => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== column.name) {
      await dispatch(updateColumnAsync({ id: column.id, name: trimmed }));
    }
    setIsEditingName(false);
  });

  const cancelEditing = () => {
    reset({ name: column.name });
    setIsEditingName(false);
  };

  return (
    <div className="flex shrink-0 overflow-x-hidden overflow-y-visible border-b bg-indigo-900">
      <Input<ColumnFormData>
        errors={errors}
        name="name"
        register={register}
        placeholder="New Column"
        readOnly={!isEditingName}
        onFocus={startEditing}
        onBlur={cancelEditing}
        onKeyDown={(e) => {
          if (e.key === 'Enter') confirmEditing();
          if (e.key === 'Escape') cancelEditing();
        }}
        iconError
        className="w-full rounded-none bg-transparent p-2 text-center font-bold text-base-100"
      />
      {isEditingName ? (
        <>
          <button className="border border-b-0 p-2 bg-green-800" onClick={confirmEditing}>
            <Check />
          </button>
          <button className="border border-b-0 p-2 bg-red-900" onClick={cancelEditing}>
            <X />
          </button>
        </>
      ) : (
        <>
          <button
            className="border border-b-0 p-2 bg-indigo-950"
            onPointerEnter={() => setAddTaskIsHovered(true)}
            onPointerLeave={() => setAddTaskIsHovered(false)}
            onClick={onAddTaskClick}
          >
            <Plus />
          </button>
          <button className="border border-b-0 p-2 bg-red-950" onClick={onDeleteColumn}>
            <Trash2 />
          </button>
        </>
      )}
    </div>
  );
};

const Column = ({ column }: ColumnProps) => {
  const dispatch = useAppDispatch();
  const [addTaskIsHovered, setAddTaskIsHovered] = useState<boolean>(false);
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false);
  const { tasks, pageIndex, hasMore, isLoading } = useAppSelector(selectColumnTasks(column.id));

  useEffect(() => {
    dispatch(getTasksAsync({ ...DEFAULT_TABLE_OPERATIONS, columnId: column.id, pageIndex: 1 }));
  }, [dispatch, column.id]);

  const onScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    if (!hasMore || isLoading) return;
    const target = e.currentTarget;
    const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    if (nearBottom) {
      dispatch(
        getTasksAsync({
          ...DEFAULT_TABLE_OPERATIONS,
          columnId: column.id,
          pageIndex: pageIndex + 1
        })
      );
    }
  };

  return (
    <section className="w-64 h-[calc(100vh-150px)] flex flex-col overflow-y-hidden shrink-0 rounded-b-md bg-base-800">
      <ColumnHeader
        column={column}
        setAddTaskIsHovered={setAddTaskIsHovered}
        onAddTaskClick={() => setIsCreatingTask(true)}
      />
      <ScrollArea className="min-h-0 flex-1 p-1" onScroll={onScroll}>
        <div className="flex flex-col items-center gap-y-1">
          {!isCreatingTask && addTaskIsHovered && <SkeletonTaskCard />}
          {isCreatingTask && (
            <NewTaskCard columnId={column.id} onCancel={() => setIsCreatingTask(false)} />
          )}
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </ScrollArea>
    </section>
  );
};

export { Column };
