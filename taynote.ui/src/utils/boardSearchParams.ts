import { SortingType } from '@/models/TableOperations';

interface ColumnFilter {
  sorting?: SortingType;
  query?: string;
}

const GLOBAL_QUERY_PARAM = 'q';
const FILTERS_PARAM = 'filters';

const parseGlobalQuery = (searchParams: URLSearchParams): string =>
  searchParams.get(GLOBAL_QUERY_PARAM) ?? '';

const parseFilters = (searchParams: URLSearchParams): Record<string, ColumnFilter> => {
  const raw = searchParams.get(FILTERS_PARAM);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, ColumnFilter>;
  } catch {
    return {};
  }
};

const isDefaultFilter = (filter: ColumnFilter): boolean =>
  (filter.sorting ?? 'none') === 'none' && (filter.query ?? '') === '';

const withGlobalQuery = (searchParams: URLSearchParams, query: string): URLSearchParams => {
  const next = new URLSearchParams(searchParams);
  if (query === '') next.delete(GLOBAL_QUERY_PARAM);
  else next.set(GLOBAL_QUERY_PARAM, query);
  return next;
};

const withColumnFilter = (
  searchParams: URLSearchParams,
  columnId: string,
  filter: ColumnFilter
): URLSearchParams => {
  const next = new URLSearchParams(searchParams);
  const filters = parseFilters(searchParams);
  if (isDefaultFilter(filter)) {
    delete filters[columnId];
  } else {
    filters[columnId] = filter;
  }
  if (Object.keys(filters).length === 0) next.delete(FILTERS_PARAM);
  else next.set(FILTERS_PARAM, JSON.stringify(filters));
  return next;
};

export { parseGlobalQuery, parseFilters, withGlobalQuery, withColumnFilter };
export type { ColumnFilter };
