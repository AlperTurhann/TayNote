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
      className="flex flex-col shrink-0"
    >
      {isDragging && <ColumnDropPlaceholder />}
      <div className={isDragging ? 'hidden' : 'contents'}>
        <div
          {...attributes}
          {...listeners}
          className="flex items-center justify-center h-4 shrink-0 rounded-t-md bg-indigo-950 text-indigo-400 touch-none cursor-grab hover:text-indigo-200 active:cursor-grabbing"
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
