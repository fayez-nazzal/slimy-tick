import { createSlice } from '@reduxjs/toolkit';

const groupsSlice = createSlice({
  name: 'groups',
  initialState: [],
  reducers: {
    add: (state, { payload }) => {
      state.push({
        ...payload,
      });
    },
    remove: (state, { payload }) => {
      const { id } = payload;
      const groupIndex = state.find((group) => group.id === id);
      state.splice(groupIndex, 1);
    },
  },
});

export const {
  add: addGroup,
  remove: removeGroup,
} = groupsSlice.actions;

export default groupsSlice.reducer;
