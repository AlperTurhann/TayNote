'use client';
import React, { useEffect } from 'react';

import { ClearFiltersButton } from '@/components/ClearFiltersButton';
import { Column, ColumnSkeleton } from '@/components/Column';
import { NewColumnForm } from '@/components/NewColumnForm';
import { TaskSearchBar } from '@/components/SearchBar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SKELETON_KEYS } from '@/constants/generalConstants';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getColumnsAsync } from '@/services/columnService';
import { selectColumns, selectGetColumnsIsLoading } from '@/slices/columnSlice';

interface BoardProps {
  boardId: string;
}

const Board = ({ boardId }: BoardProps) => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectColumns);
  const isLoading = useAppSelector(selectGetColumnsIsLoading);

  useEffect(() => {
    dispatch(getColumnsAsync(boardId));
  }, [dispatch, boardId]);

  return (
    <>
      <div className="flex items-center px-2 gap-x-2">
        <TaskSearchBar />
        <ClearFiltersButton />
      </div>
      <ScrollArea className="flex-1" viewportClassName="[&>div]:h-full">
        <div className="size-full flex p-2 pb-4 gap-x-4">
          {isLoading && columns.length === 0
            ? SKELETON_KEYS.map((key) => <ColumnSkeleton key={key} />)
            : columns.map((column) => <Column key={column.id} column={column} />)}
          <NewColumnForm boardId={boardId} />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};

export { Board };
