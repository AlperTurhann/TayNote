import { createSlice } from '@reduxjs/toolkit';

import { ColumnWithStatus } from '@/models/Column';
import { FetchOperations } from '@/models/FetchOperations';
import {
  addColumnAsync,
  deleteColumnAsync,
  getColumnsAsync,
  updateColumnAsync
} from '@/services/columnService';

interface ColumnState {
  columns: ColumnWithStatus[];
  getColumns: FetchOperations;
  addColumn: FetchOperations;
}

const initialState: ColumnState = {
  columns: [],
  getColumns: {
    isLoading: false
  },
  addColumn: {
    isLoading: false
  }
};

const findColumn = (state: ColumnState, columnId: string) =>
  state.columns.find((column) => column.id === columnId);

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
        state.columns = (action.payload.data ?? []).map((column) => ({
          ...column,
          isUpdating: false,
          isDeleting: false
        }));
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
        if (action.payload.data) {
          state.columns.push({ ...action.payload.data, isUpdating: false, isDeleting: false });
        }
        state.addColumn.isLoading = false;
        state.addColumn.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Update Column
    builder
      .addCase(updateColumnAsync.pending, (state, action) => {
        const column = findColumn(state, action.meta.arg.id);
        if (column) column.isUpdating = true;
      })
      .addCase(updateColumnAsync.fulfilled, (state, action) => {
        const column = findColumn(state, action.meta.arg.id);
        if (column) {
          if (action.payload.data) {
            column.name = action.payload.data.name;
            column.orderNo = action.payload.data.orderNo;
          }
          column.isUpdating = false;
        }
      });
    //#endregion
    //#region Delete Column
    builder
      .addCase(deleteColumnAsync.pending, (state, action) => {
        const column = findColumn(state, action.meta.arg.columnId);
        if (column) column.isDeleting = true;
      })
      .addCase(deleteColumnAsync.fulfilled, (state, action) => {
        const column = findColumn(state, action.meta.arg.columnId);
        if (column) column.isDeleting = false;
      });
    //#endregion
  }
});

export const selectColumns = (state: { column: ColumnState }) => state.column.columns;
export const selectGetColumnsIsLoading = (state: { column: ColumnState }) =>
  state.column.getColumns.isLoading;

export default columnSlice.reducer;
