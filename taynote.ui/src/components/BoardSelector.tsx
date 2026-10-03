'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getBoardsAsync } from '@/services/boardService';
import { selectBoards } from '@/slices/boardSlice';

const BoardSelector = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { boardId } = useParams<{ boardId?: string }>();
  const boards = useAppSelector(selectBoards);

  useEffect(() => {
    dispatch(getBoardsAsync());
  }, [dispatch]);

  const onValueChange = (value: string) => {
    router.push(`/board/${value}`);
  };

  if (!boardId) return;
  return (
    <Select value={boardId} onValueChange={onValueChange}>
      <SelectTrigger className="max-w-40 min-w-0 border-white/10 bg-base-800 font-medium text-base-100 hover:bg-base-700 sm:max-w-64">
        <SelectValue placeholder="Board Name" />
      </SelectTrigger>
      <SelectContent
        position="popper"
        align="end"
        className="border-white/10 bg-base-800 text-base-200"
      >
        {boards.map((board) => (
          <SelectItem key={board.id} value={board.id}>
            <p>{board.name}</p>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { BoardSelector };
