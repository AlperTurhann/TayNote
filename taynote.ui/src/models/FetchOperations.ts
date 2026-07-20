import { AppDispatch, RootState } from '@/lib/store';

interface FetchOperations {
  isLoading: boolean;
  error?: string;
}

interface ThunkConfig {
  dispatch: AppDispatch;
  state: RootState;
}

interface RefetchProps {
  dispatch: AppDispatch;
  getState: () => RootState;
}

export type { FetchOperations, ThunkConfig, RefetchProps };
