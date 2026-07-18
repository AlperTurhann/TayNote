'use client';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from './base/Button';
import { DEFAULT_TABLE_OPERATIONS } from '@/constants/generalConstants';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getTasksAsync, searchAllColumnsAsync } from '@/services/taskService';
import { selectColumnTasks, selectGlobalQuery } from '@/slices/taskSlice';
import {
  parseFilters,
  parseGlobalQuery,
  withColumnFilter,
  withGlobalQuery
} from '@/utils/boardSearchParams';

interface ColumnSearchBarProps {
  columnId: string;
}

const TaskSearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = parseGlobalQuery(searchParams);

  const dispatch = useAppDispatch();
  const globalQuery = useAppSelector(selectGlobalQuery);
  const effectiveQuery = globalQuery || urlQuery;
  const { register, handleSubmit, reset } = useForm({ defaultValues: { query: effectiveQuery } });

  const onSubmit = (data: string) => {
    const trimmed = data.trim();
    if (trimmed === globalQuery) return;
    dispatch(searchAllColumnsAsync(trimmed));
    const updated = withGlobalQuery(searchParams, trimmed);
    router.replace(`${pathname}?${updated.toString()}`, { scroll: false });
  };

  useEffect(() => {
    reset({ query: effectiveQuery });
  }, [effectiveQuery, reset]);

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data.query))}
      className="w-fit h-full flex items-center rounded border gap-x-2 bg-base-600"
    >
      <Button colorVariant="white" type="submit" className="h-full shrink-0 rounded-l p-2">
        <Search size={20} />
      </Button>
      <input
        {...register('query')}
        placeholder="Search board"
        className="pr-4 focus:outline-none"
      />
    </form>
  );
};

const ColumnSearchBar = ({ columnId }: ColumnSearchBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = parseFilters(searchParams)[columnId]?.query;

  const dispatch = useAppDispatch();
  const { tableOperations } = useAppSelector(selectColumnTasks(columnId));
  const effectiveQuery = tableOperations.query || initialQuery || '';
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { query: effectiveQuery }
  });

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
    const updated = withColumnFilter(searchParams, columnId, {
      sorting: tableOperations.sorting,
      query: trimmed
    });
    router.replace(`${pathname}?${updated.toString()}`, { scroll: false });
  };

  useEffect(() => {
    reset({ query: effectiveQuery });
  }, [effectiveQuery, reset]);

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
