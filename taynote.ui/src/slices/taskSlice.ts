import { createSlice } from '@reduxjs/toolkit';

import { DEFAULT_TABLE_OPERATIONS } from '@/constants/generalConstants';
import { FetchOperations } from '@/models/FetchOperations';
import { TableOpertions } from '@/models/TableOperations';
import { Task } from '@/models/Task';
import {
  addTaskAsync,
  changeTaskStatusAsync,
  deleteTaskAsync,
  getTasksAsync
} from '@/services/task/services';

interface TaskState {
  tasks: Task[];
  activeTableOperations: TableOpertions;
  getTasks: FetchOperations;
  addTask: FetchOperations;
  updateTask: FetchOperations;
  deleteTask: FetchOperations;
}

const initialState: TaskState = {
  tasks: [],
  activeTableOperations: DEFAULT_TABLE_OPERATIONS,
  getTasks: {
    isLoading: false
  },
  addTask: {
    isLoading: false
  },
  updateTask: {
    isLoading: false
  },
  deleteTask: {
    isLoading: false
  }
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //#region Get Tasks
    builder
      .addCase(getTasksAsync.pending, (state) => {
        state.getTasks.isLoading = true;
      })
      .addCase(getTasksAsync.fulfilled, (state, action) => {
        state.tasks = action.payload.data ?? [];
        state.getTasks.isLoading = false;
        state.getTasks.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Add Task
    builder
      .addCase(addTaskAsync.pending, (state) => {
        state.addTask.isLoading = true;
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        if (action.payload.data) state.tasks.push(action.payload.data);
        state.addTask.isLoading = false;
        state.addTask.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Change Task Status
    builder
      .addCase(changeTaskStatusAsync.pending, (state) => {
        state.updateTask.isLoading = true;
      })
      .addCase(changeTaskStatusAsync.fulfilled, (state, action) => {
        if (action.payload.data) {
          const task = state.tasks.find((task) => task.id === action.payload.data!.id);
          if (task) task.status = action.payload.data.status;
        }
        state.updateTask.isLoading = false;
        state.updateTask.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Delete Task
    builder
      .addCase(deleteTaskAsync.pending, (state) => {
        state.deleteTask.isLoading = true;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload.data);
        state.deleteTask.isLoading = false;
        state.deleteTask.error = action.payload.error ?? undefined;
      });
    //#endregion
  }
});

export const selectTasks = (state: { task: TaskState }) => state.task.tasks;

export default taskSlice.reducer;
