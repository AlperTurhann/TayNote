'use client';
import { Search } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from './base/Button';
import { DEFAULT_TABLE_OPERATIONS } from '@/constants/generalConstants';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getTasksAsync, searchAllColumnsAsync } from '@/services/taskService';
import { selectColumnTasks, selectGlobalQuery } from '@/slices/taskSlice';

interface ColumnSearchBarProps {
  columnId: string;
}

const TaskSearchBar = () => {
  const dispatch = useAppDispatch();
  const globalQuery = useAppSelector(selectGlobalQuery);
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: string) => {
    const trimmed = data.trim();
    if (trimmed === globalQuery) return;
    dispatch(searchAllColumnsAsync(trimmed));
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data.query))}
      className="w-fit flex items-center rounded-full border mx-auto py-2 px-4 gap-x-2 bg-base-600"
    >
      <Search size={20} />
      <input {...register('query')} placeholder="Search board" className="focus:outline-none" />
    </form>
  );
};

const ColumnSearchBar = ({ columnId }: ColumnSearchBarProps) => {
  const dispatch = useAppDispatch();
  const { tableOperations } = useAppSelector(selectColumnTasks(columnId));
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: string) => {
    const trimmed = data.trim();
    if (trimmed === tableOperations.query) return;
    dispatch(
      getTasksAsync({
        ...tableOperations,
        columnId: columnId,
        query: trimmed,
        pageIndex: DEFAULT_TABLE_OPERATIONS.pageIndex
      })
    );
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data.query))}
      className="flex items-center justify-between border gap-x-2 bg-base-600"
    >
      <input
        {...register('query')}
        placeholder="Search column"
        className="w-full px-4 focus:outline-none"
      />
      <Button colorVariant="white" type="submit" className="shrink-0">
        <Search size={20} />
      </Button>
    </form>
  );
};

export { TaskSearchBar, ColumnSearchBar };
