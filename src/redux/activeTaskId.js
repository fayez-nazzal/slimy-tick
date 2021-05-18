import { createSlice } from '@reduxjs/toolkit';

const activeTaskId = createSlice({
  name: 'activeTaskId',
  initialState: 'new',
  reducers: {
    set: (state, { payload }) => payload,
  },
});

export const {
  set: setActiveTaskId,
} = activeTaskId.actions;

export default activeTaskId.reducer;
