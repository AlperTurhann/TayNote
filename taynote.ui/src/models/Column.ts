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

interface UpdateColumn {
  id: string;
  name: string;
}

interface MoveColumn {
  id: string;
  boardId: string;
  targetIndex: number;
}

interface DeleteColumn {
  columnId: string;
  boardId: string;
}

export type { CreateColumn, Column, ColumnWithStatus, UpdateColumn, MoveColumn, DeleteColumn };
