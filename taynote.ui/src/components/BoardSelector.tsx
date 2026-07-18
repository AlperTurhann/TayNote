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
      <SelectTrigger className="font-bold">
        <SelectValue placeholder="Board Name" />
      </SelectTrigger>
      <SelectContent className="bg-base-800 text-base-300">
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
