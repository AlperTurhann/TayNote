'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { memo } from 'react';

import { BoardLink } from '@/components/BoardList';
import { BoardWithStatus } from '@/models/Board';

interface SortableBoardProps {
  board: BoardWithStatus;
}

const SortableBoard = memo(function SortableBoard({ board }: SortableBoardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: board.id,
    data: { type: 'board' }
  });

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className="relative w-full"
      >
        <div className="absolute inset-0 rounded-lg border-2 border-dashed border-indigo-500/40 bg-indigo-500/5" />
        <div className="invisible">
          <BoardLink board={board} />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex w-full items-center"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex h-11 shrink-0 cursor-grab items-center px-1 text-base-500 touch-none transition-colors hover:text-base-200 active:cursor-grabbing"
        title="Drag to reorder board"
      >
        <GripVertical size={14} />
      </div>
      <BoardLink board={board} />
    </div>
  );
});

export { SortableBoard };
