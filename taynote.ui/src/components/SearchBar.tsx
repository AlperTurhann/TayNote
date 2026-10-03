'use client';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from './base/Button';
import { LoadingSpinner } from '@/components/base/LoadingSpinner';
import { DEFAULT_TABLE_OPERATIONS } from '@/constants/generalConstants';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { applyGlobalFiltersAsync, getTasksAsync } from '@/services/taskService';
import { selectColumnTasks, selectGlobalQuery } from '@/slices/taskSlice';
import {
  parseFilters,
  parseGlobalQuery,
  withColumnFilter,
  withGlobalQuery
} from '@/utils/boardSearchParams';

interface ColumnSearchBarProps {
  columnId: string;
  isLoading?: boolean;
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
    dispatch(applyGlobalFiltersAsync({ query: trimmed }));
    const updated = withGlobalQuery(searchParams, trimmed);
    router.replace(`${pathname}?${updated.toString()}`, { scroll: false });
  };

  useEffect(() => {
    reset({ query: effectiveQuery });
  }, [effectiveQuery, reset]);

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data.query))}
      role="search"
      className="flex h-9 min-w-48 flex-1 items-center rounded-md border border-white/10 bg-base-800 transition-colors focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/30 sm:max-w-sm"
    >
      <Button
        colorVariant="ghost"
        type="submit"
        className="h-full shrink-0 rounded-r-none px-2.5"
        title="Search board"
      >
        <Search size={16} />
      </Button>
      <input
        {...register('query')}
        placeholder="Search board"
        aria-label="Search board"
        className="h-full min-w-0 flex-1 bg-transparent pr-3 text-sm text-base-100 outline-none placeholder:text-base-500"
      />
    </form>
  );
};

const ColumnSearchBar = ({ columnId, isLoading = false }: ColumnSearchBarProps) => {
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
      role="search"
      className={cn(
        'mx-2 mb-2 flex h-8 items-center rounded-md border border-white/10 bg-base-900/60 transition-colors focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/30',
        isLoading && 'opacity-70'
      )}
    >
      <input
        {...register('query')}
        placeholder="Filter tasks"
        aria-label="Search column"
        className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm text-base-100 outline-none placeholder:text-base-500"
        disabled={isLoading}
      />
      <Button
        colorVariant="ghost"
        type="submit"
        className="h-full shrink-0 rounded-l-none px-2"
        disabled={isLoading}
        title="Search column"
      >
        {isLoading ? <LoadingSpinner className="size-4" /> : <Search size={14} />}
      </Button>
    </form>
  );
};

export { TaskSearchBar, ColumnSearchBar };
