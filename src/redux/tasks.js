import { createSlice } from '@reduxjs/toolkit';
import { login } from './user';
import { client } from '../apollo/provider';
import { EDIT_TASK } from '../apollo/queries';

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

const editTaskMutation = (values) => {
  client.mutate({
    mutation: EDIT_TASK,
    variables: {
      ...values,
    },
    update: () => {
      console.log('task edited');
    },
  }).catch((err) => {
    console.log('error', JSON.stringify(err, null, 2));
  });
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
    setBody: (state, { payload }) => {
      const { id, newBody } = payload;
      const taskIndex = state.findIndex((task) => task._id === id);
      state[taskIndex] = {
        ...state[taskIndex],
        body: newBody,
      };

      editTaskMutation({
        ...state[taskIndex],
        taskId: state[taskIndex]._id,
        groupName: 'Inbox',
      });
    },
    setPriority: (state, { payload }) => {
      const { id, newPriority } = payload;
      const taskIndex = state.findIndex((task) => task._id === id);
      state[taskIndex] = {
        ...state[taskIndex],
        priority: newPriority,
      };

      editTaskMutation({
        ...state[taskIndex],
        taskId: state[taskIndex]._id,
        groupName: 'Inbox',
      });
    },
    setDueDate: (state, { payload }) => {
      const { id, newDueDate } = payload;
      const taskIndex = state.findIndex((task) => task._id === id);
      state[taskIndex] = {
        ...state[taskIndex],
        dueDate: newDueDate,
      };

      editTaskMutation({
        ...state[taskIndex],
        taskId: state[taskIndex]._id,
        groupName: 'Inbox',
      });
    },
    setDueTime: (state, { payload }) => {
      const { id, newDueTime } = payload;
      const taskIndex = state.findIndex((task) => task._id === id);
      state[taskIndex] = {
        ...state[taskIndex],
        dueTime: newDueTime,
      };

      editTaskMutation({
        ...state[taskIndex],
        taskId: state[taskIndex]._id,
        groupName: 'Inbox',
      });
    },
    setRepeat: (state, { payload }) => {
      const { id, newRepeat } = payload;
      const taskIndex = state.findIndex((task) => task._id === id);
      state[taskIndex] = {
        ...state[taskIndex],
        repeat: newRepeat,
      };

      editTaskMutation({
        ...state[taskIndex],
        taskId: state[taskIndex]._id,
        groupName: 'Inbox',
      });
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
  setBody: setTaskBody,
  setPriority: setTaskPriority,
  setDueDate: setTaskDueDate,
  setDueTime: setTaskDueTime,
  setRepeat: setTaskRepeat,
  reOrder: reOrderTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;
