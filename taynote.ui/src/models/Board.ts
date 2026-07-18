interface CreateBoard {
  name: string;
}

interface Board extends CreateBoard {
  id: string;
}

export type { CreateBoard, Board };
