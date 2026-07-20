'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Plus, Trash2, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/base/Button';
import Input from '@/components/base/Input';
import { ColumnSearchBar } from '@/components/SearchBar';
import { NewTaskCard, NewTaskPlaceholder, TaskCard, TaskCardSkeleton } from '@/components/TaskCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { VerificationRequiredButton } from '@/components/VerificationRequiredButton';
import { NEXT_SORTING, SORT_ICONS } from '@/constants/boardConstants';
import { DEFAULT_TABLE_OPERATIONS, SKELETON_KEYS } from '@/constants/generalConstants';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { ColumnWithStatus } from '@/models/Column';
import { ColumnFormData, ColumnFormSchema } from '@/schemas/ColumnSchema';
import { deleteColumnAsync, updateColumnAsync } from '@/services/columnService';
import { getTasksAsync } from '@/services/taskService';
import { selectColumnTasks } from '@/slices/taskSlice';
import { parseFilters, parseGlobalQuery, withColumnFilter } from '@/utils/boardSearchParams';

interface ColumnHeaderProps {
  column: ColumnWithStatus;
  setAddTaskIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
  onAddTaskClick: () => void;
}

interface ColumnProps {
  column: ColumnWithStatus;
}

const ColumnSkeleton = () => {
  return (
    <section className="w-64 flex flex-col shrink-0 rounded-b-md bg-base-800">
      <Skeleton className="h-9 w-full rounded-none bg-indigo-900" />
      <Skeleton className="h-8 w-full rounded-none bg-base-600" />
    </section>
  );
};

const ColumnHeader = ({ column, setAddTaskIsHovered, onAddTaskClick }: ColumnHeaderProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { tableOperations } = useAppSelector(selectColumnTasks(column.id));
  const { isUpdating, isDeleting } = column;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ColumnFormData>({
    resolver: zodResolver(ColumnFormSchema),
    defaultValues: { name: column.name }
  });

  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  const onDeleteColumn = async () => {
    await dispatch(deleteColumnAsync({ columnId: column.id, boardId: column.boardId }));
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
    const sorting = NEXT_SORTING[tableOperations.sorting];
    dispatch(
      getTasksAsync({
        ...tableOperations,
        columnId: column.id,
        sorting,
        pageIndex: DEFAULT_TABLE_OPERATIONS.pageIndex
      })
    );
    const updated = withColumnFilter(searchParams, column.id, {
      sorting,
      query: tableOperations.query
    });
    router.replace(`${pathname}?${updated.toString()}`, { scroll: false });
  };

  const SortIcon = SORT_ICONS[tableOperations.sorting];

  return (
    <>
      <div className="flex items-center shrink-0 border-b bg-indigo-900">
        <Button
          colorVariant="white"
          className="h-full border border-b-0"
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
          onBlur={() => {
            if (!isUpdating) cancelEditing();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') confirmEditing();
            if (e.key === 'Escape') cancelEditing();
          }}
          iconError
          className="w-full rounded-none bg-transparent p-2 text-center font-bold text-base-100"
          disabled={isUpdating || isDeleting}
        />
        {isEditingName ? (
          <>
            <Button
              colorVariant="green"
              className="border border-b-0"
              onPointerDown={(e) => e.preventDefault()}
              onClick={confirmEditing}
              disabled={isUpdating}
            >
              <Check />
            </Button>
            <Button
              colorVariant="red"
              className="border border-b-0"
              onPointerDown={(e) => e.preventDefault()}
              onClick={cancelEditing}
              disabled={isUpdating}
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
              disabled={isDeleting}
            >
              <Plus />
            </Button>
            <VerificationRequiredButton
              button={
                <Button colorVariant="red" className="border border-b-0" disabled={isDeleting}>
                  <Trash2 />
                </Button>
              }
              description="This action cannot be undone. This will permanently delete your column."
              handleAccept={onDeleteColumn}
            />
          </>
        )}
      </div>
      <ColumnSearchBar columnId={column.id} isLoading={isUpdating || isDeleting} />
    </>
  );
};

const Column = ({ column }: ColumnProps) => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [addTaskIsHovered, setAddTaskIsHovered] = useState<boolean>(false);
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false);
  const { tasks, tableOperations, hasMore, isLoading } = useAppSelector(
    selectColumnTasks(column.id)
  );

  useEffect(() => {
    const columnFilter = parseFilters(searchParams)[column.id];
    const globalQuery = parseGlobalQuery(searchParams);
    const isGlobalSearch = !columnFilter && globalQuery !== '';
    dispatch(
      getTasksAsync({
        ...DEFAULT_TABLE_OPERATIONS,
        sorting: columnFilter?.sorting ?? DEFAULT_TABLE_OPERATIONS.sorting,
        query: columnFilter?.query ?? globalQuery,
        columnId: column.id,
        isGlobalSearch
      })
    );
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
    <section className="w-64 flex flex-col overflow-y-hidden shrink-0 rounded-b-md bg-base-800">
      <ColumnHeader
        column={column}
        setAddTaskIsHovered={setAddTaskIsHovered}
        onAddTaskClick={() => setIsCreatingTask(true)}
      />
      <ScrollArea className="min-h-0 flex-1 p-1" onScroll={onScroll}>
        <div className="flex flex-col items-center gap-y-1">
          {!isCreatingTask && addTaskIsHovered && <NewTaskPlaceholder />}
          {isCreatingTask && (
            <NewTaskCard columnId={column.id} onCancel={() => setIsCreatingTask(false)} />
          )}
          {isLoading && tasks.length === 0
            ? SKELETON_KEYS.map((key) => <TaskCardSkeleton key={key} />)
            : tasks.map((task) => <TaskCard key={task.id} task={task} />)}
        </div>
      </ScrollArea>
    </section>
  );
};

export { ColumnSkeleton, Column };
