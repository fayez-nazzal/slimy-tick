import { createSlice } from '@reduxjs/toolkit';
import { login } from './user';

const moveInArray = (arr, from, to) => {
  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    throw new Error('Please provide a valid array');
  }

  const item = arr.splice(from, 1);

  if (!item.length) {
    throw new Error(`There is no item in the array at index ${from}`);
  }

  arr.splice(to, 0, item[0]);
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    add: (state, { payload }) => {
      state.push({
        ...payload,
      });
    },
    check: (state, { payload }) => {
      const { id } = payload;
      const taskToCheck = state.find((task) => task._id === id);
      taskToCheck.checked = true;
    },
    edit: (state, { payload }) => {
      const { id, newValues } = payload;
      const taskIndex = state.findIndex((task) => task._id === id);
      state[taskIndex] = {
        ...state[taskIndex],
        ...newValues,
      };
    },
    reOrder: (state, { payload }) => {
      const { id, newOrder } = payload;
      const taskToReOrder = state.findIndex((task) => task._id === id);
      moveInArray(state, taskToReOrder, newOrder);
    },
  },
  extraReducers: {
    [login]: (_, { payload }) => payload.groups[0].tasks,
  },

});

export const {
  add: addNewTask,
  check: checkTask,
  edit: editTask,
  reOrder: reOrderTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;