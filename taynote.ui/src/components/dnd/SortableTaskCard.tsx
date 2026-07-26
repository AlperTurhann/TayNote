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
      className="w-full flex"
    >
      {isDragging ? (
        !hideWhileDragging && <TaskDropPlaceholder />
      ) : (
        <>
          {!disabled && (
            <div
              {...attributes}
              {...listeners}
              className="flex items-center shrink-0 touch-none cursor-grab rounded-l-lg bg-base-700 text-base-500 hover:bg-base-600 hover:text-base-200 active:cursor-grabbing"
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
