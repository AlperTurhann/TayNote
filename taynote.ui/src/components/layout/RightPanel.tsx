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
      className={cn(
        'w-72 h-[calc(100vh-100%)] z-50 absolute top-full right-0 flex flex-col gap-y-4 transition-all duration-500 border-l border-t p-4 bg-base-800',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <section className="flex min-h-0 flex-1 flex-col gap-y-2">
        <h2 className="font-bold text-base-100">Global Labels</h2>
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
        <section className="flex min-h-0 flex-1 flex-col gap-y-2">
          <h2 className="font-bold text-base-100">Board Labels</h2>
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
