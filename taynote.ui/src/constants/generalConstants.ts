import { TableOpertions } from '@/models/TableOperations';
import { ColumnTasksState } from '@/models/Task';

const DEFAULT_TABLE_OPERATIONS: TableOpertions = {
  sorting: 'none',
  pageIndex: 1,
  pageSize: 10,
  query: ''
};

const EMPTY_COLUMN_TASKS_STATE: ColumnTasksState = {
  tasks: [],
  tableOperations: DEFAULT_TABLE_OPERATIONS,
  hasMore: true,
  isLoading: false
};

export { DEFAULT_TABLE_OPERATIONS, EMPTY_COLUMN_TASKS_STATE };
