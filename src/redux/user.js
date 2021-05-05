import { createSlice } from '@reduxjs/toolkit';
import isEqual from 'lodash.isequal';
import { matchPriorityAndReturnRange } from '../utils/matchers';
import {
  findDueDateOptions,
  findDueTimeOptions,
  findRepeatOptions,
} from '../utils/regexAnalyzers';

const replaceRange = (str, start, end, substitute) => {
  const startSubstr = str.substring(0, start);
  const endSubstr = str.substring(end);
  return startSubstr + substitute + endSubstr;
};

const getPriorityStrEquivelent = (priority) => '!'.repeat((4 - priority));

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    groupIndex: null,
    taskValues: {
      body: '',
      priority: 4,
      groupName: null,
      dueDate: '',
      dueTime: '',
      repeat: '',
    },
  },
  reducers: {
    login: (state, action) => {
      state.userData = action.payload;
      localStorage.setItem('slimy-tick-jwt', state.userData.token);
      state.groupIndex = 0;
    },
    logout: (state) => {
      state.userData = null;
      localStorage.removeItem('slimy-tick-jwt');
    },
    setGroupIndex: (state, action) => {
      state.groupIndex = action.payload;
    },
    setTaskBody: (state, action) => {
      state.taskValues.body = action.payload;
    },
    setTaskPriority: (state, action) => {
      const newPriority = getPriorityStrEquivelent(action.payload);

      // if old priority regex text exist, replace it to the new priority
      if (state.taskValues.body) {
        const taskPriorityRange = matchPriorityAndReturnRange(
          state.taskValues.body,
        );

        state.taskValues.body = replaceRange(
          state.taskValues.body,
          taskPriorityRange[0],
          taskPriorityRange[1],
          newPriority,
        );
      }

      state.taskValues.priority = action.payload;
    },
    setTaskGroup: (state, action) => {
      state.taskValues.groupName = action.payload.name;
    },
    setTaskDueDate: (state, action) => {
      const taskBody = state.taskValues.body;
      const taskDueDate = state.taskValues.dueDate;

      if (
        !taskBody.includes(action.payload) &&
        !findDueDateOptions(action.payload).isSame(
          findDueDateOptions(taskDueDate),
          'day',
        )
      ) {
        state.taskValues.body =
          taskBody && taskDueDate
            ? taskBody.replace(taskDueDate, action.payload)
            : taskBody;

        state.taskValues.dueDate = action.payload;
      }
    },
    setTaskDueTime: (state, action) => {
      const taskBody = state.taskValues.body;
      const taskDueTime = state.taskValues.dueTime;

      if (
        taskDueTime &&
        taskBody &&
        !taskBody.includes(action.payload) &&
        !findDueTimeOptions(action.payload).isSame(
          findDueTimeOptions(taskDueTime),
          'hour',
        )
      ) {
        state.taskValues.body = taskBody.replace(
          taskDueTime,
          action.payload,
        );

        state.taskValues.dueTime = action.payload;
      }
    },
    setTaskRepeat: (state, action) => {
      const taskBody = state.taskValues.body;
      const oldRepeat = state.taskValues.repeat;
      const analyzedOldRepeat = findRepeatOptions(oldRepeat);
      const newRepeat =
        action.payload && action.payload[0] ? action.payload : '';
      const analyzedNewRepeat = findRepeatOptions(newRepeat);

      if (
        taskBody &&
        oldRepeat &&
        !taskBody.includes(newRepeat) &&
        !isEqual(analyzedOldRepeat, analyzedNewRepeat)
      ) state.taskValues.body = taskBody.replace(oldRepeat, newRepeat);

      state.taskValues.repeat = newRepeat;
    },
    addtask: (state, action) => {
      const group = state.userData.groups[state.groupIndex];
      group.tasks = [...group.tasks, action.payload];
    },
    setGroups: (state, action) => {
      state.userData.groups = action.payload;
    },
  },
});

export const {
  login,
  logout,
  addtask,
  setGroupIndex,
  setTaskBody,
  setTaskPriority,
  setTaskGroup,
  setTaskDueDate,
  setTaskDueTime,
  setTaskRepeat,
  setGroups,
} = userSlice.actions;

export default userSlice.reducer;
