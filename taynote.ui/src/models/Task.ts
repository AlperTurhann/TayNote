interface CreateTask {
  title: string;
  color: string;
  columnId: string;
}

interface Task extends CreateTask {
  id: string;
}

interface ChangeTaskColumn {
  id: string;
  columnId: string;
}

interface TaskSearchResult {
  items: Task[];
  hasMore: boolean;
}

export type { CreateTask, Task, ChangeTaskColumn, TaskSearchResult };
