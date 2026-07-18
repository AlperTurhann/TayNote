import { createSlice } from '@reduxjs/toolkit';

import { Column } from '@/models/Column';
import { FetchOperations } from '@/models/FetchOperations';
import {
  addColumnAsync,
  deleteColumnAsync,
  getColumnsAsync,
  updateColumnAsync
} from '@/services/columnService';

interface ColumnState {
  columns: Column[];
  getColumns: FetchOperations;
  addColumn: FetchOperations;
  updateColumn: FetchOperations;
  deleteColumn: FetchOperations;
}

const initialState: ColumnState = {
  columns: [],
  getColumns: {
    isLoading: false
  },
  addColumn: {
    isLoading: false
  },
  updateColumn: {
    isLoading: false
  },
  deleteColumn: {
    isLoading: false
  }
};

const columnSlice = createSlice({
  name: 'column',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //#region Get Columns
    builder
      .addCase(getColumnsAsync.pending, (state) => {
        state.getColumns.isLoading = true;
      })
      .addCase(getColumnsAsync.fulfilled, (state, action) => {
        state.columns = action.payload.data ?? [];
        state.getColumns.isLoading = false;
        state.getColumns.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Add Column
    builder
      .addCase(addColumnAsync.pending, (state) => {
        state.addColumn.isLoading = true;
      })
      .addCase(addColumnAsync.fulfilled, (state, action) => {
        if (action.payload.data) state.columns.push(action.payload.data);
        state.addColumn.isLoading = false;
        state.addColumn.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Update Column
    builder
      .addCase(updateColumnAsync.pending, (state) => {
        state.updateColumn.isLoading = true;
      })
      .addCase(updateColumnAsync.fulfilled, (state, action) => {
        if (action.payload.data) {
          const updated = action.payload.data;
          const column = state.columns.find((column) => column.id === updated.id);
          if (column) {
            column.name = updated.name;
            column.orderNo = updated.orderNo;
          }
        }
        state.updateColumn.isLoading = false;
        state.updateColumn.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Delete Column
    builder
      .addCase(deleteColumnAsync.pending, (state) => {
        state.deleteColumn.isLoading = true;
      })
      .addCase(deleteColumnAsync.fulfilled, (state, action) => {
        state.deleteColumn.isLoading = false;
        state.deleteColumn.error = action.payload.error ?? undefined;
      });
    //#endregion
  }
});

export const selectColumns = (state: { column: ColumnState }) => state.column.columns;

export default columnSlice.reducer;
