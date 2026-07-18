import { ArrowDownZA, ArrowUpAZ, ArrowUpDown, LucideIcon } from 'lucide-react';

import { SortingType } from '@/models/TableOperations';

const NEXT_SORTING: Record<SortingType, SortingType> = {
  none: 'ascending',
  ascending: 'descending',
  descending: 'none'
};

const SORT_ICONS: Record<SortingType, LucideIcon> = {
  none: ArrowUpDown,
  ascending: ArrowUpAZ,
  descending: ArrowDownZA
};

export { NEXT_SORTING, SORT_ICONS };
