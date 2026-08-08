import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { EMPTY_COLUMN_TASKS_STATE } from '@/constants/generalConstants';
import { ColumnTasksState, TaskState } from '@/models/Task';
import {
  addTaskAsync,
  updateTaskAsync,
  moveTaskAsync,
  deleteTaskAsync,
  getTasksAsync,
  resetAllFiltersAsync,
  applyGlobalFiltersAsync
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
  globalLabelIds: [],
  addTask: {
    isLoading: false
  }
};

interface TaskMovedLocallyPayload {
  taskId: string;
  sourceColumnId: string;
  destColumnId: string;
  targetIndex: number;
}

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    taskMovedLocally: (state, action: PayloadAction<TaskMovedLocallyPayload>) => {
      const { taskId, sourceColumnId, destColumnId, targetIndex } = action.payload;
      const sourceState = state.byColumn[sourceColumnId];
      if (!sourceState) return;

      const taskIndex = sourceState.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) return;

      const [task] = sourceState.tasks.splice(taskIndex, 1);
      task.columnId = destColumnId;

      const destState = getOrCreateColumnState(state, destColumnId);
      const index = Math.max(0, Math.min(targetIndex, destState.tasks.length));
      destState.tasks.splice(index, 0, task);
    }
  },
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
    //#region Apply Global Filters
    builder.addCase(applyGlobalFiltersAsync.pending, (state, action) => {
      if (action.meta.arg.query !== undefined) state.globalQuery = action.meta.arg.query;
      if (action.meta.arg.labelIds !== undefined) state.globalLabelIds = action.meta.arg.labelIds;
    });
    //#endregion
    //#region Reset All Filters
    builder.addCase(resetAllFiltersAsync.pending, (state) => {
      state.globalQuery = '';
      state.globalLabelIds = [];
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
    //#region Move Task
    builder
      .addCase(moveTaskAsync.pending, (state, action) => {
        const { id, sourceColumnId, columnId } = action.meta.arg;
        const task = findTask(state, columnId, id) ?? findTask(state, sourceColumnId, id);
        if (task) task.isUpdating = true;
      })
      .addCase(moveTaskAsync.fulfilled, (state, action) => {
        const { id, sourceColumnId, columnId } = action.meta.arg;
        const task = findTask(state, columnId, id) ?? findTask(state, sourceColumnId, id);
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

export const { taskMovedLocally } = taskSlice.actions;
export const selectColumnTasks = (columnId: string) => (state: { task: TaskState }) =>
  state.task.byColumn[columnId] ?? EMPTY_COLUMN_TASKS_STATE;
export const selectGlobalQuery = (state: { task: TaskState }) => state.task.globalQuery;
export const selectGlobalLabelIds = (state: { task: TaskState }) => state.task.globalLabelIds;

export default taskSlice.reducer;
