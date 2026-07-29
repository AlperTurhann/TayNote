'use client';
import {
  closestCenter,
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

import { ClearFiltersButton } from '@/components/ClearFiltersButton';
import { ColumnDragOverlay, ColumnSkeleton } from '@/components/Column';
import { SortableColumn } from '@/components/dnd/SortableColumn';
import { NewColumnForm } from '@/components/NewColumnForm';
import { TaskSearchBar } from '@/components/SearchBar';
import { TaskDragOverlay } from '@/components/TaskCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SKELETON_KEYS } from '@/constants/generalConstants';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Column } from '@/models/Column';
import { Task } from '@/models/Task';
import { getColumnsAsync, moveColumnAsync } from '@/services/columnService';
import { moveTaskAsync } from '@/services/taskService';
import { columnsReordered, selectColumns, selectGetColumnsIsLoading } from '@/slices/columnSlice';
import { taskMovedLocally } from '@/slices/taskSlice';

interface BoardProps {
  boardId: string;
}

interface DragOverTarget {
  columnId: string;
  index: number;
}

const Board = ({ boardId }: BoardProps) => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectColumns);
  const isLoading = useAppSelector(selectGetColumnsIsLoading);
  const byColumn = useAppSelector((state) => state.task.byColumn);
  const [activeDragContent, setActiveDragContent] = useState<Column | Task | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<DragOverTarget | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const collisionDetection: CollisionDetection = (args) => {
    const activeType = args.active.data.current?.type;
    const droppableContainers = args.droppableContainers.filter((container) =>
      activeType === 'column'
        ? container.data.current?.type === 'column'
        : container.data.current?.type !== 'column'
    );
    return closestCenter({ ...args, droppableContainers });
  };

  useEffect(() => {
    dispatch(getColumnsAsync(boardId));
  }, [dispatch, boardId]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const type = active.data.current?.type;
    if (type === 'column') {
      setActiveDragContent(columns.find((column) => column.id === active.id) ?? null);
    } else if (type === 'task') {
      const columnId = active.data.current?.columnId as string;
      const task = byColumn[columnId]?.tasks.find((t) => t.id === active.id);
      setActiveDragContent(task ?? null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (active.data.current?.type !== 'task' || !over) {
      setDragOverTarget(null);
      return;
    }

    const sourceColumnId = active.data.current?.columnId as string;
    const overData = over.data.current;
    const destColumnId =
      overData?.type === 'task' || overData?.type === 'column-tasks'
        ? (overData.columnId as string)
        : undefined;

    if (!destColumnId || destColumnId === sourceColumnId) {
      setDragOverTarget(null);
      return;
    }

    const destTasks = byColumn[destColumnId]?.tasks ?? [];
    const index =
      overData?.type === 'task'
        ? Math.max(
            0,
            destTasks.findIndex((task) => task.id === over.id)
          )
        : destTasks.length;

    setDragOverTarget({ columnId: destColumnId, index });
  };

  const handleColumnDragEnd = (activeId: string, over: NonNullable<DragEndEvent['over']>) => {
    if (activeId === over.id) return;
    const oldIndex = columns.findIndex((column) => column.id === activeId);
    const newIndex = columns.findIndex((column) => column.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    dispatch(columnsReordered(arrayMove(columns, oldIndex, newIndex).map((column) => column.id)));
    dispatch(moveColumnAsync({ id: activeId, boardId, targetIndex: newIndex }));
  };

  const handleTaskDragEnd = (
    taskId: string,
    sourceColumnId: string,
    over: NonNullable<DragEndEvent['over']>
  ) => {
    const overData = over.data.current;
    const destColumnId =
      overData?.type === 'task' || overData?.type === 'column-tasks'
        ? (overData.columnId as string)
        : undefined;
    if (!destColumnId) return;

    const destTasks = byColumn[destColumnId]?.tasks ?? [];
    const targetIndex =
      overData?.type === 'task'
        ? (() => {
            const overIndex = destTasks.findIndex((task) => task.id === over.id);
            return overIndex === -1 ? destTasks.length : overIndex;
          })()
        : destTasks.length;

    if (sourceColumnId === destColumnId) {
      const currentIndex = (byColumn[sourceColumnId]?.tasks ?? []).findIndex(
        (task) => task.id === taskId
      );
      if (currentIndex === -1 || currentIndex === targetIndex) return;
    }

    dispatch(taskMovedLocally({ taskId, sourceColumnId, destColumnId, targetIndex }));
    dispatch(moveTaskAsync({ id: taskId, columnId: destColumnId, sourceColumnId, targetIndex }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragContent(null);
    setDragOverTarget(null);
    if (!over) return;

    const activeData = active.data.current;
    if (activeData?.type === 'column') {
      handleColumnDragEnd(active.id as string, over);
    } else if (activeData?.type === 'task') {
      handleTaskDragEnd(active.id as string, activeData.columnId as string, over);
    }
  };

  const handleDragCancel = () => {
    setActiveDragContent(null);
    setDragOverTarget(null);
  };

  return (
    <>
      <div className="flex items-center px-2 gap-x-2">
        <TaskSearchBar />
        <ClearFiltersButton />
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <ScrollArea className="flex-1 min-h-0" viewportClassName="[&>div]:h-full [&>div]:block!">
          <div className="size-full flex p-2 pb-4 gap-x-4">
            {isLoading && columns.length === 0 ? (
              SKELETON_KEYS.map((key) => <ColumnSkeleton key={key} />)
            ) : (
              <SortableContext
                items={columns.map((column) => column.id)}
                strategy={horizontalListSortingStrategy}
              >
                {columns.map((column) => (
                  <SortableColumn
                    key={column.id}
                    column={column}
                    placeholderIndex={
                      dragOverTarget?.columnId === column.id ? dragOverTarget.index : null
                    }
                    taskCrossedColumn={dragOverTarget !== null}
                  />
                ))}
              </SortableContext>
            )}
            <NewColumnForm boardId={boardId} />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <DragOverlay>
          {activeDragContent &&
            ('name' in activeDragContent ? (
              <ColumnDragOverlay name={activeDragContent.name} />
            ) : (
              <TaskDragOverlay {...activeDragContent} />
            ))}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export { Board };
