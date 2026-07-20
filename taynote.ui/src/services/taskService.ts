import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { DEFAULT_TABLE_OPERATIONS } from '@/constants/generalConstants';
import { RefetchProps, ThunkConfig } from '@/models/FetchOperations';
import { TableOpertions } from '@/models/TableOperations';
import {
  UpdateTask,
  CreateTask,
  DeleteTask,
  MoveTask,
  Task,
  TaskSearchResult
} from '@/models/Task';
import { tryCatch, TryCatchResult } from '@/utils/tryCatch';

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

const refetchColumn = ({ dispatch, getState }: RefetchProps, columnId: string) => {
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

const resetAllFiltersAsync = createAsyncThunk<void, void, ThunkConfig>(
  'tasks/resetAllFiltersAsync',
  async (_, { dispatch, getState }) => {
    const { columns } = getState().column;
    await Promise.all(
      columns.map((column) =>
        dispatch(getTasksAsync({ ...DEFAULT_TABLE_OPERATIONS, columnId: column.id }))
      )
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
    if (!result.error) {
      refetchColumn(thunkAPI, data.columnId);
    }
    return result;
  }
);

const updateTaskAsync = createAsyncThunk<TryCatchResult<UpdateTask>, UpdateTask, ThunkConfig>(
  'tasks/updateTaskAsync',
  async (data, thunkAPI) => {
    const result = await tryCatch<UpdateTask>(
      axios
        .patch<UpdateTask>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${data.id}`, data)
        .then((res) => res.data)
    );
    if (!result.error) {
      refetchColumn(thunkAPI, data.columnId);
    }
    return result;
  }
);

const updateTaskColumnAsync = createAsyncThunk<TryCatchResult<UpdateTask>, MoveTask, ThunkConfig>(
  'tasks/updateTaskColumnAsync',
  async ({ id, columnId, sourceColumnId }, thunkAPI) => {
    const result = await tryCatch<UpdateTask>(
      axios
        .patch<UpdateTask>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${id}/update-column`, {
          columnId
        })
        .then((res) => res.data)
    );
    if (!result.error) {
      refetchColumn(thunkAPI, sourceColumnId);
      refetchColumn(thunkAPI, columnId);
    }
    return result;
  }
);

const deleteTaskAsync = createAsyncThunk<TryCatchResult<void>, DeleteTask, ThunkConfig>(
  'tasks/deleteTaskAsync',
  async ({ taskId, columnId }, thunkAPI) => {
    const result = await tryCatch<void>(
      axios
        .delete<void>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${taskId}`)
        .then((res) => res.data)
    );
    if (!result.error) {
      refetchColumn(thunkAPI, columnId);
    }
    return result;
  }
);

export {
  getTasksAsync,
  addTaskAsync,
  updateTaskAsync,
  updateTaskColumnAsync,
  deleteTaskAsync,
  searchAllColumnsAsync,
  resetAllFiltersAsync
};
