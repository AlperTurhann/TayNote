import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { Column, CreateColumn, DeleteColumn, UpdateColumn } from '@/models/Column';
import { ThunkConfig } from '@/models/FetchOperations';
import { tryCatch, TryCatchResult } from '@/utils/tryCatch';

const getColumnsAsync = createAsyncThunk(
  'columns/getColumnsAsync',
  async (boardId: string): Promise<TryCatchResult<Column[]>> => {
    return await tryCatch<Column[]>(
      axios
        .get<Column[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/columns`, { params: { boardId } })
        .then((res) => res.data),
      []
    );
  }
);

const addColumnAsync = createAsyncThunk(
  'columns/addColumnAsync',
  async (data: CreateColumn): Promise<TryCatchResult<Column>> => {
    return await tryCatch<Column>(
      axios
        .post<Column>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/columns`, data)
        .then((res) => res.data)
    );
  }
);

const updateColumnAsync = createAsyncThunk(
  'columns/updateColumnAsync',
  async ({ id, ...data }: UpdateColumn): Promise<TryCatchResult<Column>> => {
    return await tryCatch<Column>(
      axios
        .patch<Column>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/columns/${id}`, data)
        .then((res) => res.data)
    );
  }
);

const deleteColumnAsync = createAsyncThunk<TryCatchResult<void>, DeleteColumn, ThunkConfig>(
  'columns/deleteColumnAsync',
  async ({ columnId, boardId }, { dispatch }) => {
    const result = await tryCatch<void>(
      axios
        .delete<void>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/columns/${columnId}`)
        .then((res) => res.data)
    );
    if (!result.error) {
      dispatch(getColumnsAsync(boardId));
    }
    return result;
  }
);

export { getColumnsAsync, addColumnAsync, updateColumnAsync, deleteColumnAsync };
