import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { AppDispatch } from '@/lib/store';
import { CreateLabel, DeleteLabel, Label } from '@/models/Label';
import { tryCatch, TryCatchResult } from '@/utils/tryCatch';

type ThunkConfig = { dispatch: AppDispatch };

const getGlobalLabelsAsync = createAsyncThunk(
  'labels/getGlobalLabelsAsync',
  async (): Promise<TryCatchResult<Label[]>> => {
    return await tryCatch<Label[]>(
      axios.get<Label[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/labels`).then((res) => res.data)
    );
  }
);

const getBoardLabelsAsync = createAsyncThunk(
  'labels/getBoardLabelsAsync',
  async (boardId: string): Promise<TryCatchResult<Label[]>> => {
    return await tryCatch<Label[]>(
      axios
        .get<Label[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/labels`, { params: { boardId } })
        .then((res) => res.data)
    );
  }
);

const addLabelAsync = createAsyncThunk<TryCatchResult<Label>, CreateLabel, ThunkConfig>(
  'labels/addLabelAsync',
  async (data, { dispatch }) => {
    const result = await tryCatch<Label>(
      axios
        .post<Label>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/labels`, data)
        .then((res) => res.data)
    );
    if (!result.error) {
      if (data.boardId) dispatch(getBoardLabelsAsync(data.boardId));
      else dispatch(getGlobalLabelsAsync());
    }
    return result;
  }
);

const deleteLabelAsync = createAsyncThunk<TryCatchResult<void>, DeleteLabel, ThunkConfig>(
  'labels/deleteLabelAsync',
  async ({ labelId, boardId }, { dispatch }) => {
    const result = await tryCatch<void>(
      axios
        .delete<void>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/labels/${labelId}`)
        .then((res) => res.data)
    );
    if (!result.error) {
      if (boardId) dispatch(getBoardLabelsAsync(boardId));
      else dispatch(getGlobalLabelsAsync());
    }
    return result;
  }
);

export { getGlobalLabelsAsync, getBoardLabelsAsync, addLabelAsync, deleteLabelAsync };
