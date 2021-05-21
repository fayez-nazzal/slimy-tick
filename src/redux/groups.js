import { createSlice } from '@reduxjs/toolkit';
import { login } from './user';

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
      const { name } = payload;
      const groupIndex = state.findIndex((group) => group.name === name);
      state.splice(groupIndex, 1);
    },
  },
  extraReducers: {
    [login]: (state, { payload }) => [...payload.groups],
  },
});

export const {
  add: addGroup,
  remove: removeGroup,
} = groupsSlice.actions;

export default groupsSlice.reducer;
