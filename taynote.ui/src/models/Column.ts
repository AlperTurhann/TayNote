interface CreateColumn {
  name: string;
  boardId: string;
}

interface Column extends CreateColumn {
  id: string;
  orderNo: number;
}

type UpdateColumn = { id: string } & (
  | { name: string; orderNo?: number }
  | { name?: string; orderNo: number }
);

export type { CreateColumn, Column, UpdateColumn };
