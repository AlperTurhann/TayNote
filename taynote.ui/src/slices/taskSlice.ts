import { createSlice } from '@reduxjs/toolkit';

import { EMPTY_COLUMN_TASKS_STATE } from '@/constants/generalConstants';
import { ColumnTasksState, TaskState } from '@/models/Task';
import {
  addTaskAsync,
  updateTaskAsync,
  updateTaskColumnAsync,
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

const findTask = (state: TaskState, columnId: string, taskId: string) =>
  state.byColumn[columnId]?.tasks.find((task) => task.id === taskId);

const initialState: TaskState = {
  byColumn: {},
  globalQuery: '',
  addTask: {
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
        const itemsWithStatus = items.map((item) => ({
          ...item,
          isUpdating: false,
          isDeleting: false
        }));
        columnState.tasks =
          tableOperations.pageIndex <= 1
            ? itemsWithStatus
            : [...columnState.tasks, ...itemsWithStatus];
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
    //#region Update Task
    builder
      .addCase(updateTaskAsync.pending, (state, action) => {
        const task = findTask(state, action.meta.arg.columnId, action.meta.arg.id);
        if (task) task.isUpdating = true;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        const task = findTask(state, action.meta.arg.columnId, action.meta.arg.id);
        if (task) task.isUpdating = false;
      });
    //#endregion
    //#region Update Task Column
    builder
      .addCase(updateTaskColumnAsync.pending, (state, action) => {
        const task = findTask(state, action.meta.arg.sourceColumnId, action.meta.arg.id);
        if (task) task.isUpdating = true;
      })
      .addCase(updateTaskColumnAsync.fulfilled, (state, action) => {
        const task = findTask(state, action.meta.arg.sourceColumnId, action.meta.arg.id);
        if (task) task.isUpdating = false;
      });
    //#endregion
    //#region Delete Task
    builder
      .addCase(deleteTaskAsync.pending, (state, action) => {
        const task = findTask(state, action.meta.arg.columnId, action.meta.arg.taskId);
        if (task) task.isDeleting = true;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        const task = findTask(state, action.meta.arg.columnId, action.meta.arg.taskId);
        if (task) task.isDeleting = false;
      });
    //#endregion
  }
});

export const selectColumnTasks = (columnId: string) => (state: { task: TaskState }) =>
  state.task.byColumn[columnId] ?? EMPTY_COLUMN_TASKS_STATE;
export const selectGlobalQuery = (state: { task: TaskState }) => state.task.globalQuery;

export default taskSlice.reducer;
