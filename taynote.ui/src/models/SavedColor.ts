interface CreateSavedColor {
  name: string;
  hex: string;
}

interface SavedColor extends CreateSavedColor {
  id: string;
}

interface SavedColorWithStatus extends SavedColor {
  isDeleting: boolean;
}

export type { CreateSavedColor, SavedColor, SavedColorWithStatus };
