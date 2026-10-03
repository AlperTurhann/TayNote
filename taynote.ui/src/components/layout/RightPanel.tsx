'use client';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

import { LoadingSpinner } from '@/components/base/LoadingSpinner';
import { LabelChip, NewLabelForm } from '@/components/Label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { getBoardLabelsAsync, getGlobalLabelsAsync } from '@/services/labelService';
import {
  selectBoardLabels,
  selectGetBoardLabelsIsLoading,
  selectGetGlobalLabelsIsLoading,
  selectGlobalLabels
} from '@/slices/labelSlice';

interface Props {
  isOpen: boolean;
}

const RightPanel = ({ isOpen }: Props) => {
  const dispatch = useAppDispatch();
  const { boardId } = useParams<{ boardId?: string }>();
  const globalLabels = useAppSelector(selectGlobalLabels);
  const boardLabels = useAppSelector(selectBoardLabels);
  const isGlobalLoading = useAppSelector(selectGetGlobalLabelsIsLoading);
  const isBoardLoading = useAppSelector(selectGetBoardLabelsIsLoading);

  useEffect(() => {
    dispatch(getGlobalLabelsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (boardId) dispatch(getBoardLabelsAsync(boardId));
  }, [dispatch, boardId]);

  return (
    <aside
      inert={!isOpen}
      aria-label="Labels"
      className={cn(
        'absolute top-full right-0 z-50 flex h-[calc(100dvh-100%)] w-full flex-col overflow-y-auto sm:overflow-hidden gap-y-5 border-l bg-base-800 p-4 shadow-2xl transition-transform duration-300 sm:w-80',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <section className="flex shrink-0 flex-col gap-y-2 sm:min-h-0 sm:flex-1 sm:shrink">
        <h2 className="text-xs font-semibold tracking-wider text-base-400 uppercase">
          Global labels
        </h2>
        <NewLabelForm />
        <ScrollArea className="w-[calc(100%+8px)] min-h-0 -ml-2" viewportClassName="pl-2">
          <div className="flex flex-wrap gap-2">
            {isGlobalLoading && globalLabels.length === 0 ? (
              <LoadingSpinner className="size-4" />
            ) : (
              globalLabels.map((label) => <LabelChip key={label.id} label={label} />)
            )}
          </div>
        </ScrollArea>
      </section>
      {boardId && (
        <section className="flex shrink-0 flex-col gap-y-2 sm:min-h-0 sm:flex-1 sm:shrink">
          <h2 className="text-xs font-semibold tracking-wider text-base-400 uppercase">
            Board labels
          </h2>
          <NewLabelForm boardId={boardId} />
          <ScrollArea className="w-[calc(100%+8px)] min-h-0 -ml-2" viewportClassName="pl-2">
            <div className="flex flex-wrap gap-2">
              {isBoardLoading && boardLabels.length === 0 ? (
                <LoadingSpinner className="size-4" />
              ) : (
                boardLabels.map((label) => <LabelChip key={label.id} label={label} />)
              )}
            </div>
          </ScrollArea>
        </section>
      )}
    </aside>
  );
};

export { RightPanel };
