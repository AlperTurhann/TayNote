interface CreateLabel {
  name: string;
  color: string;
  boardId?: string;
}

interface Label extends CreateLabel {
  id: string;
}

interface LabelWithStatus extends Label {
  isDeleting: boolean;
}

interface DeleteLabel {
  labelId: string;
  boardId?: string;
}

export type { CreateLabel, Label, LabelWithStatus, DeleteLabel };
