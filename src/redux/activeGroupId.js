import { createSlice } from '@reduxjs/toolkit';
import { login } from './user';

const activeGroupIdSlice = createSlice({
  name: 'activeGroupId',
  initialState: null,
  reducers: {
    set: (_, action) => action.payload._id,
  },
  extraReducers: {
    [login]: (state, { payload }) => payload.groups[0]._id,
  },
});

export const {
  set: setActiveGroupId,
} = activeGroupIdSlice.actions;

export default activeGroupIdSlice.reducer;