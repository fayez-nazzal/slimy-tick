import { createSlice } from '@reduxjs/toolkit';
import isEqual from 'lodash.isequal';
import { matchPriorityAndReturnRange } from '../utils/matchers';
import { findDueDateOptions, findDueTimeOptions, findRepeatOptions } from '../utils/regexAnalyzers';

const replaceRange = (str, start, end, substitute) => {
  const startSubstr = str.substring(0, start);
  const endSubstr = str.substring(end);
  return startSubstr + substitute + endSubstr;
};

const getPriorityStrEquivelent = (priority) => '!'.repeat((4 - priority));

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
      state.taskValues.body = action.payload;
    },
    setPriority: (state, action) => {
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
    setDueDate: (state, action) => {
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
    setDueTime: (state, action) => {
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
    setRepeat: (state, action) => {
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
