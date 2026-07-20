'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpRight, Check, Pencil, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/base/Button';
import Input from '@/components/base/Input';
import { LinkButton } from '@/components/base/LinkButton';
import { LoadingSpinner } from '@/components/base/LoadingSpinner';
import { NewBoardForm } from '@/components/NewBoardForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { VerificationRequiredButton } from '@/components/VerificationRequiredButton';
import { SKELETON_KEYS } from '@/constants/generalConstants';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { BoardWithStatus } from '@/models/Board';
import { BoardFormData, BoardFormSchema } from '@/schemas/BoardSchema';
import { updateBoardAsync, deleteBoardAsync, getBoardsAsync } from '@/services/boardService';
import { selectBoards, selectGetBoardsIsLoading } from '@/slices/boardSlice';

interface BoardButtonProps {
  board: BoardWithStatus;
}

const BoardSkeleton = () => {
  return <Skeleton className="h-9 rounded-none bg-base-700" />;
};

const BoardLink = ({ board }: BoardButtonProps) => {
  const dispatch = useAppDispatch();
  const { isUpdating, isDeleting } = board;

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
      await dispatch(updateBoardAsync({ id: board.id, name: trimmed }));
    }
    setIsEditingName(false);
  });

  const cancelEditing = () => {
    reset({ name: board.name });
    setIsEditingName(false);
  };

  return (
    <div className={cn('w-full flex', (isUpdating || isDeleting) && 'opacity-50')}>
      {isEditingName ? (
        <>
          <div className="w-full relative">
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
              disabled={isUpdating || isDeleting}
            />
            {isUpdating && (
              <LoadingSpinner className="size-5 absolute top-1/2 right-4.5 -translate-y-1/2" />
            )}
          </div>
          <Button
            colorVariant="green"
            onPointerDown={(e) => e.preventDefault()}
            onClick={confirmEditing}
            disabled={isUpdating}
          >
            <Check />
          </Button>
          <Button
            colorVariant="red"
            onPointerDown={(e) => e.preventDefault()}
            onClick={cancelEditing}
            disabled={isUpdating}
          >
            <X />
          </Button>
        </>
      ) : (
        <>
          <LinkButton
            href={isDeleting ? '' : `/board/${board.id}`}
            colorVariant="secondary"
            className="w-full justify-between px-4"
          >
            {board.name}{' '}
            {isUpdating || isDeleting ? <LoadingSpinner className="size-5" /> : <ArrowUpRight />}
          </LinkButton>
          <Button
            colorVariant="white"
            onClick={() => setIsEditingName(true)}
            disabled={isUpdating || isDeleting}
          >
            <Pencil />
          </Button>
          <VerificationRequiredButton
            button={
              <Button colorVariant="red" disabled={isDeleting}>
                <Trash2 />
              </Button>
            }
            description="This action cannot be undone. This will permanently delete your board."
            handleAccept={onDeleteBoard}
          />
        </>
      )}
    </div>
  );
};

const BoardList = () => {
  const dispatch = useAppDispatch();
  const boards = useAppSelector(selectBoards);
  const isLoading = useAppSelector(selectGetBoardsIsLoading);

  useEffect(() => {
    dispatch(getBoardsAsync());
  }, [dispatch]);

  return (
    <section className="flex flex-col gap-y-2">
      <NewBoardForm />
      <ScrollArea
        className="w-[calc(100%+24px)] min-h-0 flex-1 -ml-2 pr-4"
        viewportClassName="pl-2"
      >
        <div className="flex flex-col gap-y-2">
          {isLoading && boards.length === 0
            ? SKELETON_KEYS.map((key) => <BoardSkeleton key={key} />)
            : boards.map((board) => <BoardLink key={board.id} board={board} />)}
        </div>
      </ScrollArea>
    </section>
  );
};

export { BoardList };
