import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { DEFAULT_TABLE_OPERATIONS } from '@/constants/generalConstants';
import type { AppDispatch, RootState } from '@/lib/store';
import { TableOpertions } from '@/models/TableOperations';
import {
  ChangeTaskColumn,
  CreateTask,
  DeleteTask,
  MoveTask,
  Task,
  TaskSearchResult
} from '@/models/Task';
import { tryCatch, TryCatchResult } from '@/utils/tryCatch';

type ThunkConfig = { dispatch: AppDispatch; state: RootState };

interface GetTasksArgs extends TableOpertions {
  isGlobalSearch?: boolean;
}

const getTasksAsync = createAsyncThunk(
  'tasks/getTasksAsync',
  async ({
    isGlobalSearch: _isGlobalSearch,
    ...data
  }: GetTasksArgs): Promise<TryCatchResult<TaskSearchResult>> => {
    return await tryCatch<TaskSearchResult>(
      axios
        .post<TaskSearchResult>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/search`, data)
        .then((res) => res.data),
      { items: [], hasMore: false }
    );
  }
);

const refetchColumn = (
  { dispatch, getState }: { dispatch: AppDispatch; getState: () => RootState },
  columnId: string
) => {
  const tableOperations =
    getState().task.byColumn[columnId]?.tableOperations ?? DEFAULT_TABLE_OPERATIONS;
  dispatch(
    getTasksAsync({ ...tableOperations, columnId, pageIndex: DEFAULT_TABLE_OPERATIONS.pageIndex })
  );
};

const searchAllColumnsAsync = createAsyncThunk<void, string, ThunkConfig>(
  'tasks/searchAllColumnsAsync',
  async (query, { dispatch, getState }) => {
    const trimmed = query.trim();
    const { columns } = getState().column;
    const unfilteredColumns = columns.filter(
      (column) =>
        (getState().task.byColumn[column.id]?.tableOperations ?? DEFAULT_TABLE_OPERATIONS).query ===
        ''
    );
    await Promise.all(
      unfilteredColumns.map((column) => {
        const tableOperations =
          getState().task.byColumn[column.id]?.tableOperations ?? DEFAULT_TABLE_OPERATIONS;
        return dispatch(
          getTasksAsync({
            ...tableOperations,
            columnId: column.id,
            pageIndex: DEFAULT_TABLE_OPERATIONS.pageIndex,
            query: trimmed,
            isGlobalSearch: trimmed !== ''
          })
        );
      })
    );
  }
);

const addTaskAsync = createAsyncThunk<TryCatchResult<Task>, CreateTask, ThunkConfig>(
  'tasks/addTasksAsync',
  async (data, thunkAPI) => {
    const result = await tryCatch<Task>(
      axios
        .post<Task>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks`, data)
        .then((res) => res.data)
    );
    if (result.data) {
      refetchColumn(thunkAPI, data.columnId);
    }
    return result;
  }
);

const changeTaskColumnAsync = createAsyncThunk<
  TryCatchResult<ChangeTaskColumn>,
  MoveTask,
  ThunkConfig
>('tasks/changeTaskColumnAsync', async ({ id, columnId, sourceColumnId }, thunkAPI) => {
  const result = await tryCatch<ChangeTaskColumn>(
    axios
      .patch<ChangeTaskColumn>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${id}`, {
        columnId
      })
      .then((res) => res.data)
  );
  if (result.data) {
    refetchColumn(thunkAPI, sourceColumnId);
    refetchColumn(thunkAPI, columnId);
  }
  return result;
});

const deleteTaskAsync = createAsyncThunk<TryCatchResult<string>, DeleteTask, ThunkConfig>(
  'tasks/deleteTaskAsync',
  async ({ taskId, columnId }, thunkAPI) => {
    const result = await tryCatch<string>(
      axios
        .delete<string>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${taskId}`)
        .then((res) => res.data)
    );
    if (result.data) {
      refetchColumn(thunkAPI, columnId);
    }
    return result;
  }
);

export {
  getTasksAsync,
  addTaskAsync,
  changeTaskColumnAsync,
  deleteTaskAsync,
  searchAllColumnsAsync
};
