import { createSlice } from '@reduxjs/toolkit';

import { FetchOperations } from '@/models/FetchOperations';
import { Task } from '@/models/Task';
import {
  addTaskAsync,
  changeTaskColumnAsync,
  deleteTaskAsync,
  getTasksAsync
} from '@/services/taskService';

interface ColumnTasksState {
  tasks: Task[];
  pageIndex: number;
  hasMore: boolean;
  isLoading: boolean;
  error?: string;
}

interface TaskState {
  byColumn: Record<string, ColumnTasksState>;
  addTask: FetchOperations;
  updateTask: FetchOperations;
  deleteTask: FetchOperations;
}

const emptyColumnTasksState = (): ColumnTasksState => ({
  tasks: [],
  pageIndex: 0,
  hasMore: true,
  isLoading: false
});

const getOrCreateColumnState = (state: TaskState, columnId: string): ColumnTasksState => {
  if (!state.byColumn[columnId]) {
    state.byColumn[columnId] = emptyColumnTasksState();
  }
  return state.byColumn[columnId];
};

const findColumnStateByTaskId = (state: TaskState, taskId: string) =>
  Object.values(state.byColumn).find((columnState) =>
    columnState.tasks.some((task) => task.id === taskId)
  );

const initialState: TaskState = {
  byColumn: {},
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
      .addCase(getTasksAsync.pending, (state, action) => {
        const { columnId } = action.meta.arg;
        if (!columnId) return;
        getOrCreateColumnState(state, columnId).isLoading = true;
      })
      .addCase(getTasksAsync.fulfilled, (state, action) => {
        const { columnId, pageIndex } = action.meta.arg;
        if (!columnId) return;
        const columnState = getOrCreateColumnState(state, columnId);
        const { items, hasMore } = action.payload.data ?? { items: [], hasMore: false };
        columnState.tasks = pageIndex <= 1 ? items : [...columnState.tasks, ...items];
        columnState.pageIndex = pageIndex;
        columnState.hasMore = hasMore;
        columnState.isLoading = false;
        columnState.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Add Task
    builder
      .addCase(addTaskAsync.pending, (state) => {
        state.addTask.isLoading = true;
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        const task = action.payload.data;
        if (task) {
          getOrCreateColumnState(state, task.columnId).tasks.push(task);
        }
        state.addTask.isLoading = false;
        state.addTask.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Change Task Column
    builder
      .addCase(changeTaskColumnAsync.pending, (state) => {
        state.updateTask.isLoading = true;
      })
      .addCase(changeTaskColumnAsync.fulfilled, (state, action) => {
        const result = action.payload.data;
        if (result) {
          const sourceColumnState = findColumnStateByTaskId(state, result.id);
          const taskIndex = sourceColumnState?.tasks.findIndex((task) => task.id === result.id);
          if (sourceColumnState && taskIndex !== undefined && taskIndex !== -1) {
            const [movedTask] = sourceColumnState.tasks.splice(taskIndex, 1);
            movedTask.columnId = result.columnId;
            getOrCreateColumnState(state, result.columnId).tasks.push(movedTask);
          }
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
        const taskId = action.payload.data;
        if (taskId) {
          const columnState = findColumnStateByTaskId(state, taskId);
          if (columnState) {
            columnState.tasks = columnState.tasks.filter((task) => task.id !== taskId);
          }
        }
        state.deleteTask.isLoading = false;
        state.deleteTask.error = action.payload.error ?? undefined;
      });
    //#endregion
  }
});

export const selectColumnTasks = (columnId: string) => (state: { task: TaskState }) =>
  state.task.byColumn[columnId] ?? emptyColumnTasksState();

export default taskSlice.reducer;
