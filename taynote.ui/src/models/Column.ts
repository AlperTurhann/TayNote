interface CreateColumn {
  name: string;
  boardId: string;
}

interface Column extends CreateColumn {
  id: string;
  orderNo: number;
}

interface ColumnWithStatus extends Column {
  isUpdating: boolean;
  isDeleting: boolean;
}

type UpdateColumn = { id: string } & (
  | { name: string; orderNo?: number }
  | { name?: string; orderNo: number }
);

interface DeleteColumn {
  columnId: string;
  boardId: string;
}

export type { CreateColumn, Column, ColumnWithStatus, UpdateColumn, DeleteColumn };
