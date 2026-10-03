'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal } from 'lucide-react';
import { memo } from 'react';

import { Column, ColumnDropPlaceholder } from '@/components/Column';
import { ColumnWithStatus } from '@/models/Column';

interface SortableColumnProps {
  column: ColumnWithStatus;
  placeholderIndex?: number | null;
  taskCrossedColumn?: boolean;
}

const SortableColumn = memo(function SortableColumn({
  column,
  placeholderIndex,
  taskCrossedColumn
}: SortableColumnProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: { type: 'column' }
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex w-[82vw] max-w-80 shrink-0 flex-col sm:w-72"
    >
      {isDragging && <ColumnDropPlaceholder />}
      <div className={isDragging ? 'hidden' : 'contents'}>
        <div
          {...attributes}
          {...listeners}
          className="flex h-5 shrink-0 cursor-grab items-center justify-center rounded-t-xl border border-b-0 bg-base-800 text-base-600 touch-none transition-colors hover:text-base-300 active:cursor-grabbing"
          title="Drag to reorder column"
        >
          <GripHorizontal size={14} />
        </div>
        <Column
          column={column}
          placeholderIndex={placeholderIndex}
          taskCrossedColumn={taskCrossedColumn}
        />
      </div>
    </div>
  );
});

export { SortableColumn };
