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
        <div className="absolute inset-0 border-2 border-dashed border-indigo-500/50" />
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
      className="w-full flex"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center shrink-0 touch-none cursor-grab bg-base-700 text-base-500 hover:bg-base-600 hover:text-base-200 active:cursor-grabbing"
        title="Drag to reorder board"
      >
        <GripVertical size={14} />
      </div>
      <BoardLink board={board} />
    </div>
  );
});

export { SortableBoard };
