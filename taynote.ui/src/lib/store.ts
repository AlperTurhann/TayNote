import { configureStore } from '@reduxjs/toolkit';

import taskReducer from '@/slices/taskSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      task: taskReducer
    }
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
