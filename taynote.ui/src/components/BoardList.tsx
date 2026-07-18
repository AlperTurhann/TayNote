'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpRight, Check, Pencil, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/base/Button';
import Input from '@/components/base/Input';
import { LinkButton } from '@/components/base/LinkButton';
import { NewBoardForm } from '@/components/NewBoardForm';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Board } from '@/models/Board';
import { BoardFormData, BoardFormSchema } from '@/schemas/BoardSchema';
import { changeBoardAsync, deleteBoardAsync, getBoardsAsync } from '@/services/boardService';
import { selectBoards } from '@/slices/boardSlice';

interface BoardButtonProps {
  board: Board;
}

const BoardLink = ({ board }: BoardButtonProps) => {
  const dispatch = useAppDispatch();

  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<BoardFormData>({
    resolver: zodResolver(BoardFormSchema),
    defaultValues: { name: board.name }
  });

  const onDeleteBoard = async () => {
    await dispatch(deleteBoardAsync(board.id));
  };

  const confirmEditing = handleSubmit(async ({ name }) => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== board.name) {
      await dispatch(changeBoardAsync({ id: board.id, name: trimmed }));
    }
    setIsEditingName(false);
  });

  const cancelEditing = () => {
    reset({ name: board.name });
    setIsEditingName(false);
  };

  return (
    <div className="w-full flex">
      {isEditingName ? (
        <>
          <Input<BoardFormData>
            autoFocus
            errors={errors}
            name="name"
            register={register}
            placeholder="New Board"
            readOnly={!isEditingName}
            onBlur={cancelEditing}
            onKeyDown={(e) => {
              if (e.key === 'Enter') confirmEditing();
              if (e.key === 'Escape') cancelEditing();
            }}
            iconError
            className="w-full rounded-none font-bold p-2 bg-base-700 text-base-100"
          />
          <Button
            colorVariant="green"
            onPointerDown={(e) => e.preventDefault()}
            onClick={confirmEditing}
          >
            <Check />
          </Button>
        </>
      ) : (
        <>
          <LinkButton
            href={`/board/${board.id}`}
            colorVariant="secondary"
            className="w-full justify-between px-4"
          >
            {board.name} <ArrowUpRight />
          </LinkButton>
          <Button colorVariant="white" onClick={() => setIsEditingName(true)}>
            <Pencil />
          </Button>
          <Button colorVariant="red" onClick={onDeleteBoard}>
            <Trash2 />
          </Button>
        </>
      )}
    </div>
  );
};

const BoardList = () => {
  const dispatch = useAppDispatch();
  const boards = useAppSelector(selectBoards);

  useEffect(() => {
    dispatch(getBoardsAsync());
  }, [dispatch]);

  return (
    <section className="flex flex-col gap-y-2">
      <NewBoardForm />
      {boards.map((board) => (
        <BoardLink key={board.id} board={board} />
      ))}
    </section>
  );
};

export { BoardList };
