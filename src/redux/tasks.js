import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login } from './user';
import { getClient } from '../apollo/provider';
import { EDIT_TASK, REMOVE_TASK } from '../apollo/queries';

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

export const editTaskMutation = ({ id, newValues }, editTask, dispatch) => {
  const client = getClient();
  try {
    client.mutate({
      mutation: EDIT_TASK,
      variables: {
        taskId: id,
        groupName: 'Inbox',
        ...newValues,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        editTask: {
          __typename: 'Task',
          ...newValues,
        },
      },
      update: (_, { data: { editTask: updatedValues } }) => {
        dispatch(editTask({ updatedValues }));
      },
    });
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
  }
};

export const removeTask = createAsyncThunk(
  'tasks/remove',
  // eslint-disable-next-line consistent-return
  async ({ taskId, groupName }, thunkAPI) => {
    const client = getClient();

    try {
      await client.mutate({
        mutation: REMOVE_TASK,
        variables: {
          taskId,
          groupName,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          removeTask: true,
        },
        update: () => {
          // eslint-disable-next-line no-use-before-define
          thunkAPI.dispatch(tasksSlice.actions.remove({ id: taskId }));
        },
      });
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
    }
  },
);

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
      const { updatedValues: taskValues } = payload;
      const taskIndex = state.findIndex(
        (task) => task._id.toString() === taskValues._id.toString(),
      );

      state[taskIndex] = {
        ...state[taskIndex],
        ...taskValues,
      };
    },
    remove: (state, { payload }) => {
      const { id } = payload;

      const taskIndex = state.findIndex(
        (task) => task._id.toString() === id.toString(),
      );

      if (taskIndex !== -1) state.splice(taskIndex, 1);
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
  reOrder: reOrderTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;

const getTaskValuesFromThunk = (thunkAPI, taskId) => thunkAPI
  .getState()
  .tasks.find((task) => task._id.toString() === taskId.toString());

export const setTaskBody = createAsyncThunk(
  'tasks/setBody',
  async ({ id, newBody }, thunkAPI) => {
    const taskValues = getTaskValuesFromThunk(thunkAPI, id);
    const newValues = { ...taskValues, body: newBody };
    await editTaskMutation(
      { id, newValues },
      tasksSlice.actions.edit,
      thunkAPI.dispatch,
    );
  },
);

export const setTaskPriority = createAsyncThunk(
  'tasks/setPriority',
  async ({ id, newPriority }, thunkAPI) => {
    const taskValues = getTaskValuesFromThunk(thunkAPI, id);
    const newValues = { ...taskValues, priority: newPriority };
    await editTaskMutation(
      { id, newValues },
      tasksSlice.actions.edit,
      thunkAPI.dispatch,
    );
  },
);

export const setTaskDueDate = createAsyncThunk(
  'tasks/setDueDate',
  async ({ id, newDueDate }, thunkAPI) => {
    const taskValues = getTaskValuesFromThunk(thunkAPI, id);
    const newValues = { ...taskValues, dueDate: newDueDate };
    await editTaskMutation(
      { id, newValues },
      tasksSlice.actions.edit,
      thunkAPI.dispatch,
    );
  },
);

export const setTaskDueTime = createAsyncThunk(
  'tasks/setDueTime',
  async ({ id, newDueTime }, thunkAPI) => {
    const taskValues = getTaskValuesFromThunk(thunkAPI, id);
    const newValues = { ...taskValues, dueTime: newDueTime };
    await editTaskMutation(
      { id, newValues },
      tasksSlice.actions.edit,
      thunkAPI.dispatch,
    );
  },
);

export const setTaskRepeat = createAsyncThunk(
  'tasks/setRepeat',
  async ({ id, newRepeat }, thunkAPI) => {
    const taskValues = getTaskValuesFromThunk(thunkAPI, id);
    const newValues = { ...taskValues, repeat: newRepeat };
    await editTaskMutation(
      { id, newValues },
      tasksSlice.actions.edit,
      thunkAPI.dispatch,
    );
  },
);
