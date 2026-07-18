import { createSlice } from '@reduxjs/toolkit';

import { EMPTY_COLUMN_TASKS_STATE } from '@/constants/generalConstants';
import { ColumnTasksState, TaskState } from '@/models/Task';
import {
  addTaskAsync,
  changeTaskColumnAsync,
  changeTaskCompletedAsync,
  deleteTaskAsync,
  getTasksAsync,
  resetAllFiltersAsync,
  searchAllColumnsAsync
} from '@/services/taskService';

const getOrCreateColumnState = (state: TaskState, columnId: string): ColumnTasksState => {
  if (!state.byColumn[columnId]) {
    state.byColumn[columnId] = { ...EMPTY_COLUMN_TASKS_STATE };
  }
  return state.byColumn[columnId];
};

const initialState: TaskState = {
  byColumn: {},
  globalQuery: '',
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
        const { columnId, isGlobalSearch, ...tableOperations } = action.meta.arg;
        if (!columnId) return;
        const columnState = getOrCreateColumnState(state, columnId);
        const { items, hasMore } = action.payload.data ?? { items: [], hasMore: false };
        columnState.tasks =
          tableOperations.pageIndex <= 1 ? items : [...columnState.tasks, ...items];
        if (!isGlobalSearch) {
          columnState.tableOperations = tableOperations;
        }
        columnState.hasMore = hasMore;
        columnState.isLoading = false;
        columnState.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Search All Columns
    builder.addCase(searchAllColumnsAsync.pending, (state, action) => {
      state.globalQuery = action.meta.arg;
    });
    //#endregion
    //#region Reset All Filters
    builder.addCase(resetAllFiltersAsync.pending, (state) => {
      state.globalQuery = '';
    });
    //#endregion
    //#region Add Task
    builder
      .addCase(addTaskAsync.pending, (state) => {
        state.addTask.isLoading = true;
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
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
        state.updateTask.isLoading = false;
        state.updateTask.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Change Task Column
    builder
      .addCase(changeTaskCompletedAsync.pending, (state) => {
        state.updateTask.isLoading = true;
      })
      .addCase(changeTaskCompletedAsync.fulfilled, (state, action) => {
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
        state.deleteTask.isLoading = false;
        state.deleteTask.error = action.payload.error ?? undefined;
      });
    //#endregion
  }
});

export const selectColumnTasks = (columnId: string) => (state: { task: TaskState }) =>
  state.task.byColumn[columnId] ?? EMPTY_COLUMN_TASKS_STATE;
export const selectGlobalQuery = (state: { task: TaskState }) => state.task.globalQuery;

export default taskSlice.reducer;
