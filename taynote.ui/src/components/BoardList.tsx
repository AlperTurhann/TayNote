'use client';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpRight, Check, Pencil, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/base/Button';
import Input from '@/components/base/Input';
import { LinkButton } from '@/components/base/LinkButton';
import { LoadingSpinner } from '@/components/base/LoadingSpinner';
import { SortableBoard } from '@/components/dnd/SortableBoard';
import { LabelChip, NewLabelForm } from '@/components/Label';
import { NewBoardForm } from '@/components/NewBoardForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { VerificationRequiredButton } from '@/components/VerificationRequiredButton';
import { SKELETON_KEYS } from '@/constants/generalConstants';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { BoardWithStatus } from '@/models/Board';
import { BoardFormData, BoardFormSchema } from '@/schemas/BoardSchema';
import {
  moveBoardAsync,
  updateBoardAsync,
  deleteBoardAsync,
  getBoardsAsync
} from '@/services/boardService';
import { getGlobalLabelsAsync } from '@/services/labelService';
import { boardsReordered, selectBoards, selectGetBoardsIsLoading } from '@/slices/boardSlice';
import { selectGetGlobalLabelsIsLoading, selectGlobalLabels } from '@/slices/labelSlice';

interface BoardButtonProps {
  board: BoardWithStatus;
}

interface BoardDragOverlayProps {
  name: string;
}

const BoardSkeleton = () => {
  return <Skeleton className="h-11 rounded-lg bg-base-700/70" />;
};

const BoardDragOverlay = ({ name }: BoardDragOverlayProps) => {
  return (
    <div className="flex h-11 items-center rounded-lg border bg-base-700 px-4 shadow-2xl">
      <p className="font-medium text-base-100">{name}</p>
    </div>
  );
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
    <div className={cn('flex w-full gap-x-1', (isUpdating || isDeleting) && 'opacity-50')}>
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
              className="w-full text-base-100"
              disabled={isUpdating || isDeleting}
            />
            {isUpdating && (
              <LoadingSpinner className="size-5 absolute top-1/2 right-4.5 -translate-y-1/2" />
            )}
          </div>
          <Button
            colorVariant="green"
            className="size-11 shrink-0 p-0"
            onPointerDown={(e) => e.preventDefault()}
            onClick={confirmEditing}
            disabled={isUpdating}
            title="Save board name"
          >
            <Check />
          </Button>
          <Button
            colorVariant="red"
            className="size-11 shrink-0 p-0"
            onPointerDown={(e) => e.preventDefault()}
            onClick={cancelEditing}
            disabled={isUpdating}
            title="Cancel board name edit"
          >
            <X />
          </Button>
        </>
      ) : (
        <>
          <LinkButton
            href={isDeleting ? '' : `/board/${board.id}`}
            colorVariant="secondary"
            className="h-11 w-full justify-between px-4 font-medium"
          >
            {board.name}{' '}
            {isUpdating || isDeleting ? (
              <LoadingSpinner className="size-5" />
            ) : (
              <ArrowUpRight size={18} className="text-base-400" />
            )}
          </LinkButton>
          <Button
            colorVariant="ghost"
            className="size-11 shrink-0 p-0"
            onClick={() => setIsEditingName(true)}
            disabled={isUpdating || isDeleting}
            title="Rename board"
          >
            <Pencil />
          </Button>
          <VerificationRequiredButton
            button={
              <Button
                colorVariant="ghost"
                className="size-11 shrink-0 p-0 hover:bg-red-500/15 hover:text-red-300"
                disabled={isDeleting}
                title="Delete board"
              >
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
  const globalLabels = useAppSelector(selectGlobalLabels);
  const isGlobalLabelsLoading = useAppSelector(selectGetGlobalLabelsIsLoading);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    dispatch(getBoardsAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getGlobalLabelsAsync());
  }, [dispatch]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveLabel(boards.find((board) => board.id === event.active.id)?.name ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveLabel(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = boards.findIndex((board) => board.id === active.id);
    const newIndex = boards.findIndex((board) => board.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    dispatch(boardsReordered(arrayMove(boards, oldIndex, newIndex).map((board) => board.id)));
    dispatch(moveBoardAsync({ id: active.id as string, targetIndex: newIndex }));
  };

  const handleDragCancel = () => setActiveLabel(null);

  return (
    <section className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-4 overflow-y-auto lg:grid lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden">
      <div className="flex shrink-0 flex-col gap-y-3 rounded-xl border bg-base-800/60 p-4 sm:p-5 lg:min-h-0 lg:shrink">
        <h2 className="text-xs font-semibold tracking-wider text-base-400 uppercase">Boards</h2>
        <NewBoardForm />
        <ScrollArea className="w-[calc(100%+8px)] min-h-0 -ml-2" viewportClassName="pl-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="flex flex-col gap-y-2">
              {isLoading && boards.length === 0 ? (
                SKELETON_KEYS.map((key) => <BoardSkeleton key={key} />)
              ) : (
                <SortableContext
                  items={boards.map((board) => board.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {boards.map((board) => (
                    <SortableBoard key={board.id} board={board} />
                  ))}
                </SortableContext>
              )}
            </div>
            <DragOverlay>{activeLabel && <BoardDragOverlay name={activeLabel} />}</DragOverlay>
          </DndContext>
        </ScrollArea>
      </div>
      <div className="flex shrink-0 flex-col gap-y-3 rounded-xl border bg-base-800/60 p-4 sm:p-5 lg:min-h-0 lg:shrink">
        <h2 className="text-xs font-semibold tracking-wider text-base-400 uppercase">
          Global labels
        </h2>
        <NewLabelForm />
        <ScrollArea className="w-[calc(100%+8px)] min-h-0 -ml-2" viewportClassName="pl-2">
          <div className="flex flex-wrap gap-2">
            {isGlobalLabelsLoading && globalLabels.length === 0 ? (
              <LoadingSpinner className="size-4" />
            ) : (
              globalLabels.map((label) => <LabelChip key={label.id} label={label} />)
            )}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
};

export { BoardLink, BoardList };
