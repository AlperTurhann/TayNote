import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { AppDispatch } from '@/lib/store';
import { Board, CreateBoard, MoveBoard } from '@/models/Board';
import { tryCatch, TryCatchResult } from '@/utils/tryCatch';

type ThunkConfig = { dispatch: AppDispatch };

const getBoardsAsync = createAsyncThunk(
  'boards/getBoardsAsync',
  async (): Promise<TryCatchResult<Board[]>> => {
    return await tryCatch<Board[]>(
      axios.get<Board[]>(`/api/boards`).then((res) => res.data)
    );
  }
);

const addBoardAsync = createAsyncThunk<TryCatchResult<Board>, CreateBoard, ThunkConfig>(
  'boards/addBoardAsync',
  async (data, { dispatch }) => {
    const result = await tryCatch<Board>(
      axios
        .post<Board>(`/api/boards`, data)
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
        .patch<Board>(`/api/boards/${id}`, {
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

const moveBoardAsync = createAsyncThunk<TryCatchResult<Board>, MoveBoard, ThunkConfig>(
  'boards/moveBoardAsync',
  async ({ id, targetIndex }, { dispatch }) => {
    const result = await tryCatch<Board>(
      axios
        .patch<Board>(`/api/boards/${id}/move`, {
          targetIndex
        })
        .then((res) => res.data)
    );
    dispatch(getBoardsAsync());
    return result;
  }
);

const deleteBoardAsync = createAsyncThunk<TryCatchResult<void>, string, ThunkConfig>(
  'boards/deleteBoardAsync',
  async (boardId, { dispatch }) => {
    const result = await tryCatch<void>(
      axios
        .delete<void>(`/api/boards/${boardId}`)
        .then((res) => res.data)
    );
    if (!result.error) {
      dispatch(getBoardsAsync());
    }
    return result;
  }
);

export { getBoardsAsync, addBoardAsync, updateBoardAsync, moveBoardAsync, deleteBoardAsync };
