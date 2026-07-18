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

interface ChangeTaskColumn {
  id: string;
  columnId: string;
}

interface ChangeTaskCompleted {
  id: string;
  completed: boolean;
}

interface MoveTask extends ChangeTaskColumn {
  sourceColumnId: string;
}

interface CompleteTask extends ChangeTaskCompleted {
  columnId: string;
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
  tasks: Task[];
  tableOperations: Omit<TableOpertions, 'columnId'>;
  hasMore: boolean;
  isLoading: boolean;
  error?: string;
}

interface TaskState {
  byColumn: Record<string, ColumnTasksState>;
  globalQuery: string;
  addTask: FetchOperations;
  updateTask: FetchOperations;
  deleteTask: FetchOperations;
}

export type {
  CreateTask,
  Task,
  ChangeTaskColumn,
  ChangeTaskCompleted,
  MoveTask,
  CompleteTask,
  DeleteTask,
  TaskSearchResult,
  ColumnTasksState,
  TaskState
};
