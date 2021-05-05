import { createSlice } from '@reduxjs/toolkit';

const activeGroupIdSlice = createSlice({
  name: 'activeGroupId',
  initialState: 0,
  reducers: {
    set: (_, action) => action.payload.id,
  },
});

export const {
  set: setActiveGroupId,
} = activeGroupIdSlice.actions;

export default activeGroupIdSlice.reducer;
