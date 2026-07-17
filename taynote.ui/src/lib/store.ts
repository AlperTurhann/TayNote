import { configureStore } from '@reduxjs/toolkit';

import { errorAlertMiddleware } from '@/lib/errorMiddleware';
import columnReducer from '@/slices/columnSlice';
import taskReducer from '@/slices/taskSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      task: taskReducer,
      column: columnReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(errorAlertMiddleware)
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
