interface CreateBoard {
  name: string;
}

interface Board extends CreateBoard {
  id: string;
}

interface BoardWithStatus extends Board {
  isUpdating: boolean;
  isDeleting: boolean;
}

interface MoveBoard {
  id: string;
  targetIndex: number;
}

export type { CreateBoard, Board, BoardWithStatus, MoveBoard };
