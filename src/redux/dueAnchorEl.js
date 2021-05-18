import { createSlice } from '@reduxjs/toolkit';

const dueAnchorEl = createSlice({
  name: 'dueAnchorEl',
  initialState: null,
  reducers: {
    set: (state, { payload }) => payload,
  },
});

export const {
  set: setDueAnchorEl,
} = dueAnchorEl.actions;

export default dueAnchorEl.reducer;
