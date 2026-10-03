'use client';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Plus, Trash2, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/base/Button';
import Input from '@/components/base/Input';
import { SortableTaskCard } from '@/components/dnd/SortableTaskCard';
import { ColumnSearchBar } from '@/components/SearchBar';
import { TaskCardSkeleton, TaskDropPlaceholder } from '@/components/TaskCard';
import { TaskDialog } from '@/components/TaskDialog';
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
import {
  parseFilters,
  parseGlobalLabelIds,
  parseGlobalQuery,
  withColumnFilter
} from '@/utils/boardSearchParams';

interface ColumnHeaderProps {
  column: ColumnWithStatus;
  onAddTaskClick: () => void;
}

interface ColumnDragOverlayProps {
  name: string;
}

interface ColumnProps {
  column: ColumnWithStatus;
  placeholderIndex?: number | null;
  taskCrossedColumn?: boolean;
}

const ColumnSkeleton = () => {
  return (
    <section className="flex w-[82vw] max-w-80 shrink-0 flex-col gap-y-2 rounded-xl border bg-base-800 p-2 sm:w-72">
      <Skeleton className="h-9 w-full bg-base-700" />
      <Skeleton className="h-16 w-full bg-base-700/60" />
      <Skeleton className="h-16 w-full bg-base-700/60" />
    </section>
  );
};

const ColumnDropPlaceholder = () => {
  return (
    <div className="h-full w-[82vw] max-w-80 shrink-0 rounded-xl border-2 border-dashed border-indigo-500/40 bg-indigo-500/5 sm:w-72" />
  );
};

const ColumnDragOverlay = ({ name }: ColumnDragOverlayProps) => {
  return (
    <div className="h-11 w-72 place-content-center rounded-xl border bg-base-700 shadow-2xl">
      <p className="p-2 text-center font-semibold text-base-100">{name}</p>
    </div>
  );
};

const ColumnHeader = ({ column, onAddTaskClick }: ColumnHeaderProps) => {
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
      <div className="flex shrink-0 items-center gap-x-0.5 p-2">
        <Button
          colorVariant="ghost"
          className="size-8 shrink-0 p-0"
          onClick={onToggleSorting}
          title={`Sorting: ${tableOperations.sorting}`}
        >
          <SortIcon size={16} />
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
          className="w-full min-w-0 truncate border-transparent bg-transparent px-2 py-1 font-semibold text-base-100 hover:border-white/10"
          disabled={isUpdating || isDeleting}
        />
        {isEditingName ? (
          <>
            <Button
              colorVariant="green"
              className="size-8 shrink-0 p-0"
              onPointerDown={(e) => e.preventDefault()}
              onClick={confirmEditing}
              disabled={isUpdating}
              title="Save column name"
            >
              <Check size={16} />
            </Button>
            <Button
              colorVariant="red"
              className="size-8 shrink-0 p-0"
              onPointerDown={(e) => e.preventDefault()}
              onClick={cancelEditing}
              disabled={isUpdating}
              title="Cancel column name edit"
            >
              <X size={16} />
            </Button>
          </>
        ) : (
          <>
            <Button
              colorVariant="ghost"
              className="size-8 shrink-0 p-0"
              onClick={onAddTaskClick}
              disabled={isDeleting}
              title="Add task"
            >
              <Plus size={16} />
            </Button>
            <VerificationRequiredButton
              button={
                <Button
                  colorVariant="ghost"
                  className="size-8 shrink-0 p-0 hover:bg-red-500/15 hover:text-red-300"
                  disabled={isDeleting}
                  title="Delete column"
                >
                  <Trash2 size={16} />
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

const Column = ({ column, placeholderIndex = null, taskCrossedColumn = false }: ColumnProps) => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false);
  const { tasks, tableOperations, hasMore, isLoading } = useAppSelector(
    selectColumnTasks(column.id)
  );
  const dragDisabled = tableOperations.sorting !== 'none';
  const { setNodeRef: setDropZoneRef } = useDroppable({
    id: `tasks-${column.id}`,
    data: { type: 'column-tasks', columnId: column.id }
  });

  useEffect(() => {
    const columnFilter = parseFilters(searchParams)[column.id];
    const globalQuery = parseGlobalQuery(searchParams);
    const globalLabelIds = parseGlobalLabelIds(searchParams);
    const isGlobalSearch = !columnFilter && (globalQuery !== '' || globalLabelIds.length > 0);
    dispatch(
      getTasksAsync({
        ...DEFAULT_TABLE_OPERATIONS,
        sorting: columnFilter?.sorting ?? DEFAULT_TABLE_OPERATIONS.sorting,
        query: columnFilter?.query ?? globalQuery,
        labelIds: columnFilter ? [] : globalLabelIds,
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
    <section className="flex min-h-0 w-full flex-1 flex-col overflow-y-hidden rounded-b-xl border border-t-0 bg-base-800">
      <ColumnHeader column={column} onAddTaskClick={() => setIsCreatingTask(true)} />
      <ScrollArea className="min-h-0 flex-1 px-2 pb-2" onScroll={onScroll}>
        <div ref={setDropZoneRef} className="flex min-h-12 flex-col items-center gap-y-2">
          <TaskDialog
            mode="create"
            columnId={column.id}
            open={isCreatingTask}
            onOpenChange={setIsCreatingTask}
          />
          {isLoading && tasks.length === 0 ? (
            SKELETON_KEYS.map((key) => <TaskCardSkeleton key={key} />)
          ) : (
            <SortableContext
              items={tasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {tasks.flatMap((task, index) => [
                ...(placeholderIndex === index
                  ? [<TaskDropPlaceholder key="drop-placeholder" />]
                  : []),
                <SortableTaskCard
                  key={task.id}
                  task={task}
                  columnId={column.id}
                  disabled={dragDisabled}
                  hideWhileDragging={taskCrossedColumn}
                />
              ])}
              {placeholderIndex === tasks.length && <TaskDropPlaceholder key="drop-placeholder" />}
            </SortableContext>
          )}
        </div>
      </ScrollArea>
    </section>
  );
};

export { ColumnSkeleton, ColumnDropPlaceholder, ColumnDragOverlay, Column };
