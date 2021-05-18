import { createSlice } from '@reduxjs/toolkit';

const dueAnchorElId = createSlice({
  name: 'dueAnchorElId',
  initialState: null,
  reducers: {
    set: (state, { payload }) => payload,
  },
});

export const {
  set: setDueAnchorElId,
} = dueAnchorElId.actions;

export default dueAnchorElId.reducer;
