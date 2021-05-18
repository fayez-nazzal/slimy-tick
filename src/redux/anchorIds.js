import { createSlice } from '@reduxjs/toolkit';

const achorIds = createSlice({
  name: 'anchorIds',
  initialState: {
    priorityId: '',
    dueId: '',
    repeatId: '',
    customRepeatId: '',
  },
  reducers: {
    setPriorityId: (state, { payload }) => {
      state.priorityId = payload;
    },
    setDueId: (state, { payload }) => {
      state.dueId = payload;
    },
    setRepeatId: (state, { payload }) => {
      state.repeatId = payload;
    },
    setCustomRepeatId: (state, { payload }) => {
      state.customRepeatId = payload;
    },
  },
});

export const {
  setPriorityId: setPriorityAnchorId,
  setDueId: setDueAnchorId,
  setRepeatId: setRepeatAnchorId,
  setCustomRepeatId: setCustomRepeatAnchorId,
} = achorIds.actions;

export default achorIds.reducer;
