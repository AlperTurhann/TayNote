'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { memo } from 'react';

import { TaskCard, TaskDropPlaceholder } from '@/components/TaskCard';
import { TaskWithStatus } from '@/models/Task';

interface SortableTaskCardProps {
  task: TaskWithStatus;
  columnId: string;
  disabled: boolean;
  hideWhileDragging?: boolean;
}

const SortableTaskCard = memo(function SortableTaskCard({
  task,
  columnId,
  disabled,
  hideWhileDragging
}: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'task', columnId },
    disabled
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={
        isDragging
          ? 'flex w-full'
          : 'group flex w-full overflow-hidden rounded-lg border bg-base-700/70 shadow-sm transition-colors hover:border-white/15 hover:bg-base-700'
      }
    >
      {isDragging ? (
        !hideWhileDragging && <TaskDropPlaceholder />
      ) : (
        <>
          {!disabled && (
            <div
              {...attributes}
              {...listeners}
              className="flex shrink-0 cursor-grab items-center pl-1 text-base-600 touch-none transition-colors hover:text-base-300 active:cursor-grabbing"
              title="Drag to reorder task"
            >
              <GripVertical size={14} />
            </div>
          )}
          <TaskCard task={task} />
        </>
      )}
    </div>
  );
});

export { SortableTaskCard };
