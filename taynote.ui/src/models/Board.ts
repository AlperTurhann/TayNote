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

export type { CreateBoard, Board, BoardWithStatus };
