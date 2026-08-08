import { createSlice } from '@reduxjs/toolkit';

import { FetchOperations } from '@/models/FetchOperations';
import { LabelWithStatus } from '@/models/Label';
import {
  addLabelAsync,
  deleteLabelAsync,
  getBoardLabelsAsync,
  getGlobalLabelsAsync
} from '@/services/labelService';

interface LabelState {
  globalLabels: LabelWithStatus[];
  boardLabels: LabelWithStatus[];
  getGlobalLabels: FetchOperations;
  getBoardLabels: FetchOperations;
  addLabel: FetchOperations;
}

const initialState: LabelState = {
  globalLabels: [],
  boardLabels: [],
  getGlobalLabels: {
    isLoading: false
  },
  getBoardLabels: {
    isLoading: false
  },
  addLabel: {
    isLoading: false
  }
};

const findLabel = (state: LabelState, labelId: string) =>
  state.globalLabels.find((label) => label.id === labelId) ??
  state.boardLabels.find((label) => label.id === labelId);

const labelSlice = createSlice({
  name: 'label',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //#region Get Global Labels
    builder
      .addCase(getGlobalLabelsAsync.pending, (state) => {
        state.getGlobalLabels.isLoading = true;
      })
      .addCase(getGlobalLabelsAsync.fulfilled, (state, action) => {
        state.globalLabels = (action.payload.data ?? []).map((label) => ({
          ...label,
          isDeleting: false
        }));
        state.getGlobalLabels.isLoading = false;
        state.getGlobalLabels.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Get Board Labels
    builder
      .addCase(getBoardLabelsAsync.pending, (state) => {
        state.getBoardLabels.isLoading = true;
      })
      .addCase(getBoardLabelsAsync.fulfilled, (state, action) => {
        state.boardLabels = (action.payload.data ?? []).map((label) => ({
          ...label,
          isDeleting: false
        }));
        state.getBoardLabels.isLoading = false;
        state.getBoardLabels.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Add Label
    builder
      .addCase(addLabelAsync.pending, (state) => {
        state.addLabel.isLoading = true;
      })
      .addCase(addLabelAsync.fulfilled, (state, action) => {
        state.addLabel.isLoading = false;
        state.addLabel.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Delete Label
    builder
      .addCase(deleteLabelAsync.pending, (state, action) => {
        const label = findLabel(state, action.meta.arg.labelId);
        if (label) label.isDeleting = true;
      })
      .addCase(deleteLabelAsync.fulfilled, (state, action) => {
        const label = findLabel(state, action.meta.arg.labelId);
        if (label) label.isDeleting = false;
      });
    //#endregion
  }
});

export const selectGlobalLabels = (state: { label: LabelState }) => state.label.globalLabels;
export const selectBoardLabels = (state: { label: LabelState }) => state.label.boardLabels;
export const selectGetGlobalLabelsIsLoading = (state: { label: LabelState }) =>
  state.label.getGlobalLabels.isLoading;
export const selectGetBoardLabelsIsLoading = (state: { label: LabelState }) =>
  state.label.getBoardLabels.isLoading;
export const selectIsAddingLabel = (state: { label: LabelState }) => state.label.addLabel.isLoading;

export default labelSlice.reducer;
