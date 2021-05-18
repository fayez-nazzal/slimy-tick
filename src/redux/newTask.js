import { createSlice } from '@reduxjs/toolkit';
import isEqual from 'lodash.isequal';
import { matchPriorityAndReturnRange } from '../utils/matchers';
import {
  findDueDateOptions,
  findDueTimeOptions,
  findRepeatOptions,
} from '../utils/regexAnalyzers';
import { login } from './user';

const replaceRange = (str, start, end, substitute) => {
  const startSubstr = str.substring(0, start);
  const endSubstr = str.substring(end);
  return startSubstr + substitute + endSubstr;
};

const getPriorityStrEquivelent = (priority) => '!'.repeat(4 - priority);

const newTaskSlice = createSlice({
  name: 'newTask',
  initialState: {
    body: '',
    priority: 4,
    groupName: null,
    dueDate: '',
    dueTime: '',
    repeat: '',
  },
  reducers: {
    setBody: (state, action) => {
      state.body = action.payload;
    },
    setPriority: (state, action) => {
      const newPriority = getPriorityStrEquivelent(action.payload);

      // if old priority regex text exist, replace it to the new priority
      if (state.body) {
        const taskPriorityRange = matchPriorityAndReturnRange(state.body);

        state.body = replaceRange(
          state.body,
          taskPriorityRange[0],
          taskPriorityRange[1],
          newPriority,
        );
      }

      state.priority = action.payload;
    },
    setDueDate: (state, action) => {
      const taskBody = state.body;
      const taskDueDate = state.dueDate;

      if (
        action.payload &&
        !taskBody.includes(action.payload) &&
        !findDueDateOptions(action.payload).isSame(
          findDueDateOptions(taskDueDate),
          'day',
        )
      ) {
        state.body =
          taskBody && taskDueDate
            ? taskBody.replace(taskDueDate, action.payload)
            : taskBody;
      }
      state.dueDate = action.payload;
    },
    setDueTime: (state, action) => {
      const taskBody = state.body;
      const taskDueTime = state.dueTime;

      if (
        action.payload &&
        taskDueTime &&
        taskBody &&
        !taskBody.includes(action.payload) &&
        !findDueTimeOptions(action.payload).isSame(
          findDueTimeOptions(taskDueTime),
          'hour',
        )
      ) {
        state.body = taskBody.replace(taskDueTime, action.payload);
      }
      state.dueTime = action.payload;
    },
    setRepeat: (state, action) => {
      const taskBody = state.body;
      const oldRepeat = state.repeat;
      const analyzedOldRepeat = findRepeatOptions(oldRepeat);
      const newRepeat =
        action.payload && action.payload[0] ? action.payload : '';
      const analyzedNewRepeat = findRepeatOptions(newRepeat);

      if (
        taskBody &&
        oldRepeat &&
        !taskBody.includes(newRepeat) &&
        !isEqual(analyzedOldRepeat, analyzedNewRepeat)
      ) state.body = taskBody.replace(oldRepeat, newRepeat);

      state.repeat = newRepeat;
    },
  },
  extraReducers: {
    [login]: (state, { payload }) => {
      state.groupName = payload.groups[0].name;
    },
  },
});

export const {
  setBody: setNewTaskBody,
  setPriority: setNewTaskPriority,
  setDueDate: setNewTaskDueDate,
  setDueTime: setNewTaskDueTime,
  setRepeat: setNewTaskRepeat,
} = newTaskSlice.actions;

export default newTaskSlice.reducer;
