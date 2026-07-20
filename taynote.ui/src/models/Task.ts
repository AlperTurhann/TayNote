import { FetchOperations } from '@/models/FetchOperations';
import { TableOpertions } from '@/models/TableOperations';

interface CreateTask {
  title: string;
  color: string;
  columnId: string;
}

interface Task extends CreateTask {
  id: string;
  completed: boolean;
}

interface TaskWithStatus extends Task {
  isUpdating: boolean;
  isDeleting: boolean;
}

interface UpdateTask extends Partial<Task> {
  id: string;
  columnId: string;
}

interface MoveTask {
  id: string;
  columnId: string;
  sourceColumnId: string;
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
