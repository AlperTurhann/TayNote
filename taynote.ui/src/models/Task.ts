type Status =
  | 'Product Backlog'
  | 'To Do'
  | 'In Progress'
  | 'Technical Review'
  | 'QA Test'
  | 'UAT Test'
  | 'Test Failed'
  | 'Blocked'
  | 'Done'
  | 'Cancelled';

interface CreateTask {
  title: string;
  color: string;
  status?: Status;
}

interface Task extends CreateTask {
  id: string;
}

interface ChangeTaskStatus {
  id: string;
  status: Status;
}

export type { Status, CreateTask, Task, ChangeTaskStatus };
