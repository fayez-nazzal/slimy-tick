import { createSlice } from '@reduxjs/toolkit';

const dueTaskId = createSlice({
  name: 'dueTaskId',
  initialState: 'new',
  reducers: {
    set: (state, { payload }) => payload,
  },
});

export const {
  set: setDueTaskId,
} = dueTaskId.actions;

export default dueTaskId.reducer;
