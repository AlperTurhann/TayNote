import { createSlice } from '@reduxjs/toolkit';

import { Board } from '@/models/Board';
import { FetchOperations } from '@/models/FetchOperations';
import {
  addBoardAsync,
  updateBoardAsync,
  deleteBoardAsync,
  getBoardsAsync
} from '@/services/boardService';

interface BoardState {
  boards: Board[];
  getBoards: FetchOperations;
  addBoard: FetchOperations;
  updateBoard: FetchOperations;
  deleteBoard: FetchOperations;
}

const initialState: BoardState = {
  boards: [],
  getBoards: {
    isLoading: false
  },
  addBoard: {
    isLoading: false
  },
  updateBoard: {
    isLoading: false
  },
  deleteBoard: {
    isLoading: false
  }
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //#region Get Boards
    builder
      .addCase(getBoardsAsync.pending, (state) => {
        state.getBoards.isLoading = true;
      })
      .addCase(getBoardsAsync.fulfilled, (state, action) => {
        state.boards = action.payload.data ?? [];
        state.getBoards.isLoading = false;
        state.getBoards.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Add Board
    builder
      .addCase(addBoardAsync.pending, (state) => {
        state.addBoard.isLoading = true;
      })
      .addCase(addBoardAsync.fulfilled, (state, action) => {
        state.addBoard.isLoading = false;
        state.addBoard.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Update Board
    builder
      .addCase(updateBoardAsync.pending, (state) => {
        state.updateBoard.isLoading = true;
      })
      .addCase(updateBoardAsync.fulfilled, (state, action) => {
        state.updateBoard.isLoading = false;
        state.updateBoard.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Delete Board
    builder
      .addCase(deleteBoardAsync.pending, (state) => {
        state.deleteBoard.isLoading = true;
      })
      .addCase(deleteBoardAsync.fulfilled, (state, action) => {
        state.deleteBoard.isLoading = false;
        state.deleteBoard.error = action.payload.error ?? undefined;
      });
    //#endregion
  }
});

export const selectBoards = (state: { board: BoardState }) => state.board.boards;

export default boardSlice.reducer;
