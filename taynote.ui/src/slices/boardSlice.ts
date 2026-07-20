import { createSlice } from '@reduxjs/toolkit';

import { BoardWithStatus } from '@/models/Board';
import { FetchOperations } from '@/models/FetchOperations';
import {
  addBoardAsync,
  updateBoardAsync,
  deleteBoardAsync,
  getBoardsAsync
} from '@/services/boardService';

interface BoardState {
  boards: BoardWithStatus[];
  getBoards: FetchOperations;
  addBoard: FetchOperations;
}

const initialState: BoardState = {
  boards: [],
  getBoards: {
    isLoading: false
  },
  addBoard: {
    isLoading: false
  }
};

const findBoard = (state: BoardState, boardId: string) =>
  state.boards.find((board) => board.id === boardId);

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
        state.boards = (action.payload.data ?? []).map((board) => ({
          ...board,
          isUpdating: false,
          isDeleting: false
        }));
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
      .addCase(updateBoardAsync.pending, (state, action) => {
        const board = findBoard(state, action.meta.arg.id);
        if (board) board.isUpdating = true;
      })
      .addCase(updateBoardAsync.fulfilled, (state, action) => {
        const board = findBoard(state, action.meta.arg.id);
        if (board) board.isUpdating = false;
      });
    //#endregion
    //#region Delete Board
    builder
      .addCase(deleteBoardAsync.pending, (state, action) => {
        const board = findBoard(state, action.meta.arg);
        if (board) board.isDeleting = true;
      })
      .addCase(deleteBoardAsync.fulfilled, (state, action) => {
        const board = findBoard(state, action.meta.arg);
        if (board) board.isDeleting = false;
      });
    //#endregion
  }
});

export const selectBoards = (state: { board: BoardState }) => state.board.boards;
export const selectBoardIsCreating = (state: { board: BoardState }) =>
  state.board.addBoard.isLoading;
export const selectGetBoardsIsLoading = (state: { board: BoardState }) =>
  state.board.getBoards.isLoading;

export default boardSlice.reducer;
