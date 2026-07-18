'use client';
import React, { useEffect } from 'react';

import { Column } from '@/components/Column';
import { NewColumnForm } from '@/components/NewColumnForm';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getColumnsAsync } from '@/services/columnService';
import { selectColumns } from '@/slices/columnSlice';

const Board = () => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectColumns);

  useEffect(() => {
    dispatch(getColumnsAsync());
  }, [dispatch]);

  return (
    <ScrollArea>
      <div className="size-full flex p-2 pb-4 gap-x-4">
        {columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
        <NewColumnForm />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export { Board };
