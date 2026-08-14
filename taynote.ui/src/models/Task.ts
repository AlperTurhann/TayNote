import { FetchOperations } from '@/models/FetchOperations';
import { Label } from '@/models/Label';
import { TableOpertions } from '@/models/TableOperations';

interface CreateTask {
  title: string;
  color: string;
  columnId: string;
  description?: string;
  labelIds?: string[];
}

interface Task extends Omit<CreateTask, 'description' | 'labelIds'> {
  id: string;
  completed: boolean;
  description?: string | null;
  labels: Label[];
}

interface TaskWithStatus extends Task {
  isUpdating: boolean;
  isDeleting: boolean;
}

interface UpdateTask extends Partial<Task> {
  id: string;
  columnId: string;
  labelIds?: string[];
}

interface MoveTask {
  id: string;
  columnId: string;
  sourceColumnId: string;
  targetIndex: number;
}

interface DeleteTask {
  taskId: string;
  columnId: string;
}

interface TaskSearchResult {
  items: Task[];
  hasMore: boolean;
}

interface ColumnTasksState {
  tasks: TaskWithStatus[];
  tableOperations: Omit<TableOpertions, 'columnId'>;
  hasMore: boolean;
  isLoading: boolean;
  error?: string;
}

interface TaskState {
  byColumn: Record<string, ColumnTasksState>;
  globalQuery: string;
  globalLabelIds: string[];
  addTask: FetchOperations;
}

export type {
  CreateTask,
  Task,
  TaskWithStatus,
  UpdateTask,
  MoveTask,
  DeleteTask,
  TaskSearchResult,
  ColumnTasksState,
  TaskState
};
