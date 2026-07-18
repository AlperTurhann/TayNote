import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { AppDispatch } from '@/lib/store';
import { Board, CreateBoard } from '@/models/Board';
import { tryCatch, TryCatchResult } from '@/utils/tryCatch';

type ThunkConfig = { dispatch: AppDispatch };

const getBoardsAsync = createAsyncThunk(
  'boards/getBoardsAsync',
  async (): Promise<TryCatchResult<Board[]>> => {
    return await tryCatch<Board[]>(
      axios.get<Board[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/boards`).then((res) => res.data)
    );
  }
);

const addBoardAsync = createAsyncThunk<TryCatchResult<Board>, CreateBoard, ThunkConfig>(
  'boards/addBoardAsync',
  async (data, { dispatch }) => {
    const result = await tryCatch<Board>(
      axios
        .post<Board>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/boards`, data)
        .then((res) => res.data)
    );
    if (!result.error) {
      dispatch(getBoardsAsync());
    }
    return result;
  }
);

const updateBoardAsync = createAsyncThunk<TryCatchResult<Board>, Board, ThunkConfig>(
  'boards/updateBoardAsync',
  async ({ id, name }, { dispatch }) => {
    const result = await tryCatch<Board>(
      axios
        .patch<Board>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/boards/${id}`, {
          name
        })
        .then((res) => res.data)
    );
    if (!result.error) {
      dispatch(getBoardsAsync());
    }
    return result;
  }
);

const deleteBoardAsync = createAsyncThunk<TryCatchResult<void>, string, ThunkConfig>(
  'boards/deleteBoardAsync',
  async (boardId, { dispatch }) => {
    const result = await tryCatch<void>(
      axios
        .delete<void>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/boards/${boardId}`)
        .then((res) => res.data)
    );
    if (!result.error) {
      dispatch(getBoardsAsync());
    }
    return result;
  }
);

export { getBoardsAsync, addBoardAsync, updateBoardAsync, deleteBoardAsync };
