'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from './base/Button';
import Input from './base/Input';
import { ColumnSearchBar } from '@/components/SearchBar';
import { NewTaskCard, SkeletonTaskCard, TaskCard } from '@/components/TaskCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NEXT_SORTING, SORT_ICONS } from '@/constants/boardConstants';
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
  const { tableOperations } = useAppSelector(selectColumnTasks(column.id));
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

  const onToggleSorting = () => {
    dispatch(
      getTasksAsync({
        ...tableOperations,
        columnId: column.id,
        sorting: NEXT_SORTING[tableOperations.sorting],
        pageIndex: DEFAULT_TABLE_OPERATIONS.pageIndex
      })
    );
  };

  const SortIcon = SORT_ICONS[tableOperations.sorting];

  return (
    <div className="">
      <div className="flex shrink-0 border-b bg-indigo-900">
        <Button
          colorVariant="white"
          className="border border-b-0"
          onClick={onToggleSorting}
          title={`Sorting: ${tableOperations.sorting}`}
        >
          <SortIcon size={18} />
        </Button>
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
            <Button
              colorVariant="green"
              className="border border-b-0"
              onPointerDown={(e) => e.preventDefault()}
              onClick={confirmEditing}
            >
              <Check />
            </Button>
            <Button
              colorVariant="red"
              className="border border-b-0"
              onPointerDown={(e) => e.preventDefault()}
              onClick={cancelEditing}
            >
              <X />
            </Button>
          </>
        ) : (
          <>
            <Button
              className="border border-b-0"
              onPointerEnter={() => setAddTaskIsHovered(true)}
              onPointerLeave={() => setAddTaskIsHovered(false)}
              onClick={onAddTaskClick}
            >
              <Plus />
            </Button>
            <Button colorVariant="red" className="border border-b-0" onClick={onDeleteColumn}>
              <Trash2 />
            </Button>
          </>
        )}
      </div>
      <ColumnSearchBar columnId={column.id} />
    </div>
  );
};

const Column = ({ column }: ColumnProps) => {
  const dispatch = useAppDispatch();
  const [addTaskIsHovered, setAddTaskIsHovered] = useState<boolean>(false);
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false);
  const { tasks, tableOperations, hasMore, isLoading } = useAppSelector(
    selectColumnTasks(column.id)
  );

  useEffect(() => {
    dispatch(getTasksAsync({ ...tableOperations, columnId: column.id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, column.id]);

  const onScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    if (!hasMore || isLoading) return;
    const target = e.currentTarget;
    const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    if (nearBottom) {
      dispatch(
        getTasksAsync({
          ...tableOperations,
          columnId: column.id,
          pageIndex: tableOperations.pageIndex + 1
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
