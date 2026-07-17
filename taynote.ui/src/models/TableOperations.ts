type SortingType = 'none' | 'ascending' | 'descending';

interface TableOpertions {
  sorting: SortingType;
  pageIndex: number;
  pageSize: number;
  query: string;
  columnId?: string;
}

export type { SortingType, TableOpertions };
